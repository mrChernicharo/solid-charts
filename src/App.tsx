import { Component, createEffect, createMemo, createSignal, JSXElement } from "solid-js";

const s = {
	body: {
		width: "100vw",
		height: "100vh",
		background: "#333",
		color: "#fff",
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

const ResizableContainer: Component<{
	initialHeight: number;
	children: JSXElement;
}> = props => {
	const windowWidth = () => window.innerWidth - 2;
	const [height, setHeight] = createSignal(props.initialHeight);
	const [width, setWidth] = createSignal(windowWidth());
	const [isDragging, setIsDragging] = createSignal(false);

	createEffect(() => {
		document.body.addEventListener("pointermove", e => {
			if (isDragging()) {
				setWidth(width() + e.movementX);
				setHeight(height() + e.movementY);
			}
		});
		document.body.addEventListener("pointerup", e => {
			if (isDragging()) {
				setIsDragging(false);
			}
		});
	});

	return (
		<div
			style={{
				...s.container,
				position: "relative",
				width: `${width()}px`,
				height: `${height()}px`,
			}}>
			{props.children}
			<div
				style={{ ...s.dragHandle, position: "absolute" }}
				onPointerMove={e => {
					if (e.buttons === 1 && !isDragging()) {
						setIsDragging(true);
					}
				}}
				onPointerDown={e => {}}
				onPointerUp={e => {}}></div>
		</div>
	);
};

const App: Component = () => {
	return (
		<div style={s.body}>
			<h1 style={s.h1}>Solid charts</h1>

			<ResizableContainer initialHeight={400}>
				<div>Hello</div>
			</ResizableContainer>
			<ResizableContainer initialHeight={200}>
				<div>Hello 2</div>
			</ResizableContainer>
		</div>
	);
};

export default App;
