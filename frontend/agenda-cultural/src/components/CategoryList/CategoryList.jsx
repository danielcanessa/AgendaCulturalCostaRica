import './CategoryList.css';
import { useEffect, useState } from 'react';

export default function CategoryList({ onCategoriaSeleccionada }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories/');
        if (!response.ok) throw new Error('Error al obtener categorías');
        const data = await response.json();
        // Agregar la categoría "Todos" al inicio
        const categoriasConTodos = [{ name: 'Todos' }, ...data];
        setCategorias(categoriasConTodos);
      } catch (error) {
        console.error('Error cargando categorías:', error.message);
      }
    };

    fetchCategorias();
  }, []);

  // Map de iconos por nombre
  const iconMap = {
    Todos: 'grid',
    Música: 'music',
    Teatro: 'mask',
    Danza: 'walk',
    Arte: 'paint',
    Cine: 'movie',
    Literatura: 'book',
  };

  return (
    <div className="category-list">
      {categorias.map((cat, index) => {
        const icon = iconMap[cat.name] || 'folder';
        return (
          <div key={index} onClick={() => onCategoriaSeleccionada(cat.name)}>
            <div className="category-item icono"><i className={`bx bx-${icon}`}></i></div>
            <p className='category-Text'>{cat.name}</p>
          </div>
        );
      })}
    </div>
  );
}

