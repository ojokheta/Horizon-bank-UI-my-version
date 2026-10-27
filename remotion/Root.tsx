import { Composition, useCurrentFrame, AbsoluteFill } from "remotion";
import PromoVideo from "../components/promo-video/PromoVideo";

const RemotionHorizonPromo = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <PromoVideo
        frame={frame}
        scale={1}
        fitToContainer={false}
        autoPlay={false}
        loop={false}
        showFrameCounter={false}
      />
    </AbsoluteFill>
  );
};

export const Root = () => {
  return (
    <Composition
      id="HorizonPromo"
      component={RemotionHorizonPromo}
      durationInFrames={750}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};
