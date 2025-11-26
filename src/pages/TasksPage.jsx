import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../api/tasks';
import { getCategories } from '../api/categories';
import '../styles/taskPage.css';

function TasksPage({ user, onLogout, goToCategories }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // estados del formulario de tarea
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newStatus, setNewStatus] = useState('pendiente');
  const [newPriority, setNewPriority] = useState('media');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // categorías
  const [categories, setCategories] = useState([]);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar tareas', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  }

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  function resetForm() {
    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');
    setNewStatus('pendiente');
    setNewPriority('media');
    setSelectedCategoryId('');
    setEditingTaskId(null);
  }

  async function handleSubmitTask(e) {
    e.preventDefault();

    const payload = {
      title: newTitle,
      description: newDescription,
      due_date: newDueDate || null,
      status: newStatus,
      priority: newPriority,
      category_id: selectedCategoryId ? Number(selectedCategoryId) : null,
    };

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
      } else {
        await createTask(payload);
      }

      resetForm();
      setShowForm(false); // cerramos la tarjeta al guardar
      loadTasks();
    } catch (error) {
      console.error('Error al guardar tarea', error);
    }
  }

  function handleCreateClick() {
    resetForm();
    setShowForm(true);
  }

  function handleEditClick(task) {
    setEditingTaskId(task.id);
    setNewTitle(task.title || '');
    setNewDescription(task.description || '');
    setNewStatus(task.status || 'pendiente');
    setNewPriority(task.priority || 'media');
    setNewDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
    setSelectedCategoryId(task.category_id || '');
    setShowForm(true); // abrimos la tarjeta en modo edición
  }

  async function handleDeleteTask(id) {
    const seguro = confirm('¿Eliminar esta tarea?');
    if (!seguro) return;

    try {
      await deleteTask(id);
      // si se estaba editando esta tarea, reseteamos
      if (editingTaskId === id) {
        resetForm();
        setShowForm(false);
      }
      loadTasks();
    } catch (error) {
      console.error('Error al eliminar tarea', error);
    }
  }

  function getCategoryName(categoryId) {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : null;
  }

  return (
    <div className="tasks-outer">
      <div className="tasks-container">
        <header className="tasks-header">
          <div>
            <h1 className="tasks-title">Mis tareas</h1>
            {user && <p className="tasks-user">Usuario: {user.name}</p>}
          </div>

          <div className="tasks-header-buttons">
            <button className="btn-secondary" onClick={goToCategories}>
              Categorías
            </button>
            <button className="btn-primary" onClick={handleCreateClick}>
              Crear tarea
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                onLogout();
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="tasks-main">
          {/* Tarjeta flotante para crear / editar tarea */}
          {showForm && (
            <section className="tasks-form-float">
              <div className="tasks-form-header">
                <h2 className="tasks-section-title">
                  {editingTaskId ? 'Editar tarea' : 'Nueva tarea'}
                </h2>
                <button
                  type="button"
                  className="tasks-close-btn"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="tasks-form">
                <label className="tasks-label">
                  Título
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="tasks-input"
                  />
                </label>

                <label className="tasks-label">
                  Descripción
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="tasks-input tasks-textarea"
                  />
                </label>

                <div className="tasks-form-row">
                  <label className="tasks-label">
                    Fecha límite
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="tasks-input"
                    />
                  </label>

                  <label className="tasks-label">
                    Estado
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="tasks-input"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_progreso">En progreso</option>
                      <option value="completada">Completada</option>
                    </select>
                  </label>
                </div>

                <div className="tasks-form-row">
                  <label className="tasks-label">
                    Prioridad
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="tasks-input"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </label>

                  <label className="tasks-label">
                    Categoría
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="tasks-input"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="tasks-form-actions">
                  <button type="submit" className="btn-primary">
                    {editingTaskId ? 'Guardar cambios' : 'Crear tarea'}
                  </button>
                  {editingTaskId && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* Sección de listado de tareas (post-its) */}
          <section className="tasks-list-section">
            <h2 className="tasks-section-title">Mis tareas</h2>
            {loading ? (
              <p>Cargando tareas...</p>
            ) : tasks.length === 0 ? (
              <p>No hay tareas todavía.</p>
            ) : (
              <ul className="tasks-list">
                {tasks.map((task) => {
                  const catName = getCategoryName(task.category_id);
                  return (
                    <li key={task.id} className="tasks-item">
                      <div className="tasks-item-main">
                        <div className="tasks-item-pin" />
                        <strong className="tasks-item-title">
                          {task.title}
                        </strong>
                        {task.description && (
                          <p className="tasks-item-description">
                            {task.description}
                          </p>
                        )}

                        <div className="tasks-chips-row">
                          <span className="tasks-chip">
                            Estado: {task.status}
                          </span>
                          <span className="tasks-chip">
                            Prioridad: {task.priority}
                          </span>
                          {catName && (
                            <span className="tasks-chip">
                              Categoría: {catName}
                            </span>
                          )}
                        </div>

                        {task.due_date && (
                          <p className="tasks-due-date">
                            Vence:{' '}
                            {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="tasks-item-actions">
                        <button
                          className="btn-small"
                          onClick={() => handleEditClick(task)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;





