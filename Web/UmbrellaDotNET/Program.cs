using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlite("Data Source=subjects.db");
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
        c.RoutePrefix = string.Empty; // Serve the Swagger UI at the root URL
    });
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors();

app.UseAuthorization();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    endpoints.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

    endpoints.MapControllerRoute(
        name: "GetSubjects",
        pattern: "api/Subject",
        defaults: new { controller = "Subject", action = "GetSubjects" });

    endpoints.MapControllerRoute(
        name: "GetSubjectById",
        pattern: "api/Subject/{id}",
        defaults: new { controller = "Subject", action = "GetSubjectById" });

    endpoints.MapControllerRoute(
        name: "CreateSubject",
        pattern: "api/Subject",
        defaults: new { controller = "Subject", action = "CreateSubject" });

    endpoints.MapControllerRoute(
        name: "UpdateSubject",
        pattern: "api/Subject/{id}",
        defaults: new { controller = "Subject", action = "UpdateSubject" });

    endpoints.MapControllerRoute(
        name: "DeleteSubjectById",
        pattern: "api/Subject/{id}",
        defaults: new { controller = "Subject", action = "DeleteSubjectById" });

    endpoints.MapControllerRoute(
    name: "GetViruses",
    pattern: "api/Virus",
    defaults: new { controller = "Virus", action = "Get" });

    endpoints.MapControllerRoute(
        name: "GetVirusById",
        pattern: "api/Virus/{id}",
        defaults: new { controller = "Virus", action = "GetVirusById" });

    endpoints.MapControllerRoute(
        name: "CreateVirus",
        pattern: "api/Virus",
        defaults: new { controller = "Virus", action = "CrateVirus" });

    endpoints.MapControllerRoute(
        name: "UpdateVirus",
        pattern: "api/Virus/{id}",
        defaults: new { controller = "Virus", action = "UpdateVirus" });

    endpoints.MapControllerRoute(
        name: "DeleteVirusById",
        pattern: "api/Virus/{id}",
        defaults: new { controller = "Virus", action = "DelteVirusById" });

    endpoints.MapControllerRoute(
    name: "GetExperiments",
    pattern: "api/experiment",
    defaults: new { controller = "Experiment", action = "Get" });

    endpoints.MapControllerRoute(
        name: "GetExperimentById",
        pattern: "api/experiment/{id}",
        defaults: new { controller = "Experiment", action = "GetExperimentById" });

    endpoints.MapControllerRoute(
        name: "CreateExperiment",
        pattern: "api/experiment",
        defaults: new { controller = "Experiment", action = "CreateExperiment" });

    endpoints.MapControllerRoute(
        name: "UpdateExperiment",
        pattern: "api/experiment/{id}",
        defaults: new { controller = "Experiment", action = "UpdateExperiment" });

    endpoints.MapControllerRoute(
        name: "DeleteExperiment",
        pattern: "api/experiment/{id}",
        defaults: new { controller = "Experiment", action = "DeleteExperimentById" });

});

app.Run();