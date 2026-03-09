import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Search, Globe, Smartphone, MousePointer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface PopularSpecimen {
  specimen_id: string;
  specimen_name: string;
  view_count: number;
}

interface SearchQueryStat {
  query: string;
  count: number;
}

interface ReferrerStat {
  referrer: string;
  count: number;
}

interface DeviceStat {
  device_type: string;
  count: number;
}

interface CountryStat {
  country: string;
  count: number;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(var(--secondary))"];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [popularSpecimens, setPopularSpecimens] = useState<PopularSpecimen[]>([]);
  const [searchQueries, setSearchQueries] = useState<SearchQueryStat[]>([]);
  const [referrers, setReferrers] = useState<ReferrerStat[]>([]);
  const [devices, setDevices] = useState<DeviceStat[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalSearches, setTotalSearches] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch popular specimens
        const { data: specimenData } = await supabase
          .from("specimen_views")
          .select("specimen_id, specimen_name");
        
        if (specimenData) {
          const counts: Record<string, { name: string; count: number }> = {};
          specimenData.forEach((row) => {
            if (!counts[row.specimen_id]) {
              counts[row.specimen_id] = { name: row.specimen_name || row.specimen_id, count: 0 };
            }
            counts[row.specimen_id].count++;
          });
          const sorted = Object.entries(counts)
            .map(([id, data]) => ({ specimen_id: id, specimen_name: data.name, view_count: data.count }))
            .sort((a, b) => b.view_count - a.view_count)
            .slice(0, 10);
          setPopularSpecimens(sorted);
        }

        // Fetch search queries
        const { data: searchData } = await supabase
          .from("search_queries")
          .select("query");
        
        if (searchData) {
          setTotalSearches(searchData.length);
          const counts: Record<string, number> = {};
          searchData.forEach((row) => {
            const q = row.query.toLowerCase();
            counts[q] = (counts[q] || 0) + 1;
          });
          const sorted = Object.entries(counts)
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          setSearchQueries(sorted);
        }

        // Fetch referrer stats
        const { data: eventData } = await supabase
          .from("analytics_events")
          .select("referrer, device_type")
          .eq("event_type", "page_view");
        
        if (eventData) {
          setTotalViews(eventData.length);
          
          // Referrers
          const refCounts: Record<string, number> = {};
          eventData.forEach((row) => {
            const ref = row.referrer || "direct";
            refCounts[ref] = (refCounts[ref] || 0) + 1;
          });
          const sortedRefs = Object.entries(refCounts)
            .map(([referrer, count]) => ({ referrer, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
          setReferrers(sortedRefs);

          // Devices
          const devCounts: Record<string, number> = {};
          eventData.forEach((row) => {
            const dev = row.device_type || "unknown";
            devCounts[dev] = (devCounts[dev] || 0) + 1;
          });
          const sortedDevs = Object.entries(devCounts)
            .map(([device_type, count]) => ({ device_type, count }))
            .sort((a, b) => b.count - a.count);
          setDevices(sortedDevs);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<MousePointer size={16} />} label="Page Views" value={totalViews} />
        <StatCard icon={<Search size={16} />} label="Searches" value={totalSearches} />
        <StatCard icon={<TrendingUp size={16} />} label="Popular Records" value={popularSpecimens.length} />
        <StatCard icon={<Globe size={16} />} label="Traffic Sources" value={referrers.length} />
      </div>

      {/* Popular Specimens */}
      <Section title="Popular Records" icon={<TrendingUp size={14} />}>
        {popularSpecimens.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularSpecimens} layout="vertical" margin={{ left: 100 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="specimen_name" tick={{ fontSize: 11 }} width={95} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="view_count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState message="No specimen views recorded yet" />
        )}
      </Section>

      {/* Search Queries */}
      <Section title="Top Search Queries" icon={<Search size={14} />}>
        {searchQueries.length > 0 ? (
          <div className="space-y-2">
            {searchQueries.map((sq, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-card/50">
                <span className="text-sm font-body text-foreground truncate">{sq.query}</span>
                <span className="text-xs font-body text-muted-foreground ml-2">{sq.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No search queries recorded yet" />
        )}
      </Section>

      {/* Referral Sources */}
      <Section title="Referral Sources" icon={<Globe size={14} />}>
        {referrers.length > 0 ? (
          <div className="space-y-2">
            {referrers.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-card/50">
                <span className="text-sm font-body text-foreground capitalize">{r.referrer}</span>
                <span className="text-xs font-body text-muted-foreground">{r.count} visits</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No referral data recorded yet" />
        )}
      </Section>

      {/* Device Types */}
      <Section title="Device Types" icon={<Smartphone size={14} />}>
        {devices.length > 0 ? (
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="count"
                    nameKey="device_type"
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                  >
                    {devices.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {devices.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-body text-foreground capitalize">{d.device_type}</span>
                  <span className="text-xs font-body text-muted-foreground">({d.count})</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState message="No device data recorded yet" />
        )}
      </Section>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="p-4 rounded-lg bg-card border border-border">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      {icon}
      <span className="text-xs font-body">{label}</span>
    </div>
    <p className="text-2xl font-display text-foreground">{value}</p>
  </div>
);

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="p-4 rounded-lg bg-card border border-border">
    <h3 className="flex items-center gap-2 text-sm font-body font-medium text-foreground mb-4">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <p className="text-sm font-body text-muted-foreground text-center py-8">{message}</p>
);

export default AnalyticsDashboard;
