import { Component, createSignal } from "solid-js";
import { DataPoint } from "./App";
import TransitionContainer from "./TransitionContainer";

const Chart: Component<{ data: DataPoint[] }> = (props) => {
  const [chartData, setChartData] = createSignal(props.data);

  return (
    <TransitionContainer data={props.data}>
      <div style={{ height: "300px", border: "1px solid" }}>
        <h3>Chart</h3>
        <pre>{"data " + JSON.stringify(props.data)}</pre>
        <pre>{"transitioned " + JSON.stringify(chartData())}</pre>
      </div>
    </TransitionContainer>
  );
};

export default Chart;
