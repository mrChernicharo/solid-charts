import { Component, createEffect, createMemo, createSignal, For, Index, Match, Switch } from "solid-js";
import { LineDataPoint, LineDataRow, PieDataPoint } from "../lib/constants";
import TransitionContainer from "./TransitionContainer";
import { arc } from "d3";
import { getColor } from "../lib/helpers";
import Legends from "./Legends";
import ResizableContainer from "./ResizableContainer";
import Pie from "./Pie";
import Line from "./Line";

const arcBuilder = arc();

const ChartConfig: Component<{
  type: string;
  title: string;
  initialDims: { width: number; height: number };
  transitionDuration: number;
  resizable: boolean;
  colorScheme: string;
  data: PieDataPoint[] | LineDataRow[];
}> = (props) => {
  let legendsRef!: HTMLDivElement;

  const [height, setHeight] = createSignal(props.initialDims.height);
  const [dims, setDims] = createSignal(props.initialDims);

  const [bulkData, setBulkData] = createSignal<PieDataPoint[] | LineDataRow[]>(props.data);
  const [chartData, setChartData] = createSignal<PieDataPoint[] | LineDataRow[]>([]);
  let filteredPoints: number[] = [];

  createEffect(() => {
    filteredPoints = bulkData()
      .map((d, i) => (d.hidden ? i : -1))
      .filter((o) => o !== -1);

    // changes in data.length might affect legendsRef.height
    setHeight(dims().height - legendsRef?.getBoundingClientRect().height || 0);
  });

  createEffect(() => {
    // console.log(props.data);
    if ("value" in props.data[0]) {
      setBulkData(
        (props.data as PieDataPoint[]).map((d, i) => (filteredPoints.includes(i) ? { ...d, hidden: true } : d))
      );
    }
    if ("values" in props.data[0]) {
      console.log(props.data);
      setBulkData(props.data as LineDataRow[]);
    }
  });

  return (
    <ResizableContainer
      canResize={props.resizable}
      initialHeight={props.initialDims.height}
      initialWidth={props.initialDims.width}
      onDimensionsChange={setDims}
    >
      <Switch>
        <Match when={props.type === "pie"}>
          <TransitionContainer
            duration={props.transitionDuration}
            data={bulkData() as PieDataPoint[]}
            onUpdate={setChartData}
          >
            <Legends
              ref={legendsRef}
              data={bulkData() as PieDataPoint[]}
              title={props.title}
              colorScheme={props.colorScheme}
              onToggleItem={(d, i) =>
                setBulkData((prev) =>
                  (prev as PieDataPoint[]).map((o, oIdx) => (oIdx === i ? { ...o, hidden: !o.hidden } : o))
                )
              }
            />
            <Pie
              height={height()}
              width={dims().width}
              colorScheme={props.colorScheme}
              data={chartData() as PieDataPoint[]}
            />
          </TransitionContainer>
        </Match>

        <Match when={props.type === "line"}>
          <TransitionContainer
            duration={props.transitionDuration}
            data={bulkData() as LineDataRow[]}
            onUpdate={setChartData}
          >
            <Legends
              ref={legendsRef}
              data={bulkData() as LineDataRow[]}
              title={props.title}
              colorScheme={props.colorScheme}
              onToggleItem={(d, i) =>
                setBulkData((prev) =>
                  (prev as PieDataPoint[]).map((o, oIdx) => (oIdx === i ? { ...o, hidden: !o.hidden } : o))
                )
              }
            />
            {/* <pre>{JSON.stringify(bulkData(), null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(chartData(), null, 2)}</pre> */}
            <Line
              height={height()}
              width={dims().width}
              colorScheme={props.colorScheme}
              data={chartData() as LineDataRow[]}
            />
          </TransitionContainer>
        </Match>
      </Switch>
    </ResizableContainer>
  );
};

export default ChartConfig;
