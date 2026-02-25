using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data;

public class TA_POKEMON 
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID { get; set; } 
    
    public string NOMBRE { get; set; } = string.Empty;
    public string TIPO { get; set; } = string.Empty;
    public int NIVEL { get; set; }
    public DateTime FECHA_CAPTURA { get; set; } = DateTime.Now;
}