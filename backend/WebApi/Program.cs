using Microsoft.EntityFrameworkCore;
using WebApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. CONFIGURAR CORS: Permite peticiones desde tu frontend en React
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontendReact", policy =>
    {
        policy.AllowAnyOrigin()   // Permite cualquier origen (tu localhost de Vite)
            .AllowAnyMethod()   // Permite los métodos GET, POST, PUT, DELETE
            .AllowAnyHeader();  // Permite el envío de JSON y otras cabeceras
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=pokemon.db"));

var app = builder.Build();

// 2. APLICAR CORS: ¡Muy importante! Debe ir aquí, antes de los controladores
app.UseCors("PermitirFrontendReact");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();