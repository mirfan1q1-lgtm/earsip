/*
  # Create Storage Buckets

  ## Overview
  Creates storage buckets for portfolio assets and configures public access policies.

  ## Storage Buckets
  
  ### 1. `images` bucket
  Stores profile images and project images
  - Public access for viewing
  - Authenticated users can upload
  
  ### 2. `documents` bucket
  Stores CV/resume PDF files
  - Public access for viewing
  - Authenticated users can upload

  ## Security
  
  - Public can view all files (needed for portfolio display)
  - Only authenticated users can upload files
  - Only authenticated users can delete files
  
  ## Notes
  
  - Buckets are created with public access enabled
  - File size limits are handled by Supabase default settings
  - Supported file types for images: jpg, jpeg, png, gif, webp
  - Supported file types for documents: pdf
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket

CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- Storage policies for documents bucket

CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');