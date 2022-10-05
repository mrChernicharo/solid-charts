import { Component, createSignal, Index, For, Switch, Match, splitProps, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import Chart from "./ChartConfig";
import { PieDataPoint, INITIAL_DATA, LineChartConfig, LineDataRow } from "../lib/constants";
import ChartConfig from "./ChartConfig";

let n = 0;
const App: Component = () => {
  const [store, setStore] = createStore(INITIAL_DATA);
  // console.log(unwrap(store));

  const computedData = (chartType: string, data: PieDataPoint[] | LineDataRow[]) => {
    switch (chartType) {
      case "pie": {
        return (data as PieDataPoint[]).map((d) => ({ ...d }));
      }
      case "line": {
        return (data as LineDataRow[]).map((d) => ({ ...d, items: d.items.map((p) => ({ ...p })) }));
      }
      default:
        return [];
    }
  };

  return (
    <div>
      <h1>Solid Charts</h1>

      <div style={{ display: "flex", "flex-wrap": "wrap" }}>
        <Index each={store}>
          {(chart, idx) => {
            return (
              <div>
                <Show when={chart().type === "pie"}>
                  <button
                    onClick={(e) =>
                      setStore(idx, "data", store[idx].data.length, {
                        label: "0" + n++,
                        value: Math.round(Math.random() * 30),
                      })
                    }
                  >
                    ADD
                  </button>
                  <Index each={chart().data as PieDataPoint[]}>
                    {(dataPoint, dIdx) => {
                      return (
                        <label for={dataPoint().label}>
                          {dataPoint().label}
                          <input
                            type="number"
                            id={dataPoint().label}
                            value={dataPoint().value}
                            onChange={(e) => setStore(idx, "data", dIdx, "value" as any, +e.currentTarget.value)}
                          />
                        </label>
                      );
                    }}
                  </Index>
                </Show>

                <div style={{ display: "flex" }}>
                  <ChartConfig
                    data={computedData(store[idx].type, store[idx].data)}
                    resizable
                    initialDims={{ width: 400, height: 400 }}
                    transitionDuration={store[idx].type === "pie" ? 400 : 1500}
                    colorScheme={["Cool", "YlOrRd", "Inferno", "Sinebow", "Turbo"][idx]}
                    title={store[idx].title}
                    type={store[idx].type}
                  />
                </div>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
};

export default App;
