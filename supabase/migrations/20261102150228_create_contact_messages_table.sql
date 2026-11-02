/*
# Create contact messages table

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `full_name` (text, required, 2-100 characters)
  - `email` (text, required, basic email shape, max 254 characters)
  - `message` (text, required, 10-2000 characters)
  - `created_at` (timestamptz, defaults to now())

2. Security
- Row level security is enabled on `contact_messages`.
- Website visitors (anon role) may only INSERT a message. They cannot read, change, or delete messages sent by others.
- Clinic staff read messages through the Supabase dashboard, which bypasses these policies.

3. Notes
- Length and format checks are enforced by the database as a final safety net in addition to validation in the website.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email LIKE '%_@_%.__%'),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
