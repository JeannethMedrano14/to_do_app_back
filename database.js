import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

  export async function getAllTasks() {
    const [rows] = await pool.execute(`SELECT * FROM tasks`);
    return rows;
  }
  
  export async function getPendingTasks() {
    const [rows] = await pool.execute(`SELECT * FROM tasks WHERE completed = 0`);
    return rows;
  }
  
  export async function getCompletedTasks() {
    const [rows] = await pool.execute(`SELECT * FROM tasks WHERE completed = 1`);
    return rows;
  }
  
  export async function createTask(title) {
    const [result] = await pool.execute(`INSERT INTO tasks (title) VALUES (?)`, [
      title,
    ]);
    const taskId = result.insertId;
    return getTask(taskId);
  }
  
  export async function getTask(taskId) {
    const [rows] = await pool.execute(`SELECT * FROM tasks WHERE id = ?`, [
      taskId,
    ]);
    return rows[0];
  }
  
  export async function updateTask(taskId, newDetails) {
    const { title, description, due_date, due_time } = newDetails;
    const [result] = await pool.execute(
        `
        UPDATE tasks
        SET title = ?, description = ?, due_date = ?, due_time = ?
        WHERE id = ?;
        `,
        [title, description, due_date, due_time, taskId]
    );

    if (result.affectedRows > 0) {
        return getTask(taskId);
    } else {
        throw new Error(`No se encontró ninguna tarea con el ID ${taskId}`);
    }
}
  
  export async function deleteTask(taskId) {
    await pool.execute(`DELETE FROM tasks WHERE id = ?`, [taskId]);
  }
  
  export async function toggleCompletedTask(taskId, completed) {
    await pool.execute(`UPDATE tasks SET completed = ? WHERE id = ?`, [
      completed,
      taskId,
    ]);
    return getTask(taskId);
  }