import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import { DataPoint } from "../lib/constants";
import TransitionContainer from "./TransitionContainer";
import { arc } from "d3";
import { getColor } from "../lib/helpers";
import Legends from "./Legends";
import ResizableContainer from "./ResizableContainer";

const arcBuilder = arc();

const Chart: Component<{
  type: string;
  title: string;
  initialDims: { width: number; height: number };
  transitionDuration: number;
  resizable: boolean;
  colorScheme: string;
  data: DataPoint[];
}> = (props) => {
  let legendsRef!: HTMLDivElement;
  const margin = { top: 10, bottom: 10, left: 10, right: 10 };

  const [height, setHeight] = createSignal(props.initialDims.height);
  const [dims, setDims] = createSignal(props.initialDims);

  const [bulkData, setBulkData] = createSignal<DataPoint[]>(props.data);
  const [chartData, setChartData] = createSignal<DataPoint[]>([]);
  let filteredPoints: number[] = [];

  const computed = createMemo(() => {
    const radius = Math.min(height(), dims().width) / 2 - margin.top;

    const paths: {
      path: string;
      color: string;
    }[] = [];

    let angle = 0;
    const total = chartData().reduce((acc, d) => acc + d.value, 0);

    const arcScale = (v: number) => (v / total) * (Math.PI * 2);

    for (const [i, dataPoint] of chartData().entries()) {
      let { value } = dataPoint;

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
        color: getColor(i, chartData(), props.colorScheme),
      });
    }

    return { paths };
  });

  createEffect(() => {
    filteredPoints = bulkData()
      .map((d, i) => (d.hidden ? i : -1))
      .filter((o) => o !== -1);

    // changes in data.length might affect legendsRef.height
    setHeight(dims().height - legendsRef.getBoundingClientRect().height);
  });

  createEffect(() => {
    setBulkData(
      props.data.map((d, i) =>
        filteredPoints.includes(i) ? { ...d, hidden: true } : d
      )
    );
  });

  createEffect(() => {});

  return (
    <TransitionContainer
      duration={props.transitionDuration}
      data={bulkData()}
      onUpdate={setChartData}
    >
      <ResizableContainer
        canResize={props.resizable}
        initialHeight={props.initialDims.height}
        initialWidth={props.initialDims.width}
        onDimensionsChange={setDims}
      >
        <Legends
          ref={legendsRef}
          data={bulkData()}
          title={props.title}
          colorScheme={props.colorScheme}
          onToggleItem={(d, i) =>
            setBulkData((prev) =>
              prev.map((o, oIdx) =>
                oIdx === i ? { ...o, hidden: !o.hidden } : o
              )
            )
          }
        />

        <Switch>
          <Match when={props.type === "pie"}>
            <svg
              width={dims().width}
              height={height()}
              style={{ background: "#444" }}
            >
              <g style={{ transform: `translate(50%, ${height() / 2}px)` }}>
                <For each={computed().paths}>
                  {(p, i) => (
                    <path
                      d={p.path}
                      fill={p.color}
                      onPointerOver={
                        (e) => console.log(bulkData()[i()])
                        // console.log({ dataPoint: bulkData()[i()], path: p.path })
                      }
                    />
                  )}
                </For>
              </g>
            </svg>
          </Match>
        </Switch>
      </ResizableContainer>
    </TransitionContainer>
  );
};

export default Chart;
