using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Localization;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuoteModel : TutorialPageModel {

    public Quote Entity { get; set; }
    public QuoteDate SelectedQuoteDate { get; set; }
    public QuoteItem SelectedQuoteItem { get; set; }
    public DateTime? OldDate { get; set; }
    public DateTime? PrevDate { get; set; }

    public QuoteModel(ILogger<TutorialPageModel> logger, IRepository<Quote> repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public string SelectedDateStr {
      get {
        return SelectedQuoteDate == null || !SelectedQuoteDate.Date.HasValue ? "0" : SelectedQuoteDate.Date.Value.ToString("yyyy-MM-dd");
      }
    }

    public void OnGetEntity(int id) {
      Entity = _Repository.Get(id);
    }

    #region QuoteDate

    public PartialViewResult OnGetAddDate(int id) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = new QuoteDate();

      return Partial("QuoteDate/_AddEdit", this);
    }

    public PartialViewResult OnGetEditDate(int id, DateTime date) {
      Entity = _Repository.Get(id);
      OldDate = date;
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      return Partial("QuoteDate/_AddEdit", this);
    }

    public async Task<IActionResult> OnPostAddDate(int id, QuoteDate selectedQuoteDate) {
      Entity = _Repository.Get(id);
      if(ModelState.IsValid) {
        if(Entity.Dates.Where(i => i.Date == selectedQuoteDate.Date).Any()) {
          ModelState.AddModelError("Date", "Given date already exists.");

          return Partial("QuoteDate/_AddEdit", this);
        } else {
          SelectedQuoteDate = selectedQuoteDate;
          Entity.Dates.Add(SelectedQuoteDate);
          PrevDate = Entity.Dates.Where(i => i.Date.Value < SelectedQuoteDate.Date.Value).Max(i => i.Date);

          Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Date is successfully created." };

          var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteDate/_Add", this);

          await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

          return new EmptyResult();

          #region Turbo Stream
          //Response.ContentType = "text/vnd.turbo-stream.html";
          //return Partial("QuoteDate/_Add", this);
          #endregion
        }
      } else {
        return Partial("QuoteDate/_AddEdit", this);
      }
    }

    public async Task<IActionResult> OnPostEditDate(int id, DateTime oldDate, QuoteDate selectedQuoteDate) {
      Entity = _Repository.Get(id);
      if(oldDate == selectedQuoteDate.Date)
        return Page();

      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == oldDate).FirstOrDefault();
      OldDate = oldDate;
      if(ModelState.IsValid) {
        if(Entity.Dates.Where(i => i.Date == selectedQuoteDate.Date).Any()) {
          ModelState.AddModelError("Date", "Given date already exists.");

          return Partial("QuoteDate/_AddEdit", this);
        } else {
          if(SelectedQuoteDate != null) {
            SelectedQuoteDate.Date = selectedQuoteDate.Date;
            PrevDate = Entity.Dates.Where(i => i.Date.Value < SelectedQuoteDate.Date.Value).Max(i => i.Date);
          }

          Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Date is successfully created." };

          var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteDate/_Edit", this);

          await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

          return new EmptyResult();

          #region Turbo Stream
          //Response.ContentType = "text/vnd.turbo-stream.html";
          //return Partial("QuoteDate/_Edit", this);
          #endregion
        }
      } else {
        return Partial("QuoteDate/_AddEdit", this);
      }
    }

    public async Task<IActionResult> OnPostDeleteDate(int id, DateTime date) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      Entity.Dates.Remove(SelectedQuoteDate);

      Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Record is successfully deleted." };

      var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteDate/_Delete", this);

      await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

      return new EmptyResult();

      #region Turbo Stream
      //Response.ContentType = "text/vnd.turbo-stream.html";
      //return Partial("QuoteDate/_Delete", this);
      #endregion
    }

    #endregion

    #region QuoteItem

    public PartialViewResult OnGetAddItem(int id, DateTime date) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = new QuoteItem();

      return Partial("QuoteItem/_AddEdit", this);
    }

    public PartialViewResult OnGetEditItem(int id, DateTime date, int itemId) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = SelectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();

      return Partial("QuoteItem/_AddEdit", this);
    }

    public async Task<IActionResult> OnPostAddItem(int id, DateTime date, QuoteItem selectedQuoteItem) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = selectedQuoteItem;
      if(ModelState.IsValid) {
        SelectedQuoteItem = QuoteItem.GetNew(selectedQuoteItem.Name, selectedQuoteItem.Description, selectedQuoteItem.Quantity, selectedQuoteItem.Price);
        SelectedQuoteDate.Items.Add(SelectedQuoteItem);

        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Item is successfully added." };

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteItem/_Add", this);

        await _Hub.Clients.All.SendAsync("QuoteItemReceived", renderedViewStr);

        return new EmptyResult();

        #region Turbo Stream
        //Response.ContentType = "text/vnd.turbo-stream.html";
        //return Partial("QuoteItem/_Add", this);
        #endregion
      } else {
        return Partial("QuoteItem/_AddEdit", this);
      }
    }

    public async Task<IActionResult> OnPostEditItem(int id, DateTime date, int itemId, QuoteItem selectedQuoteItem) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = SelectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();
      if(ModelState.IsValid) {
        SelectedQuoteItem.Name = selectedQuoteItem.Name;
        SelectedQuoteItem.Description = selectedQuoteItem.Description;
        SelectedQuoteItem.Quantity = selectedQuoteItem.Quantity;
        SelectedQuoteItem.Price = selectedQuoteItem.Price;

        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Item is successfully edited." };

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteItem/_Edit", this);

        await _Hub.Clients.All.SendAsync("QuoteItemReceived", renderedViewStr);

        return new EmptyResult();

        #region Turbo Stream
        //Response.ContentType = "text/vnd.turbo-stream.html";
        //return Partial("QuoteItem/_Edit", this);
        #endregion
      } else {
        return Partial("QuoteItem/_AddEdit", this);
      }
    }

    public async Task<IActionResult> OnPostDeleteItem(int id, DateTime date, int itemId) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = SelectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();
      SelectedQuoteDate.Items.Remove(SelectedQuoteItem);

      Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Item is successfully deleted." };

      var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteItem/_Delete", this);

      await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

      return new EmptyResult();

      #region Turbo Stream
      //Response.ContentType = "text/vnd.turbo-stream.html";
      //return Partial("QuoteItem/_Delete", this);
      #endregion
    }

    #endregion
  }
}
