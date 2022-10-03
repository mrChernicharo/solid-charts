import { createStore } from "solid-js/store";
import { interpolateReds } from "d3";
import { DataPoint } from "./constants";

export const getColor = (num: number, data: DataPoint[]) =>
  interpolateReds((data.length - num) / data.length);
