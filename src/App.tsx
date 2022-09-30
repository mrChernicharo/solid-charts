import { useTransitionValue } from "./useTransitionValue";
import { arc } from "d3";
import { Component, createEffect, createMemo, createSignal, JSXElement, For, Index, untrack, useTransition } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { initialWidgets, s } from "./lib/constants";

const arcBuilder = arc();
const TRANSITION_DURATION = 750;

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

  const [height, setHeight] = createSignal(0);
  const [chartData, setChartData] = createSignal<DataPoint[]>([]);

  const computed = createMemo((prev) => {
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

  createEffect((prev) => {
    setChartData(props.data);
  });

  createEffect(() => {
    setHeight(props.height - headerRef.getBoundingClientRect().height);
  });

  return (
    <div>
      <div ref={headerRef}>{props.title}</div>
      <svg width={props.width} height={height() >= 0 ? height() : 0} style={{ background: "#666" }}>
        <g style={{ transform: `translate(50%, ${height() / 2}px)` }}>
          <For each={computed().paths}>{(p) => <path d={p.path} fill={p.color} />}</For>
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
            const [isTransitioning, setIsTransitioning] = createSignal(false);
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
                  {(dataPoint, di) => {
                    const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
                    return (
                      <input
                        ref={setInputRef}
                        type="number"
                        value={inputRef()?.value || dataPoint.value}
                        onChange={(e) => {
                          if (!isTransitioning()) {
                            setIsTransitioning(true);

                            setTimeout(() => {
                              const prevVal = store.widgets[idx()].data[di()].value;
                              const updateChartData = (v: number) => setStore("widgets", idx(), "data", di(), "value", v);

                              useTransitionValue(prevVal, +inputRef()?.value!, TRANSITION_DURATION, updateChartData);
                              setIsTransitioning(false);
                            }, TRANSITION_DURATION);
                          }
                        }}
                      />
                    );
                  }}
                </For>
                <div>
                  <button
                    onClick={(e) => {
                      // const prevWidgets = [...store.widgets];
                      setStore("widgets", idx(), "data", (prev) => [...prev, { label: "0" + prev.length, value: 0 }]);
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <For each={store.widgets}>
        {(widget, idx) => (
          <ResizableContainer
            initialHeight={widget.height}
            initialWidth={widget.width}
            onDimensionsChange={(dims) =>
              setStore("widgets", idx(), {
                height: dims.height,
                width: dims.width,
              })
            }
          >
            <Chart {...store.widgets[idx()]} />
          </ResizableContainer>
        )}
      </For>

      <pre>{JSON.stringify(store, null, 2)}</pre>
    </div>
  );
};

export default App;
