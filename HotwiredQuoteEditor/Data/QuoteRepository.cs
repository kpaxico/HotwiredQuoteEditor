using System.ComponentModel.DataAnnotations;

using HotwiredQuoteEditor.Models;

namespace HotwiredQuoteEditor.Data {

  public sealed class QuoteRepository: IRepository<Quote> {

    private readonly ILogger<QuoteRepository> _Logger;

    private static List<Quote> _EntityList = new List<Quote>();

    public QuoteRepository(ILogger<QuoteRepository> logger) {
      _Logger = logger;
      _Logger.LogInformation("QuoteRepository constructor");

      _EntityList.Add(Quote.GetNew("Quote 1", 1));
      _EntityList.Add(Quote.GetNew("Quote 2", 2));
      
      var entity = Quote.GetNew("Quote 3", 3);
      entity.Dates.Add(new QuoteDate { Date = new DateTime(2022, 5, 10) });
      entity.Dates.Add(new QuoteDate { Date = new DateTime(2022, 6, 12) });
      
      var entityDate = new QuoteDate { Date = new DateTime(2022, 7, 30) };
      entity.Dates.Add(entityDate);

      entityDate.Items.Add(QuoteItem.GetNew("Item 1", "Item 1 Description", 10, 100));
      entityDate.Items.Add(QuoteItem.GetNew("Item 2", "Item 2 Description", 20, 200));

      _EntityList.Add(entity);
    }

    public List<Quote> GetAll() {
      return _EntityList;
    }

    public Quote Get(int id) {
      return _EntityList.Where(i => i.Id == id).FirstOrDefault();
    }

    public Quote Add(Quote entity) {
      _EntityList.Add(entity);

      return entity;
    }

    public Quote Update(Quote entity) {
      throw new NotImplementedException();
    }

    public Quote Delete(int id) {
      var entity = Get(id);
      if (entity != null)
        _EntityList.Remove(entity);

      return entity;
    }
  }

}
