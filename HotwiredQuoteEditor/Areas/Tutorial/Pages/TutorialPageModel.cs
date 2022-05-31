using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;

using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;
using HotwiredQuoteEditor.Models;

namespace HotwiredQuoteEditor.Pages {

  public class TutorialPageModel: PageModel {

    protected readonly ILogger<TutorialPageModel> _Logger;
    protected readonly IRepository<Quote> _Repository;
    protected readonly IHubContext<AppHub> _Hub;
    protected readonly IRazorPartialToStringRenderer _Renderer;

    [BindProperty]
    public JsonMessage Message { get; set; }

    public TutorialPageModel(ILogger<TutorialPageModel> logger, IRepository<Quote> repository,
      IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer) {
      _Logger = logger;
      _Repository = repository;
      _Hub = hub;
      _Renderer = renderer;
    }

  }
}