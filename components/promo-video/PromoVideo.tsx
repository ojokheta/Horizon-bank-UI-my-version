"use client";

import { memo, useMemo } from "react";
import SceneOne from "./SceneOne";
import SceneTwo from "./SceneTwo";
import SceneThree from "./SceneThree";
import SceneFour from "./SceneFour";
import VideoCanvas from "./VideoCanvas";
import {
  FPS,
  TOTAL_FRAMES,
  TOTAL_SECONDS,
  WIDTH,
  HEIGHT,
  useVideoEngine,
} from "./useVideoEngine";

export interface PromoVideoProps {
  autoPlay?: boolean;
  loop?: boolean;
  showFrameCounter?: boolean;
  scale?: number;
  fitToContainer?: boolean;
  className?: string;
  style?: React.CSSProperties;
  frame?: number;
}

const PromoVideo = memo(function PromoVideo({
  autoPlay = true,
  loop = true,
  showFrameCounter = false,
  scale: scaleProp,
  fitToContainer = true,
  className,
  style,
  frame: forcedFrame,
}: PromoVideoProps) {
  const { frame } = useVideoEngine(autoPlay, loop, forcedFrame);

  const finalScale = useMemo(() => {
    if (scaleProp !== undefined) return scaleProp;
    if (typeof window === "undefined") return 0.5;
    const maxW = (window.innerWidth - 40) / WIDTH;
    const maxH = (window.innerHeight - 120) / HEIGHT;
    const base = Math.min(1, Math.min(maxW, maxH));
    return Math.max(0.2, fitToContainer ? base : 1);
  }, [scaleProp, fitToContainer]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
        overflow: "hidden",
        ...style,
      }}
    >
      <VideoCanvas
        scale={finalScale}
        showFrameCounter={showFrameCounter}
        frame={frame}
      >
        <SceneOne frame={frame} />
        <SceneTwo frame={frame} />
        <SceneThree frame={frame} />
        <SceneFour frame={frame} />
        <SubtleFilmGrain frame={frame} />
      </VideoCanvas>
    </div>
  );
});

export default PromoVideo;

export {
  FPS,
  TOTAL_FRAMES,
  TOTAL_SECONDS,
  WIDTH,
  HEIGHT,
};

const SubtleFilmGrain = memo(function SubtleFilmGrain({
  frame,
}: {
  frame: number;
}) {
  const op = 0.045 + ((frame * 17) % 100) / 4000;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: op,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        backgroundSize: "160px 160px",
        backgroundPosition: `${(frame * 13) % 160}px ${(frame * 7) % 160}px`,
        zIndex: 9998,
        willChange: "opacity, background-position",
      }}
    />
  );
});
