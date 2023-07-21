import type {ChartData, ChartItem, ItemData} from "src/types";
import {getChartPoints} from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";

export class ChartRenderer extends BaseRenderer {
  #data: Array<ChartItem> = [];
  name: string;
  label: string;
  offsetX: number;
  offsetY: number;
  constructor(chart: ChartData, width: number, height: number, offsetX: number, offsetY: number) {
    super(width, height);
    this.label = chart.label;
    this.name = chart.name;
    this.data = chart.data;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  set data (value: Array<ItemData>) {
    this.#data = getChartPoints(
      value,
      this.width,
      this.height,
      this.offsetX,
      this.offsetY,
    );
  }

  get data(): Array<ChartItem> {
    return this.#data;
  }

  render() {
    this.clear();
    this.context.beginPath();
    this.data.forEach((item, index) => {
      if (index === 0) {
        this.context.moveTo(item.x, item.y);
      } else {
        this.context.lineTo(item.x, item.y);
      }
    });
    this.context.strokeStyle = "#000";
    this.context.lineWidth = 2;
    this.context.stroke();
  }
}
