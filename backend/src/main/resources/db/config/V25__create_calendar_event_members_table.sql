CREATE TABLE IF NOT EXISTS calendar_event_members (
    id BIGSERIAL PRIMARY KEY,
    group_id VARCHAR(255) NOT NULL,
    event_id BIGINT NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);