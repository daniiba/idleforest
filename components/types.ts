export interface Point {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface ViewState {
	zoom: number;
	offset: Point;
}

export interface TreePosition {
	x: number;
	y: number;
	rotation: number;
}

export interface TreeData extends TreePosition {
	isComplete: boolean;
	isPersonal: boolean;
	size: number;
}

export interface ProgressTreeIconProps {
	size: number;
	progress: number;
	className?: string;
}

export interface GridProps {
	viewportOffset: Point;
	zoom: number;
	containerSize: Size;
}

export interface MinimapProps {
	viewportOffset: Point;
	zoom: number;
	trees: TreeData[];
	containerSize: Size;
}

export interface ForestViewProps {
	isPersonal: boolean;
	totalTrees: number;
	userProgress: number;
	partialProgress: number;
	zoom: number;
	onZoomChange: (zoom: number) => void;
}

export interface TreeGridProps {
	totalTrees: number;
	userProgress: number;
	partialProgress: number;
	onZoomChange?: (zoom: number) => void;
}