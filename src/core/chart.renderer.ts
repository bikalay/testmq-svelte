import {CHART_COLOR, CHART_LINE_WIDTH} from "../chart.config";
import type {ChartData, ChartItem, ItemData} from "src/types";
import {DrawBuilder} from "../utils/draw.builder";
import {getChartPoints} from "../utils/chart.utils";
import {BaseRenderer} from "./base.renderer";

export class ChartRenderer extends BaseRenderer {
  #data: Array<ChartItem> = [];
  name: string;
  label: string;
  offsetX: number;
  offsetY: number;
  constructor(
    chart: ChartData,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ) {
    super(width, height);
    this.label = chart.label;
    this.name = chart.name;
    this.data = chart.data;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  set data(value: Array<ItemData>) {
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
    const drawBuilder = new DrawBuilder(
      this.context,
      CHART_LINE_WIDTH,
      CHART_COLOR,
    ).beginPath();
    this.data.forEach((item, index) => {
      if (index === 0) {
        drawBuilder.moveTo(item.x, item.y);
      } else {
        drawBuilder.lineTo(item.x, item.y);
      }
    });
    drawBuilder.stroke();
  }
}
