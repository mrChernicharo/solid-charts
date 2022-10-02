import { Component, createEffect, createSignal, JSXElement } from "solid-js";
import { s } from "./styles";

// const ResizableContainer: Component<{ children: JSXElement }> = (props) => {
//   return (
//     <div>
//       <div>resizable container</div>
//       {props.children}
//     </div>
//   );
// };

const ResizableContainer: Component<{
  initialHeight: number;
  initialWidth: number;
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
  children: JSXElement;
}> = (props) => {
  const [height, setHeight] = createSignal(props.initialHeight);
  const [width, setWidth] = createSignal(props.initialWidth);
  const [isDragging, setIsDragging] = createSignal(false);

  createEffect(() => {
    document.body.addEventListener("pointermove", (e) => {
      if (isDragging()) {
        setWidth(width() + e.movementX);
        setHeight(height() + e.movementY);
        props.onDimensionsChange({ width: width(), height: height() });
      }
    });
    document.body.addEventListener("pointerup", (e) => {
      setIsDragging(false);
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
    </div>
  );
};

export default ResizableContainer;
