using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using WebApi.Data;
using WebApi.DTOs;
using WebApi.Utilities;

namespace WebApi.Controllers;

[ApiController]
[Route("Pokemon")]
public class PokemonController : ControllerBase
{
    private readonly AppDbContext _context;

    public PokemonController(AppDbContext context)
    {
        _context = context;
    }

    // 1. ADD - Recibe directamente el DTO plano
    [HttpPost("add")]
    public IActionResult Agregar([FromBody] PokemonDTO data)
    {
        if (data == null) return BadRequest();

        StringBuilder sb = new StringBuilder();
        sb.Append("INSERT INTO TA_POKEMON (NOMBRE, TIPO, NIVEL, FECHA_CAPTURA) ");
        sb.Append("VALUES ({0}, {1}, {2}, {3})");

        DateTime dateTime = DateTime.Now;

        int num = _context.Database.ExecuteSqlRaw(sb.ToString(), data.Nombre, data.Tipo, data.Nivel, dateTime);

        if (num != 1) return BadRequest();

        StringBuilder sbSelect = new StringBuilder();
        sbSelect.Append("SELECT * FROM TA_POKEMON WHERE NOMBRE = {0} AND FECHA_CAPTURA = {1}");
        
        TA_POKEMON? newPokemon = _context.TA_POKEMON
            .FromSqlRaw(sbSelect.ToString(), data.Nombre, dateTime)
            .AsNoTracking()
            .FirstOrDefault();
        
        return Ok(new { data = newPokemon });
    }

    // 2. GET LIST - Recibe el RequestListDTO con Paginación y Filtros
    [HttpPost("getList")]
    public IActionResult ObtenerLista([FromBody] RequestListDTO<PokemonDTO> req)
    {
        StringBuilder sb = new StringBuilder();
        List<object> parametros = new List<object>();

        sb.Append("SELECT * FROM TA_POKEMON WHERE 1=1");

        // --- LÓGICA DE FILTROS DINÁMICOS ---
        if (req.Filters != null && req.Filters.Count > 0) 
        { 
            foreach (FilterDTO f in req.Filters) 
            { 
                if (SqlUtilities.EsOperadorValido(f.Operador)) 
                { 
                    sb.Append($" AND {f.Campo} {f.Operador} {{{parametros.Count}}}");
    
                    string opMayuscula = f.Operador.ToUpper();
            
                    // Desempaquetar el JsonElement al tipo C# correcto
                    object valorFinal = f.Valor;
            
                    if (f.Valor is System.Text.Json.JsonElement jsonElement)
                    {
                        switch (jsonElement.ValueKind)
                        {
                            case System.Text.Json.JsonValueKind.Number:
                                // Intentamos sacarlo como int, si es decimal, como double
                                valorFinal = jsonElement.TryGetInt32(out int intVal) ? intVal : jsonElement.GetDouble();
                                break;
                            case System.Text.Json.JsonValueKind.True:
                            case System.Text.Json.JsonValueKind.False:
                                valorFinal = jsonElement.GetBoolean();
                                break;
                            default:
                                // Todo lo demás (textos, etc.) lo sacamos como string
                                valorFinal = jsonElement.GetString() ?? string.Empty;
                                break;
                        }
                    }

                    // Asignamos el valor procesado a los parámetros de EF Core
                    if (opMayuscula == "LIKE") 
                    {
                        parametros.Add($"%{valorFinal}%"); 
                    }
                    else 
                    {
                        parametros.Add(valorFinal); 
                    }
                } 
            } 
        }

        // --- LÓGICA DE PAGINACIÓN ---
        int limite = (req.Pagination?.Cantidad ?? 0) <= 0 ? 100 : req.Pagination.Cantidad;
        int offset = req.Pagination.ObtenerOffset();

        sb.Append($" LIMIT {{{parametros.Count}}} OFFSET {{{parametros.Count + 1}}}");
        parametros.Add(limite);
        parametros.Add(offset);

        // --- EJECUCIÓN ---
        List<TA_POKEMON> lista = _context.TA_POKEMON
            .FromSqlRaw(sb.ToString(), parametros.ToArray())
            .AsNoTracking()
            .ToList();

        return Ok(new { 
            data = lista, 
            pagination = req.Pagination ?? new PaginationDTO() 
        });
    }

    // 3. GET SINGLE - Parámetro {id} explícito en la ruta
    [HttpGet("getSingle")]
    public IActionResult ObtenerUno(int id)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("SELECT * FROM TA_POKEMON WHERE ID = {0}");

        TA_POKEMON? p = _context.TA_POKEMON
            .FromSqlRaw(sb.ToString(), id)
            .AsNoTracking()
            .FirstOrDefault();

        return p == null ? NotFound() : Ok(p);
    }

    // 4. STATUS (RAW) - Parámetro {id} explícito en la ruta
    [HttpGet("status")]
    public IActionResult ObtenerStatus(int id)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("SELECT * FROM TA_POKEMON WHERE ID = {0}");

        TA_POKEMON? p = _context.TA_POKEMON
            .FromSqlRaw(sb.ToString(), id)
            .AsNoTracking()
            .FirstOrDefault();

        if (p == null) return NotFound();

        return Ok(new PokemonRAW {
            Id = p.ID,
            Nombre = p.NOMBRE.ToUpper(),
            Nivel = p.NIVEL,
            PoderTotal = p.NIVEL * 15,
            EsLegendario = p.NIVEL > 90
        });
    }

    // 5. UPDATE - Recibe directamente el DTO plano
    [HttpPut("update")]
    public IActionResult Actualizar([FromBody] PokemonDTO data)
    {
        if (data.Id == null) return BadRequest("El ID es obligatorio para actualizar.");

        StringBuilder sb = new StringBuilder();
        sb.Append("UPDATE TA_POKEMON ");
        sb.Append("SET NOMBRE = {0}, TIPO = {1}, NIVEL = {2} ");
        sb.Append("WHERE ID = {3}");

        _context.Database.ExecuteSqlRaw(sb.ToString(), 
            data.Nombre, data.Tipo, data.Nivel, data.Id);
        
        StringBuilder sbSelect = new StringBuilder();
        sbSelect.Append("SELECT * FROM TA_POKEMON WHERE ID = {0}");
        
        TA_POKEMON? newPokemon = _context.TA_POKEMON
            .FromSqlRaw(sbSelect.ToString(), data.Id)
            .AsNoTracking()
            .FirstOrDefault();
        
        return Ok(new { data = newPokemon });
    }

    // 6. DELETE - Parámetro {id} explícito en la ruta
    [HttpDelete("delete")]
    public IActionResult Borrar(int id)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("DELETE FROM TA_POKEMON WHERE ID = {0}");

        _context.Database.ExecuteSqlRaw(sb.ToString(), id);

        return Ok(new { eliminado = id });
    }
}