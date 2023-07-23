<script lang="ts">
  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();
  export let placeholder = "Select Year...";
  export let from = 1970;
  export let to = new Date().getFullYear();
  export let value = "";
  $: years = new Array(to - from).fill(0).map((_, index) => from + index);
  function onYearSelected(event) {
    dispatch('change', event.target.value);
  };
  function onOpen(event) {
    dispatch('open');
  }

</script>

<div class="year-picker w-100">
  <select class="w-100" on:change={onYearSelected} on:click={onOpen} on:focus={onOpen} bind:value={value}>
    <option value="">{placeholder}</option>
    {#each years as year}
      <option value={year.toString()}>{year}</option>
    {/each}
  </select>
</div>

<style>
  .year-picker:first-child {
    border-right: none;
  }
  .year-picker select {
    color: gray;
    outline: none;
    padding: 10px 10px;
    border: 1px solid gray;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-size: 16px;
  }
  .year-picker select::-ms-expand {
    display: none;
  }

  .year-picker {
    position: relative;
  }
  .year-picker:after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    display: block;
    border-left: 1px solid gray;
    background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 60 43.3" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" fill="none"><polygon points="3,3 50,3 27.5,43.3" style="fill:none;stroke:gray;stroke-width:5"></polygon></svg>');
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
  }
</style>
