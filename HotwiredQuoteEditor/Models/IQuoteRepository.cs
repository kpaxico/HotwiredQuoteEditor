namespace HotwiredQuoteEditor.Models {

  public interface IQuoteRepository {
    List<Quote> GetAll();

    Quote Get(int id);
    Quote Add(Quote entity);
    Quote Update(Quote entity);
    Quote Delete(int id);

  }

}
