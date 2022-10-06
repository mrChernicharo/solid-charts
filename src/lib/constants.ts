export type PieChartConfig = {
  title: string;
  type: string;
  data: PieDataPoint[];
};

export type PieDataPoint = {
  label: string;
  value: number;
  hidden?: boolean;
};

export type LineChartConfig = {
  title: string;
  type: string;
  data: LineDataRow[];
};

export type LineDataRow = {
  label: string;
  hidden?: boolean;
  items: LineDataPoint[];
};

export type LineDataPoint = {
  x: string | number;
  y: number;
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
        items: [
          { x: "2022-09-03T00:00:00.000Z", y: 41 },
          { x: "2022-09-13T00:00:00.000Z", y: 43 },
          { x: "2022-09-23T00:00:00.000Z", y: 47 },
          { x: "2022-10-02T00:00:00.000Z", y: 51 },
        ],
      },
      {
        label: "Bozo",
        items: [
          { x: "2022-09-03T00:00:00.000Z", y: 37 },
          { x: "2022-09-13T00:00:00.000Z", y: 35 },
          { x: "2022-09-23T00:00:00.000Z", y: 34 },
          { x: "2022-10-02T00:00:00.000Z", y: 35 },
        ],
      },
      {
        label: "Tebet",
        items: [
          { x: "2022-09-03T00:00:00.000Z", y: 3 },
          { x: "2022-09-13T00:00:00.000Z", y: 3 },
          { x: "2022-09-23T00:00:00.000Z", y: 4 },
          { x: "2022-10-02T00:00:00.000Z", y: 5 },
        ],
      },
      {
        label: "Ciro",
        items: [
          { x: "2022-09-03T00:00:00.000Z", y: 10 },
          { x: "2022-09-13T00:00:00.000Z", y: 8 },
          { x: "2022-09-23T00:00:00.000Z", y: 5 },
          { x: "2022-10-02T00:00:00.000Z", y: 3 },
        ],
      },
    ],
  },
  {
    title: "Chart 06",
    type: "line",
    data: [
      {
        label: "Lula",
        items: [
          { x: 1, y: 41 },
          { x: 2, y: 43 },
          { x: 3, y: 47 },
          { x: 4, y: 51 },
          { x: 5, y: 54 },
        ],
      },
      {
        label: "Bozo",
        items: [
          { x: 1, y: 37 },
          { x: 2, y: 35 },
          { x: 3, y: 34 },
          { x: 4, y: 35 },
          { x: 5, y: 30 },
        ],
      },
      {
        label: "Tebet",
        items: [
          { x: 1, y: 3 },
          { x: 2, y: 3 },
          { x: 3, y: 4 },
          { x: 4, y: 5 },
          { x: 5, y: 6 },
        ],
      },
      {
        label: "Ciro",
        items: [
          { x: 1, y: 10 },
          { x: 2, y: 8 },
          { x: 3, y: 5 },
          { x: 4, y: 3 },
          { x: 5, y: 3 },
        ],
      },
    ],
  },
];

export const INITIAL_DATA = [...LINE_CHARTS, ...PIE_CHARTS];

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
    overflow: "hidden",
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
