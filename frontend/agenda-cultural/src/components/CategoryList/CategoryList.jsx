import './CategoryList.css';

export default function CategoryList() {
  const categorias = ['Música', 'Teatro', 'Danza', 'Arte', 'Cine', 'Literatura'];
  const iconos =['music','mask','walk','paint','movie','book']
  return (
    <div className="category-list">
      {categorias.map((cat, index) => (
        <div className="" key={index}>
          <div className="category-item icono"><i className={`bx bx-${iconos[index]}`}></i> </div>

          <p className='category-Text'>{cat}</p>
        </div>
      ))}
    </div>
  );
}
