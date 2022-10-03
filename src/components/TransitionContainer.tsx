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
      if (prevList[idx] && prevList[idx].hidden && arr[idx].hidden) {
        console.log("hidden item", idx);
        updateTransitionList(0, idx);
        return { ...d, value: 0, hidden: true };
      }

      if (prevList[idx] && prevList[idx].value !== arr[idx].value) {
        useTransitionValue({
          id: String(idx),
          initial: prevList[idx].value,
          final: data()[idx].value,
          duration: props.duration,
          cb: (val: number) => updateTransitionList(val, idx),
        });
      }

      // visibility changed
      if (prevList[idx] && prevList[idx].hidden !== arr[idx].hidden) {
        // just hidden
        if (arr[idx].hidden) {
          useTransitionValue({
            id: String(idx),
            initial: data()[idx].value,
            final: 0,
            duration: props.duration,
            cb: (val: number) => updateTransitionList(val, idx),
          });
        }

        // just shown
        if (prevList[idx].hidden) {
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
