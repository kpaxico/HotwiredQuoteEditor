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
      if (TempData["MessageStr"] != null) {
        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successful operation", Message = TempData["MessageStr"].ToString() };
        TempData.Remove("MessageStr");
      }
    }

    public async Task<IActionResult> OnPostDelete(int id) {
      _Logger.LogInformation($"OnPostDelete, id = {id}");
      
      _Repository.Delete(id);

      var messageStr = "Quote is successfully deleted.";

      if (Request.AcceptsTurboStream()) {
        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successful operation", Message = messageStr };
        
        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/Quote/_Delete", this);

        //await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

        //return new EmptyResult();

        #region Turbo Stream
        Response.ContentType = Consts.ContentTypeTurboStream;
        return Partial("Quote/_Delete", this);
        #endregion
      } else {
        MessageStr = messageStr;

        return LocalRedirect("/Tutorial/Quotes");
      }
    }
  }
}
