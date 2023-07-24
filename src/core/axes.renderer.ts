import { DrawBuilder } from "../utils/draw.builder";
import { AXES_COLOR, AXES_LINE_WIDTH } from "../chart.config";
import { BaseRenderer } from "./base.renderer";
const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 5;
const ARROW_OFFSET = 2;

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
    new DrawBuilder(this.context, AXES_LINE_WIDTH, AXES_COLOR)
    .beginPath()
    .moveTo(this.offsetX, this.height-this.offsetY)
    .lineTo(this.offsetX, ARROW_OFFSET)
    .lineTo(this.offsetX - ARROW_WIDTH, ARROW_HEIGHT)
    .moveTo(this.offsetX, ARROW_OFFSET)
    .lineTo(this.offsetX + ARROW_WIDTH, ARROW_HEIGHT)
    .moveTo(this.offsetX, this.height-this.offsetY)
    .lineTo(this.width-ARROW_OFFSET, this.height-this.offsetY)
    .lineTo(this.width-ARROW_HEIGHT, this.height-this.offsetY+ARROW_WIDTH)
    .moveTo(this.width-ARROW_OFFSET, this.height-this.offsetY)
    .lineTo(this.width-ARROW_HEIGHT, this.height-this.offsetY-ARROW_WIDTH)
    .stroke();
  }

  draw() {
    return this.canvas;
  }
}
