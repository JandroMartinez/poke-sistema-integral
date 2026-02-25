using Microsoft.EntityFrameworkCore;

namespace WebApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    // El DbSet también lo llamamos igual para ser consistentes
    public DbSet<TA_POKEMON> TA_POKEMON { get; set; }
}