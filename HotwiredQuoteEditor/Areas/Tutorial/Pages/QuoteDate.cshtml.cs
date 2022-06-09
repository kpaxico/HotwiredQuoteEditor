using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;
using HotwiredQuoteEditor.Utils;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuoteDateModel : TutorialPageModel {

    [BindProperty(SupportsGet = true)]
    public string Handler { get; set; }
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }

    [BindProperty]
    public QuoteDate SelectedQuoteDate { get; set; }
    public DateTime? PrevDate { get; set; }

    public QuoteDateModel(ILogger<TutorialPageModel> logger, IQuoteRepository repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public void OnGetView(int id, DateTime date) {
      _Logger.LogInformation($"OnGetView, id = {id}, date = {date}");
      var selectedQuote = _Repository.Get(id);
      SelectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
    }

    public void OnGetAdd(int id) {
      _Logger.LogInformation($"OnGetAdd, id = {id}");

      var selectedQuote = _Repository.Get(id);
      SelectedQuoteDate = new QuoteDate(selectedQuote);
    }

    public void OnGetEdit(int id, DateTime date) {
      _Logger.LogInformation($"OnGetEditDate, id = {id}, date = {date}");

      var selectedQuote = _Repository.Get(id);
      SelectedQuoteDate = selectedQuote.Dates.Where(i => i.Date == date).FirstOrDefault();
    }

    public async Task<IActionResult> OnPostAdd(int id) {
      var entity = _Repository.Get(id);
      if (ModelState.IsValid) {
        if (entity.Dates.Where(i => i.Date == SelectedQuoteDate.Date).Any()) {
          ModelState.AddModelError("Date", "Given date already exists.");

          return Page();
        } else {
          SelectedQuoteDate.Parent = entity;
          entity.Dates.Add(SelectedQuoteDate);
          PrevDate = entity.Dates.Where(i => i.Date.Value < SelectedQuoteDate.Date.Value).Max(i => i.Date);

          var message = JsonMessage.GetSuccessMessage("Date is successfully created.");

          if (Request.AcceptsTurboStream()) {
            Message = message;

            var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteDate/_Add", this);

            //await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

            //return new EmptyResult();

            #region Turbo Stream
            Response.ContentType = Consts.ContentTypeTurboStream;
            return Partial("QuoteDate/_Add", this);
            #endregion
          } else {
            TempData.Set<JsonMessage>("Message", message);

            return LocalRedirect($"/Tutorial/QuoteDate/View/{entity.Id}/{SelectedQuoteDate.ToString()}");
          }
        }
      } else
        return Page();
    }

    public async Task<IActionResult> OnPostEdit(int id, DateTime date) {
      if (date == SelectedQuoteDate.Date)
        return Page();

      var entity = _Repository.Get(id);
      var entityDate = entity.Dates.Where(i => i.Date == date).FirstOrDefault();
      if (ModelState.IsValid) {
        if (entity.Dates.Where(i => i.Date == SelectedQuoteDate.Date).Any()) {
          ModelState.AddModelError("Date", "Given date already exists.");

          return Page();
        } else {
          if (SelectedQuoteDate != null) {
            entityDate.Date = SelectedQuoteDate.Date;
            PrevDate = entity.Dates.Where(i => i.Date.Value < SelectedQuoteDate.Date.Value).Max(i => i.Date);
          }

          var message = JsonMessage.GetSuccessMessage("Date is successfully edited.");

          if (Request.AcceptsTurboStream()) {
            Message = message;

            var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/QuoteDate/_Edit", this);

            //await _Hub.Clients.All.SendAsync("QuoteDateReceived", renderedViewStr);

            //return new EmptyResult();

            #region Turbo Stream
            Response.ContentType = Consts.ContentTypeTurboStream;
            return Partial("QuoteDate/_Edit", this);
            #endregion
          } else {
            TempData.Set<JsonMessage>("Message", message);

            return LocalRedirect($"/Tutorial/QuoteDate/View/{entity.Id}/{SelectedQuoteDate.ToString()}");
          }
        }
      } else
        return Page();
    }
  }

}
