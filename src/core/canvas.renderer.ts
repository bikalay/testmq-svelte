import type {ChartData} from "src/types";
import { AxesRenderer } from "./axes.renderer";
import {ChartRenderer} from "./chart.renderer";

export class CanvasRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  chartRenderer: ChartRenderer;
  axesRenderer: AxesRenderer;
  #chart: ChartData;
  constructor(canvas: HTMLCanvasElement, chart: ChartData) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.chartRenderer = new ChartRenderer(
      chart,
      this.canvas.width,
      this.canvas.height,
    );
    this.axesRenderer = new AxesRenderer(chart.label, this.canvas.width, this.canvas.height, 20, 20);
    this.#chart = chart;
    this.draw();
  }

  set chart(value: ChartData) {

    this.chartRenderer.data = value.data;
    this.chartRenderer.label = value.label;
    this.chartRenderer.name = value.name;
    this.#chart = value;
    this.draw();
  }

  get chart() {
    return this.#chart;
  }

  draw() {
    this.clear();
    this.context.drawImage(this.chartRenderer.draw(), 0, 0);
    this.context.drawImage(this.axesRenderer.draw(), 0, 0);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
