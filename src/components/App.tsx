import { Component, createSignal, Index, For } from "solid-js";
import { createStore } from "solid-js/store";
import Chart from "./Chart";
import { INITIAL_DATA, INITIAL_STORE } from "../lib/constants";

let n = 0;
const App: Component = () => {
  const [store, setStore] = createStore(INITIAL_STORE);
  const [overallData, setOverallData] = createSignal(INITIAL_DATA);

  // const storeItems = () => Object.keys(store).map((k) => store[k]);

  return (
    <div>
      <h1>Solid Charts</h1>

      <div>
        <Index each={Object.keys(store)}>
          {(chartName, idx) => {
            return (
              <>
                <p>{chartName}</p>
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
              </>
            );
          }}
        </Index>

        <hr />

        <Index each={overallData()}>
          {(d, idx) => (
            <label for={d().label}>
              {d().label}
              <input
                type="number"
                id={d().label}
                value={d().value}
                onChange={(e) =>
                  setOverallData((prev) =>
                    prev.map((it, i) =>
                      i === idx ? { ...it, value: +e.currentTarget.value } : it
                    )
                  )
                }
              />
            </label>
          )}
        </Index>
        <button
          onClick={(e) => {
            setOverallData((prev) => [
              ...prev,
              { label: "0" + n++, value: Math.round(Math.random() * 30) },
            ]);
          }}
        >
          ADD
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <Chart
          data={overallData()}
          resizable
          initialDims={{ width: 400, height: 400 }}
          transitionDuration={1000}
          title="my chart"
          type="pie"
        />
      </div>
    </div>
  );
};

export default App;
