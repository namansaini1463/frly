ALTER TABLE config.users
ADD COLUMN IF NOT EXISTS font_preference VARCHAR(20);
