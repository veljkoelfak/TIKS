using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[ApiController]
[Route("api/[controller]")]
public class SubjectController : ControllerBase
{
     private readonly ApplicationDbContext _context;

    public SubjectController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSubjects()
    {
        var subjects = await _context.Subjects.ToListAsync();
        return Ok(subjects);
    }

    [HttpGet("{id}", Name = "GetSubject")]
    public async Task<IActionResult> GetSubjectById(int id)
    {
        var subject = await _context.Subjects.FindAsync(id);

        if (subject == null)
        {
            return NotFound();
        }

        return Ok(subject);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSubject([FromBody] Subject sub)
    {
        var existingSub = await _context.Subjects.FindAsync(sub.Id);

        if (sub == null)
        {
            return BadRequest();
        }

        if (existingSub != null) {
            return Conflict();
        }
        
        if (sub.status == "Alive" || sub.status == "Missing" || sub.status == "Dead") {
            _context.Subjects.Add(sub);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("CreateSubject", new { id = sub.Id }, sub);
        }

        else {
            return BadRequest();
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSubject(int id, [FromBody] Subject updatedSub)
    {
        var existingSub = await _context.Subjects.FindAsync(id);

        if (existingSub == null)
        {
            return NotFound();
        }

        if (existingSub.Id == updatedSub.Id) {
            
            if (updatedSub.status == "Alive" || updatedSub.status == "Missing" || updatedSub.status == "Dead") {
            existingSub.firstName = updatedSub.firstName;
            existingSub.lastName = updatedSub.lastName;
            existingSub.age = updatedSub.age;
            existingSub.height = updatedSub.height;
            existingSub.weight = updatedSub.weight;
            existingSub.status = updatedSub.status;

            await _context.SaveChangesAsync();

            return NoContent();
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
    public async Task<IActionResult> DeleteSubjectById(int id)
    {
        var sub = await _context.Subjects.FindAsync(id);

        if (sub == null)
        {
            return NotFound();
        }

        _context.Subjects.Remove(sub);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}