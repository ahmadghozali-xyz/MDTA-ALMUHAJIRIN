/*
  # Add Facebook Posts Table

  1. New Tables
    - `facebook_posts`
      - `id` (text, primary key) - Facebook post ID
      - `message` (text) - Post content
      - `image_url` (text) - Post image URL
      - `created_at` (timestamptz) - Post creation time
      - `permalink_url` (text) - Link to Facebook post
      
  2. Security
    - Enable RLS on `facebook_posts` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS facebook_posts (
  id text PRIMARY KEY,
  message text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  permalink_url text NOT NULL
);

ALTER TABLE facebook_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Facebook posts are publicly viewable"
  ON facebook_posts
  FOR SELECT
  TO public
  USING (true);