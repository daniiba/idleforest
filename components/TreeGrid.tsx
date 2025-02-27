import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TreePine, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Point,
  Size,
  ViewState,
  TreePosition,
  TreeData,
  ProgressTreeIconProps,
  GridProps,
  MinimapProps,
  ForestViewProps,
  TreeGridProps
} from './types';


// Constants
export const GRID_SIZE = 100;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 5;
export const ZOOM_FACTOR = 1.5;


export const ProgressTreeIcon: React.FC<ProgressTreeIconProps> = ({ size, progress, className = "" }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <TreePine size={size} className={`absolute text-gray-200 ${className}`} />
    <div style={{ 
      clipPath: `polygon(0% 100%, 100% 100%, 100% ${100 - Math.min(100, Math.max(0, progress * 100))}%, 0% ${100 - Math.min(100, Math.max(0, progress * 100))}%)`,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }}>
      <TreePine size={size} className={`text-green-600 ${className}`} />
    </div>
  </div>
);

const Grid: React.FC<GridProps> = React.memo(({ viewportOffset, zoom, containerSize }) => {
  const size = 4000;
  const step = GRID_SIZE;
  const gridLines = [];
  
  for (let i = -size/2; i <= size/2; i += step) {
    const isMajor = i % (step * 5) === 0;
    gridLines.push(
      <g key={`grid-${i}`}>
        <line
          x1={i}
          y1={-size/2}
          x2={i}
          y2={size/2}
          stroke={isMajor ? "#d1d5db" : "#e5e7eb"}
          strokeWidth={isMajor ? 1.5 : 1}
          strokeDasharray={isMajor ? "none" : "4,4"}
        />
        <line
          x1={-size/2}
          y1={i}
          x2={size/2}
          y2={i}
          stroke={isMajor ? "#d1d5db" : "#e5e7eb"}
          strokeWidth={isMajor ? 1.5 : 1}
          strokeDasharray={isMajor ? "none" : "4,4"}
        />
        {isMajor && (
          <>
            <text x={i + 5} y="15" fontSize="12" fill="#9ca3af">
              {i !== 0 ? i/step : ''}
            </text>
            <text x="5" y={i + 15} fontSize="12" fill="#9ca3af">
              {i !== 0 ? -i/step : ''}
            </text>
          </>
        )}
      </g>
    );
  }

  return (
    <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
      <g
        transform={`translate(${viewportOffset.x + containerSize.width / 2}, 
                            ${viewportOffset.y + containerSize.height / 2}) 
                   scale(${zoom})`}
      >
        {gridLines}
      </g>
    </svg>
  );
});

