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
}

/**
 * AnimatedSprite
 *
 * Wraps a Konva.Image + Konva.Animation to play a horizontal spritesheet.
 * Expects a SINGLE ROW spritesheet:
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
  private loop: boolean;

  private currentFrame = 0;
  private timeAccumulator = 0; // seconds

  constructor(layer: Konva.Layer, options: AnimatedSpriteOptions) {
    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.frameCount = options.frameCount;
    this.frameRate = options.frameRate;
    this.loop = options.loop;

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

      // Wrap or clamp frame index
      if (this.loop) {
        this.currentFrame = totalFramesPassed % this.frameCount;
      } else {
        this.currentFrame = Math.min(totalFramesPassed, this.frameCount - 1);
      }

      const frameX = this.currentFrame * this.frameWidth;

      // IMPORTANT: update the crop rect so we show the correct slice
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

  /** Optionally jump back to frame 0 */
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
}