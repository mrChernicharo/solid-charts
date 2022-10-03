import { Component, For } from "solid-js";
import { DataPoint, s } from "../lib/constants";
import { getColor } from "../lib/helpers";

const Legend: Component<{
  ref: HTMLDivElement;
  title: string;
  data: DataPoint[];
  onToggleHiddenItem: (d: DataPoint, idx: number) => void;
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
            onClick={(e) => props.onToggleHiddenItem(d, idx())}
          >
            <div
              style={{
                ...s.legendBtn,
                background: d.hidden ? "#cdcdcd" : getColor(idx(), props.data),
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

export default Legend;
