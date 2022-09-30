export const initialWidgets = {
  widgets: [
    {
      type: "ring",
      title: "Chart 01",
      height: 400,
      width: window.innerWidth * 0.75,
      data: [
        { label: "A", value: 20 },
        { label: "B", value: 30 },
        { label: "C", value: 10 },
      ],
    },
    {
      type: "ring",
      title: "Chart 02",
      height: 200,
      width: window.innerWidth * 0.5,
      data: [
        { label: "A", value: 90 },
        { label: "B", value: 40 },
        { label: "C", value: 50 },
        { label: "D", value: 70 },
        { label: "E", value: 110 },
      ],
      // data: [
      // 	{ label: 'A', x: 0, y: 80 },
      // 	{ label: 'A', x: 100, y: 120 },
      // 	{ label: 'A', x: 200, y: 90 },
      // 	{ label: 'B', x: 0, y: 40 },
      // 	{ label: 'B', x: 100, y: 80 },
      // 	{ label: 'B', x: 200, y: 70 },
      // ],
    },
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
  container: {
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
