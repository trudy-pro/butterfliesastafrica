import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { specimens, ButterflySpecimen } from "@/data/butterflies";
import { getSoundProfile } from "@/data/wingBeatData";
import { getFlightStyles } from "@/data/flightStyles";
import DigitalSpecimenCard from "@/components/DigitalSpecimenCard";

interface ExaminedRecord {
  specimen_id: string;
  first_examined_at: string;
  serial_number: string;
}

const Collection = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ExaminedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchCollection = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("examined_specimens")
      .select("specimen_id, first_examined_at, serial_number")
      .eq("user_id", user.id)
      .order("first_examined_at", { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  // Map records to specimen data
  const collection = records
    .map((r) => {
      const specimen = specimens.find((s) => s.id === r.specimen_id);
      if (!specimen) return null;
      return { specimen, record: r };
    })
    .filter(Boolean) as { specimen: ButterflySpecimen; record: ExaminedRecord }[];

  const filtered = filter
    ? collection.filter(
        ({ specimen }) =>
          specimen.commonName.toLowerCase().includes(filter.toLowerCase()) ||
          specimen.scientificName.toLowerCase().includes(filter.toLowerCase())
      )
    : collection;

  // Play a tone for a specimen card
  const playTone = (hz: number) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 180;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = hz;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4;
    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.12;
    lfo.connect(lfoGain);
    lfoGain.connect(mainGain.gain);
    osc.connect(mainGain);
    mainGain.connect(ctx.destination);
    osc.start();
    lfo.start();
    setTimeout(() => {
      try { osc.stop(); lfo.stop(); } catch { /* */ }
      ctx.close();
    }, 3000);
  };

  const totalSpecimens = specimens.length;
  const collectedCount = collection.length;
  const completionPct = Math.round((collectedCount / totalSpecimens) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </button>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.3em] mb-2">
              Personal Collection
            </p>
            <h1
              className="text-3xl md:text-4xl text-foreground leading-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Your Specimen Vault
            </h1>
            <p className="text-sm font-body text-muted-foreground mt-2">
              {collectedCount} of {totalSpecimens} specimens examined
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-body font-semibold text-foreground tabular-nums">
              {completionPct}%
            </div>
            <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
              Collection
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Search */}
      <div className="px-6 py-3 border-b border-border">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search your collection..."
            className="w-full pl-9 pr-4 py-2 text-sm font-body bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Collection Grid */}
      <div className="px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm font-body text-muted-foreground animate-pulse">
              Loading your vault...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h2
              className="text-xl text-foreground mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {filter ? "No matches found" : "Your vault is empty"}
            </h2>
            <p className="text-sm font-body text-muted-foreground max-w-sm">
              {filter
                ? "Try a different search term."
                : "Open specimen details in the archive to add them to your personal collection. Each examined specimen becomes a unique digital print."}
            </p>
            {!filter && (
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-4 py-2 text-sm font-body bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
              >
                Explore the Archive
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(({ specimen, record }, i) => {
              const sound = getSoundProfile(specimen.id);
              const styles = getFlightStyles(specimen.id);

              // Determine acoustic texture label
              const textureLabels: Record<string, string> = {
                "satin-like": "Satin-like",
                "dry-parchment": "Dry / Parchment",
                "rhythmic-pulsing": "Rhythmic Pulse",
                "papery-flutter": "Papery Flutter",
                "velvet-hum": "Velvet Hum",
                "crisp-snap": "Crisp Snap",
                "soft-whisper": "Soft Whisper",
                "buzzing-vibrato": "Buzzing Vibrato",
              };

              return (
                <motion.div
                  key={record.specimen_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DigitalSpecimenCard
                    image={specimen.image}
                    commonName={specimen.commonName}
                    scientificName={specimen.scientificName}
                    archivalId={`#${String(i + 1).padStart(3, "0")}-${specimen.id.toUpperCase()}`}
                    frequencyHz={sound.frequencyHz}
                    flightProfile={styles[0]?.label ?? "Standard"}
                    acousticSignature={textureLabels[sound.acousticTexture] ?? sound.textureLabel}
                    serialNumber={record.serial_number}
                    onPlayTone={() => playTone(sound.frequencyHz)}
                  />
                  <p className="text-[10px] font-body text-muted-foreground text-center mt-2 tracking-wider">
                    Examined {new Date(record.first_examined_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
