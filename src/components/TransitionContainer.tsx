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

    if ("items" in data[0]) {
      return (data[rowIdx] as LineDataRow)?.items[idx].y || 0;
    }

    return 0;
  };

  const updateTransitionList = (
    currVal: number,
    itemIdx: number,
    rowIndex = -1
  ) => {
    // console.log({ currVal, itemIdx });
    setTransitionList((list) => {
      if ("value" in data()[0]) {
        return (list as PieDataPoint[]).map((d, i) =>
          i === itemIdx ? { ...d, value: currVal } : d
        );
      }

      if ("items" in data()[0] && rowIndex !== -1) {
        console.log("line chart", currVal, itemIdx, rowIndex);

        return (list as LineDataRow[]).map((row, rix) => ({
          label: row.label,
          hidden: row.hidden,
          items: row.items.map((val, vix) =>
            rowIndex === rix && itemIdx === vix ? { ...val, y: currVal } : val
          ),
        }));
      }
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
      }
    }

    // LINE
    if ("items" in data()[0]) {
      // LineData
      const row = (rowIdx: number) => data()[rowIdx] as LineDataRow;
      const point = (rowIdx: number, idx: number) => row(rowIdx).items[idx];

      const prevRow = (rowIdx: number) => (prevList as LineDataRow[])[rowIdx];
      const prevPoint = (rowIdx: number, idx: number) => row(rowIdx).items[idx];

      // Initial Transition
      if (prevList.length === 0) {
        console.log("initial Transition", data(), point(0, 0), point(1, 1));
        (data() as LineDataRow[]).forEach((row, rowIdx) => {
          row.items.forEach((el, i) => {
            const id = `${rowIdx}::${i}`;
            useTransitionValue({
              id,
              initial: 0,
              final: el.y,
              duration: props.duration,
              cb: (val: number) => updateTransitionList(val, i, rowIdx),
            });
          });
        });
      }

      // // new element added
      // if (prevList.length !== 0 && prevList.length < props.data.length) {
      //   let idx = props.data.length - 1;
      //   // console.log("added new element!", { data: data(), item: data()[idx], idx });

      //   useTransitionValue({
      //     id: String(idx),
      //     initial: 0,
      //     final: val(data(), idx),
      //     duration: props.duration,
      //     cb: (val: number) => updateTransitionList(val, idx),
      //   });
      // }

      // for (let [idx, d] of data().entries()) {
      //   // hidden item
      //   if (prevPoint(idx) && prevPoint(idx).hidden && point(idx).hidden) {
      //     updateTransitionList(0, idx);
      //   }

      //   // visibility changed
      //   if (prevPoint(idx) && prevPoint(idx).hidden !== point(idx).hidden) {
      //     // just hidden
      //     if ((data()[idx] as PieDataPoint).hidden) {
      //       useTransitionValue({
      //         id: String(idx),
      //         initial: val(data(), idx),
      //         final: 0,
      //         duration: props.duration,
      //         cb: (val: number) => updateTransitionList(val, idx),
      //       });
      //     }

      //     // just shown
      //     if (prevPoint(idx).hidden) {
      //       useTransitionValue({
      //         id: String(idx),
      //         initial: 0,
      //         final: val(data(), idx),
      //         duration: props.duration,
      //         cb: (val: number) => updateTransitionList(val, idx),
      //       });
      //     }
      //   }

      //   // updating item
      //   if (prevPoint(idx) && prevPoint(idx).value !== val(data(), idx)) {
      //     if (point(idx).hidden) {
      //       // update hidden item;
      //       useTransitionValue({
      //         id: String(idx),
      //         initial: 0,
      //         final: 0,
      //         duration: props.duration,
      //         cb: (val: number) => updateTransitionList(val, idx),
      //       });
      //     } else {
      //       // update visible item;
      //       useTransitionValue({
      //         id: String(idx),
      //         initial: prevPoint(idx).value,
      //         final: val(data(), idx),
      //         duration: props.duration,
      //         cb: (val: number) => updateTransitionList(val, idx),
      //       });
      //     }
      //   }
      // }
    }
  });

  createEffect(() => {
    props.onUpdate(transitionList());
  });

  createEffect(() => {
    // console.log(transitionList());
    // setInterval(() => console.log(transitionList()), 2000);
  });

  return (
    <>
      <pre>{JSON.stringify(transitionList(), null, 2)}</pre>
      {props.children}
    </>
  );
};

export default TransitionContainer;
