import { BaseRenderer } from "./base.renderer";

export class AxesRenderer extends BaseRenderer {
  name: string;
  label: string;
  offsetX: number;
  offsetY: number;
  constructor(label: string, width: number, height: number, offsetX: number, offsetY: number) {
    super(width, height);
    this.label = label;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.render();
  }
  render() {
    this.clear();
    this.context.beginPath();
    this.context.moveTo(this.offsetX, this.height-this.offsetY);
    this.context.lineTo(this.offsetX, 2);
    this.context.lineTo(this.offsetX - 5, 10);
    this.context.moveTo(this.offsetX, 2);
    this.context.lineTo(this.offsetX + 5, 10);
    this.context.moveTo(this.offsetX, this.height-this.offsetY);
    this.context.lineTo(this.width-2, this.height-this.offsetY);
    this.context.lineTo(this.width-10, this.height-this.offsetY+5);
    this.context.moveTo(this.width-2, this.height-this.offsetY);
    this.context.lineTo(this.width-10, this.height-this.offsetY-5);
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 2;
    this.context.stroke();
  }

  draw() {
    return this.canvas;
  }
}
