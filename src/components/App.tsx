import { Component, createSignal, Index, For } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import Chart from "./Chart";
import { INITIAL_DATA, INITIAL_STORE } from "../lib/constants";

let n = 0;
const App: Component = () => {
  const [store, setStore] = createStore(INITIAL_STORE);

  return (
    <div>
      <h1>Solid Charts</h1>

      <div style={{ display: "flex", "flex-wrap": "wrap" }}>
        <Index each={Object.keys(store)}>
          {(chartName, idx) => {
            return (
              <div
                style={{
                  border: "1px solid",
                  width: "45vw",
                  overflow: "hidden",
                }}
              >
                <p>{chartName()}</p>
                <pre>{JSON.stringify(store[chartName()])}</pre>

                <Index each={store[chartName()]}>
                  {(dataPoint, dIdx) => {
                    return (
                      <label for={dataPoint().label}>
                        {dataPoint().label}
                        <input
                          type="number"
                          id={dataPoint().label}
                          value={dataPoint().value}
                          onChange={(e) => {
                            setStore(
                              chartName(),
                              dIdx,
                              "value",
                              +e.currentTarget.value
                            );
                          }}
                        />
                      </label>
                    );
                  }}
                </Index>

                <button
                  onClick={(e) => {
                    setStore(chartName(), (prev) => [
                      ...prev,
                      {
                        label: "0" + n++,
                        value: Math.round(Math.random() * 30),
                      },
                    ]);
                  }}
                >
                  ADD
                </button>

                <div style={{ display: "flex" }}>
                  <Chart
                    data={store[chartName()].map((d) => ({ ...d }))}
                    resizable
                    initialDims={{ width: 400, height: 400 }}
                    transitionDuration={1000}
                    title="my chart"
                    type="pie"
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
