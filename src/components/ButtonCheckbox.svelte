<script lang="ts">
  const id = Math.floor(Math.random() * Date.now());
  export let label = "";
</script>
<div class="btn-checkbox">
  <input id={id} type="checkbox"/>
  <label for={id}>{label}</label>
</div>
<style>
  .btn-checkbox input {
    width:0;
    height:0;
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
