"use client";

import { useEffect, useRef, useState } from "react";

export const FPS = 60;
export const TOTAL_FRAMES = 750;
export const TOTAL_SECONDS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FRAME_DURATION = 1000 / FPS;

export interface VideoState {
  frame: number;
  progress: number;
  isPlaying: boolean;
}

export function useVideoEngine(
  autoPlay = true,
  loop = true,
  forcedFrame?: number
): VideoState {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedFrameRef = useRef(0);

  useEffect(() => {
    if (forcedFrame !== undefined) return;
    if (!autoPlay) return;

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      const elapsed = now - startTimeRef.current;
      let currentFrame = Math.floor(elapsed / FRAME_DURATION);

      if (currentFrame >= TOTAL_FRAMES) {
        if (loop) {
          startTimeRef.current = now;
          currentFrame = 0;
        } else {
          setFrame(TOTAL_FRAMES - 1);
          setIsPlaying(false);
          return;
        }
      }

      setFrame(currentFrame);
      setIsPlaying(true);
      pausedFrameRef.current = currentFrame;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoPlay, loop, forcedFrame]);

  const finalFrame =
    forcedFrame !== undefined
      ? Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(forcedFrame)))
      : frame;
  return {
    frame: finalFrame,
    progress:
      TOTAL_FRAMES > 0 ? finalFrame / (TOTAL_FRAMES - 1) : 0,
    isPlaying: forcedFrame !== undefined ? true : isPlaying,
  };
}

export function inRange(frame: number, start: number, end: number): boolean {
  return frame >= start && frame < end;
}

export function localProgress(
  frame: number,
  start: number,
  end: number
): number {
  const dur = end - start;
  if (dur <= 0) return 0;
  return Math.max(0, Math.min(1, (frame - start) / dur));
}
