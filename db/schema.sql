DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  facebook_id VARCHAR(255),
  facebook_token VARCHAR(255),
  social_media VARCHAR(255)[],
  instagram_username VARCHAR(255),
  twitter_username VARCHAR(255),
  youtube_username VARCHAR(255)
);

