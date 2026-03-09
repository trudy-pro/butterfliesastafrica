import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Volume2, Headphones } from "lucide-react";
import DigitalSpecimenCard from "@/components/DigitalSpecimenCard";
import EnvironmentOnboarding from "@/components/EnvironmentOnboarding";
import { ClimateZone, HabitatType } from "@/hooks/useEnvironmentProfile";

// The inaugural specimen for all new researchers
import danausChrysippus from "@/assets/specimens/danaus-chrysippus.jpg";

interface FirstLoginExperienceProps {
  userName?: string;
  onComplete: () => void;
  onEnvironmentSave?: (climate: ClimateZone, habitat: HabitatType) => void;
}

const STEPS = [
  { key: "welcome", title: "Field Kit Initialized" },
  { key: "environment", title: "Your Eco-Region" },
  { key: "specimen", title: "Your Inaugural Specimen" },
  { key: "tutorial", title: "Reading Wing-Beat Waveforms" },
  { key: "ready", title: "Your Field Station Awaits" },
];

/**
 * First-login onboarding overlay styled as a "Field Kit Induction."
 * Introduces the user to the archive, presents their inaugural specimen,
 * and teaches them to read wing-beat waveforms.
 */
const FirstLoginExperience = ({ userName, onComplete, onEnvironmentSave }: FirstLoginExperienceProps) => {
  const [step, setStep] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);

  const displayName = userName || "Researcher";

  const playTone = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 180;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 11.5; // African Monarch Hz

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
      ctxRef.current = null;
    }, 4000);
  }, []);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete();
  };

  const skip = () => onComplete();

  // Generate a unique-looking serial number
  const serial = `BA-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-md" />

      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute top-6 right-6 z-10 text-primary-foreground/50 hover:text-primary-foreground transition-colors flex items-center gap-1 text-xs font-body tracking-wider uppercase"
      >
        Skip <X className="w-3.5 h-3.5" />
      </button>

      {/* Step indicator */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 rounded-full transition-all ${
              i <= step ? "w-6 bg-primary-foreground/70" : "w-3 bg-primary-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                className="text-5xl mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                🦋
              </motion.div>

              <p className="text-[10px] font-body text-primary-foreground/40 uppercase tracking-[0.4em] mb-3">
                Field Kit Initialized
              </p>

              <h1
                className="text-3xl text-primary-foreground mb-4"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Welcome to the Archive
              </h1>

              <p className="text-sm font-body text-primary-foreground/70 leading-relaxed max-w-md mx-auto mb-2">
                Dear {displayName},
              </p>
              <p className="text-sm font-body text-primary-foreground/60 leading-relaxed max-w-md mx-auto">
                Your credentials have been verified and your digital field station is now active.
                You are joining a global network dedicated to documenting the delicate, the fleeting, and the flutter.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <EnvironmentOnboarding
              onComplete={(climate, habitat) => {
                onEnvironmentSave?.(climate, habitat);
                next();
              }}
            />
          )}

          {step === 2 && (
            <motion.div
              key="specimen"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[10px] font-body text-primary-foreground/40 uppercase tracking-[0.4em] mb-4 text-center">
                📜 Your Inaugural Specimen
              </p>

              <DigitalSpecimenCard
                image={danausChrysippus}
                commonName="African Monarch"
                scientificName="Danaus chrysippus"
                archivalId="#001-DC"
                frequencyHz={11.5}
                flightProfile="The Floater"
                acousticSignature="Velvet Hum"
                serialNumber={serial}
                onPlayTone={playTone}
              />

              <div className="flex items-center justify-center gap-2 mt-4 text-primary-foreground/50">
                <Headphones className="w-3.5 h-3.5" />
                <span className="text-[10px] font-body uppercase tracking-wider">
                  Click the waveform to hear the 11.5 Hz sonification
                </span>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="tutorial"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-[10px] font-body text-primary-foreground/40 uppercase tracking-[0.4em] mb-4">
                🔍 Reading Wing-Beat Waveforms
              </p>

              <h2
                className="text-2xl text-primary-foreground mb-6"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Your Field Guide
              </h2>

              <div className="space-y-4 text-left max-w-md mx-auto">
                {[
                  {
                    hz: "4–10 Hz",
                    label: "Gliders & Soarers",
                    desc: "Wide, slow waveforms. These species ride thermals — look for long flat stretches between gentle peaks.",
                  },
                  {
                    hz: "10–20 Hz",
                    label: "Floaters & Dippers",
                    desc: "Medium rhythm, undulating waves. The heartbeat of the forest — steady, meditative pulses.",
                  },
                  {
                    hz: "20–50 Hz",
                    label: "Skippers & Buzzers",
                    desc: "Tight, rapid oscillations. Almost a blur — these species vibrate so fast the waveform looks like a solid bar.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="flex gap-3 p-3 rounded-sm bg-primary-foreground/5 border border-primary-foreground/10"
                  >
                    <div className="shrink-0 w-16 text-center">
                      <span className="text-lg font-body font-semibold text-primary-foreground tabular-nums">
                        {item.hz}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-body font-medium text-primary-foreground mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-[11px] font-body text-primary-foreground/50 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="ready"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                className="text-4xl mb-6"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                🛠
              </motion.div>

              <h2
                className="text-2xl text-primary-foreground mb-4"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Your Field Station Awaits
              </h2>

              <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
                {[
                  { icon: "🎵", label: "The Soundboard", desc: "Explore Hz frequencies across the full collection" },
                  { icon: "🗺", label: "The Migration Map", desc: "Track species gliding through your coordinates" },
                  { icon: "📸", label: "Observation Logs", desc: "Upload sightings to the collective Wing-Beat database" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs font-body font-medium text-primary-foreground">{item.label}</p>
                      <p className="text-[11px] font-body text-primary-foreground/50">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs font-body italic text-primary-foreground/40 mb-2">
                Stay observant,
              </p>
              <p className="text-xs font-body text-primary-foreground/50">
                — The Curator, The Butterfly Archive
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.button
          onClick={next}
          className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 rounded-sm bg-primary-foreground text-primary text-sm font-body tracking-wider uppercase hover:bg-primary-foreground/90 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {step === STEPS.length - 1 ? "Access My Field Station" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FirstLoginExperience;
