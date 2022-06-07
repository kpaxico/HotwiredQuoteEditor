using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace HotwiredQuoteEditor.Models {

  public class Quote {

    private static Random _Random = new Random(100);

    [Key]
    public int Id { get; private set; }

    [Required]
    [Display(Name = "Name")]
    public string Name { get; set; }

    public BindingList<QuoteDate> Dates { get; set; }

    public decimal TotalPrice {
      get {
        decimal total = 0;
        foreach (var date in Dates) {
          foreach (var item in date.Items) {
            total += item.Quantity * item.Price;
          }
        }

        return total;
      }
    }

    public Quote() {
      Dates = new BindingList<QuoteDate>();
      Dates.AddingNew += Dates_AddingNew;
    }

    public Quote(string name, int? id = null) : this() {
      Id = id.HasValue ? id.Value : _Random.Next();
      Name = name;
    }

    private void Dates_AddingNew(object sender, AddingNewEventArgs e) {
      var newDateObj = (QuoteDate)e.NewObject;

      if (newDateObj == null || !newDateObj.Date.HasValue)
        throw new Exception("New date can not be null or have an Id of zero.");

      if (this != newDateObj.Parent)
        throw new Exception("New date's parent is not this object.");
    }

    public override bool Equals(object obj) {
      var newObj = obj as Quote;
      return newObj != null && this.Id == newObj.Id;
    }

    public override int GetHashCode() {
      return base.GetHashCode();
    }

  }

  public class QuoteDate {
    public Quote Parent { get; set; }
    [Key]
    [Required]
    public DateTime? Date { get; set; }
    public BindingList<QuoteItem> Items { get; set; }

    public QuoteDate() {
      Items = new BindingList<QuoteItem>();
      Items.AddingNew += Items_AddingNew;
    }

    public QuoteDate(Quote parent) : this() {
      Parent = parent;
    }

    public QuoteDate(Quote parent, DateTime date) : this(parent) {
      Date = date;
    }

    private void Items_AddingNew(object sender, AddingNewEventArgs e) {
      var newItem = (QuoteItem)e.NewObject;

      if (newItem == null || newItem.Id == 0)
        throw new Exception("New item can not be null or have an Id of zero.");

      if (this != newItem.Parent)
        throw new Exception("New item's parent is not this object.");
    }

    public override string ToString() {
      return !this.Date.HasValue ? "0" : this.Date.Value.ToString("yyyy-MM-dd");
    }

    public override bool Equals(object obj) {
      var newObj = obj as QuoteDate;
      return newObj != null && this.Date == newObj.Date;
    }

    public override int GetHashCode() {
      return base.GetHashCode();
    }
  }

  public class QuoteItem {
    private static Random _Random = new Random(200);

    public QuoteDate Parent { get; set; }
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

    public QuoteItem() {
      Id = _Random.Next();
    }

    public QuoteItem(QuoteDate parent) : this() {
      Parent = parent;
    }

    public QuoteItem(QuoteDate parent, string name, string description, int quantity, decimal price) : this(parent) {
      Name = name;
      Description = description;
      Quantity = quantity;
      Price = price;
    }

  }
}
