import type { ChartData, ChartItem, ItemData } from "src/types";
import { getChartPoints } from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";

export class ChartRenderer extends BaseRenderer {
  #data: Array<ChartItem>;
  name: string;
  label: string;
  constructor(
    chart: ChartData,
    width: number,
    height: number,
  ) {
    super(width, height);
    this.data = chart.data;
    this.label = chart.label;
    this.name = chart.name;
  }

  set data(value: Array<ItemData>) {
    this.#data = getChartPoints(value, this.width, this.height, 10, 10);
  }
  get data(): Array<ChartItem> {
    return this.#data;
  }

  render() {
    this.clear();
    this.context.beginPath();
    this.data.forEach((item, index) => {
      if(index === 0) {
        this.context.moveTo(item.x, item.y);
      } else {
        this.context.lineTo(item.x, item.y);
      }
    });
    this.context.strokeStyle = '#000';
    this.context.lineWidth = 3;
    this.context.stroke();
  }
}
