using HotwiredQuoteEditor.Hubs;
using HotwiredQuoteEditor.Services;

var builder = WebApplication.CreateBuilder(args);

// Register RazorPartialToStringRenderer service for DI
builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IRazorPartialToStringRenderer, RazorPartialToStringRenderer>();

// Add SignalR for DI
builder.Services.AddSignalR();

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if(!app.Environment.IsDevelopment()) {
  app.UseExceptionHandler("/Error");
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

// Configure SignalR endpoints
app.MapHub<AppHub>("/appHub");

app.Run();
