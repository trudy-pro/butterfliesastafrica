import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

const POLL_KEY = "user_poll_answered";

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

const options = [
  { value: "school", label: "School / Academic" },
  { value: "family", label: "Family Research" },
  { value: "professional", label: "Professional Work" },
  { value: "personal", label: "Personal Interest" },
];

export default function UserPoll() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const answered = localStorage.getItem(POLL_KEY);
    if (answered) return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = async (value: string) => {
    setSelected(value);
    localStorage.setItem(POLL_KEY, value);

    try {
      await supabase.from("analytics_events").insert([{
        session_id: getSessionId(),
        event_type: "user_poll_response",
        event_data: { user_type: value } as Json,
        page_path: window.location.pathname,
        device_type: /mobile|android|iphone/i.test(navigator.userAgent) ? "mobile" : "desktop",
        user_agent: navigator.userAgent,
      }]);
    } catch (e) {
      console.debug("Poll tracking error:", e);
    }

    setSubmitted(true);
    setTimeout(() => setVisible(false), 1500);
  };

  const handleDismiss = () => {
    localStorage.setItem(POLL_KEY, "dismissed");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 bg-card border border-border rounded-xl shadow-lg p-4"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss poll"
          >
            <X size={16} />
          </button>

          {submitted ? (
            <p className="text-sm text-center text-foreground py-2">Thanks for your feedback!</p>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground mb-3">
                What brings you here today?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                      selected === opt.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
