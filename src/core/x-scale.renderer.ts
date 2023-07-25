import {
  AXES_COLOR,
  AXES_LINE_WIDTH,
  SCALE_FONT,
  SCALE_LARGE_DASH,
  SCALE_SMALL_DASH,
  SCALE_VALUES_OFFSET,
} from "../chart.config";
import type {ItemData} from "src/types";
import {getYearScalePoints} from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";
import {DrawBuilder} from "../utils/draw.builder";

export class DateScaleRenderer extends BaseRenderer {
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
    const preparedData = getYearScalePoints(
      this.data,
      this.width,
      this.offsetX,
    );
    const drawBuilder = new DrawBuilder(
      this.context,
      AXES_LINE_WIDTH,
      AXES_COLOR,
      SCALE_FONT,
      "center",
    ).beginPath();
    preparedData.map((item) => {
      const dashSize = item.label ? SCALE_LARGE_DASH : SCALE_SMALL_DASH;
      drawBuilder
        .moveTo(item.x, this.height - this.offsetY - dashSize)
        .lineTo(item.x, this.height - this.offsetY + dashSize);
      if (item.label) {
        drawBuilder.fillText(
          item.label,
          item.x,
          this.height - this.offsetY + SCALE_VALUES_OFFSET,
        );
      }
    });
    drawBuilder.stroke();
  }
}
