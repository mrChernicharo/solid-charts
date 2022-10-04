import { createStore } from "solid-js/store";
import {
  interpolateGreys,
  interpolateReds,
  interpolateGreens,
  interpolateBlues,
  interpolateOranges,
  interpolatePurples,
  interpolateYlOrBr,
  interpolateYlOrRd,
  interpolateBuGn,
  interpolateGnBu,
  interpolateYlGnBu,
  interpolateBuPu,
  interpolateCool,
  interpolateCividis,
  interpolateMagma,
  interpolatePlasma,
  interpolateWarm,
  interpolateSpectral,
  interpolateSinebow,
  interpolateViridis,
  interpolateTurbo,
  interpolateInferno,
} from "d3";
import { PieDataPoint } from "./constants";

const colorFuncs = {
  Greys: interpolateGreys,
  Reds: interpolateReds,
  Greens: interpolateGreens,
  Blues: interpolateBlues,
  Oranges: interpolateOranges,
  Purples: interpolatePurples,
  YlOrBr: interpolateYlOrBr,
  YlOrRd: interpolateYlOrRd,
  BuGn: interpolateBuGn,
  GnBu: interpolateGnBu,
  YlGnBu: interpolateYlGnBu,
  BuPu: interpolateBuPu,
  Cool: interpolateCool,
  Cividis: interpolateCividis,
  Magma: interpolateMagma,
  Plasma: interpolatePlasma,
  Warm: interpolateWarm,
  Spectral: interpolateSpectral,
  Sinebow: interpolateSinebow,
  Viridis: interpolateViridis,
  Turbo: interpolateTurbo,
  Inferno: interpolateInferno,
};

export const getColor = (
  num: number,
  data: PieDataPoint[],
  colorFunc: string
) => {
  // @ts-ignore
  return colorFuncs[colorFuncs[colorFunc] ? colorFunc : "Inferno"](
    (data.length - num) / data.length
  );
};
