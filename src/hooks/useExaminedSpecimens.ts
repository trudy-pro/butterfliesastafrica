import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Records that a user has examined a specimen.
 * Uses upsert to avoid duplicates — only the first examination is stored.
 */
export function useExaminedSpecimens() {
  const recordExamination = useCallback(async (specimenId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const serial = `BA-${new Date().getFullYear()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

    await supabase
      .from("examined_specimens")
      .upsert(
        {
          user_id: user.id,
          specimen_id: specimenId,
          serial_number: serial,
        },
        { onConflict: "user_id,specimen_id", ignoreDuplicates: true }
      );
  }, []);

  return { recordExamination };
}
