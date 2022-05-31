using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;
using HotwiredQuoteEditor.Pages;

namespace HotwiredQuoteEditor.Areas.Tutorial.Pages {

  public class QuotesModel : TutorialPageModel {

    [BindProperty(SupportsGet = true)]
    public string Handler { get; set; }
    [BindProperty(SupportsGet = true)]
    public int Id { get; set; }
    [BindProperty]
    public Quote SelectedEntity { get; set; }

    public QuotesModel(ILogger<TutorialPageModel> logger, IRepository<Quote> repository, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) : base(logger, repository, hub, renderer) {
    }

    public void OnGetList() {
    }

    public PartialViewResult OnGetAdd() {
      SelectedEntity = new Quote();
      return Partial("Quote/_AddEdit", this);
    }

    public IActionResult OnGetEdit(int id) {
      SelectedEntity = _Repository.Get(id);
      //return RedirectToPage("QuoteEdit", new { Id = id });
      return Partial("Quote/_AddEdit", this);
    }

    public async Task<IActionResult> OnPostAdd(Quote selectedEntity) {
      if(ModelState.IsValid) {
        SelectedEntity = Quote.GetNew(selectedEntity.Name);
        Id = SelectedEntity.Id;
        _Repository.Add(SelectedEntity);

        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Record is successfully added." };

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/Quote/_Add", this);

        await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

        return new EmptyResult();

        #region Turbo Stream
        //Response.ContentType = "text/vnd.turbo-stream.html";
        //return Partial("Quote/_Add", this);
        #endregion
      } else {
        return Partial("Quote/_AddEdit", this);
      }
    }

    public async Task<IActionResult> OnPostEdit(int id, Quote selectedEntity) {
      if(ModelState.IsValid) {
        SelectedEntity = _Repository.Get(id);
        if(SelectedEntity != null) {
          SelectedEntity.Name = selectedEntity.Name;
        }

        Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Record is successfully edited." };

        var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/Quote/_Edit", this);

        await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

        return new EmptyResult();

        #region Turbo Stream
        //Response.ContentType = "text/vnd.turbo-stream.html";
        //return Partial("Quote/_Edit", this);
        #endregion
      } else {
        return Partial("Quote/_AddEdit", this);
      }
    }

    public async Task<IActionResult> OnPostDelete(int id) {
      _Repository.Delete(id);

      Message = new JsonMessage { IsSuccess = true, MessageTitle = "Successfull operation", Message = "Record is successfully deleted." };

      var renderedViewStr = await _Renderer.RenderPartialToStringAsync("../Areas/Tutorial/Pages/Quote/_Delete", this);

      await _Hub.Clients.All.SendAsync("QuoteReceived", renderedViewStr);

      return new EmptyResult();

      #region Turbo Stream
      //Response.ContentType = "text/vnd.turbo-stream.html";
      //return Partial("Quote/_Delete", this);
      #endregion
    }
  }
}
