import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

// Detect device type from user agent
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
};

// Get referrer source
const getReferrerSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return "direct";
  
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("facebook") || host.includes("fb.")) return "facebook";
    if (host.includes("twitter") || host.includes("x.com")) return "twitter";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("github")) return "github";
    if (host.includes(".edu")) return "university";
    if (host.includes("library")) return "library";
    
    return host;
  } catch {
    return "unknown";
  }
};

interface AnalyticsData {
  session_id: string;
  user_id?: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  page_path?: string;
  referrer?: string;
  user_agent?: string;
  device_type?: string;
}

export const useAnalytics = () => {
  const sessionId = useRef(getSessionId());
  const deviceType = useRef(getDeviceType());
  const referrer = useRef(getReferrerSource());
  const pageViewTracked = useRef(false);

  // Track generic event
  const trackEvent = useCallback(async (
    eventType: string,
    eventData?: Record<string, unknown>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const analyticsData: AnalyticsData = {
        session_id: sessionId.current,
        user_id: user?.id,
        event_type: eventType,
        event_data: eventData || {},
        page_path: window.location.pathname,
        referrer: referrer.current,
        user_agent: navigator.userAgent,
        device_type: deviceType.current,
      };

      await supabase.from("analytics_events").insert([analyticsData]);
    } catch (error) {
      // Silently fail - analytics should never break the app
      console.debug("Analytics error:", error);
    }
  }, []);

  // Track page view
  const trackPageView = useCallback(async () => {
    await trackEvent("page_view", {
      url: window.location.href,
      title: document.title,
    });
  }, [trackEvent]);

  // Track search query
  const trackSearch = useCallback(async (
    query: string,
    category: string,
    resultsCount: number
  ) => {
    if (!query.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("search_queries").insert([{
        session_id: sessionId.current,
        user_id: user?.id,
        query: query.trim(),
        category,
        results_count: resultsCount,
      }]);
    } catch (error) {
      console.debug("Search analytics error:", error);
    }
  }, []);

  // Track specimen view
  const trackSpecimenView = useCallback(async (
    specimenId: string,
    specimenName: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("specimen_views").insert([{
        session_id: sessionId.current,
        user_id: user?.id,
        specimen_id: specimenId,
        specimen_name: specimenName,
      }]);
    } catch (error) {
      console.debug("Specimen view analytics error:", error);
    }
  }, []);

  // Auto-track initial page view
  useEffect(() => {
    if (!pageViewTracked.current) {
      pageViewTracked.current = true;
      trackPageView();
    }
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackSpecimenView,
    sessionId: sessionId.current,
    deviceType: deviceType.current,
    referrer: referrer.current,
  };
};
