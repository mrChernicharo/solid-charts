import { Component, For } from "solid-js";
import { LineDataRow } from "../lib/constants";
import { line, axisBottom, range, AxisDomain, AxisScale } from "d3";
const lineGenerator = line();
const Line: Component<{
  height: number;
  width: number;
  data: LineDataRow[];
  colorScheme: string;
}> = (props) => {
  const margin = { top: 10, bottom: 10, left: 10, right: 10 };

  const line = lineGenerator([
    [4, 4],
    [100, 4],
    [200, 100],
    [300, 80],
    [400, 190],
  ]);
  console.log(line);
  return (
    <svg
      width={props.width}
      height={props.height}
      style={{ background: "#344" }}
    >
      <For each={props.data}>
        {(row, rowIdx) => (
          <g>
            <text x={(rowIdx() + 1) * 100} y={(rowIdx() + 1) * 100}>
              {row.label}
            </text>
          </g>
        )}
      </For>
    </svg>
  );
};

export default Line;
