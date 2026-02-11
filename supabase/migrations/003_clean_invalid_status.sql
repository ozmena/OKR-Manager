UPDATE okrs SET status = NULL WHERE status NOT IN ('on-track', 'progressing', 'off-track');
