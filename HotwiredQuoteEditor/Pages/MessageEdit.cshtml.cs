using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HotwiredQuoteEditor.Pages {

  public class MessageEditModel : PageModel {

    private readonly ILogger<MessageEditModel> _logger;

    [BindProperty(SupportsGet = true)]
    public string Message { get; set; }

    public MessageEditModel(ILogger<MessageEditModel> logger) {
      _logger = logger;
    }

    public void OnGet() {
    }

    public IActionResult OnPost() {
      return RedirectToPage("Index", new { Message1 = Message });
    }
  }
}