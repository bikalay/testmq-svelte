<script lang="ts">
  import {onMount} from "svelte";
  import {getMinMaxYears} from "./weather.service";
  import {setHashValue, getHashValue} from "./utils/location.utils";
  import YearPicker from "./components/YearPicker.svelte";
  import ButtonCheckbox from "./components/ButtonCheckbox.svelte";
  import Chart from "./components/Chart.svelte";
  let from, to, fromYear=getHashValue("from"), toYear = getHashValue("to"), scale="5";
  onMount(async () => {
    [from, to] = await getMinMaxYears();
  });
  function onFromYearChanged(event: {detail: string}) {
    fromYear = event.detail;
    setHashValue("from", fromYear);
  }
  function onToYearChanged(event: {detail: string}) {
    toYear = event.detail;
    setHashValue("to", toYear);
  }
</script>

<div class="container">
  <h1>Archive</h1>
  <div class="d-flex">
    <aside>
      <div class="mb-5">
        <ButtonCheckbox label="Temperature" />
      </div>
      <div class="mb-5">
        <ButtonCheckbox label="Preseption" />
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
        <span>{scale}<span>
        <input type="range" min="3" max="65" bind:value={scale} />
        <Chart fromYear={fromYear} toYear={toYear} scale={scale} />
      </div>
    </main>
  </div>
</div>

<style>
</style>
