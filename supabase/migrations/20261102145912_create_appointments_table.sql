/*
# Create appointment requests table

1. New Tables
- `appointments`
  - `id` (uuid, primary key)
  - `full_name` (text, required, 2-100 characters)
  - `email` (text, required, basic email shape, max 254 characters)
  - `phone` (text, required, 7-20 characters)
  - `preferred_date` (date, required, the patient's requested day)
  - `treatment` (text, required, one of the clinic's treatment types)
  - `message` (text, optional, max 1000 characters)
  - `status` (text, defaults to 'pending')
  - `created_at` (timestamptz, defaults to now())

2. Security
- Row level security is enabled on `appointments`.
- Website visitors (anon role) may only INSERT new requests. They cannot read, change, or delete any request, so one patient cannot see another patient's details.
- Clinic staff read requests through the Supabase dashboard, which bypasses these policies.

3. Notes
- Length and format checks are enforced by the database as a final safety net in addition to validation in the website.
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email LIKE '%_@_%.__%'),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 20),
  preferred_date date NOT NULL,
  treatment text NOT NULL CHECK (char_length(treatment) BETWEEN 2 AND 80),
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appointments_preferred_date_idx ON appointments (preferred_date);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON appointments TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');
