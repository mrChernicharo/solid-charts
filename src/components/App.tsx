import { Component, createSignal, Index } from "solid-js";
import Chart from "./Chart";
import ResizableContainer from "./ResizableContainer";
import { INITIAL_DATA } from "../lib/constants";

let n = 0;
const App: Component = () => {
  const [overallData, setOverallData] = createSignal(INITIAL_DATA);
  return (
    <div>
      <h1>Solid Charts</h1>

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

        <Chart
          data={overallData()}
          resizable
          initialDims={{ width: 600, height: 400 }}
          transitionDuration={1000}
          title="my chart"
          type="pie"
        />

        <Chart
          data={overallData()}
          resizable={false}
          initialDims={{ width: 600, height: 400 }}
          transitionDuration={1000}
          title="my chart"
          type="pie"
        />
      </div>
    </div>
  );
};

export default App;
