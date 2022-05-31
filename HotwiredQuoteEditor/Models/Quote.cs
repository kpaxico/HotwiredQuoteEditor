using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace HotwiredQuoteEditor.Models {

  public class Quote : IEntity {

    private static Random _Random = new Random(100);
    [Key]
    public int Id { get; private set; }
    [Required]
    [Display(Name = "Name")]
    public string Name { get; set; }
    public List<QuoteDate> Dates { get; set; }
    public decimal TotalPrice {
      get {
        decimal total = 0;
        foreach(var date in Dates) {
          foreach(var item in date.Items) {
            total += item.Quantity * item.Price;
          }
        }

        return total;
      }
    }

    public Quote() {
      Dates = new List<QuoteDate>();
    }

    public static Quote GetNew(string name, int? id = null) {
      var entity = new Quote { Id = id.HasValue ? id.Value : _Random.Next() };
      entity.Name = name;

      return entity;
    }

  }

  public class QuoteDate {
    [Key]
    [Required]
    public DateTime? Date { get; set; }
    public BindingList<QuoteItem> Items { get; set; }

    public QuoteDate() {
      Items = new BindingList<QuoteItem>();
      Items.AddingNew += Items_AddingNew;
    }

    private void Items_AddingNew(object sender, AddingNewEventArgs e) {
      var newItem = (QuoteItem)e.NewObject;
      if(newItem == null || newItem.Id == 0) {
        throw new Exception("New item can not be null or have an Id of zero.");
      }
    }
  }

  public class QuoteItem {
    private static Random _Random = new Random(200);

    [Key]
    public int Id { get; private set; }
    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    [Required]
    [Range(1, 1000000)]
    public int Quantity { get; set; }
    [Required]
    [DataType(DataType.Currency)]
    public decimal Price { get; set; }

    public static QuoteItem GetNew(string name, string description, int quantity, decimal price) {
      var item = new QuoteItem();
      item.Id = _Random.Next();
      item.Name = name;
      item.Description = description;
      item.Quantity = quantity;
      item.Price = price;

      return item;
    }
  }
}
