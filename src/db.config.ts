
export const DB_NAME =  "weather";
export const DB_VERSION = 2;
export const STORE_TEMPERATURE_NAME = "temperature";
export const STORE_PRECIPITATION_NAME = "precipitation";
export const STORES_CONFIG = [
  {
    name: STORE_TEMPERATURE_NAME,
    config: {
      autoIncrement: true
    },
    indexes: [
      {name: "t", unique: false},
      {name: "v", unique: false},
    ]
  },
  {
    name: STORE_PRECIPITATION_NAME,
    config: {
      autoIncrement: true
    },
    indexes: [
      {name: "t", unique: false},
      {name: "v", unique: false},
    ]
  },
]
