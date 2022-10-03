import { Component, For } from "solid-js";
import { DataPoint } from "../lib/constants";
import { getColor } from "../lib/helpers";

const ChartLegend: Component<{
  ref: HTMLDivElement;
  title: string;
  data: DataPoint[];
}> = (props) => {
  return (
    <header
      ref={props.ref}
      style={{
        background: "#444",
        display: "flex",
        "flex-wrap": "wrap",
        padding: ".5rem",
      }}
    >
      <div>{props.title}</div>
      <For each={props.data}>
        {(d, idx) => (
          <div
            style={{ display: "flex", "margin-bottom": "5px" }}
            onClick={(e) => {
              console.log(d, idx());

              // setChartData((prev) =>
              //   prev.map((o, i) =>
              //     i === idx() ? { ...o, hidden: !o.hidden } : o
              //   )
              // );
            }}
          >
            <div
              style={{
                background: props.data[idx()].hidden
                  ? "#cdcdcd"
                  : getColor(idx(), props.data),
                width: "24px",
                height: "16px",
                "border-radius": "4px",
                "margin-inline": "8px",
                "margin-top": "2px",
              }}
            ></div>
            <div>{d.label}</div>
          </div>
        )}
      </For>
      <pre style={{ margin: "0", overflow: "hidden" }}>
        {JSON.stringify(props.data)}
      </pre>
    </header>
  );
};

export default ChartLegend;
