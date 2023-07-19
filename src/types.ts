/** one element in data */
export type ItemData = {
    /** time */
    t: string;
    /** value */
    v: number;
};

export type ChartItem = ItemData & {
  x: number,
  y: number
}

export type ChartData = {
  name: string,
  label: string,
  data: ItemData[]
}
