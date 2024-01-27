using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projekat18382.Migrations
{
    /// <inheritdoc />
    public partial class SecondDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Viruses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    type = table.Column<string>(type: "TEXT", nullable: false),
                    family = table.Column<string>(type: "TEXT", nullable: false),
                    desc = table.Column<string>(type: "TEXT", nullable: false),
                    lethality = table.Column<string>(type: "TEXT", nullable: false),
                    genCode = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Viruses", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Viruses");
        }
    }
}
