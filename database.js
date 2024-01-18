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
    try {
      const [tasks] = await pool.execute(`SELECT * FROM tasks`);
      return tasks;
    } catch (error) {
      console.error("Error en getAllTasks:", error);
      throw error;
    }
  }

  export async function getTasksByCompleted(completed) {
    try {
      const [rows] = await pool.execute(`SELECT * FROM tasks WHERE completed = ?`, [completed]);
      console.log(`Tasks with completed=${completed}:`, rows);
      return rows;
    } catch (error) {
      console.error("Error in getTasksByCompleted:", error);
      throw error;
    }
  }  
  
  export async function getPendingTasks() {
    const [tasks] = await pool.execute(`SELECT * FROM tasks WHERE completed = 0`);
    console.log("Pending Tasks:", rows);
    return tasks;
}

export async function getCompletedTasks() {
    const [rows] = await pool.execute(`SELECT * FROM tasks WHERE completed = 1`);
    console.log("Completed Tasks:", rows);
    return rows;
}
  
export async function createTask(title, description, due_date, due_time) {
  try {
    const params = [title || null, description || null, due_date || null, due_time || null];

    const [result] = await pool.execute(
      `
      INSERT INTO tasks (title, description, due_date, due_time)
      VALUES (?, ?, ?, ?)
      `,
      params
    );

    const taskId = result.insertId;
    return getTask(taskId);
  } catch (error) {
    console.error("Error en createTask:", error);
    throw error;
  }
}
  
  export async function getTask(taskId) {
    const [rows] = await pool.execute(`SELECT * FROM tasks WHERE id = ?`, [
      taskId,
    ]);
    return rows[0];
  }
  
  export async function updateTask(taskId, newDetails) {
    const { title, description, due_date, due_time } = newDetails;
    try {
      const [result] = await pool.execute(
        `
        UPDATE tasks
        SET title = ?, description = ?, due_date = ?, due_time = ?
        WHERE id = ?;
        `,
        [title, description, due_date, due_time, taskId]
      );
      if (result.affectedRows > 0) {
        return { success: true, message: "Tarea actualizada con éxito" };
      } else {
        throw new Error("No se pudo actualizar la tarea");
      }
    } catch (error) {
      throw error;
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