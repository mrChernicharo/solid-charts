export type PieDataPoint = {
  label: string;
  value: number;
  hidden?: boolean;
};

export type PieChartConfig = {
  title: string;
  type: string;
  data: PieDataPoint[];
};

export type LineDataRow = {
  label: string;
  hidden?: boolean;
  values: LineDataPoint[];
};

export type LineDataPoint = {
  x: string;
  y: number;
};

export type LineChartConfig = {
  title: string;
  type: string;
  data: LineDataRow[];
};

export const PIE_CHARTS: PieChartConfig[] = [
  {
    title: "Chart 01",
    type: "pie",
    data: [
      { label: "A", value: 20 },
      { label: "B", value: 15 },
      { label: "C", value: 10 },
    ],
  },
  {
    title: "Chart 02",
    type: "pie",
    data: [
      { label: "D", value: 30 },
      { label: "E", value: 25 },
      { label: "F", value: 10 },
    ],
  },
  {
    title: "Chart 03",
    type: "pie",
    data: [
      { label: "G", value: 40 },
      { label: "H", value: 28 },
      { label: "I", value: 32 },
      { label: "J", value: 18 },
      { label: "K", value: 28 },
      { label: "L", value: 14 },
    ],
  },
  {
    title: "Chart 04",
    type: "pie",
    data: [
      { label: "M", value: 28 },
      { label: "N", value: 32 },
      { label: "O", value: 14 },
      { label: "P", value: 18 },
      { label: "Q", value: 40 },
      { label: "R", value: 28 },
      { label: "S", value: 8 },
    ],
  },
];

export const LINE_CHARTS: LineChartConfig[] = [
  {
    title: "Chart 05",
    type: "line",
    data: [
      {
        label: "Lula",
        values: [
          { x: "2022-09-03", y: 49 },
          { x: "2022-09-13", y: 50 },
          { x: "2022-09-23", y: 51 },
        ],
      },
      {
        label: "Bozo",
        values: [
          { x: "2022-09-03", y: 37 },
          { x: "2022-09-13", y: 35 },
          { x: "2022-09-23", y: 34 },
        ],
      },
    ],
  },
];

export const INITIAL_DATA = [...PIE_CHARTS, ...LINE_CHARTS];

export const s = {
  body: {
    // width: '100vw',
    // height: "100vh",
  },
  h1: {
    margin: "0",
  },
  resizableContainer: {
    border: "1px solid",
    height: "400px",
  },
  dragHandle: {
    width: "24px",
    height: "24px",
    background: "#222",
    "clip-path": "polygon(0% 100%, 100% 0%, 100% 100%)",
    right: "0",
    bottom: "0",
  },
  legendContainer: {
    background: "#444",
    display: "flex",
    padding: ".5rem",
  },
  legendItem: {
    display: "flex",
    "margin-bottom": "5px",
    cursor: "pointer",
  },
  legendBtn: {
    width: "24px",
    height: "16px",
    "border-radius": "4px",
    "margin-inline": "8px",
    "margin-top": "2px",
  },
};
