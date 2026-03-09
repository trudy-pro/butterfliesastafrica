import { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from "lucide-react";

interface DeepZoomViewerProps {
  src: string;
  alt: string;
  onClose?: () => void;
}

const DeepZoomViewer = ({ src, alt, onClose }: DeepZoomViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const viewer = (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={12}
      centerOnInit
      wheel={{ smoothStep: 0.04 }}
      doubleClick={{ mode: "zoomIn", step: 2 }}
    >
      {({ zoomIn, zoomOut, resetTransform, state }) => (
        <div className="relative w-full h-full group/zoom">
          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => zoomIn(0.5)}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => zoomOut(0.5)}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => resetTransform()}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5 text-foreground" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <X className="w-4 h-4 text-foreground" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-foreground" />
              )}
            </button>
          </div>

          {/* Zoom level indicator */}
          <div className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded bg-card/80 backdrop-blur-sm border border-border opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-200">
            <span className="text-[10px] font-body text-muted-foreground tabular-nums">
              {Math.round(state.scale * 100)}%
            </span>
          </div>

          {/* Hint text */}
          {state.scale <= 1.05 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border pointer-events-none animate-pulse">
              <span className="text-[11px] font-body text-muted-foreground">
                Scroll to zoom · Double-click to magnify · Drag to pan
              </span>
            </div>
          )}

          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
              style={{ imageRendering: state.scale > 3 ? "pixelated" : "auto" }}
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Exit fullscreen"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-full h-full">{viewer}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      {viewer}
    </div>
  );
};

export default DeepZoomViewer;
