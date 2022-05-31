namespace HotwiredQuoteEditor.Models {

  public interface IRepository<T> where T : class, IEntity {
    List<T> GetAll();
    T Get(int id);
    T Add(T entity);
    T Update(T entity);
    T Delete(int id);
  }

}
