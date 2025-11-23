import Konva from "konva";

export interface AnimatedSpriteOptions {
  image: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameRate: number;   // frames per second
  loop: boolean;
  x: number;
  y: number;

  //optional callback when a non-looping animation finishes 
  onComplete?: () => void;

  //scaling: number = uniform or separate x/y
  scale?: number | { x: number; y: number };
}

/**
 * AnimatedSprite
 *
 * Wraps a Konva.Image + Konva.Animation to play a horizontal spritesheet.
 * @param Expects a SINGLE ROW spritesheet:
 *  [frame0][frame1][frame2]...[frameN-1]
 */
export class AnimatedSprite {
  // The Konva.Image that actually gets drawn on the canvas
  public node: Konva.Image;

  // The Konva.Animation that updates the crop each frame
  public animation: Konva.Animation;

  private frameWidth: number;
  private frameHeight: number;
  private frameCount: number;
  private frameRate: number;
  private loop?: boolean;

  private currentFrame = 0;
  private timeAccumulator = 0; // seconds

  private onComplete?: () => void;
  private completedOnce = false;

  constructor(layer: Konva.Layer, options: AnimatedSpriteOptions) {
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.frameCount = options.frameCount;
    this.frameRate = options.frameRate;
    this.loop = options.loop ?? true;
    this.onComplete = options.onComplete;

    // Create the image node, initially showing frame 0
    this.node = new Konva.Image({
      x: options.x,
      y: options.y,
      image: options.image,
      width: this.frameWidth,
      height: this.frameHeight,
      // crop shows which part of the spritesheet to draw
      crop: {
        x: 0,
        y: 0,
        width: this.frameWidth,
        height: this.frameHeight,
      },
    });

    //Scaling
    if (options.scale !== undefined) {
      if (typeof options.scale === "number") {
        this.node.scale({ x: options.scale, y: options.scale });
      } else {
        this.node.scale(options.scale);
      }
    }

    // Add it to the layer so it's visible
    layer.add(this.node);

    // Set up Konva.Animation on this same layer
    this.animation = new Konva.Animation((frame) => {
      if (!frame) return;

      // Convert ms → seconds
      const dt = frame.timeDiff / 1000;
      this.timeAccumulator += dt;

      // How many frames have passed according to desired fps
      const totalFramesPassed = Math.floor(
        this.timeAccumulator * this.frameRate
      );

      if (this.loop) {
        //Looping animation
        this.currentFrame = totalFramesPassed % this.frameCount;
      } else {
        //Non-looping: clamps at last frame
        if (totalFramesPassed >= this.frameCount) {
          this.currentFrame = this.frameCount - 1;

          if (!this.completedOnce) {
            this.completedOnce = true;
            if (this.onComplete) {
              this.onComplete();
            }
            this.animation.stop();
          }
        } else {
          this.currentFrame = totalFramesPassed;
        }
      }

      const frameX = this.currentFrame * this.frameWidth;

      // update the crop rect so we show the correct slice
      this.node.crop({
        x: frameX,
        y: 0,
        width: this.frameWidth,
        height: this.frameHeight,
      });
    }, layer);
  }

  /** Start the animation */
  play(): void {
    this.animation.start();
  }

  /** Stop the animation */
  stop(): void {
    this.animation.stop();
  }

  /** Jump back to frame 0 and allow onComplete to run again */
  reset(): void {
    this.timeAccumulator = 0;
    this.currentFrame = 0;
    this.node.crop({
      x: 0,
      y: 0,
      width: this.frameWidth,
      height: this.frameHeight,
    });
  }

  /** Change sprite scale at runtime */
  setScale(scale: number | { x: number; y: number }): void {
    if (typeof scale === "number") {
      this.node.scale({ x: scale, y: scale });
    } else {
      this.node.scale(scale);
    }
  }

  /** Total length of this animation in milliseconds */
  getDurationMs(): number {
    return (this.frameCount / this.frameRate) * 1000;
  }
}