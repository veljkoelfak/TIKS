using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public DbSet<Subject> Subjects { get; set; }

    public DbSet<Virus> Viruses { get; set; }

    public DbSet<Experiment> Experiments { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
}