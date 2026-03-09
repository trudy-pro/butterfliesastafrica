import { getFlightActivity, MONTH_LABELS, getCurrentMonth } from "@/data/flightPeriods";
import { useLanguage } from "@/i18n/LanguageContext";

interface SeasonalityChartProps {
  specimenId: string;
}

const SeasonalityChart = ({ specimenId }: SeasonalityChartProps) => {
  const { t } = useLanguage();
  const activity = getFlightActivity(specimenId);
  const currentMonth = getCurrentMonth();

  return (
    <div className="mb-6">
      <h3 className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Flight Period
      </h3>
      <div className="flex items-end gap-[3px] h-16">
        {activity.map((value, i) => {
          const isCurrent = i === currentMonth;
          const heightPercent = Math.max(value * 100, 4);
          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-1">
              <div
                className="w-full rounded-sm transition-all duration-300"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: isCurrent
                    ? "hsl(var(--primary))"
                    : value >= 0.6
                      ? "hsl(var(--primary) / 0.5)"
                      : "hsl(var(--muted-foreground) / 0.2)",
                }}
                title={`${MONTH_LABELS[i]}: ${Math.round(value * 100)}% activity`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px] mt-1">
        {MONTH_LABELS.map((label, i) => (
          <span
            key={label}
            className={`flex-1 text-center font-body ${
              i === currentMonth
                ? "text-[9px] text-primary font-semibold"
                : "text-[8px] text-muted-foreground"
            }`}
          >
            {label.charAt(0)}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "hsl(var(--primary))" }} />
          <span className="text-[9px] font-body text-muted-foreground">Now</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "hsl(var(--primary) / 0.5)" }} />
          <span className="text-[9px] font-body text-muted-foreground">Peak</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.2)" }} />
          <span className="text-[9px] font-body text-muted-foreground">Low</span>
        </div>
      </div>
    </div>
  );
};

export default SeasonalityChart;
