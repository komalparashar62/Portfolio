CREATE TABLE IF NOT EXISTS enquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id UUID NOT NULL UNIQUE,
  queries JSONB NOT NULL,
  name VARCHAR(100) NOT NULL,
  contact_method VARCHAR(5) NOT NULL CHECK (contact_method IN ('email', 'phone')),
  contact VARCHAR(254) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
