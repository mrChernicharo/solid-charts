import { Component, createMemo, For } from "solid-js";
import { PieDataPoint } from "../lib/constants";
import { getColor } from "../lib/helpers";
import { arc } from "d3";

const arcBuilder = arc();

const Pie: Component<{
  height: number;
  width: number;
  data: PieDataPoint[];
  colorScheme: string;
}> = (props) => {
  const margin = { top: 10, bottom: 10, left: 10, right: 10 };

  const computed = createMemo(() => {
    const radius = Math.min(props.height, props.width) / 2 - margin.top;

    const paths: {
      path: string;
      color: string;
    }[] = [];

    let angle = 0;
    const total = props.data.reduce((acc, d) => acc + d.value, 0);

    const arcScale = (v: number) => (v / total) * (Math.PI * 2);

    for (const [i, PieDataPoint] of props.data.entries()) {
      let { value } = PieDataPoint;

      const endAngle = angle + arcScale(value);

      const path = arcBuilder({
        outerRadius: radius,
        innerRadius: radius * 0.65,
        startAngle: angle,
        endAngle: endAngle,
        padAngle: 0.01,
      })!;

      angle = endAngle;
      paths.push({
        path,
        color: getColor(i, props.data, props.colorScheme),
      });
    }

    return { paths };
  });

  return (
    <svg width={props.width} height={props.height} style={{ background: "#444" }}>
      <g style={{ transform: `translate(50%, ${props.height / 2}px)` }}>
        <For each={computed().paths}>
          {(p, i) => (
            <path
              d={p.path}
              fill={p.color}
              onPointerOver={
                (e) => console.log(props.data[i()])
                // console.log({ PieDataPoint: bulkData()[i()], path: p.path })
              }
            />
          )}
        </For>
      </g>
    </svg>
  );
};

export default Pie;
