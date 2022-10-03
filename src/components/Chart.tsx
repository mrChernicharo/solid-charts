import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import { DataPoint } from "../lib/constants";
import TransitionContainer from "./TransitionContainer";
import { arc, interpolateCool, interpolateInferno, interpolateReds } from "d3";
import { getColor } from "../lib/helpers";
import ChartLegend from "./ChartLegend";
import ResizableContainer from "./ResizableContainer";

const arcBuilder = arc();

const Chart: Component<{
  type: string;
  title: string;
  initialDims: { width: number; height: number };
  transitionDuration: number;
  data: DataPoint[];
  onToggleHidden: (d: DataPoint, idx: number) => void;
}> = (props) => {
  let legendsRef!: HTMLDivElement;
  const margin = { top: 10, bottom: 10, left: 10, right: 10 };

  const [height, setHeight] = createSignal(props.initialDims.height);
  const [dims, setDims] = createSignal(props.initialDims);
  const [chartData, setChartData] = createSignal<DataPoint[]>(props.data);

  const computed = createMemo(() => {
    const radius = height() / 2 - margin.top;

    const paths: {
      path: string;
      color: string;
    }[] = [];

    let angle = 0;
    const total = chartData().reduce(
      (acc, d) => acc + d.value,
      // (acc, d) => acc + (d.hidden ? 0 : d.value),
      0
    );

    const arcScale = (v: number) => (v / total) * (Math.PI * 2);

    for (const [i, dataPoint] of chartData().entries()) {
      let { value } = dataPoint;

      // const endAngle = angle + arcScale(hidden ? 0 : value);
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
        color: getColor(i, chartData()),
      });
    }

    return { paths };
  });

  createEffect(() => {
    props.data.length; // changes in data.length might affect legendsRef.height
    setHeight(dims().height - legendsRef.getBoundingClientRect().height);
  });

  createEffect(() => {});

  return (
    <TransitionContainer
      duration={props.transitionDuration}
      data={props.data}
      onUpdate={setChartData}
    >
      <ResizableContainer
        initialHeight={props.initialDims.height}
        initialWidth={props.initialDims.width}
        onDimensionsChange={setDims}
      >
        <ChartLegend
          ref={legendsRef}
          data={props.data}
          title={props.title}
          onToggleHiddenItem={props.onToggleHidden}
        />

        <svg
          width={dims().width}
          height={height()}
          style={{ background: "#444" }}
        >
          <g style={{ transform: `translate(50%, ${height() / 2}px)` }}>
            <For each={computed().paths}>
              {(p) => <path d={p.path} fill={p.color} />}
            </For>
          </g>
        </svg>
      </ResizableContainer>
    </TransitionContainer>
  );
};

export default Chart;
