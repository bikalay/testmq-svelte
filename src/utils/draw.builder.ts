export class DrawBuilder {
  context: CanvasRenderingContext2D;
  #offset: number;
  constructor(context, lineWidth, color, font?, textAlign?) {
    this.context = context;
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = color;
    if (font) {
      this.context.font = font;
    }
    if (textAlign) {
      this.context.textAlign = textAlign;
    }
    this.#offset = lineWidth === 1 ? 0.5 : 0;
  }
  beginPath() {
    this.context.beginPath();
    return this;
  }
  moveTo(x: number, y: number) {
    this.context.moveTo(x + this.#offset, y - this.#offset);
    return this;
  }
  lineTo(x: number, y: number) {
    this.context.lineTo(x + this.#offset, y - this.#offset);
    return this;
  }
  fillText(text: string, x: number, y: number) {
    this.context.fillText(text, x, y);
    return this;
  }
  stroke() {
    this.context.stroke();
  }
}
