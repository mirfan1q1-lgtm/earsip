/*
  # Portfolio Website Schema

  ## Overview
  Creates complete database schema for premium portfolio website with admin CMS.

  ## New Tables
  
  ### 1. `hero_section`
  Stores hero section content (single row table)
  - `id` (uuid, primary key)
  - `name` (text) - Full name
  - `role` (text) - Job title/position
  - `description` (text) - Brief intro
  - `profile_image_url` (text) - Profile photo URL
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. `about_me`
  Stores about section content (single row table)
  - `id` (uuid, primary key)
  - `bio` (text) - Biography
  - `cv_url` (text) - CV PDF file URL
  - `updated_at` (timestamptz)
  
  ### 3. `experiences`
  Stores work experience timeline
  - `id` (uuid, primary key)
  - `title` (text) - Company/organization name
  - `position` (text) - Job position
  - `start_year` (integer) - Start year
  - `end_year` (integer, nullable) - End year (null = present)
  - `description` (text) - Job description
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. `skills`
  Stores technical and soft skills
  - `id` (uuid, primary key)
  - `name` (text) - Skill name
  - `category` (text) - Category (technical/soft/other)
  - `level` (integer) - Skill level percentage (0-100)
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. `projects`
  Stores portfolio projects
  - `id` (uuid, primary key)
  - `title` (text) - Project title
  - `description` (text) - Project description
  - `image_url` (text) - Project image URL
  - `technologies` (text[]) - Array of technologies used
  - `year` (integer) - Project year
  - `demo_link` (text, nullable) - Demo URL
  - `github_link` (text, nullable) - GitHub repository URL
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 6. `messages`
  Stores contact form submissions
  - `id` (uuid, primary key)
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz)

  ## Security
  
  All tables have RLS enabled with appropriate policies:
  - Public read access for portfolio content tables
  - Admin-only write access (requires authentication)
  - Messages table: public can insert, only authenticated can read
  
  ## Notes
  
  - hero_section and about_me are single-row tables (only one record should exist)
  - order_index fields allow custom sorting in admin panel
  - All timestamps use timestamptz for proper timezone handling
*/

-- Create tables

CREATE TABLE IF NOT EXISTS hero_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  profile_image_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_me (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bio text NOT NULL DEFAULT '',
  cv_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  position text NOT NULL,
  start_year integer NOT NULL,
  end_year integer,
  description text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'technical',
  level integer NOT NULL DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  technologies text[] DEFAULT '{}',
  year integer NOT NULL,
  demo_link text,
  github_link text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Insert default data for single-row tables

INSERT INTO hero_section (name, role, description, profile_image_url)
VALUES (
  'Your Name',
  'Full Stack Developer',
  'Passionate developer creating amazing web experiences',
  ''
)
ON CONFLICT DO NOTHING;

INSERT INTO about_me (bio, cv_url)
VALUES (
  'Write your biography here...',
  ''
)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security

ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hero_section

CREATE POLICY "Anyone can view hero section"
  ON hero_section FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update hero section"
  ON hero_section FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for about_me

CREATE POLICY "Anyone can view about me"
  ON about_me FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update about me"
  ON about_me FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for experiences

CREATE POLICY "Anyone can view experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert experiences"
  ON experiences FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experiences"
  ON experiences FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experiences"
  ON experiences FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for skills

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for projects

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for messages

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete messages"
  ON messages FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance

CREATE INDEX IF NOT EXISTS experiences_order_idx ON experiences(order_index);
CREATE INDEX IF NOT EXISTS skills_order_idx ON skills(order_index);
CREATE INDEX IF NOT EXISTS projects_order_idx ON projects(order_index);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_is_read_idx ON messages(is_read);