-- Run this entire script in the Supabase SQL Editor to create your tables and policies.

-- 1. Create table for Portfolio Content (Hero Images & Bio)
CREATE TABLE portfolio_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_images JSONB DEFAULT '[]'::jsonb,
  bio_de JSONB DEFAULT '{"role": "", "bio": ""}'::jsonb,
  bio_en JSONB DEFAULT '{"role": "", "bio": ""}'::jsonb,
  bio_sr JSONB DEFAULT '{"role": "", "bio": ""}'::jsonb
);

-- Insert a single row that we will always update
INSERT INTO portfolio_content (id) VALUES ('00000000-0000-0000-0000-000000000000');

-- 2. Create table for Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language TEXT NOT NULL, -- 'DE', 'EN', or 'SR'
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  image TEXT,
  size TEXT DEFAULT 'normal',
  link TEXT,
  roles TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for Gallery Images
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  src TEXT NOT NULL,
  title TEXT,
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create table for Gallery Comments
CREATE TABLE gallery_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_id UUID REFERENCES gallery_images(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create table for Project Inquiries (Emails)
CREATE TABLE project_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) but allow anonymous access for now since this is a simple portfolio
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to read the content
CREATE POLICY "Allow public read access to portfolio_content" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gallery_comments" ON gallery_comments FOR SELECT USING (true);

-- Create policies to allow public (or admin from app) to insert, update and delete
-- NOTE: In a real production app with sensitive data, you would lock down INSERT/UPDATE/DELETE to authenticated users.
-- Since the frontend handles a single password, we are allowing anon access here for simplicity, 
-- but you should not share your URL with malicious actors.
CREATE POLICY "Allow public all access on portfolio_content" ON portfolio_content FOR ALL USING (true);
CREATE POLICY "Allow public all access on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow public all access on gallery_images" ON gallery_images FOR ALL USING (true);

-- Anyone can comment, but maybe can't delete
CREATE POLICY "Allow public to insert comments" ON gallery_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to delete comments" ON gallery_comments FOR DELETE USING (true);

-- Anyone can send an inquiry
CREATE POLICY "Allow public to insert inquiries" ON project_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to read/delete inquiries" ON project_inquiries FOR ALL USING (true);
