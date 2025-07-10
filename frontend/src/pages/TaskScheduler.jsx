import React, { useEffect, useState } from 'react';

function TaskScheduler() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ id: '', description: '', schedule: '' });

  useEffect(() => {
    fetch('/api/scheduler/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const addTask = (e) => {
    e.preventDefault();
    fetch('/api/scheduler/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    }).then(() => {
      setTasks(prev => [...prev, newTask]);
      setNewTask({ id: '', description: '', schedule: '' });
    });
  };

  const deleteTask = (taskId) => {
    fetch(`/api/scheduler/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      });
  };

  return (
    <div>
      <h1>Task Scheduler</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          name="id"
          placeholder="Task ID"
          value={newTask.id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="schedule"
          placeholder="Schedule (cron or interval)"
          value={newTask.schedule}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.id}</strong>: {task.description} - {task.schedule}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskScheduler;
