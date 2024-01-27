using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[ApiController]
[Route("api/[controller]")]
public class VirusController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VirusController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var viruses = await _context.Viruses.ToListAsync();
        return Ok(viruses);
    }

    [HttpGet("{id}", Name = "GetVirus")]
    public async Task<IActionResult> GetVirusById(int id)
    {
        var viruses = await _context.Viruses.FindAsync(id);

        if (viruses == null)
        {
            return NotFound();
        }

        return Ok(viruses);
    }

    [HttpPost]
    public async Task<IActionResult> CrateVirus([FromBody] Virus vir)
    {

        var existingVirus = await _context.Viruses.FindAsync(vir.Id);

        if (vir == null)
        {
            return BadRequest();
        }

        if (existingVirus != null) {
            return Conflict();
        }

        if (vir.lethality == "Low" || vir.lethality == "Medium" || vir.lethality == "High") {

            _context.Viruses.Add(vir);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("CreateSubject", new { id = vir.Id }, vir);
        }

        else {
            return BadRequest();
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVirus(int id, [FromBody] Virus updatedVir)
    {
        var existingVirus = await _context.Viruses.FindAsync(id);

        

        if (existingVirus == null)
        {
            return NotFound();
        }

        if (existingVirus.Id == updatedVir.Id) {


            if (updatedVir.lethality == "Low" || updatedVir.lethality == "Medium" || updatedVir.lethality == "High") {

                if (updatedVir.genCode - existingVirus.genCode > 13) {
                    existingVirus.name = updatedVir.name;
                    existingVirus.type = updatedVir.type;
                    existingVirus.family = updatedVir.family;
                    existingVirus.desc = updatedVir.desc;
                    existingVirus.lethality = updatedVir.lethality;
                    existingVirus.genCode = updatedVir.genCode;

                    await _context.SaveChangesAsync();

                return NoContent();
                }

                else {
                    return StatusCode(StatusCodes.Status304NotModified);
                }
            }

            else {
                return BadRequest();
            }
        }

        else {
            return Conflict();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DelteVirusById(int id)
    {
        var vir = await _context.Viruses.FindAsync(id);

        if (vir == null)
        {
            return NotFound();
        }

        _context.Viruses.Remove(vir);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}