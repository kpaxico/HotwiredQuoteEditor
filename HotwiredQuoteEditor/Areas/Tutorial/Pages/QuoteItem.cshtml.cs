using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;
using HotwiredQuoteEditor.Utils;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuoteItemModel : TutorialPageModel {

    [BindProperty(SupportsGet = true)]
    public string Handler { get; set; }
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }

    [BindProperty]
    public QuoteItem SelectedQuoteItem { get; set; }

    public QuoteItemModel(ILogger<TutorialPageModel> logger, IQuoteRepository repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public void OnGetView(int id, DateTime date, int itemId) {
      _Logger.LogInformation($"OnGetView, id = {id}, date = {date}, date = {itemId}");
      var selectedQuote = _Repository.Get(id);
      var selectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = selectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();
    }

    public void OnGetAdd(int id, DateTime date) {
      _Logger.LogInformation($"OnGetAdd, id = {id}");

      var selectedQuote = _Repository.Get(id);
      var selectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = new QuoteItem(selectedQuoteDate);
    }

    public void OnGetEdit(int id, DateTime date, int itemId) {
      _Logger.LogInformation($"OnGetEditDate, id = {id}, date = {date}");

      var selectedQuote = _Repository.Get(id);
      var selectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = selectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();
    }

    public async Task<IActionResult> OnPostAdd(int id, DateTime date) {
      _Logger.LogInformation($"OnPostAdd, id = {id}, date = {date}");

      var selectedQuote = _Repository.Get(id);
      var selectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem.Parent = selectedQuoteDate;
      ModelState.ClearValidationState(nameof(SelectedQuoteItem));
      TryValidateModel(SelectedQuoteItem, nameof(SelectedQuoteItem));
      if (ModelState.IsValid) {
        SelectedQuoteItem = new QuoteItem(selectedQuoteDate, SelectedQuoteItem.Name, SelectedQuoteItem.Description, SelectedQuoteItem.Quantity, SelectedQuoteItem.Price);
        selectedQuoteDate.Items.Add(SelectedQuoteItem);

        var message = JsonMessage.GetSuccessMessage("Item is successfully created.");

        if (Request.AcceptsTurboStream()) {
          Message = message;

          var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteItem/_Add", this);

          //await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

          //return new EmptyResult();

          #region Turbo Stream
          Response.ContentType = Consts.ContentTypeTurboStream;
          return Partial("QuoteItem/_Add", this);
          #endregion
        } else {
          TempData.Set<JsonMessage>("Message", message);

          return LocalRedirect($"/Tutorial/QuoteItem/View/{selectedQuote.Id}/{selectedQuoteDate.ToString()}/{SelectedQuoteItem.Id}");
        }

      } else
        return Page();
    }

    public async Task<IActionResult> OnPostEdit(int id, DateTime date, int itemId) {
      _Logger.LogInformation($"OnPostEdit, id = {id}, date = {date}, id = {itemId}");

      var selectedQuote = _Repository.Get(id);
      var selectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
      var selectedQuoteItem = selectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();
      SelectedQuoteItem.Parent = selectedQuoteDate;
      ModelState.ClearValidationState(nameof(SelectedQuoteItem));
      TryValidateModel(SelectedQuoteItem, nameof(SelectedQuoteItem));
      if (ModelState.IsValid) {
        selectedQuoteItem.Name = SelectedQuoteItem.Name;
        selectedQuoteItem.Description = SelectedQuoteItem.Description;
        selectedQuoteItem.Quantity = SelectedQuoteItem.Quantity;
        selectedQuoteItem.Price = SelectedQuoteItem.Price;

        var message = JsonMessage.GetSuccessMessage("Item is successfully edited.");

        if (Request.AcceptsTurboStream()) {
          Message = message;

          var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteItem/_Edit", this);

          //await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

          //return new EmptyResult();

          #region Turbo Stream
          Response.ContentType = Consts.ContentTypeTurboStream;
          return Partial("QuoteItem/_Edit", this);
          #endregion
        } else {
          TempData.Set<JsonMessage>("Message", message);

          return LocalRedirect($"/Tutorial/QuoteItem/View/{selectedQuote.Id}/{selectedQuoteDate.ToString()}/{selectedQuoteItem.Id}");
        }

      } else
        return Page();
    }
  }

}
