CREATE DATABASE logindatabase;

CREATE TABLE login(
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(40),
    nombre VARCHAR(40),
    apellido VARCHAR(40),
    direccion VARCHAR(40),
    email TEXT,
    password VARCHAR(150)
);

INSERT INTO login (nickName, direccion)
 VALUES ('marcos','typescript'),
        ('sofia','node.js'),
        ('pedro', 'react');

SELECT * FROM login;