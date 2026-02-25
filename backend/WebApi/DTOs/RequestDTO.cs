namespace WebApi.DTOs;

public class RequestDataDTO<T>
{
    public T? data { get; set; }
}

// NIVEL 2: El contenedor completo (Específico para getList)
public class RequestListDTO<T>
{
    public PaginationDTO? Pagination { get; set; }
    public List<FilterDTO>? Filters { get; set; } = new List<FilterDTO>();
}