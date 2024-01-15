CREATE DATABASE todos_db;

USE todos_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    due_date DATE,
    due_time TIME,
    completed BOOLEAN DEFAULT false
);

INSERT INTO tasks (title, description, due_date, due_time, completed)
VALUES
("Ejercicio", "Hacer ejercicio en la mañana", '2024-01-12', '08:00:00', 1),
("Proyecto", "Trabajar en el proyecto", '2024-01-12', '09:00:00', 1),
("Almuerzo", "Ir a almuerzo de trabajo", '2024-01-13', '12:30:00', 1),
("Capacitación", "Asistir a la capacitación", '2024-01-12', '14:00:00', 1),
("Compras", "Hacer compras", '2024-01-14', '18:30:00', 1),
("Cena", "Cena con la familia", '2024-01-12', '19:30:00', 1);