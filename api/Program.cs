var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapGet("/", () => "Welcome to the Dental Reservation API!");

app.MapGet("/api/appointments", () => "List of appointments will be here.");
app.MapPost("/api/appointments", () => "Create a new appointment here.");
app.MapPut("/api/appointments/{id}", (int id) => $"Update appointment with ID {id} here.");
app.MapDelete("/api/appointments/{id}", (int id) => $"Delete appointment with ID {id} here.");

app.MapGet("/api/patients", () => "List of patients will be here.");
app.MapPost("/api/patients", () => "Create a new patient here.");
app.MapPut("/api/patients/{id}", (int id) => $"Update patient with ID {id} here.");
app.MapDelete("/api/patients/{id}", (int id) => $"Delete patient with ID {id} here.");

app.MapGet("/api/dentists", () => "List of dentists will be here.");
app.MapPost("/api/dentists", () => "Create a new dentist here.");
app.MapPut("/api/dentists/{id}", (int id) => $"Update dentist with ID {id} here.");
app.MapDelete("/api/dentists/{id}", (int id) => $"Delete dentist with ID {id} here.");

app.MapGet("/api/clinics", () => "List of clinics will be here.");
app.MapPost("/api/clinics", () => "Create a new clinic here.");
app.MapPut("/api/clinics/{id}", (int id) => $"Update clinic with ID {id} here.");
app.MapDelete("/api/clinics/{id}", (int id) => $"Delete clinic with ID {id} here.");

app.MapGet("/api/services", () => "List of services will be here.");
app.MapPost("/api/services", () => "Create a new service here.");
app.MapPut("/api/services/{id}", (int id) => $"Update service with ID {id} here.");
app.MapDelete("/api/services/{id}", (int id) => $"Delete service with ID {id} here.");

app.Run();
