using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;
using HotwiredQuoteEditor.Utils;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuotesModel : TutorialPageModel {

    [BindProperty(SupportsGet = true)]
    public string Handler { get; set; }
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }

    [BindProperty]
    public Models.Quote SelectedEntity { get; set; }

    public QuotesModel(ILogger<TutorialPageModel> logger, IQuoteRepository repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public void OnGetList() {
    }

    public async Task<IActionResult> OnPostDelete(int id) {
      _Logger.LogInformation($"OnPostDelete, id = {id}");

      _Repository.Delete(id);

      var message = JsonMessage.GetSuccessMessage("Quote is successfully deleted.");

      if (Request.AcceptsTurboStream()) {
        Message = message;

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/Quote/_Delete", this);

        //await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

        //return new EmptyResult();

        #region Turbo Stream
        Response.ContentType = Consts.ContentTypeTurboStream;
        return Partial("Quote/_Delete", this);
        #endregion
      } else {
        TempData.Set<JsonMessage>("Message", message);

        return LocalRedirect("/Tutorial/Quotes");
      }
    }
  }
}
