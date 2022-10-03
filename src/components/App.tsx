import { Component, createSignal, Index } from "solid-js";
import Chart from "./Chart";
import ResizableContainer from "./ResizableContainer";
import { INITIAL_DATA } from "../lib/constants";

const App: Component = () => {
  const [overallData, setOverallData] = createSignal(INITIAL_DATA);
  const [chartDims, setChartDims] = createSignal({ width: 400, height: 400 });
  return (
    <div>
      <h1>Solid Charts</h1>

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

      <ResizableContainer
        initialHeight={400}
        initialWidth={400}
        onDimensionsChange={setChartDims}
      >
        <Chart
          data={overallData()}
          height={chartDims().height}
          width={chartDims().width}
          title="my chart"
          type="pie"
        />
      </ResizableContainer>
    </div>
  );
};

export default App;
