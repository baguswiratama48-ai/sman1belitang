export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alumni: {
        Row: {
          angkatan: string
          created_at: string
          foto_url: string | null
          id: string
          instansi: string | null
          is_published: boolean | null
          nama: string
          pekerjaan: string | null
          testimoni: string | null
          updated_at: string
        }
        Insert: {
          angkatan: string
          created_at?: string
          foto_url?: string | null
          id?: string
          instansi?: string | null
          is_published?: boolean | null
          nama: string
          pekerjaan?: string | null
          testimoni?: string | null
          updated_at?: string
        }
        Update: {
          angkatan?: string
          created_at?: string
          foto_url?: string | null
          id?: string
          instansi?: string | null
          is_published?: boolean | null
          nama?: string
          pekerjaan?: string | null
          testimoni?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      berita: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ekskul: {
        Row: {
          created_at: string
          deskripsi: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          jadwal: string | null
          nama: string
          order_index: number | null
          pembina: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          jadwal?: string | null
          nama: string
          order_index?: number | null
          pembina?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          jadwal?: string | null
          nama?: string
          order_index?: number | null
          pembina?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fasilitas: {
        Row: {
          created_at: string
          deskripsi: string | null
          id: string
          image_url: string
          is_published: boolean | null
          kategori: string | null
          nama: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          image_url: string
          is_published?: boolean | null
          kategori?: string | null
          nama: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          image_url?: string
          is_published?: boolean | null
          kategori?: string | null
          nama?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      galeri: {
        Row: {
          album: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          album?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          album?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      guru: {
        Row: {
          created_at: string
          email: string | null
          foto_url: string | null
          id: string
          is_active: boolean | null
          jabatan: string
          mata_pelajaran: string | null
          nama: string
          nip: string | null
          order_index: number | null
          pendidikan: string | null
          telepon: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          jabatan: string
          mata_pelajaran?: string | null
          nama: string
          nip?: string | null
          order_index?: number | null
          pendidikan?: string | null
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          jabatan?: string
          mata_pelajaran?: string | null
          nama?: string
          nip?: string | null
          order_index?: number | null
          pendidikan?: string | null
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kalender_akademik: {
        Row: {
          created_at: string
          deskripsi: string | null
          id: string
          is_published: boolean | null
          judul: string
          kategori: string | null
          tanggal_mulai: string
          tanggal_selesai: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          is_published?: boolean | null
          judul: string
          kategori?: string | null
          tanggal_mulai: string
          tanggal_selesai?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          is_published?: boolean | null
          judul?: string
          kategori?: string | null
          tanggal_mulai?: string
          tanggal_selesai?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kelas: {
        Row: {
          created_at: string
          id: string
          jumlah_siswa: number | null
          jurusan: string | null
          nama_kelas: string
          order_index: number | null
          tahun_ajaran: string
          tingkat: string
          updated_at: string
          wali_kelas: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          jumlah_siswa?: number | null
          jurusan?: string | null
          nama_kelas: string
          order_index?: number | null
          tahun_ajaran: string
          tingkat: string
          updated_at?: string
          wali_kelas?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          jumlah_siswa?: number | null
          jurusan?: string | null
          nama_kelas?: string
          order_index?: number | null
          tahun_ajaran?: string
          tingkat?: string
          updated_at?: string
          wali_kelas?: string | null
        }
        Relationships: []
      }
      osis: {
        Row: {
          created_at: string
          foto_url: string | null
          id: string
          is_active: boolean | null
          jabatan: string
          kelas: string | null
          nama: string
          order_index: number | null
          periode: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          jabatan: string
          kelas?: string | null
          nama: string
          order_index?: number | null
          periode: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          jabatan?: string
          kelas?: string | null
          nama?: string
          order_index?: number | null
          periode?: string
          updated_at?: string
        }
        Relationships: []
      }
      pengumuman: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          is_important: boolean
          is_published: boolean
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_important?: boolean
          is_published?: boolean
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_important?: boolean
          is_published?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prestasi: {
        Row: {
          created_at: string
          deskripsi: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          judul: string
          kategori: string | null
          order_index: number | null
          peraih: string | null
          tahun: string
          tingkat: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          judul: string
          kategori?: string | null
          order_index?: number | null
          peraih?: string | null
          tahun: string
          tingkat?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          judul?: string
          kategori?: string | null
          order_index?: number | null
          peraih?: string | null
          tahun?: string
          tingkat?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sejarah: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          order_index: number | null
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number | null
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          order_index?: number | null
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      struktur_organisasi: {
        Row: {
          created_at: string
          foto_url: string | null
          id: string
          jabatan: string
          level: number | null
          nama: string
          order_index: number | null
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          foto_url?: string | null
          id?: string
          jabatan: string
          level?: number | null
          nama: string
          order_index?: number | null
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          foto_url?: string | null
          id?: string
          jabatan?: string
          level?: number | null
          nama?: string
          order_index?: number | null
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "struktur_organisasi_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "struktur_organisasi"
            referencedColumns: ["id"]
          },
        ]
      }
      tendik: {
        Row: {
          created_at: string
          email: string | null
          foto_url: string | null
          id: string
          is_active: boolean | null
          jabatan: string
          nama: string
          nip: string | null
          order_index: number | null
          pendidikan: string | null
          telepon: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          jabatan: string
          nama: string
          nip?: string | null
          order_index?: number | null
          pendidikan?: string | null
          telepon?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          is_active?: boolean | null
          jabatan?: string
          nama?: string
          nip?: string | null
          order_index?: number | null
          pendidikan?: string | null
          telepon?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student" | "alumni"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "student", "alumni"],
    },
  },
} as const
