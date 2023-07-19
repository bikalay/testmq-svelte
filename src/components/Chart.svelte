<script lang="ts">
  import {onMount} from "svelte";
  import {CanvasRenderer} from "../core/canvas.renderer";
  import {
    getTemperature,
    getTemperatureCount,
    getMinMaxYears,
  } from "../weather.service";
  import {
    addDays,
    getFirstDayOfYear,
    getLastDayOfYear,
    getDifferenceInDays,
  } from "../utils/date.utils";
  import {getChartFrame} from "../utils/chart.utils";
  let canvasEl, scrollEl, scrollWraper, canvasRenderer;
  export let fromYear = "0000";
  export let toYear = "9999";

  async function setChartData(
    fromYear: string,
    toYear: string,
    offset: number = 0,
    step: number = 5,
  ) {
    if (canvasRenderer && canvasEl) {
      const [from, to, originalFrom, originalTo] = await getChartFrame(
        fromYear,
        toYear,
        canvasEl.width,
        offset,
        step,
      );
      const data = await getTemperature(from, to);
      canvasRenderer.chart = {
        data,
        name: "temperature",
        label: "Temperature",
      };
      const daysNumber = getDifferenceInDays(originalFrom, originalTo);
      scrollEl.style.width = daysNumber * step + "px";
    }
  }

  $: setChartData(
    fromYear,
    toYear,
    scrollWraper ? scrollWraper.scrollLeft : 0,
    5,
  );
  onMount(async () => {
    canvasRenderer = new CanvasRenderer(canvasEl, {
      data: [],
      name: "temperature",
      label: "Temperature",
    });
    await setChartData(fromYear, toYear, 0, 5);
    let timeoutId = false;
    scrollWraper.onscroll = function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      timeoutId = setTimeout(() => {
        requestAnimationFrame(async () => {
          await setChartData(fromYear, toYear, scrollWraper.scrollLeft, 5);
          timeoutId = null;
        });
      }, 100);
    };
  });
</script>

<div style="width: 800px">
  <div style="overflow-x: scroll; max-width: 100%" bind:this={scrollWraper}>
    <div bind:this={scrollEl}>&nbsp;</div>
  </div>
  <canvas
    style="width: 800px; height: 500px;position: absolute;"
    width="800"
    height="500"
    bind:this={canvasEl}
  />
</div>
