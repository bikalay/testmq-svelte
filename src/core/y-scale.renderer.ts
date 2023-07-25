import type {ItemData} from "src/types";
import {DrawBuilder} from "../utils/draw.builder";
import {getMinMaxValues, getYScalePoint} from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";
import {
  AXES_COLOR,
  AXES_LINE_WIDTH,
  SCALE_FONT,
  SCALE_LARGE_DASH,
} from "../chart.config";

export class ValuesScale extends BaseRenderer {
  data: Array<ItemData> = [];
  offsetX: number;
  offsetY: number;
  constructor(
    data: Array<ItemData>,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ) {
    super(width, height);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.data = data;
  }
  render() {
    this.clear();
    const [min, max] = getMinMaxValues(this.data);
    const drawBuilder = new DrawBuilder(
      this.context,
      AXES_LINE_WIDTH,
      AXES_COLOR,
      SCALE_FONT,
      "right",
    ).beginPath();
    let step = (max - min) / 10;
    const k = step < 1 ? 10 : 1;

    step = Math.floor(step * k) / k;
    step = step || 0.1;
    const iMin = Math.floor(min * k) / k;
    const iMax = Math.floor(max * k) / k;
    for (let i = iMin; i < iMax; i += step) {
      const y = getYScalePoint(i, min, max, this.height, this.offsetY);
      if (y <= this.height - this.offsetY) {
        drawBuilder
          .moveTo(this.offsetX - SCALE_LARGE_DASH, y)
          .lineTo(this.offsetX + SCALE_LARGE_DASH, y)
          .fillText((Math.floor(i * k) / k).toString(), this.offsetX - 10, y);
      }
    }
    drawBuilder.stroke();
  }
}
