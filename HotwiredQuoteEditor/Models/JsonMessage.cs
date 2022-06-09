namespace HotwiredQuoteEditor.Models {

  public class JsonMessage {
    public bool IsSuccess { get; set; }
    public string MessageTitle { get; set; }
    public string Message { get; set; }

    public static JsonMessage GetSuccessMessage(string message) {
      return new JsonMessage { IsSuccess = true, MessageTitle = "Successful operation", Message = message };
    }
  }

}
