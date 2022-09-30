import { useTransitionValue } from "./useTransitionValue";
import { arc } from "d3";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  JSXElement,
  For,
  Index,
  untrack,
} from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { initialWidgets, s } from "./lib/constants";

const arcBuilder = arc();

interface DataPoint {
  label: string;
  value: number;
}

// interface DataPoint2 {
// 	label: string;
// 	x: number;
// 	y: number;
// }

const ResizableContainer: Component<{
  initialHeight: number;
  initialWidth: number;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  children: JSXElement;
}> = (props) => {
  const [height, setHeight] = createSignal(props.initialHeight);
  const [width, setWidth] = createSignal(props.initialWidth);
  const [isDragging, setIsDragging] = createSignal(false);

  createEffect(() => {
    document.body.addEventListener("pointermove", (e) => {
      if (isDragging()) {
        setWidth(width() + e.movementX);
        setHeight(height() + e.movementY);
        props.onDimensionsChange({ width: width(), height: height() });
      }
    });
    document.body.addEventListener("pointerup", (e) => {
      if (isDragging()) {
        setIsDragging(false);
      }
    });
  });

  return (
    <div
      style={{
        ...s.container,
        position: "relative",
        width: `${width()}px`,
        height: `${height()}px`,
      }}
    >
      {props.children}
      <div
        style={{
          ...s.dragHandle,
          position: "absolute",
          cursor: isDragging() ? "grabbing" : "grab",
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 && !isDragging()) {
            setIsDragging(true);
          }
        }}
      ></div>
    </div>
  );
};

const Chart: Component<{
  type: string;
  title: string;
  height: number;
  width: number;
  data: DataPoint[];
}> = (props) => {
  const margin = { top: 10, bottom: 10, left: 10, right: 10 };

  let headerRef!: HTMLDivElement;
  let prevData: DataPoint[] = [];

  const [height, setHeight] = createSignal(0);
  const [chartData, setChartData] = createSignal<DataPoint[]>([]);
  //   const [prevData, setPrevData] = createSignal<DataPoint[]>([]);

  const computed = createMemo((prev) => {
    const radius = height() / 2 - margin.top;
    console.log("computed", { prevData });

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

  createEffect((prev) => {
    setChartData(props.data);
  });

  createEffect(() => {
    setHeight(props.height - headerRef.getBoundingClientRect().height);
  });

  return (
    <div>
      <div ref={headerRef}>{props.title}</div>
      <svg
        width={props.width}
        height={height() >= 0 ? height() : 0}
        style={{ background: "#666" }}
      >
        <g style={{ transform: `translate(50%, ${height() / 2}px)` }}>
          <For each={computed().paths}>
            {(p) => <path d={p.path} fill={p.color} />}
          </For>
        </g>
      </svg>
    </div>
  );
};

const App: Component = () => {
  const [store, setStore] = createStore(initialWidgets);

  return (
    <div style={s.body}>
      <h1 style={s.h1}>Solid charts</h1>

      <div>
        <For each={store.widgets}>
          {(widget, idx) => {
            const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
            return (
              <div>
                <input
                  type="text"
                  value={widget.title}
                  onChange={(e) => {
                    setStore("widgets", idx(), "title", e.currentTarget.value);
                  }}
                />
                <For each={widget.data}>
                  {(dataPoint, di) => (
                    <input
                      ref={setInputRef}
                      type="number"
                      value={inputRef()?.value || dataPoint.value}
                      onChange={(e) => {
                        const prevVal = store.widgets[idx()].data[di()].value;

                        const updateChart = (v: number) =>
                          setStore("widgets", idx(), "data", di(), "value", v);

                        // prettier-ignore
                        useTransitionValue(prevVal, +e.currentTarget.value, 1000, updateChart)
                      }}
                    />
                  )}
                </For>
                <div>
                  <button
                    onClick={(e) =>
                      setStore("widgets", idx(), "data", (prev) => [
                        ...prev,
                        { label: "0" + prev.length, value: 0 },
                      ])
                    }
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <Index each={store.widgets}>
        {(widget, idx) => (
          <ResizableContainer
            initialHeight={widget().height}
            initialWidth={widget().width}
            onDimensionsChange={(dims) =>
              setStore("widgets", idx, {
                height: dims.height,
                width: dims.width,
              })
            }
          >
            <Chart {...store.widgets[idx]} />
          </ResizableContainer>
        )}
      </Index>

      <pre>{JSON.stringify(store, null, 2)}</pre>
    </div>
  );
};

export default App;
