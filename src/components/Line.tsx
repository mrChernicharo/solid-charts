import { Component, createEffect, createMemo, For, Index } from "solid-js";
import { LineDataRow } from "../lib/constants";
import { line, axisBottom, range, AxisDomain, AxisScale, scaleLinear, ticks } from "d3";
import { getColor } from "../lib/helpers";
const lineGenerator = line();
const Line: Component<{
  height: number;
  width: number;
  data: LineDataRow[];
  colorScheme: string;
}> = (props) => {
  const margin = { top: 10, bottom: 20, left: 40, right: 40 };
  let minY = Infinity;
  let maxY = -Infinity;

  //   const line = lineGenerator([
  //     [4, 4],
  //     [100, 4],
  //     [200, 100],
  //     [300, 80],
  //     [400, 190],
  //   ]);

  // const axisTicks = createMemo(() => {
  //   const xScale = scaleLinear()
  //     .domain([
  //       new Date(props.data[0]?.items[0]?.x || new Date()),
  //       new Date(props.data[0]?.items.at(-1)!?.x || new Date()),
  //     ])
  //     .range([margin.left, props.width - margin.right]);

  //   return xScale.ticks();
  // });

  const computed = createMemo(() => {
    const minW = margin.left;
    const maxW = props.width - margin.right;
    const minH = margin.top;
    const maxH = props.height - margin.bottom;
    const W = maxW - minW;
    const H = maxH - minH;

    const fx = (i: number) => (W / (props.data[0].items.length - 1)) * i;
    const fy = (n: number) => -(((n - minY) / (maxY - minY)) * (H - margin.bottom - margin.top)) + H;

    const points: { x: number; y: number }[][] = [];
    const lines: string[] = [];

    for (const [rowIdx, row] of props.data.entries()) {
      points.push([]);
      const lineData: [number, number][] = [];

      for (const [i, item] of row.items.entries()) {
        const point = { x: fx(i), y: fy(item.y) };
        points[rowIdx].push(point);
        lineData.push([point.x, point.y]);
      }
      lines[rowIdx] = lineGenerator(lineData)!;
    }

    return { points, lines };
  });

  createEffect(() => {
    props.data.forEach((row, rowIdx) => {
      row.items.forEach((it, idx) => {
        if (it.y < minY) minY = it.y;
        if (it.y > maxY) maxY = it.y;
      });
    });
  });

  return (
    <svg width={props.width} height={props.height} style={{ background: "#444" }}>
      <g style={{ transform: `translate(${margin.left}px, ${margin.top}px)` }}>
        <Index each={computed().lines}>
          {(line, idx) => <path d={line()} fill="none" stroke={getColor(idx, props.data, props.colorScheme)} />}
        </Index>

        <For each={props.data}>
          {(row, rowIdx) => (
            <For each={row.items}>
              {(item, idx) => (
                <circle
                  onPointerOver={(e) => console.log(row.label, item.x, item.y)}
                  cx={computed().points[rowIdx()][idx()].x}
                  cy={computed().points[rowIdx()][idx()].y}
                  r={4}
                ></circle>
              )}
            </For>
          )}
        </For>

        {/* <BottomAxis domain={[]} range={[]} /> */}
      </g>

      {/* <g>
        <Index each={axisTicks()}>
          {(tick, i) => (
            <g transform={`translate(0, 0)`}>
              <line y2="6" />
              <text stroke="white" y="100" x={i * 100}>
                {new Date(tick()).toLocaleDateString()}
              </text>
            </g>
          )}
        </Index>
      </g> */}
    </svg>
  );
};

export default Line;
