import { Component, createSignal, Index, For, Switch, Match, splitProps } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import Chart from "./ChartConfig";
import { PieDataPoint, INITIAL_DATA, LineChartConfig, LineDataRow } from "../lib/constants";
import ChartConfig from "./ChartConfig";

let n = 0;
const App: Component = () => {
  const [store, setStore] = createStore(INITIAL_DATA);
  console.log(unwrap(store));

  return (
    <div>
      <h1>Solid Charts</h1>

      <div style={{ display: "flex", "flex-wrap": "wrap" }}>
        <Index each={store}>
          {(chart, idx) => {
            return (
              <div>
                <p>{chart().title}</p>

                <Switch>
                  <Match when={chart().type === "pie"}>
                    <button
                      // prettier-ignore
                      onClick={(e) => setStore(idx, "data", store[idx].data.length, ({ label: "0" + n++, value: Math.round(Math.random() * 30) }))}
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
                              // prettier-ignore
                              onChange={(e) =>  setStore(idx, "data", dIdx, "value" as any, +e.currentTarget.value)}
                            />
                          </label>
                        );
                      }}
                    </Index>

                    <div style={{ display: "flex" }}>
                      <ChartConfig
                        // prettier-ignore
                        data={(store[idx].data as PieDataPoint[]).map((d) => ({ ...d }))}
                        resizable
                        initialDims={{ width: 400, height: 400 }}
                        transitionDuration={400}
                        colorScheme={["Cool", "YlOrRd", "Inferno", "Sinebow"][idx]}
                        title={store[idx].title}
                        type={store[idx].type}
                      />
                    </div>
                  </Match>

                  <Match when={chart().type === "line"}>
                    <div>Line</div>

                    <div style={{ display: "flex" }}>
                      <ChartConfig
                        // prettier-ignore
                        // data={(store[idx].data as LineDataRow[]).map((d) => ({ ...d, items: d.items.map(p => ({...p}))}))}
                        data={(chart().data as LineDataRow[]).map((d) => ({ ...d, items: d.items.map(p => ({...p}))}))}
                        resizable
                        initialDims={{ width: 400, height: 400 }}
                        transitionDuration={1000}
                        colorScheme={["Cool", "YlOrRd", "Inferno", "Sinebow"][idx]}
                        title={store[idx].title}
                        type={store[idx].type}
                      />
                    </div>
                  </Match>
                </Switch>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
};

export default App;
