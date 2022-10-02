import { children, Component, createSignal, JSXElement } from "solid-js";
import { DataPoint } from "./App";

const TransitionContainer: Component<{
  children: JSXElement;
  data: DataPoint[];
}> = (props) => {
  const [test, setTest] = createSignal("test");

  return (
    <div>
      <div>transition container</div>
      {props.children}
    </div>
  );
};

export default TransitionContainer;
