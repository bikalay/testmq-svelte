<script lang="ts">
  import {onMount} from "svelte";
  import {CanvasRenderer} from "../core/canvas.renderer";
  import {getWeatherData, getDataCount} from "../weather.service";
  import {
    addDays,
    getFirstDayOfYear,
    getLastDayOfYear,
    getDifferenceInDays,
  } from "../utils/date.utils";
  import {getChartFrame} from "../utils/chart.utils";
  import {STORE_TEMPERATURE_NAME} from "../db.config";
  let canvasEl, scrollEl, scrollWraper, canvasRenderer;
  export let fromYear = "0000";
  export let toYear = "9999";
  export let scale = "5";
  export let chart = STORE_TEMPERATURE_NAME;
  let dataLoaded = false;
  let prevStep = null;

  async function setChartData(
    chart: string,
    fromYear: string,
    toYear: string,
    offset: number = 0,
    step: number = 5,
  ) {
    if (canvasRenderer && canvasEl) {

      const [from, to, originalFrom, originalTo] = await getChartFrame(
        chart,
        fromYear,
        toYear,
        canvasEl.width,
        offset,
        step,
      );
      const data = await getWeatherData(chart, from, to);
      dataLoaded = !!data.length;
      canvasRenderer.chart = {
        data,
        name: chart,
      };
      const daysNumber = getDifferenceInDays(originalFrom, originalTo);
      const scrollSize = daysNumber * step;
      if (scrollSize !== scrollEl.clientWidth) {
        scrollEl.style.width = scrollSize + "px";
        const scrollPosition = getDifferenceInDays(originalFrom, from) * step;
        if (scrollWraper.scrollLeft != scrollPosition) {
          scrollWraper.scrollLeft = scrollPosition;
        }
      }
      prevStep = step;
    }
  }

  $: setChartData(
    chart,
    fromYear,
    toYear,
    scrollWraper ? (scrollWraper.scrollLeft / prevStep) * scale : 0,
    parseInt(scale),
  );

  onMount(async () => {
    canvasRenderer = new CanvasRenderer(canvasEl, {
      data: [],
      name: chart,
    });
    await setChartData(chart, fromYear, toYear, 0, parseInt(scale));
    let timeoutId = false;
    scrollWraper.onscroll = function (event) {
      event.stopPropagation();
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      timeoutId = setTimeout(() => {
        requestAnimationFrame(async () => {
          await setChartData(
            chart,
            fromYear,
            toYear,
            scrollWraper.scrollLeft,
            parseInt(scale),
          );
          timeoutId = null;
        });
      }, 10);
    };
    scrollWraper.addEventListener("wheel", function (e) {
      e.preventDefault();
      scrollWraper.scrollLeft += e.deltaY;
    });
  });
</script>

<div class="chart-wrapper">
  <h1 style={dataLoaded ? "display: none" : ""}>Loading...</h1>
  <canvas
    style="display:{dataLoaded ? 'block' : 'block'}"
    width="800"
    height="500"
    bind:this={canvasEl}
  />
  <div class="scroll-wrapper" bind:this={scrollWraper}>
    <div bind:this={scrollEl}>&nbsp;</div>
  </div>
</div>

<style>
  .chart-wrapper {
    width: 800px;
  }
  .chart-wrapper canvas {
    width: 800px;
    height: 500px;
    position: absolute;
  }
  .scroll-wrapper {
    overflow-x: scroll;
    max-width: 100%;
    width: 800px;
    position: absolute;
    height: 520px;
  }
</style>
