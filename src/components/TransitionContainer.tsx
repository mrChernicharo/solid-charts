import {
  children,
  Component,
  createEffect,
  createSignal,
  JSXElement,
} from "solid-js";
import { LineDataPoint, LineDataRow, PieDataPoint } from "../lib/constants";
import { useTransitionValue } from "use-transition-value";

const TransitionContainer: Component<{
  children: JSXElement;
  data: PieDataPoint[];
  duration: number;
  onUpdate: (data: PieDataPoint[]) => void;
}> = (props) => {
  let prevList: PieDataPoint[] = [];

  const [data, setData] = createSignal<PieDataPoint[]>([]);
  const [transitionList, setTransitionList] = createSignal<PieDataPoint[]>(
    props.data
  );

  const val = (data: PieDataPoint[] | LineDataPoint[], idx: number) => {
    if ("value" in data[0]) {
      return (data[idx] as PieDataPoint)?.value || 0;
    }

    if ("y" in data[0]) {
      return (data[idx] as LineDataPoint)?.y || 0;
    }

    return 0;
  };

  const updateTransitionList = (curr: number, idx: number) => {
    // console.log({ curr, idx });
    setTransitionList((list) =>
      list.map((d, i) => (i === idx ? { ...d, value: curr } : d))
    );
  };
  // data setup: receiving bulk data via props
  createEffect(() => {
    prevList = data();
    setData(props.data);
    setTransitionList(props.data);
  });

  // transitions setup: tell what values should update when
  createEffect(() => {
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
      if (prevList[idx] && prevList[idx].hidden && data()[idx].hidden) {
        updateTransitionList(0, idx);
      }

      // visibility changed
      if (prevList[idx] && prevList[idx].hidden !== data()[idx].hidden) {
        // just hidden
        if (data()[idx].hidden) {
          useTransitionValue({
            id: String(idx),
            initial: val(data(), idx),
            final: 0,
            duration: props.duration,
            cb: (val: number) => updateTransitionList(val, idx),
          });
        }

        // just shown
        if (prevList[idx].hidden) {
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
      if (prevList[idx] && prevList[idx].value !== val(data(), idx)) {
        if (data()[idx].hidden) {
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
            initial: prevList[idx].value,
            final: val(data(), idx),
            duration: props.duration,
            cb: (val: number) => updateTransitionList(val, idx),
          });
        }
      }
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