const Minimap: React.FC<MinimapProps> = React.memo(({ viewportOffset, zoom, trees, containerSize }) => {
  const mapSize = 120;
  const padding = 10;
  const minRectSize = 4;
  const contentArea = mapSize - padding * 2;
  
  const bounds = trees.reduce((acc, tree) => ({
    minX: Math.min(acc.minX, tree.x),
    maxX: Math.max(acc.maxX, tree.x),
    minY: Math.min(acc.minY, tree.y),
    maxY: Math.max(acc.maxY, tree.y)
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  
  if (!isFinite(bounds.minX)) {
    bounds.minX = -100;
    bounds.maxX = 100;
    bounds.minY = -100;
    bounds.maxY = 100;
  }
  
  const boundsPadding = 100;
  bounds.minX -= boundsPadding;
  bounds.maxX += boundsPadding;
  bounds.minY -= boundsPadding;
  bounds.maxY += boundsPadding;
  
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  
  const scale = Math.min(
    contentArea / contentWidth,
    contentArea / contentHeight
  );

  const transformPoint = (x: number, y: number): Point => ({
    x: ((x - bounds.minX) * scale) + padding,
    y: ((y - bounds.minY) * scale) + padding
  });

  const viewportWidth = Math.min(containerSize.width / zoom, contentWidth) * scale;
  const viewportHeight = Math.min(containerSize.height / zoom, contentHeight) * scale;
  const viewportX = (-viewportOffset.x / zoom - bounds.minX) * scale + padding;
  const viewportY = (-viewportOffset.y / zoom - bounds.minY) * scale + padding;

  const constrainedRect = {
    width: Math.max(Math.min(viewportWidth, contentArea), minRectSize),
    height: Math.max(Math.min(viewportHeight, contentArea), minRectSize),
    x: Math.min(Math.max(viewportX, padding + viewportWidth/2), mapSize - padding - viewportWidth/2),
    y: Math.min(Math.max(viewportY, padding + viewportHeight/2), mapSize - padding - viewportHeight/2),
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg shadow-lg p-2">
      <div 
        className="relative border border-gray-200"
        style={{ width: mapSize, height: mapSize }}
      >
        {trees.map((tree, i) => {
          const pos = transformPoint(tree.x, tree.y);
          return (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                tree.isPersonal ? 'bg-yellow-400' : 'bg-green-600'
              }`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
        
        <div
          className="absolute border-2 border-blue-500"
          style={{
            left: constrainedRect.x,
            top: constrainedRect.y,
            width: constrainedRect.width,
            height: constrainedRect.height,
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div
          className="absolute border border-transparent"
          style={{
            left: padding,
            top: padding,
            width: contentArea,
            height: contentArea,
          }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        Position: ({Math.round(-viewportOffset.x/(GRID_SIZE * zoom))}, 
                  {Math.round(-viewportOffset.y/(GRID_SIZE * zoom))})
      </div>
    </div>
  );
});

const ForestView: React.FC<ForestViewProps> = ({
  isPersonal,
  totalTrees,
  userProgress,
  partialProgress,
  zoom,
  onZoomChange
}) => {
  const [viewState, setViewState] = useState<ViewState>({ zoom, offset: { x: 0, y: 0 } });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const treePositionsRef = useRef<Map<string, TreePosition>>(new Map());

  useEffect(() => {
    setViewState(prev => ({ ...prev, zoom }));
  }, [zoom]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const { width, height } = container.getBoundingClientRect();
      setContainerSize({ width, height });
    };

    updateSize();
    
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const getTreePosition = useCallback((index: number, isPersonal: boolean): TreePosition => {
    const key = `${index}-${isPersonal}`;
    if (!treePositionsRef.current.has(key)) {
      if (isPersonal) {
        const spacing = 60;
        const totalWidth = Math.ceil(userProgress) * spacing;
        const startX = -totalWidth / 2;
        treePositionsRef.current.set(key, {
          x: startX + (index * spacing),
          y: 0,
          rotation: 0,
        });
      } else {
        const spacing = 40;
        const gridSize = Math.ceil(Math.sqrt(totalTrees * 2));
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const randX = (Math.random() - 0.5) * spacing * 0.3;
        const randY = (Math.random() - 0.5) * spacing * 0.3;
        treePositionsRef.current.set(key, {
          x: (col - gridSize/2) * spacing + randX,
          y: (row - gridSize/2) * spacing + randY,
          rotation: (Math.random() - 0.5) * 10,
        });
      }
    }
    return treePositionsRef.current.get(key)!;
  }, [totalTrees, userProgress]);

  const getTrees = useCallback((): TreeData[] => {
    const maxTrees = isPersonal ? Math.ceil(userProgress) : totalTrees;
    const trees: TreeData[] = [];
    
    for (let i = 0; i < maxTrees; i++) {
      const pos = getTreePosition(i, isPersonal);
      trees.push({
        ...pos,
        isComplete: i < Math.floor(userProgress),
        isPersonal: isPersonal || i < Math.floor(userProgress),
        size: isPersonal ? 48 : 24,
      });
    }
    
    return trees;
  }, [getTreePosition, isPersonal, totalTrees, userProgress]);

  const handleZoom = useCallback((newZoom: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scaleChange = newZoom / viewState.zoom;
    
    setViewState(prev => ({
      zoom: newZoom,
      offset: {
        x: centerX - (centerX - prev.offset.x) * scaleChange,
        y: centerY - (centerY - prev.offset.y) * scaleChange
      }
    }));

    onZoomChange(newZoom);
  }, [viewState.zoom, onZoomChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setViewState(prev => ({
      ...prev,
      offset: {
        x: prev.offset.x + dx,
        y: prev.offset.y + dy
      }
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const trees = getTrees();

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] bg-white rounded-lg overflow-hidden cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Grid 
        viewportOffset={viewState.offset} 
        zoom={viewState.zoom}
        containerSize={containerSize}
      />
      
      <div className="absolute inset-0">
        {trees.map((tree, i) => (
          <div
            key={i}
            className="absolute transform-gpu"
            style={{
              left: `${viewState.offset.x + containerSize.width / 2 + tree.x * viewState.zoom}px`,
              top: `${viewState.offset.y + containerSize.height / 2 + tree.y * viewState.zoom}px`,
              transform: `translate(-50%, -50%) rotate(${tree.rotation}deg)`,
            }}
          >
            {isPersonal ? (
              tree.isComplete ? (
                <TreePine size={tree.size} className="text-green-600" />
              ) : (
                <ProgressTreeIcon 
                  size={tree.size}
                  progress={partialProgress}
                />
              )
            ) : (
              <TreePine 
                size={tree.size} 
                className={tree.isPersonal ? "text-yellow-400" : "text-green-600"} 
              />
            )}
          </div>
        ))}
      </div>

      <Minimap 
        viewportOffset={viewState.offset}
        zoom={viewState.zoom}
        trees={trees}
        containerSize={containerSize}
      />
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm rounded-md p-2 text-xs shadow-md">
        <div className="flex justify-center items-center space-x-4 font-medium">
          {isPersonal ? (
            <>
              <div className="flex items-center">
                <TreePine size={14} className="text-green-600 mr-1" />
                <span>Complete tree</span>
              </div>
              <div className="flex items-center">
                <ProgressTreeIcon size={14} progress={partialProgress} className="mr-1" />
                <span>Tree in progress</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <TreePine size={14} className="text-yellow-400 mr-1" />
                <span>Your completed trees ({Math.floor(userProgress)})</span>
              </div>
              <div className="flex items-center">
                <TreePine size={14} className="text-green-600 mr-1" />
                <span>Community trees</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const TreeGrid: React.FC<TreeGridProps> = ({
  totalTrees,
  userProgress,
  partialProgress,
  onZoomChange
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "global">("personal");
  const [zoom, setZoom] = useState(1);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  const handleZoomIn = () => handleZoomChange(Math.min(zoom * ZOOM_FACTOR, MAX_ZOOM));
  const handleZoomOut = () => handleZoomChange(Math.max(zoom / ZOOM_FACTOR, MIN_ZOOM));

  return (
    <div className='relative'>

      <Tabs defaultValue="personal" onValueChange={(value) => setActiveTab(value as "personal" | "global")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Your Trees</TabsTrigger>
          <TabsTrigger value="global">Global Forest</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" >
          <ForestView
            isPersonal={true}
            totalTrees={totalTrees}
            userProgress={userProgress}
            partialProgress={partialProgress}
            zoom={zoom}
            onZoomChange={handleZoomChange}
          />
        </TabsContent>
        
        <TabsContent value="global">
          <ForestView
            isPersonal={false}
            totalTrees={totalTrees}
            userProgress={userProgress}
            partialProgress={partialProgress}
            zoom={zoom}
            onZoomChange={handleZoomChange}
          />
        </TabsContent>
        <div className="flex gap-2 absolute top-16 right-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="transition-all duration-200 hover:bg-gray-100"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="transition-all duration-200 hover:bg-gray-100"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </Tabs>
    </div>
  );
};
