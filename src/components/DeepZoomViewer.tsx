import { useState, useCallback, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X, Search } from "lucide-react";

interface DeepZoomViewerProps {
  src: string;
  alt: string;
  onClose?: () => void;
}

const DeepZoomViewer = ({ src, alt, onClose }: DeepZoomViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [lensMode, setLensMode] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, visible: false });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const LENS_SIZE = 150;
  const LENS_ZOOM = 3;

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!lensMode || !imgRef.current) return;
    
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // Check if cursor is over the image
    const isOverImage = 
      e.clientX >= rect.left && 
      e.clientX <= rect.right && 
      e.clientY >= rect.top && 
      e.clientY <= rect.bottom;
    
    if (isOverImage) {
      setLensPos({
        x: e.clientX,
        y: e.clientY,
        visible: true,
      });
    } else {
      setLensPos(prev => ({ ...prev, visible: false }));
    }
  }, [lensMode]);

  const handleMouseLeave = useCallback(() => {
    setLensPos(prev => ({ ...prev, visible: false }));
  }, []);

  const getLensBackgroundPosition = () => {
    if (!imgRef.current) return { x: 0, y: 0 };
    
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    
    // Position relative to the image
    const relX = lensPos.x - rect.left;
    const relY = lensPos.y - rect.top;
    
    // Calculate background position (scaled and centered)
    const bgX = (relX * LENS_ZOOM) - (LENS_SIZE / 2);
    const bgY = (relY * LENS_ZOOM) - (LENS_SIZE / 2);
    
    return { x: -bgX, y: -bgY, width: rect.width * LENS_ZOOM, height: rect.height * LENS_ZOOM };
  };

  const viewer = (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={12}
      centerOnInit
      wheel={{ smoothStep: 0.04 }}
      doubleClick={{ mode: "zoomIn", step: 2 }}
      onTransformed={(_, state) => setScale(state.scale)}
      disabled={lensMode}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div 
          ref={containerRef}
          className="relative w-full h-full group/zoom"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => zoomIn(0.5)}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors disabled:opacity-50"
              aria-label="Zoom in"
              disabled={lensMode}
            >
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => zoomOut(0.5)}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors disabled:opacity-50"
              aria-label="Zoom out"
              disabled={lensMode}
            >
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => resetTransform()}
              className="w-8 h-8 rounded-md bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-card transition-colors disabled:opacity-50"
              aria-label="Reset zoom"
              disabled={lensMode}
            >
              <RotateCcw className="w-3.5 h-3.5 text-foreground" />
            </button>
            <button
              onClick={() => setLensMode(!lensMode)}
              className={`w-8 h-8 rounded-md backdrop-blur-sm border flex items-center justify-center transition-colors ${
                lensMode 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-card/90 border-border hover:bg-card text-foreground'
              }`}
              aria-label="Toggle lens mode"
            >
              <Search className="w-3.5 h-3.5" />
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
              {lensMode ? `Lens ${LENS_ZOOM}x` : `${Math.round(scale * 100)}%`}
            </span>
          </div>

          {/* Hint text */}
          {scale <= 1.05 && !lensMode && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border pointer-events-none animate-pulse">
              <span className="text-[11px] font-body text-muted-foreground">
                Scroll to zoom · Double-click to magnify · Drag to pan
              </span>
            </div>
          )}

          {/* Lens mode hint */}
          {lensMode && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border pointer-events-none">
              <span className="text-[11px] font-body text-muted-foreground">
                Move cursor over image to magnify
              </span>
            </div>
          )}

          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%", cursor: lensMode ? "none" : undefined }}
            contentStyle={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
              style={{ imageRendering: scale > 3 ? "pixelated" : "auto" }}
            />
          </TransformComponent>

          {/* Magnifier Lens */}
          {lensMode && lensPos.visible && (
            <div
              className="pointer-events-none fixed rounded-full border-2 border-primary shadow-lg overflow-hidden"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                left: lensPos.x - LENS_SIZE / 2,
                top: lensPos.y - LENS_SIZE / 2,
                zIndex: 100,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: `${getLensBackgroundPosition().x}px ${getLensBackgroundPosition().y}px`,
                  backgroundSize: `${getLensBackgroundPosition().width}px ${getLensBackgroundPosition().height}px`,
                  backgroundRepeat: "no-repeat",
                }}
              />
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-px h-3 bg-primary/50" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3 h-px bg-primary/50" />
              </div>
            </div>
          )}
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
