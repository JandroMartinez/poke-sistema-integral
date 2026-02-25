namespace WebApi.DTOs;

public class PokemonRAW : BasicDTO
{
    public string? Nombre { get; set; } = string.Empty;
    public int? Nivel { get; set; }
    
    // Campos extra (Lógica o Joins)
    public string? NombreEntrenador{ get; set; } = "Sin asignar";
    public int? PoderTotal { get; set; }
    public bool? EsLegendario { get; set; }
}