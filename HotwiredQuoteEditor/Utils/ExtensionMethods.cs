using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Primitives;

using System.Text.Json;

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

    public static void Set<T>(this ITempDataDictionary tempData, string key, T value) where T : class {
      tempData[key] = JsonSerializer.Serialize(value);
    }

    public static T Get<T>(this ITempDataDictionary tempData, string key, bool retain = false) where T : class {
      tempData.TryGetValue(key, out object o);
      if (!retain)
        tempData.Remove(key);
      return o == null ? null : JsonSerializer.Deserialize<T>((string)o);
    }

  }

}
