<script lang="ts">
  import {onMount} from "svelte";
  import {getMinMaxDates} from "./weather.service";
  import {setHashValue, getHashValue} from "./utils/location.utils";
  import {getYearFromISODate} from "./utils/date.utils";
  import YearPicker from "./components/YearPicker.svelte";
  import ButtonCheckbox from "./components/ButtonCheckbox.svelte";
  import Chart from "./components/Chart.svelte";
  import {STORE_TEMPERATURE_NAME, STORE_PRECIPITATION_NAME} from "./db.config";
  let from,
    to,
    fromYear = getHashValue("from") || "",
    toYear = getHashValue("to") || "",
    scale = "6",
    chart = getHashValue("chart") || STORE_TEMPERATURE_NAME;

  onMount(async () => {
    [from, to] = (await getMinMaxDates(chart)).map((date) =>
      getYearFromISODate(date),
    );
  });
  function onFromYearChanged(event: {detail: string}) {
    fromYear = event.detail;
    setHashValue("from", fromYear);
  }
  function onToYearChanged(event: {detail: string}) {
    toYear = event.detail;
    setHashValue("to", toYear);
  }
  function onChartChanged(event: {detail: string}) {
    chart = event.detail;
    setHashValue("chart", chart);
  }
</script>

<div class="container">
  <h1>Archive</h1>
  <div class="d-flex">
    <aside>
      <div class="mb-5">
        <ButtonCheckbox
          label="Temperature"
          value={STORE_TEMPERATURE_NAME}
          name="chart-type"
          selectedValue={chart}
          on:change={onChartChanged}
        />
      </div>
      <div class="mb-5">
        <ButtonCheckbox
          label="Preseption"
          value={STORE_PRECIPITATION_NAME}
          name="chart-type"
          selectedValue={chart}
          on:change={onChartChanged}
        />
      </div>
    </aside>
    <main class="grow-1">
      <div class="d-flex w-100">
        <YearPicker
          {from}
          {to}
          on:change={onFromYearChanged}
          placeholder="Select Start Year"
          value={fromYear}
        />
        <YearPicker
          {from}
          {to}
          on:change={onToYearChanged}
          placeholder="Select End Year"
          value={toYear}
        />
      </div>
      <div>
        <span>Scale: </span><input
          type="range"
          min="6"
          max="65"
          bind:value={scale}
        />
        <Chart {fromYear} {toYear} {scale} {chart} />
      </div>
    </main>
  </div>
</div>

<style>
</style>
