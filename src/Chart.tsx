import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import { DataPoint } from "./App";
import TransitionContainer from "./TransitionContainer";
import {
  arc,
  interpolateBlues,
  interpolateCool,
  interpolateDiscrete,
  interpolateInferno,
} from "d3";

const arcBuilder = arc();

const Chart: Component<{
  type: string;
  title: string;
  height: number;
  width: number;
  data: DataPoint[];
}> = (props) => {
  let headerRef!: HTMLDivElement;
  const margin = { top: 10, bottom: 10, left: 10, right: 10 };

  const [height, setHeight] = createSignal(props.height);
  const [chartData, setChartData] = createSignal<DataPoint[]>(props.data);

  const computed = createMemo(() => {
    const radius = height() / 2 - margin.top;

    const paths: {
      path: string;
      color: string;
    }[] = [];

    let angle = 0;
    const total = chartData().reduce((acc, d) => acc + d.value, 0);

    const arcScale = (v: number) => (v / total) * (Math.PI * 2);

    for (const [i, dataPoint] of chartData().entries()) {
      const { value } = dataPoint;
      const endAngle = angle + arcScale(value);

      const path = arcBuilder({
        outerRadius: radius,
        innerRadius: radius * 0.65,
        startAngle: angle,
        endAngle: endAngle,
        padAngle: 0.01,
      })!;

      // const path = arcBuilder({
      //   outerRadius: radius,
      //   innerRadius: 0,
      //   startAngle: angle,
      //   endAngle: endAngle,
      //   padAngle: 0,
      // })!;

      angle = endAngle;
      paths.push({
        path,
        color: interpolateCool((i + 1) / chartData().length),
      });
    }

    return { paths };
  });

  createEffect(() => {
    setHeight(props.height - headerRef.getBoundingClientRect().height);
  });

  return (
    <TransitionContainer
      duration={1000}
      data={props.data}
      onUpdate={setChartData}
    >
      <header
        style={{ background: "#444", overflow: "hidden", display: "flex" }}
        ref={headerRef}
      >
        <div>{props.title}</div>
        <For each={props.data}>
          {(d, i) => (
            <div style={{ display: "flex" }}>
              <div
                style={{
                  background: interpolateCool((i() + 1) / chartData().length),
                  width: "24px",
                  height: "16px",
                  "border-radius": "4px",
                  "margin-inline": "5px",
                }}
              ></div>
              <div>{d.label}</div>
            </div>
          )}
        </For>
        {/* <pre style={{ margin: "0" }}>{JSON.stringify(chartData())}</pre> */}
      </header>

      <svg width={props.width} height={height()} style={{ background: "#444" }}>
        <g style={{ transform: `translate(50%, ${height() / 2}px)` }}>
          <For each={computed().paths}>
            {(p) => <path d={p.path} fill={p.color} />}
          </For>
        </g>
        {/* <g>
            <For each={chartData()}>
              {(d, i) => {
                return (
                  <rect x={(i() + 1) * 50} y={0} width={20} height={d.value} />
                );
              }}
            </For>
          </g> */}
      </svg>
    </TransitionContainer>
  );
};

export default Chart;
