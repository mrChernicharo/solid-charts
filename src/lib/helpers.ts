import { interpolateReds } from "d3";
import { DataPoint } from "./constants";

export const getColor = (num: number, data: DataPoint[]) =>
  interpolateReds((num + 1) / data.length);
