import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import '../styles/CategoriesPage.css';

function CategoriesPage({ goBack }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editing) {
        await updateCategory(editing.id, name);
      } else {
        await createCategory(name);
      }

      setName('');
      setEditing(null);
      loadCategories();
    } catch (error) {
      console.error('Error al guardar categoría', error);
    }
  }

  function startEdit(cat) {
    setEditing(cat);
    setName(cat.name);
  }

  function cancelEdit() {
    setEditing(null);
    setName('');
  }

  async function handleDelete(id) {
    const seguro = confirm('¿Eliminar esta categoría?');
    if (!seguro) return;

    try {
      await deleteCategory(id);
      if (editing && editing.id === id) {
        cancelEdit();
      }
      loadCategories();
    } catch (error) {
      console.error('Error al eliminar categoría', error);
    }
  }

  return (
    <div className="cats-outer">
      <div className="cats-container">
        <header className="cats-header">
          <div>
            <h1 className="cats-title">Categorías</h1>
            <p className="cats-subtitle">
              Organizá tus tareas agrupándolas por categoría
            </p>
          </div>
          <button className="btn-outline" onClick={goBack}>
            Volver a tareas
          </button>
        </header>

        <section className="cats-form-section">
          <h2 className="cats-section-title">
            {editing ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <form onSubmit={handleSubmit} className="cats-form">
            <label className="cats-label">
              Nombre de categoría
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="cats-input"
              />
            </label>

            <div className="cats-actions">
              <button type="submit" className="btn-primary">
                {editing ? 'Guardar cambios' : 'Crear'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-ghost"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="cats-section-title">Listado de categorías</h2>
          <ul className="cats-list">
            {categories.map((cat) => (
              <li key={cat.id} className="cats-item">
                <span>{cat.name}</span>
                <div className="cats-item-buttons">
                  <button
                    className="btn-small"
                    onClick={() => startEdit(cat)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default CategoriesPage;


