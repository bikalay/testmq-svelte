<script lang="ts">
  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();
  const id = Math.floor(Math.random() * Date.now());
  export let label = "";
  export let name = "";
  export let value = "";
  export let selectedValue = "";
  function onChange(event) {
    dispatch("change", event.target.value);
  }
</script>

<div class="btn-checkbox">
  <input
    {id}
    type="radio"
    on:change={onChange}
    {name}
    {value}
    bind:group={selectedValue}
  />
  <label for={id}>{label}</label>
</div>

<style>
  .btn-checkbox input {
    width: 0;
    height: 0;
    float: left;
  }
  .btn-checkbox label {
    color: gray;
    font-size: 16px;
    display: block;
    text-align: center;
    padding: 10px 30px;
    border: 1px solid gray;
  }
  .btn-checkbox input:checked + label {
    background: gray;
    color: white;
  }
</style>
