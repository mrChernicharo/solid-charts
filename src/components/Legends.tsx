import { Component, For } from "solid-js";
import { PieDataPoint, s } from "../lib/constants";
import { getColor } from "../lib/helpers";

const Legends: Component<{
  ref: HTMLDivElement;
  title: string;
  colorScheme: string;
  data: PieDataPoint[];
  onToggleItem: (d: PieDataPoint, idx: number) => void;
}> = (props) => {
  return (
    <header
      ref={props.ref}
      style={{ ...s.legendContainer, "flex-wrap": "wrap" }}
    >
      <div>{props.title}</div>
      <For each={props.data}>
        {(d, idx) => (
          <div
            style={s.legendItem}
            onClick={(e) => props.onToggleItem(d, idx())}
          >
            <div
              style={{
                ...s.legendBtn,
                background: d.hidden
                  ? "#cdcdcd"
                  : getColor(idx(), props.data, props.colorScheme),
              }}
            ></div>
            <div>{d.label}</div>
          </div>
        )}
      </For>
      {/* <pre style={{ margin: "0", overflow: "hidden" }}>
        {JSON.stringify(props.data)}
      </pre> */}
    </header>
  );
};

export default Legends;
