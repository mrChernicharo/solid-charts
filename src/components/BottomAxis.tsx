import { line, scaleLinear } from "d3";
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
      typeof props.domain[0] === "string" ? props.domain.map((v) => new Date(v).getTime()) : props.domain
    ) as number[];
    const xScale = scaleLinear().domain(domain).range(props.range);
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
              style={{
                "font-size": "10px",
                "text-anchor": "middle",
                transform: "translateY(20px)",
              }}
            >
              {new Date(tick().value - new Date(tick().value).getTimezoneOffset() * 60 * 60).toLocaleDateString(
                "pt-BR"
              )}
            </text>
          </g>
        )}
      </Index>
    </g>
  );
};

export default BottomAxis;
