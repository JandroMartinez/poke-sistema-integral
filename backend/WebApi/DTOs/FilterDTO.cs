namespace WebApi.DTOs;

public class FilterDTO
{
    public string? Campo { get; set; } = string.Empty; // Ejemplo: "NIVEL"
    public string? Operador { get; set; } = "=";      // "=", ">", "<", "<>"
    public object? Valor { get; set; } = string.Empty; // El valor a comparar
}