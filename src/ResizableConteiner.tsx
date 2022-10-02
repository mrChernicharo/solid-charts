import { Component, JSXElement } from "solid-js";

const ResizableContainer: Component<{ children: JSXElement }> = (props) => {
  return (
    <div>
      <div>resizable container</div>
      {props.children}
    </div>
  );
};

export default ResizableContainer;
