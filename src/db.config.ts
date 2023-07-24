export const DB_NAME =  "weather-dev";
export const DB_VERSION = 7;
export const STORE_TEMPERATURE_NAME = "temperature";
export const STORE_PRECIPITATION_NAME = "precipitation";
export const STORES_CONFIG = [
  {
    name: STORE_TEMPERATURE_NAME,
    config: {
      keyPath: "t"
    },
    indexes: [
      {name: "t", unique: true},
    ]
  },
  {
    name: STORE_PRECIPITATION_NAME,
    config: {
      keyPath: "t"
    },
    indexes: [
      {name: "t", unique: true},
    ]
  },
]
