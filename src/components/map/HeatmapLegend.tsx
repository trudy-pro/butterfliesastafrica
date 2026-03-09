const HeatmapLegend = () => (
  <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3">
    <p className="text-xs font-body text-foreground font-semibold mb-2">Biodiversity Hotspots</p>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 90%, 55%)" }} />
        <span className="text-[10px] text-muted-foreground">High</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(30, 90%, 55%)" }} />
        <span className="text-[10px] text-muted-foreground">Medium</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(50, 90%, 55%)" }} />
        <span className="text-[10px] text-muted-foreground">Low</span>
      </div>
    </div>
  </div>
);

export default HeatmapLegend;
