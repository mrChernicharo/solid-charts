import {
	Component,
	createEffect,
	createMemo,
	createSignal,
	JSXElement,
	For,
	Index,
} from "solid-js";
import { createStore } from "solid-js/store";

const s = {
	body: {
		width: "100vw",
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

const ResizableContainer: Component<{
	initialHeight: number;
	initialWidth: number;
	onDimensionsChange: (dimensions: { width: number; height: number }) => void;
	children: JSXElement;
}> = props => {
	const windowWidth = () => window.innerWidth - 2;
	const [height, setHeight] = createSignal(props.initialHeight);
	const [width, setWidth] = createSignal(props.initialWidth);
	const [isDragging, setIsDragging] = createSignal(false);

	createEffect(() => {
		document.body.addEventListener("pointermove", e => {
			if (isDragging()) {
				setWidth(width() + e.movementX);
				setHeight(height() + e.movementY);
				props.onDimensionsChange({ width: width(), height: height() });
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
				}}></div>
		</div>
	);
};

const Chart: Component<{
	type: string;
	title: string;
	height: number;
	width: number;
}> = props => {
	let headerRef!: HTMLDivElement;
	const [height, setHeight] = createSignal(0);

	createEffect(() => {
		setHeight(props.height - headerRef.getBoundingClientRect().height);
	});

	return (
		<div>
			<div ref={headerRef}>{props.title}</div>
			<svg width={props.width} height={height()} style={{ background: "#666" }}>
				<g>
					<circle r={20} cx={props.width / 2} cy={height() / 2} fill="red" />
					<circle r={20} cx={props.width / 4} cy={height() / 4} fill="blue" />
				</g>
			</svg>
		</div>
	);
};

const App: Component = () => {
	const [store, setStore] = createStore({
		widgets: [
			{
				type: "bar",
				title: "01",
				height: 400,
				width: window.innerWidth - 10,
			},
			{
				type: "bar",
				title: "02",
				height: 200,
				width: window.innerWidth / 2,
			},
		],
	});

	return (
		<div style={s.body}>
			<h1 style={s.h1}>Solid charts</h1>

			<Index each={store.widgets}>
				{(widget, idx) => (
					<ResizableContainer
						initialHeight={widget().height}
						initialWidth={widget().width}
						onDimensionsChange={dims =>
							setStore("widgets", idx, {
								height: dims.height,
								width: dims.width,
							})
						}>
						<Chart {...store.widgets[idx]} />
					</ResizableContainer>
				)}
			</Index>

			<pre>{JSON.stringify(store, null, 2)}</pre>
		</div>
	);
};

export default App;
