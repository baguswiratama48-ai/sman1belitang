ALTER TABLE "public"."berita" 
ADD COLUMN IF NOT EXISTS "gallery_images" text[] DEFAULT '{}'::text[];
