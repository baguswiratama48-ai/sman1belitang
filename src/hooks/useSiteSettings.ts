import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface PPDBTimeline {
  label: string;
  date: string;
}

export interface PPDBSettings {
  year: string;
  description: string;
  registration_start: string;
  registration_end: string;
  quota: string;
  registration_url: string;
  timeline: PPDBTimeline[];
}

export interface VisiMisiSettings {
  visi: string;
  misi: string[];
  tujuan: string;
}

export interface SambutanSettings {
  nama: string;
  jabatan: string;
  foto: string;
  konten: string;
}

export interface StatsSettings {
  jumlah_siswa: number;
  fasilitas: number;
  prestasi: number;
  tahun_berdiri: number;
}

export interface KontakSettings {
  alamat: string;
  telepon: string;
  email: string;
  jam_operasional: string;
  maps_embed: string;
}

export interface FooterSettings {
  tagline: string;
  facebook: string;
  instagram: string;
  youtube: string;
  jam_senin_kamis: string;
  jam_jumat: string;
  jam_sabtu: string;
  copyright: string;
}

type SettingsKey = 'hero_slides' | 'ppdb' | 'visi_misi' | 'sambutan' | 'stats' | 'kontak' | 'footer';

export function useSiteSetting<T>(key: SettingsKey) {
  return useQuery({
    queryKey: ['site_settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error) throw error;
      return data?.value as T;
    },
  });
}

export function useUpdateSiteSetting<T>(key: SettingsKey) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (value: T) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('site_settings')
        .update({ value: value as any })
        .eq('key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings', key] });
    },
  });
}

export function useAllSiteSettings() {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
}
