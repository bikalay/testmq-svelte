import type {ItemData} from "src/types";
import {getYearScalePoints} from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";

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
    this.context.beginPath();
    this.context.font = "12px serif";
    this.context.textAlign = "center";
    preparedData.map((item) => {
      const dashSize = item.label ? 5 : 3;
      this.context.moveTo(item.x + 0.5, this.offsetY - dashSize);
      this.context.lineTo(item.x + 0.5, this.offsetY + dashSize);
      this.context.fillText(item.label, item.x, this.offsetY + 15);
    });
    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;
    this.context.stroke();
  }
}
