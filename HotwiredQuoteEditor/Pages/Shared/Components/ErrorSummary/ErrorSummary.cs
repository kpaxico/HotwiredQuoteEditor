using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace HotwiredQuoteEditor.ViewComponents {

  public class ErrorSummary: ViewComponent {

    public ErrorSummary() {
    }

    public IViewComponentResult Invoke(PageModel model) {
      return View("Default", model);
    }
  }
}