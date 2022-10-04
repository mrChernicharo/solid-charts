import { Component, createSignal, Index, For, Switch, Match } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import Chart from "./Chart";
import { INITIAL_DATA, INITIAL_STORE } from "../lib/constants";

let n = 0;
const App: Component = () => {
  const [store, setStore] = createStore(INITIAL_DATA);

  return (
    <div>
      <h1>Solid Charts</h1>

      <div style={{ display: "flex", "flex-wrap": "wrap" }}>
        <Index each={store}>
          {(chart, idx) => {
            console.log(chart().title, chart().type, idx);
            return (
              <div
                style={{
                  width: "650px",
                }}
              >
                <p>{chart().title}</p>

                <Switch>
                  <Match when={chart().type === "pie"}>
                    <button
                      onClick={(e) => {
                        // prettier-ignore
                        setStore(idx, "data", (prev: any) => [ ...prev, { label: "0" + n++, value: Math.round(Math.random() * 30) }]);
                      }}
                    >
                      ADD
                    </button>
                    <Index
                      each={chart().data as { label: string; value: number }[]}
                    >
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
                      <Chart
                        // prettier-ignore
                        data={(
                          store[idx].data as { label: string; value: number }[]).map((d) => ({ ...d }))}
                        resizable
                        initialDims={{ width: 400, height: 400 }}
                        transitionDuration={1000}
                        colorScheme={["Cool", "Blues", "Magma", "Sinebow"][idx]}
                        title={store[idx].title}
                        type={store[idx].type}
                      />
                    </div>
                  </Match>
                </Switch>
                {/* <pre>{JSON.stringify(store[chartName()])}</pre> */}
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
};

export default App;
