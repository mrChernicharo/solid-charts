import { line, scaleLinear, scaleTime, scaleUtc } from "d3";
import { Component, createEffect, createMemo, Index } from "solid-js";

const lineGenerator = line();

const BottomAxis: Component<{
  domain: (string | number)[];
  range: number[];
  yPos: number;
}> = (props) => {
  createEffect(() => {
    // console.log({ domain: props.domain, range: props.range });
  });

  const axisTicks = createMemo(() => {
    const domain = (
      typeof props.domain[0] === "string"
        ? props.domain.map((v) => new Date(v).getTime() + new Date().getTimezoneOffset() * 60 * 1000)
        : props.domain
    ) as number[];
    const xScale =
      typeof props.domain[0] === "string"
        ? scaleTime().domain(domain).range(props.range)
        : scaleLinear().domain(domain).range(props.range);
    const width = props.range[1] - props.range[0];
    const pixelsPerTick = 100;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  });

  return (
    <g transform={`translate(-${props.range[0]}, ${props.yPos})`}>
      {/* <g transform={`translate(-${props.range[0]}, ${props.yPos})`}> */}
      <path
        d={
          lineGenerator([
            [props.range[0], 6],
            [props.range[1], 6],
          ])!
        }
        stroke="red"
      ></path>

      <Index each={axisTicks()}>
        {(tick, idx) => (
          <g transform={`translate(${tick().xOffset}, 0)`}>
            <line y2="6" stroke="currentColor" />
            <text
              fill="white"
              style={{
                "font-size": "10px",
                "text-anchor": "middle",
                transform: "translateY(20px)",
              }}
            >
              {
                (typeof props.domain[0] === "string"
                  ? new Date(tick().value).toLocaleDateString("de")
                  : tick().value) as string
              }
            </text>
          </g>
        )}
      </Index>
    </g>
  );
};

export default BottomAxis;
