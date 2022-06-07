using Microsoft.Extensions.Primitives;

namespace HotwiredQuoteEditor.Utils {
  
  public static class ExtensionMethods {

    public static bool AcceptsTurboStream(this HttpRequest request) {
      request.Headers.TryGetValue("turbo-frame", out StringValues headerValue);
      return request.Headers.Accept.SelectMany(i => i.Split(",")).Select(i => i.Trim()).Contains(Consts.ContentTypeTurboStream);
    }

    public static bool TargetsATurboFrame(this HttpRequest request) {
      request.Headers.TryGetValue("turbo-frame", out StringValues headerValue);
      return headerValue.FirstOrDefault() != null;
    }
  }

}
