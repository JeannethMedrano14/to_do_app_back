import express from 'express';
import {
    getAllTasks,
    getPendingTasks,
    getCompletedTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
    toggleCompletedTask,
    getTasksByCompleted,
} from "./database.js";
import cors from "cors";

const corsOptions = {
    origin: "http://127.0.0.1:3306",
    methods: ["POST", "GET"],
    credentials: true,
  }
  
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Ver todas las tareas
app.get('/tasks', async (req, res) => {
    try {
      const tasks = await getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error en la ruta /tasks:", error);
      res.status(500).json({ error: "Error al obtener las tareas" });
    }
  });

  app.get('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
      const task = await getTask(taskId);
      res.json(task);
    } catch (error) {
      console.error("Error en la ruta /tasks/:taskId:", error);
      res.status(500).json({ error: "Error al obtener la tarea" });
    }
  });

  app.get('/tasks/completed/:completed', async (req, res) => {
    const { completed } = req.params;
    try {
      const tasks = await getTasksByCompleted(completed);
      res.json(tasks);
    } catch (error) {
      console.error("Error in the route /tasks/completed/:completed:", error);
      res.status(500).json({ error: "Error fetching completed tasks" });
    }
  });
  

// Ver tareas pendientes
app.get('/tasks/pending', async (req, res) => {
    const pendingTasks = await getPendingTasks();
    res.json(pendingTasks);
});

// Ver tareas completadas
app.get('/tasks/completed', async (req, res) => {
  try {
      const completedTasks = await getCompletedTasks();
      res.json(completedTasks);
  } catch (error) {
      console.error("Error en la ruta /tasks/completed:", error);
      res.status(500).json({ error: "Error al obtener tareas completadas" });
  }
});

// Crear nueva tarea
app.post('/tasks', async (req, res) => {
    const { title, description, due_date, due_time } = req.body;
    try {
      const newTask = await createTask(title, description, due_date, due_time);
      res.json(newTask);
    } catch (error) {
      console.error("Error en la ruta /tasks:", error);
      res.status(500).json({ error: "Error al crear la tarea" });
    }
  });

  app.put('/tasks/:taskId', async (req, res) => {
    console.log("Request body:", req.body);
    const { taskId } = req.params;
    const { title, description, due_date, due_time } = req.body;
    try {
        const updatedTask = await updateTask(taskId, { title, description, due_date, due_time });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
});

// Eliminar una tarea
app.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        await deleteTask(taskId);
        res.json({ message: "Tarea eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
});

// Actualizar una tarea
app.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description, due_date, due_time } = req.body;
    try {
        const updatedTask = await updateTask(taskId, { title, description, due_date, due_time });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
});

// Marcar si la tarea esta completada o pendiente
app.put('/tasks/:taskId/toggle', async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;
    try {
        const updatedTask = await toggleCompletedTask(taskId, completed);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar el estado de la tarea" });
    }
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
