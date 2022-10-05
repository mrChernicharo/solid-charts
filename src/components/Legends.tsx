import { Component, For, Show } from "solid-js";
import { LineDataRow, PieDataPoint, s } from "../lib/constants";
import { getColor } from "../lib/helpers";

const Legends: Component<{
  ref: HTMLDivElement;
  title: string;
  colorScheme: string;
  data: PieDataPoint[] | LineDataRow[];
  onToggleItem: (d: PieDataPoint | LineDataRow, idx: number) => void;
}> = (props) => {
  return (
    <header
      ref={props.ref}
      style={{ ...s.legendContainer, "flex-wrap": "wrap" }}
    >
      <div>{props.title}</div>

      <Show when={"value" in props.data[0]}>
        <For each={props.data as PieDataPoint[]}>
          {(d, idx) => (
            <div
              style={s.legendItem}
              onClick={(e) => props.onToggleItem(d, idx())}
            >
              <div
                // prettier-ignore
                style={{
                  ...s.legendBtn,
                  background: d.hidden ? "#cdcdcd" : getColor(idx(), (props.data as PieDataPoint[]), props.colorScheme),
                }}
              ></div>
              <div>{d.label}</div>
            </div>
          )}
        </For>
      </Show>
      <Show when={"items" in props.data[0]}>
        <For each={props.data as LineDataRow[]}>
          {(row, idx) => (
            <div
              style={s.legendItem}
              onClick={(e) => props.onToggleItem(row, idx())}
            >
              <div
                // prettier-ignore
                style={{
                  ...s.legendBtn,
                  background: row.hidden ? "#cdcdcd" : getColor(idx(), (props.data as PieDataPoint[]), props.colorScheme),
                }}
              ></div>
              <div>{row.label}</div>
            </div>
          )}
        </For>
      </Show>

      {/* <pre style={{ margin: "0", overflow: "hidden" }}>
        {JSON.stringify(props.data)}
      </pre> */}
    </header>
  );
};

export default Legends;
