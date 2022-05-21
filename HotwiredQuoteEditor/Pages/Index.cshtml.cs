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

    public PartialViewResult OnGetAddNote(int id) {
      var note = new Note { Id = 0, Name = String.Empty };
      return Partial("_NoteAddEdit", note);
    }

    public PartialViewResult OnGetEditNote(int id) {
      var note = Notes.Instance.Where(i => i.Id == id).FirstOrDefault();
      return Partial("_NoteAddEdit", note);
    }

    public PartialViewResult OnPostSaveNote(int id, string name) {
      if(id == 0) {
        var note = new Note { Id = Notes.Instance.Count + 1, Name = name };
        Notes.Instance.Add(note);

        Response.ContentType = "text/vnd.turbo-stream.html";
        return Partial("_NoteAdd", note);
      } else {
        var note = Notes.Instance.Where(i => i.Id == id).FirstOrDefault();
        note.Name = name;

        Response.ContentType = "text/vnd.turbo-stream.html";
        return Partial("_NoteEdit", note);
      }
    }

    public PartialViewResult OnPostDeleteNote(int id) {
      var note = Notes.Instance.Where(i => i.Id == id).FirstOrDefault();
      Notes.Instance.Remove(note);

      Response.ContentType = "text/vnd.turbo-stream.html";
      return Partial("_NoteDelete", note);
    }
  }

  public class Note {
    public int Id { get; set; }
    public string Name { get; set; }
  }

  public class Notes : List<Note> {
    private Notes() { }
    private static Notes _Instance = null;
    public static Notes Instance {
      get {
        if(_Instance == null) {
          _Instance = new Notes();

          for(var i = 0; i < 2; i++) {
            _Instance.Add(new Note { Id = i + 1, Name = $"Note {i + 1}" });
          }
        }
        return _Instance;
      }
    }
  }
}
