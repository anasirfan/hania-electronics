import type { SiteSettings } from "@/domain/types";
import { defaultSiteSettings } from "@/lib/site-settings";
import {
  createServiceSupabase,
  isSupabaseConfigured,
} from "@/server/supabase/client";

const SETTINGS_ID = "main";
const STORAGE_PATH = "config/site-settings.json";

type DbRow = {
  id: string;
  store_name: string;
  tagline: string;
  support_line: string;
  email: string;
  address: string;
  facebook_url: string;
  map_url: string;
  whatsapp: string;
  whatsapp_e164: string;
  phone_primary: string;
  phone_primary_display: string;
  phone_secondary: string;
  phone_secondary_display: string;
  phone_landline: string;
  phone_landline_display: string;
  contacts: SiteSettings["contacts"];
  business_hours: SiteSettings["businessHours"];
  updated_at: string;
};

function mapRow(row: DbRow): SiteSettings {
  return {
    storeName: row.store_name,
    tagline: row.tagline,
    supportLine: row.support_line,
    email: row.email,
    address: row.address,
    facebookUrl: row.facebook_url,
    mapUrl: row.map_url,
    whatsapp: row.whatsapp,
    whatsappE164: row.whatsapp_e164,
    phonePrimary: row.phone_primary,
    phonePrimaryDisplay: row.phone_primary_display,
    phoneSecondary: row.phone_secondary,
    phoneSecondaryDisplay: row.phone_secondary_display,
    phoneLandline: row.phone_landline,
    phoneLandlineDisplay: row.phone_landline_display,
    contacts: row.contacts ?? [],
    businessHours: row.business_hours ?? [],
    updatedAt: row.updated_at,
  };
}

function toRow(s: SiteSettings): DbRow {
  return {
    id: SETTINGS_ID,
    store_name: s.storeName,
    tagline: s.tagline,
    support_line: s.supportLine,
    email: s.email,
    address: s.address,
    facebook_url: s.facebookUrl,
    map_url: s.mapUrl,
    whatsapp: s.whatsapp,
    whatsapp_e164: s.whatsappE164,
    phone_primary: s.phonePrimary,
    phone_primary_display: s.phonePrimaryDisplay,
    phone_secondary: s.phoneSecondary,
    phone_secondary_display: s.phoneSecondaryDisplay,
    phone_landline: s.phoneLandline,
    phone_landline_display: s.phoneLandlineDisplay,
    contacts: s.contacts,
    business_hours: s.businessHours,
    updated_at: s.updatedAt,
  };
}

async function readFromStorage(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createServiceSupabase();
  const { data, error } = await sb.storage.from("uploads").download(STORAGE_PATH);
  if (error || !data) return null;
  try {
    const text = await data.text();
    return { ...defaultSiteSettings(), ...JSON.parse(text) } as SiteSettings;
  } catch {
    return null;
  }
}

async function writeToStorage(settings: SiteSettings): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = createServiceSupabase();
  const body = JSON.stringify(settings, null, 2);
  const { error } = await sb.storage.from("uploads").upload(
    STORAGE_PATH,
    new Blob([body], { type: "application/json" }),
    { upsert: true, contentType: "application/json", cacheControl: "60" },
  );
  if (error) throw new Error(`Settings storage write failed: ${error.message}`);
}

async function readFromTable(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createServiceSupabase();
  const { data, error } = await sb
    .from("site_settings")
    .select("*")
    .eq("id", SETTINGS_ID)
    .maybeSingle();
  if (error) {
    // Table missing — fall through to storage
    if (error.code === "PGRST205" || /schema cache|does not exist/i.test(error.message)) {
      return null;
    }
    throw new Error(`site_settings read: ${error.message}`);
  }
  return data ? mapRow(data as DbRow) : null;
}

async function writeToTable(settings: SiteSettings): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const sb = createServiceSupabase();
  const { error } = await sb.from("site_settings").upsert(toRow(settings));
  if (error) {
    if (error.code === "PGRST205" || /schema cache|does not exist/i.test(error.message)) {
      return false;
    }
    throw new Error(`site_settings write: ${error.message}`);
  }
  return true;
}

export const siteSettingsRepository = {
  async get(): Promise<SiteSettings> {
    try {
      const fromTable = await readFromTable();
      if (fromTable) return fromTable;
    } catch (e) {
      console.warn("[site_settings] table read failed", e);
    }
    try {
      const fromStorage = await readFromStorage();
      if (fromStorage) return fromStorage;
    } catch (e) {
      console.warn("[site_settings] storage read failed", e);
    }
    return defaultSiteSettings();
  },

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.get();
    const next: SiteSettings = {
      ...current,
      ...patch,
      contacts: patch.contacts ?? current.contacts,
      businessHours: patch.businessHours ?? current.businessHours,
      updatedAt: new Date().toISOString(),
    };

    const wroteTable = await writeToTable(next);
    // Always mirror to Storage so contact works even before the SQL table exists
    await writeToStorage(next);
    if (!wroteTable) {
      console.warn(
        "[site_settings] saved to Storage only — run supabase/migrations/20260323000000_site_settings.sql for table mode",
      );
    }
    return next;
  },
};
