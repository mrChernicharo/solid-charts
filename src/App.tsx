import { Component, createSignal, Index } from "solid-js";
import Chart from "./Chart";
import ResizableContainer from "./ResizableConteiner";
import TransitionContainer from "./TransitionContainer";

export interface DataPoint {
  label: string;
  value: number;
}

const INITIAL_DATA: DataPoint[] = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 10 },
];

const App: Component = () => {
  const [overallData, setOverallData] = createSignal(INITIAL_DATA);
  return (
    <div>
      <p>
        <strong>App</strong>
      </p>
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
      <ResizableContainer>
        <Chart data={overallData()} />
      </ResizableContainer>
    </div>
  );
};

export default App;
