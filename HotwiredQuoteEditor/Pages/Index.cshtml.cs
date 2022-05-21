using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HotwiredQuoteEditor.Pages {

  public class IndexModel : PageModel {

    private readonly ILogger<IndexModel> _Logger;

    [BindProperty(SupportsGet = true)]
    public string Message1 { get; set; }
    [BindProperty(SupportsGet = true)]
    public string Message2 { get; set; }
    [BindProperty(SupportsGet = true)]
    public string Message3 { get; set; }

    public IndexModel(ILogger<IndexModel> logger) {
      _Logger = logger;
    }

    public void OnGet() {
      if(String.IsNullOrEmpty(Message1))
        Message1 = "I am in a turbo-frame.";

      if(String.IsNullOrEmpty(Message2))
        Message2 = "I am also in a turbo-frame.";
    }

    public PartialViewResult OnGetEdit() {
      return Partial("_MessageEdit2", this);
    }

    public PartialViewResult OnPostEdit() {
      return Partial("_MessageView2", this);
    }

    public PartialViewResult OnGetAdd() {
      return Partial("_MessageEdit3", this);
    }

    public PartialViewResult OnPostAdd() {
      return Partial("_MessageView3", this);
    }

  }

}
