import { CHART_OFFSET_X, CHART_OFFSET_Y } from "../chart.config";
import type {ChartData} from "src/types";
import {AxesRenderer} from "./axes.renderer";
import {ChartRenderer} from "./chart.renderer";
import {DateScaleRenderer} from "./x-scale.renderer";
import {ValuesScale} from "./y-scale.renderer";

export class CanvasRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  chartRenderer: ChartRenderer;
  axesRenderer: AxesRenderer;
  dateScaleRenderer: DateScaleRenderer;
  valuesScaleRenderer: ValuesScale;
  #chart: ChartData;
  constructor(canvas: HTMLCanvasElement, chart: ChartData) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.chartRenderer = new ChartRenderer(
      chart,
      this.canvas.width,
      this.canvas.height,
      CHART_OFFSET_X,
      CHART_OFFSET_Y,
    );
    this.axesRenderer = new AxesRenderer(
      chart.label,
      this.canvas.width,
      this.canvas.height,
      CHART_OFFSET_X,
      CHART_OFFSET_Y,
    );
    this.dateScaleRenderer = new DateScaleRenderer(
      chart.data,
      this.canvas.width,
      this.canvas.height,
      CHART_OFFSET_X,
      CHART_OFFSET_Y,
    );
    this.valuesScaleRenderer = new ValuesScale(
      chart.data,
      this.canvas.width,
      this.canvas.height,
      CHART_OFFSET_X,
      CHART_OFFSET_Y,
    );
    this.#chart = chart;
    this.draw();
  }

  set chart(value: ChartData) {
    this.chartRenderer.name = value.name;
    this.chartRenderer.data = value.data;
    this.dateScaleRenderer.data = value.data;
    this.valuesScaleRenderer.data = value.data;
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
    this.context.drawImage(this.dateScaleRenderer.draw(), 0, 0);
    this.context.drawImage(this.valuesScaleRenderer.draw(), 0, 0);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
