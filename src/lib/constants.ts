export interface DataPoint {
  label: string;
  value: number;
  hidden?: boolean;
}

export const INITIAL_DATA: DataPoint[] = [
  { label: "A", value: 20 },
  { label: "B", value: 15 },
  { label: "C", value: 10 },
  { label: "D", value: 40 },
  { label: "E", value: 25 },
  { label: "F", value: 10 },
];

export const INITIAL_STORE: { [id: string]: DataPoint[] } = {
  "chart 01": [
    { label: "A", value: 20 },
    { label: "B", value: 15 },
    { label: "C", value: 10 },
  ],
  "chart 02": [
    { label: "D", value: 40 },
    { label: "E", value: 25 },
    { label: "F", value: 10 },
  ],
  "chart 03": [
    { label: "G", value: 40 },
    { label: "H", value: 25 },
  ],
};

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
