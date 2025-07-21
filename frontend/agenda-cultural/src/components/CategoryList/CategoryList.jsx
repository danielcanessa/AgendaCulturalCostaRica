import './CategoryList.css';

export default function CategoryList({ onCategoriaSeleccionada }) {
  const categorias = ['Todos','Música', 'Teatro', 'Danza', 'Arte', 'Cine', 'Literatura'];
  const iconos =['grid','music','mask','walk','paint','movie','book']

  
  return (
    <div className="category-list">
      {categorias.map((cat, index) => (
         <div key={index} onClick={() => onCategoriaSeleccionada(cat)}>
          <div className="category-item icono"><i className={`bx bx-${iconos[index]}`}></i> </div>

          <p className='category-Text'>{cat}</p>
        </div>
      ))}
    </div>
  );
}
