CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    handle VARCHAR(30) NOT NULL UNIQUE,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    quick_status TEXT
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires TIMESTAMP NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    public_id UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    content VARCHAR(280) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT now()
);