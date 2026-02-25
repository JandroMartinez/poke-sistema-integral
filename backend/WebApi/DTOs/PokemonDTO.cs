namespace WebApi.DTOs;

public class PokemonDTO : BasicDTO
{
    public string Nombre { get; set; } = string.Empty;
    public string? Tipo { get; set; }
    public int? Nivel { get; set; }
    public DateTime FechaCaptura { get; set; } = DateTime.Now;
}