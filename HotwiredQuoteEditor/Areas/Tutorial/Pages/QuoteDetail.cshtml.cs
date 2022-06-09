using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Localization;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;
using HotwiredQuoteEditor.Utils;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuoteDetailModel : TutorialPageModel {

    public Models.Quote Entity { get; set; }
    public QuoteDate SelectedQuoteDate { get; set; }
    public QuoteItem SelectedQuoteItem { get; set; }
    public DateTime? OldDate { get; set; }
    public DateTime? PrevDate { get; set; }

    public QuoteDetailModel(ILogger<TutorialPageModel> logger, IQuoteRepository repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public string SelectedDateStr {
      get {
        return SelectedQuoteDate == null || !SelectedQuoteDate.Date.HasValue ? "0" : SelectedQuoteDate.Date.Value.ToString("yyyy-MM-dd");
      }
    }

    public void OnGetEntity(int id) {
      _Logger.LogInformation($"OnGetEntity, id = {id}");
      Entity = _Repository.Get(id);
    }

    #region QuoteDate

    public async Task<IActionResult> OnPostDeleteDate(int id, DateTime date) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      Entity.Dates.Remove(SelectedQuoteDate);

      var message = JsonMessage.GetSuccessMessage("Date is successfully deleted.");

      if (Request.AcceptsTurboStream()) {
        Message = message;

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteDate/_Delete", this);

        //await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

        //return new EmptyResult();

        #region Turbo Stream
        Response.ContentType = Consts.ContentTypeTurboStream;
        return Partial("QuoteDate/_Delete", this);
        #endregion
      } else {
        TempData.Set<JsonMessage>("Message", message);

        return LocalRedirect($"/Tutorial/QuoteDetail/Entity/{id}");
      }
    }

    #endregion

    #region QuoteItem

    public async Task<IActionResult> OnPostDeleteItem(int id, DateTime date, int itemId) {
      Entity = _Repository.Get(id);
      SelectedQuoteDate = Entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      SelectedQuoteItem = SelectedQuoteDate.Items.Where(i => i.Id == itemId).FirstOrDefault();
      SelectedQuoteDate.Items.Remove(SelectedQuoteItem);

      var message = JsonMessage.GetSuccessMessage("Item is successfully deleted.");

      if (Request.AcceptsTurboStream()) {
        Message = message;

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteItem/_Delete", this);

        //await _Hub.Clients.All.SendAsync("QuoteItemReceived", renderedViewStr);

        //return new EmptyResult();

        #region Turbo Stream
        Response.ContentType = "text/vnd.turbo-stream.html";
        return Partial("QuoteItem/_Delete", this);
        #endregion
      } else {
        TempData.Set<JsonMessage>("Message", message);

        return LocalRedirect($"/Tutorial/QuoteDetail/Entity/{id}");
      }
    }

    #endregion
  }
}
