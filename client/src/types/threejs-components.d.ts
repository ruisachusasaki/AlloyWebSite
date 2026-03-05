declare module "threejs-components/build/cursors/tubes1.min.js" {
  interface TubesConfig {
    colors?: string[];
    count?: number;
    speed?: number;
    radius?: number;
    lights?: {
      intensity?: number;
      colors?: string[];
    };
  }

  interface TubesCursorConfig {
    tubes?: TubesConfig;
    bloom?: {
      strength?: number;
      radius?: number;
      threshold?: number;
    };
  }

  interface TubesCursorInstance {
    tubes: {
      setColors(colors: string[]): void;
      setLightsColors(colors: string[]): void;
    };
    dispose(): void;
  }

  export default function TubesCursor(
    canvas: HTMLCanvasElement,
    config?: TubesCursorConfig
  ): TubesCursorInstance;
}
