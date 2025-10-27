-- HLSitech Storage Buckets Setup
-- Run this in Supabase SQL Editor

-- Create storage buckets for file uploads

-- 1. Chat Attachments (images, files sent in chat)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/zip']
)
ON CONFLICT (id) DO NOTHING;

-- 2. User Avatars (profile pictures)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket for avatars
  2097152, -- 2MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Knowledge Base Attachments (help articles, documentation)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'knowledge-base',
  'knowledge-base',
  true, -- Public for KB articles
  52428800, -- 50MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- 4. Dashboard Images (general dashboard images, logos, assets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dashboard-images',
  'dashboard-images',
  true, -- Public bucket for dashboard assets
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Chat Attachments Policies
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload chat attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');

-- Allow users to read their own files
CREATE POLICY "Users can view chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-attachments');

-- Avatars Policies
-- Anyone can view avatars (public)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Users can update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Knowledge Base Policies
-- Anyone can view KB files (public)
CREATE POLICY "Anyone can view knowledge base files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'knowledge-base');

-- Only authenticated agents can upload KB files
CREATE POLICY "Agents can upload knowledge base files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'knowledge-base');

-- Dashboard Images Policies
-- Anyone can view dashboard images (public)
CREATE POLICY "Anyone can view dashboard images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dashboard-images');

-- Authenticated users can upload dashboard images
CREATE POLICY "Authenticated users can upload dashboard images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dashboard-images');

-- Authenticated users can update dashboard images
CREATE POLICY "Authenticated users can update dashboard images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'dashboard-images');

-- Authenticated users can delete dashboard images
CREATE POLICY "Authenticated users can delete dashboard images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dashboard-images');

-- ============================================================================
-- NOTES
-- ============================================================================
-- After running this SQL:
-- 1. Go to Storage in Supabase Dashboard
-- 2. You should see 4 buckets: chat-attachments, avatars, knowledge-base, dashboard-images
-- 3. Test by uploading a file through the dashboard
-- 4. File URLs format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<filename>
--
-- Bucket Usage:
-- - chat-attachments: Files sent in chat conversations (private)
-- - avatars: User profile pictures (public)
-- - knowledge-base: Help articles, documentation files (public)
-- - dashboard-images: Dashboard logos, assets, general images (public)
