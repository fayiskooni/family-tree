CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS families (
    family_id SERIAL PRIMARY KEY,
    family_name VARCHAR(255) NOT NULL,
    created_user INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS members (
    member_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender BOOLEAN NOT NULL,
    age INTEGER NOT NULL,
    date_of_birth DATE,
    date_of_death DATE,
    blood_group VARCHAR(10),
    created_user INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS couples (
    couple_id SERIAL PRIMARY KEY,
    husband_id INTEGER REFERENCES members(member_id),
    wife_id INTEGER REFERENCES members(member_id)
);

CREATE TABLE IF NOT EXISTS parent_child (
    couple_id INTEGER REFERENCES couples(couple_id),
    child_id INTEGER REFERENCES members(member_id),
    PRIMARY KEY (couple_id, child_id)
);

CREATE TABLE IF NOT EXISTS family_members (
    family_id INTEGER REFERENCES families(family_id),
    member_id INTEGER REFERENCES members(member_id),
    PRIMARY KEY (family_id, member_id)
);
