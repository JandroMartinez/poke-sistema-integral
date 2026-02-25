using WebApi.DTOs;

namespace WebApi.Utilities;

public static class SqlUtilities
{
    // Ahora es un método de extensión para la caja genérica RequestDTO<T>
    public static int ObtenerOffset(this PaginationDTO? pag)
    {
        if (pag == null) 
        {
            pag = new PaginationDTO();
        }

        // Validaciones de seguridad: si es 0 o menor, forzamos a 1 y 100
        int pagina = pag.Pagina <= 0 ? 1 : pag.Pagina;
        int cantidad = pag.Cantidad <= 0 ? 100 : pag.Cantidad; // ¡Aquí cambiamos a 100!

        return (pagina - 1) * cantidad;
    }
    
    public static readonly List<string> OperadoresValidos = new() 
    { 
        "=", ">", "<", "<>", "!=", "LIKE", ">=", "<="
    };
    
    public static bool EsOperadorValido(string operador)
    {
        return OperadoresValidos.Contains(operador.ToUpper());
    }
}