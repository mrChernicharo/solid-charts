import { Component, createEffect, createSignal, JSXElement, Show } from "solid-js";
import { s } from "../lib/constants";

const ResizableContainer: Component<{
  initialHeight: number;
  initialWidth: number;
  canResize: boolean;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  children: JSXElement;
}> = (props) => {
  const [height, setHeight] = createSignal(props.initialHeight);
  const [width, setWidth] = createSignal(props.initialWidth);
  const [isDragging, setIsDragging] = createSignal(false);

  createEffect(() => {
    document.addEventListener("pointermove", (e) => {
      if (isDragging() && props.canResize) {
        setWidth(width() + e.movementX);
        setHeight(height() + e.movementY);
        props.onDimensionsChange({ width: width(), height: height() });
      }
    });
    document.addEventListener("pointerup", (e) => {
      if (isDragging()) setIsDragging(false);
    });
  });

  return (
    <div
      style={{
        ...s.resizableContainer,
        position: "relative",
        width: `${width()}px`,
        height: `${height()}px`,
      }}
    >
      {props.children}
      <Show when={props.canResize}>
        <div
          style={{
            ...s.dragHandle,
            position: "absolute",
            cursor: isDragging() ? "grabbing" : "grab",
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1 && !isDragging()) {
              setIsDragging(true);
            }
          }}
        ></div>
      </Show>
    </div>
  );
};

export default ResizableContainer;
