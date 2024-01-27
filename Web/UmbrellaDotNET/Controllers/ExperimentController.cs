using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[ApiController]
[Route("api/[controller]")]
public class ExperimentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExperimentController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var exps = await _context.Experiments.ToListAsync();
        return Ok(exps);
    }

    [HttpGet("{id}", Name = "GetExperiment")]
    public async Task<IActionResult> GetExperimentById(int id)
    {
        var exps = await _context.Experiments.FindAsync(id);

        if (exps == null)
        {
            return NotFound();
        }

        return Ok(exps);
    }

    [HttpGet("virus/{id}", Name = "GetExperimentVirus")]
    public async Task<IActionResult> GetExperimentVirus(int id)
    {
        var exps = await _context.Experiments.FindAsync(id);

        if (exps == null)
        {
            return NotFound();
        }

        var vir = await _context.Viruses.FindAsync(exps.virusId);

        return Ok(vir.name);
    }

    [HttpGet("subject/{id}", Name = "GetExperimentSubject")]
    public async Task<IActionResult> GetExperimentSubject(int id)
    {
        var exps = await _context.Experiments.FindAsync(id);

        if (exps == null)
        {
            return NotFound();
        }

        var sub = await _context.Subjects.FindAsync(exps.subjectId);

        return Ok(new { firstName = sub.firstName, lastName = sub.lastName});
    }



    [HttpPost]
    public async Task<IActionResult> CreateExperiment([FromBody] Experiment exp)
    {
        var existingExp = await _context.Experiments.FindAsync(exp.Id);

        if (exp == null)
        {
            return BadRequest();
        }

        var sub =  await _context.Subjects.FindAsync(exp.subjectId);

        var vir = await _context.Viruses.FindAsync(exp.virusId);

        if (existingExp != null) {
            return Conflict();
        }

        if (vir != null)
        {
            if (sub != null) {

                _context.Experiments.Add(exp);
                await _context.SaveChangesAsync();

                return CreatedAtRoute("CreateSubject", new { id = exp.Id }, exp);
            }
            
            else 
            {
                return Unauthorized();
            }
        }
        else
        {
            return UnprocessableEntity();
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExperiment(int id, [FromBody] Experiment updatedExp)
    {
        var existingExp = await _context.Experiments.FindAsync(id);
        

        if (existingExp == null)
        {
            return NotFound();
        }

        if (existingExp.Id == updatedExp.Id) {

            var sub = await _context.Subjects.FindAsync(updatedExp.subjectId);

            var vir = await _context.Viruses.FindAsync(updatedExp.virusId);

            if (vir != null) {

                if (sub != null) {

                existingExp.subjectId = updatedExp.subjectId;
                existingExp.virusId = updatedExp.virusId;
                existingExp.desc = updatedExp.desc;
                existingExp.outcome = updatedExp.outcome;
                existingExp.notes = updatedExp.notes;

                await _context.SaveChangesAsync();

                return NoContent();
                }

                else {
                    return Unauthorized();
                }
            }
            else {
                return UnprocessableEntity();
            }
        }
        else {
            return Conflict();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExperimentById(int id)
    {
        var exp = await _context.Experiments.FindAsync(id);

        if (exp == null)
        {
            return NotFound();
        }

        _context.Experiments.Remove(exp);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}