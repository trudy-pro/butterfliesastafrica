import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ClimateZone = "tropical" | "subtropical" | "temperate" | "arid" | "mediterranean" | "alpine";
export type HabitatType = "balcony" | "suburban_garden" | "rural_farm" | "near_forest" | "near_wetland" | "urban_park";

export interface EnvironmentProfile {
  climate_zone: ClimateZone;
  habitat_type: HabitatType;
  signup_season: string | null;
}

const CLIMATE_LABELS: Record<ClimateZone, string> = {
  tropical: "Tropical",
  subtropical: "Subtropical",
  temperate: "Temperate",
  arid: "Arid / Semi-Arid",
  mediterranean: "Mediterranean",
  alpine: "Alpine / Montane",
};

const HABITAT_LABELS: Record<HabitatType, string> = {
  balcony: "Balcony / Rooftop",
  suburban_garden: "Suburban Garden",
  rural_farm: "Rural / Farmland",
  near_forest: "Near a Forest",
  near_wetland: "Near Wetland / River",
  urban_park: "Urban Park",
};

export function getMigrationSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring Migration";
  if (month >= 5 && month <= 7) return "Summer Peak Flight";
  if (month >= 8 && month <= 10) return "Autumn Migration";
  return "Winter Dormancy";
}

export { CLIMATE_LABELS, HABITAT_LABELS };

export function useEnvironmentProfile() {
  const [profile, setProfile] = useState<EnvironmentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("user_environment_profiles")
      .select("climate_zone, habitat_type, signup_season")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data as EnvironmentProfile);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = useCallback(async (climate_zone: ClimateZone, habitat_type: HabitatType) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const season = getMigrationSeason();

    const { error } = await supabase
      .from("user_environment_profiles")
      .upsert(
        {
          user_id: user.id,
          climate_zone,
          habitat_type,
          signup_season: season,
        },
        { onConflict: "user_id" }
      );

    if (!error) {
      setProfile({ climate_zone, habitat_type, signup_season: season });
    }
  }, []);

  return { profile, loading, saveProfile };
}
