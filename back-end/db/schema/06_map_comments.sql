DROP TABLE IF EXISTS map_comments CASCADE;

CREATE TABLE map_comments (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  date_commented TIMESTAMP NOT NULL,
  content TEXT NOT NULL
);