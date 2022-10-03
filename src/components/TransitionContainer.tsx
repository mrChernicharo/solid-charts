import {
  children,
  Component,
  createEffect,
  createSignal,
  JSXElement,
} from "solid-js";
import { DataPoint } from "../lib/constants";
import { useTransitionValue } from "../lib/helpers";
// import { useTransitionValue } from "use-transition-value";

const TransitionContainer: Component<{
  children: JSXElement;
  data: DataPoint[];
  duration: number;
  onUpdate: (data: DataPoint[]) => void;
}> = (props) => {
  let prevList: DataPoint[] = [];

  const [data, setData] = createSignal<DataPoint[]>([]);
  const [transitionList, setTransitionList] = createSignal<DataPoint[]>(
    props.data
  );

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
      data().forEach((d, idx, arr) => {
        useTransitionValue({
          id: String(idx),
          initial: 0,
          final: arr[idx].value,
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
        final: data()[idx].value || 0,
        duration: props.duration,
        cb: (val: number) => updateTransitionList(val, idx),
      });
    }

    // standalone value updated
    data().forEach((d, idx, arr) => {
      if (prevList[idx] && prevList[idx].value !== arr[idx].value) {
        // console.log("useTransitionValue! value updating!", { prevList, arr, value: arr[idx].value });
        console.log("standalone value updated");
        useTransitionValue({
          id: String(idx),
          initial: prevList[idx].value,
          final: arr[idx].value,
          duration: props.duration,
          cb: (val: number) => updateTransitionList(val, idx),
        });
      }

      if (prevList[idx] && prevList[idx].hidden !== arr[idx].hidden) {
        const [hasHidden, wasHidden] = [arr[idx].hidden, prevList[idx].hidden];
        if (hasHidden) {
          console.log("visibility changed: Has Hidden", { idx });
          useTransitionValue({
            id: String(idx),
            initial: arr[idx].value,
            final: 0,
            duration: props.duration,
            cb: (val: number) => updateTransitionList(val, idx),
          });
        }

        if (wasHidden) {
          console.log("visibility changed: Was Hidden");
          useTransitionValue({
            id: String(idx),
            initial: 0,
            final: arr[idx].value,
            duration: props.duration,
            cb: (val: number) => updateTransitionList(val, idx),
          });
        }
      }
    });
  });

  createEffect(() => {
    props.onUpdate(transitionList());
  });

  createEffect(() => {
    // console.log(transitionList()[0]);
  });
  return <>{props.children}</>;
};

export default TransitionContainer;
