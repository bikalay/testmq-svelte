import type {ItemData} from "src/types";
import {getMinMaxValues, getYScalePont} from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";

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
    this.context.beginPath();
    this.context.font = "12px serif";
    this.context.textAlign = "right";
    let step;
    let k = 1;
    if (max - min > 50) {
      step = 5;
    } else if (max - min > 20) {
      step = 2;
    } else if (max - min > 10) {
      step = 1;
    } else if (max - min > 5) {
      step = 0.3;
      k = 10;
    } else if (max - min > 3) {
      step = 0.2;
      k = 10;
    } else {
      step = 0.1;
      k = 10;
    }

    const iMin = Math.floor(min * k) / k;
    const iMax = Math.floor(max * k) / k;
    for (let i = iMin; i < iMax; i += step) {
      const y = getYScalePont(i, min, max, this.height, this.offsetY);
      this.context.moveTo(this.offsetX - 5, y);
      this.context.lineTo(this.offsetX + 5, y);
      this.context.fillText(
        (Math.floor(i * k) / k).toString(),
        this.offsetX - 10,
        y,
      );
    }
    this.context.strokeStyle = "red";
    this.context.lineWidth = 1;
    this.context.stroke();
  }
}
