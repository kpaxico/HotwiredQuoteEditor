using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;
using HotwiredQuoteEditor.Utils;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuoteModel : TutorialPageModel {

    [BindProperty(SupportsGet = true)]
    public string Handler { get; set; }

    [BindProperty]
    public Models.Quote SelectedEntity { get; set; }

    public QuoteModel(ILogger<TutorialPageModel> logger, IQuoteRepository repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public void OnGetView(int id) {
      _Logger.LogInformation($"OnGetView, id = {id}");
      SelectedEntity = _Repository.Get(id);

      if (TempData["MessageStr"] != null) {
        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successful operation", Message = TempData["MessageStr"].ToString() };
        TempData.Remove("MessageStr");
      }
    }

    public void OnGetAdd(int id) {
      _Logger.LogInformation($"OnGetAdd, id = {id}");
      SelectedEntity = new Models.Quote();
    }

    public void OnGetEdit(int id) {
      _Logger.LogInformation($"OnGetEdit, id = {id}");
      SelectedEntity = _Repository.Get(id);
    }

    public async Task<IActionResult> OnPostAdd(int id) {
      _Logger.LogInformation($"OnPostAdd, id = {id}, {SelectedEntity.Name}");

      if (ModelState.IsValid) {
        var entity = new Models.Quote(SelectedEntity.Name);
        _Repository.Add(entity);
        SelectedEntity = entity;

        var messageStr = "Quote is successfully added.";

        if (Request.AcceptsTurboStream()) {
          Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successful operation", Message = messageStr };

          string partialViewName = "_Add";
          var renderedViewStr = await _Renderer.RenderPartialToStringAsync($"../Areas/Tutorial/Pages/Quote/{partialViewName}", this);

          //await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

          //return new EmptyResult();

          #region Turbo Stream
          Response.ContentType = Consts.ContentTypeTurboStream;
          return Partial($"Quote/{partialViewName}", this);
          #endregion
        } else {
          MessageStr = messageStr;

          return LocalRedirect($"/Tutorial/Quote/View/{entity.Id}");
        }
      } else {
        return Page();
      }
    }

    public async Task<IActionResult> OnPostEdit(int id) {
      _Logger.LogInformation($"OnPostEdit, id = {id}, {SelectedEntity.Name}");

      if (ModelState.IsValid) {
        var entity = _Repository.Get(id);
        if (entity != null) {
          entity.Name = SelectedEntity.Name;
        }
        SelectedEntity = entity;

        var messageStr = "Quote is successfully edited.";

        if (Request.AcceptsTurboStream()) {
          Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successful operation", Message = messageStr };

          string partialViewName = "_Edit";
          var renderedViewStr = await _Renderer.RenderPartialToStringAsync($"../Areas/Tutorial/Pages/Quote/{partialViewName}", this);

          //await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

          //return new EmptyResult();

          #region Turbo Stream
          Response.ContentType = Consts.ContentTypeTurboStream;
          return Partial($"Quote/{partialViewName}", this);
          #endregion
        } else {
          MessageStr = messageStr;

          return LocalRedirect($"/Tutorial/Quote/View/{entity.Id}");
        }
      } else {
        return Page();
      }
    }

  }
}
