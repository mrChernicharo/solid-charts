export interface DataPoint {
  label: string;
  value: number;
}

export const INITIAL_DATA: DataPoint[] = [
  { label: "A", value: 10 },
  { label: "B", value: 20 },
  { label: "C", value: 10 },
  { label: "D", value: 40 },
  { label: "E", value: 25 },
  { label: "F", value: 10 },
];

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
};
