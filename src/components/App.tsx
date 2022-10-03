import { Component, createSignal, Index, For } from "solid-js";
import { createStore } from "solid-js/store";
import Chart from "./Chart";
import { INITIAL_DATA, INITIAL_STORE } from "../lib/constants";

let n = 0;
const App: Component = () => {
  const [store, setStore] = createStore(INITIAL_STORE);
  const [overallData, setOverallData] = createSignal(INITIAL_DATA);

  const storeItems = () => Object.keys(store).map((k) => store[k]);

  return (
    <div>
      <h1>Solid Charts</h1>

      <Index each={storeItems()}>
        {(chart, idx) => {
          return <pre>{JSON.stringify(chart())}</pre>;
        }}
      </Index>

      <div>
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
              { label: "0" + n++, value: Math.round(Math.random() * 100) },
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
