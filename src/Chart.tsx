import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import { DataPoint } from "./App";
import TransitionContainer from "./TransitionContainer";
import { arc } from "d3";

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
        innerRadius: radius / 2,
        startAngle: angle,
        endAngle: endAngle,
        padAngle: 0.01,
      })!;

      angle = endAngle;
      paths.push({ path, color: `#${(i + 2) * 100}` });
    }

    return { paths };
  });

  createEffect(() => {
    setHeight(props.height - headerRef.getBoundingClientRect().height);
  });

  return (
    <div>
      <header style={{ background: "#444" }} ref={headerRef}>
        <span>{props.title}</span>
        <pre style={{ margin: "0" }}>
          {"transitioned " + JSON.stringify(chartData())}
        </pre>
      </header>

      <TransitionContainer
        duration={1000}
        data={props.data}
        onUpdate={setChartData}
      >
        <svg
          width={props.width}
          height={height()}
          style={{ background: "lightblue" }}
        >
          <g style={{ transform: "translate(50%, 50%)" }}>
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
    </div>
  );
};

// const Chart: Component<{
//   type: string;
//   title: string;
//   height: number;
//   width: number;
//   data: DataPoint[];
// }> = (props) => {
//   let headerRef!: HTMLDivElement;

//   const [height, setHeight] = createSignal(0);
//   const [chartData, setChartData] = createStore<DataPoint[]>([]);
//   const [prevData, setPrevData] = createStore<DataPoint[]>([]);
//   const margin = { top: 10, bottom: 10, left: 10, right: 10 };

//   const computed = createMemo(() => {
//     const radius = height() / 2 - margin.top;

//     const paths: {
//       path: string;
//       color: string;
//     }[] = [];

//     let angle = 0;
//     const total = chartData.reduce((acc, d) => acc + d.value, 0);

//     const arcScale = (v: number) => (v / total) * (Math.PI * 2);

//     for (const [i, dataPoint] of chartData.entries()) {
//       const { value } = dataPoint;
//       const endAngle = angle + arcScale(value);

//       const path = arcBuilder({
//         outerRadius: radius,
//         innerRadius: radius / 2,
//         startAngle: angle,
//         endAngle: endAngle,
//         padAngle: 0.01,
//       })!;

//       angle = endAngle;
//       paths.push({ path, color: `#${(i + 2) * 100}` });
//     }

//     return { paths };
//   });

//   createEffect(() => {
//     setChartData((prevData) => {
//       console.log(unwrap(prevData));

//       return props.data;
//     });
//     console.log(unwrap(chartData));
//     // console.log({ prev: prevData[0]?.value ?? null, curr: chartData[0].value });
//   });

//   //   createEffect(() => {
//   //     console.log({ prev: prevData[0]?.value ?? null, curr: chartData[0].value });
//   //   });

//   createEffect(() => {
//     setHeight(props.height - headerRef.getBoundingClientRect().height);
//   });

//   return (
//     <div>
//       <div ref={headerRef}>{props.title}</div>
//       <svg
//         width={props.width}
//         height={height() >= 0 ? height() : 0}
//         style={{ background: "#666" }}
//       >
//         <g style={{ transform: `translate(50%, ${height() / 2}px)` }}>
//           <For each={computed().paths}>
//             {(p) => <path d={p.path} fill={p.color} />}
//           </For>
//         </g>
//       </svg>
//     </div>
//   );
// };

export default Chart;
