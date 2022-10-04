import {
  children,
  Component,
  createEffect,
  createSignal,
  JSXElement,
} from "solid-js";
import { LineDataRow, LineDataPoint, PieDataPoint } from "../lib/constants";
import { useTransitionValue } from "use-transition-value";

const TransitionContainer: Component<{
  children: JSXElement;
  data: PieDataPoint[] | LineDataRow[];
  duration: number;
  onUpdate: (data: PieDataPoint[] | LineDataRow[]) => void;
}> = (props) => {
  let prevList: PieDataPoint[] | LineDataRow[] = [];

  const [data, setData] = createSignal<PieDataPoint[] | LineDataRow[]>([]);
  const [transitionList, setTransitionList] = createSignal<
    PieDataPoint[] | LineDataRow[]
  >(props.data);

  const val = (
    data: PieDataPoint[] | LineDataRow[],
    idx: number,
    rowIdx = -1
  ) => {
    if ("value" in data[0]) {
      return (data[idx] as PieDataPoint)?.value || 0;
    }

    if ("values" in data[0]) {
      return (data[rowIdx] as LineDataRow)?.values[idx].y || 0;
    }

    return 0;
  };

  const updateTransitionList = (curr: number, idx: number, rowIdx = -1) => {
    // console.log({ curr, idx });
    setTransitionList((list) => {
      if ("value" in data()[0]) {
        return (list as PieDataPoint[]).map((d, i) =>
          i === idx ? { ...d, value: curr } : d
        );
      }

      if ("values" in data()[0]) {
        return (list as LineDataRow[]).map((row, ri) =>
          ri === rowIdx
            ? row.values.map((d, i) => (i === idx ? { ...d, y: curr } : d))
            : row
        ) as LineDataRow[];
      }

      return [];
    });
  };
  // data setup: receiving bulk data via props
  createEffect(() => {
    prevList = data();
    setData(props.data);
    setTransitionList(props.data);
  });

  // transitions setup: tell what values should update when
  createEffect(() => {
    // PIE
    if ("value" in data()[0]) {
      const point = (idx: number) => data()[idx] as PieDataPoint;
      const prevPoint = (idx: number) => (prevList as PieDataPoint[])[idx];
      // Initial Transition
      if (prevList.length === 0) {
        data().forEach((d, idx) => {
          useTransitionValue({
            id: String(idx),
            initial: 0,
            final: val(data(), idx),
            duration: props.duration,
            cb: (val: number) => updateTransitionList(val, idx),
          });
        });
      }

      // new element added
      if (prevList.length !== 0 && prevList.length < props.data.length) {
        let idx = props.data.length - 1;
        // console.log("added new element!", { data: data(), item: data()[idx], idx });

        useTransitionValue({
          id: String(idx),
          initial: 0,
          final: val(data(), idx),
          duration: props.duration,
          cb: (val: number) => updateTransitionList(val, idx),
        });
      }

      for (let [idx, d] of data().entries()) {
        // hidden item
        if (prevPoint(idx) && prevPoint(idx).hidden && point(idx).hidden) {
          updateTransitionList(0, idx);
        }

        // visibility changed
        if (prevPoint(idx) && prevPoint(idx).hidden !== point(idx).hidden) {
          // just hidden
          if ((data()[idx] as PieDataPoint).hidden) {
            useTransitionValue({
              id: String(idx),
              initial: val(data(), idx),
              final: 0,
              duration: props.duration,
              cb: (val: number) => updateTransitionList(val, idx),
            });
          }

          // just shown
          if (prevPoint(idx).hidden) {
            useTransitionValue({
              id: String(idx),
              initial: 0,
              final: val(data(), idx),
              duration: props.duration,
              cb: (val: number) => updateTransitionList(val, idx),
            });
          }
        }

        // updating item
        if (prevPoint(idx) && prevPoint(idx).value !== val(data(), idx)) {
          if (point(idx).hidden) {
            // update hidden item;
            useTransitionValue({
              id: String(idx),
              initial: 0,
              final: 0,
              duration: props.duration,
              cb: (val: number) => updateTransitionList(val, idx),
            });
          } else {
            // update visible item;
            useTransitionValue({
              id: String(idx),
              initial: prevPoint(idx).value,
              final: val(data(), idx),
              duration: props.duration,
              cb: (val: number) => updateTransitionList(val, idx),
            });
          }
        }

        // LineData
        if ("values" in d) {
          const row = (rowIdx: number) => data()[rowIdx] as LineDataRow;
          const prevRow = (rowIdx: number) =>
            (prevList as LineDataRow[])[rowIdx];

          const point = (rowIdx: number, idx: number) =>
            row(rowIdx).values[idx];
          const prevPoint = (rowIdx: number, idx: number) =>
            row(rowIdx).values[idx];
        }
      }
    }

    // LINE
    if ("values" in data()[0]) {
    }
  });

  createEffect(() => {
    props.onUpdate(transitionList());
  });

  // createEffect(() => {
  //   setInterval(() => console.log(transitionList()), 2000);
  // });

  return <>{props.children}</>;
};

export default TransitionContainer;
