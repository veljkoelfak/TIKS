using Microsoft.VisualStudio.TestPlatform.Common;
using Newtonsoft.Json;
using System.Text;

namespace UmbrellaCorp
{
    public class SubjectTests
    {
        private const string BaseUrl = "http://localhost:5016";

        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            _httpClient = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        }

        [Test]
        public async Task GetAll_1() // Proverava da li postoji nesto u tabeli Subject
        {
            var response = await _httpClient.GetAsync("/api/Subject");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            Assert.IsNotNull(jsonContent, "The returned JSON should not be null.");
        }

        [Test]
        public async Task GetAll_2() // Proverava da li postoji Subject sa odredjenim imenom i prezimenom
        {
            var response = await _httpClient.GetAsync("/api/Subject");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            List<Subject> subs = JsonConvert.DeserializeObject<List<Subject>>(jsonContent);

            string firstName = "Jill";
            string lastName = "Redfield";

            Assert.IsTrue(subs.Any(sub => sub.firstName == firstName && sub.lastName == lastName), "The subject doesn't exist");
        }

        [Test]
        public async Task GetAll_3() // Proverava da li je broj Subjects manji od n
        {
            var response = await _httpClient.GetAsync("/api/Subject");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            List<Subject> subs = JsonConvert.DeserializeObject<List<Subject>>(jsonContent);

            int n = 20;

            Assert.Less(subs.Count, n, $"Subject number should be smaller than {n}");
        }

        [Test]
        public async Task GetSubject_1() // Provarava da li Subject sa ID-em ne postoji
        {
            int ID = 100;

            var response = await _httpClient.GetAsync($"/api/Subject/{ID}");

            Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [Test]
        public async Task GetSubject_2() // Proverava da li je request dobar
        {
            string ID = "1";

            var response = await _httpClient.GetAsync($"/api/Subject/{ID}");

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Test]
        public async Task GetSubject_3() // Proverava da li je Subject mrtav
        {
            string ID = "1";

            var response = await _httpClient.GetAsync($"/api/Subject/{ID}");

            string jsonContent = await response.Content.ReadAsStringAsync();

            Subject sub = JsonConvert.DeserializeObject<Subject>(jsonContent);

            string state = "Dead";

            Assert.AreEqual(state, sub.status, "Subject is not dead");
        }

        [Test]
        public async Task PostSubject_1() // Proverava osnovnu funckionalnost
        {
            var bodyData = new
            {
                id = 2,
                firstName = "Jill",
                lastName = "Valentine",
                height = 166,
                weight = 55,
                age = 22,
                status = "Alive"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Subject/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Created, response.StatusCode);
        }

        [Test]
        public async Task PostSubject_2() // Proverava da body nije pravilan
        {
            var bodyData = new
            {
                id = 4,
                firstName = "Jill",
                lastName = "Valentine",
                height = 166,
                weight = 55,
                age = "Twenty two", // Treba da bude int
                status = "Alive"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Subject/", content);

            Assert.IsTrue(response.IsSuccessStatusCode, "Body isn't innacurate");

        }

        [Test]
        public async Task PostSubject_3() // Proverava konkuretnost
        {
            int numberOfConcurrentRequests = 5;
            Task[] tasks = new Task[numberOfConcurrentRequests];

            for (int i = 0; i < numberOfConcurrentRequests; i++)
            {
                tasks[i] = Task.Run(() => PostSubjectConcurrent());
            }

            await Task.WhenAll(tasks);
        }

        private async Task PostSubjectConcurrent()
        {
            var bodyData = new
            {
                id = 3,
                firstName = "Barry",
                lastName = "Burton",
                height = 186,
                weight = 90,
                age = 25,
                status = "Missing"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Subject/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Created, response.StatusCode);
        }

        [TestCase("Missing")]
        [TestCase("missing")]
        [TestCase("Unknown")]
        public async Task PutSubject_1(string statusTest) // Pokusaj da se status promeni na nedozovoljeno
        {
            var bodyData = new
            {
                id = 3,
                firstName = "Barry",
                lastName = "Burton",
                height = 186,
                weight = 90,
                age = 25,
                status = statusTest
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            string ID = "3";

            var response = await _httpClient.PutAsync($"/api/Subject/{ID}", content);

            Assert.AreEqual(System.Net.HttpStatusCode.NoContent, response.StatusCode);

        }
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(101)]
        public async Task PutSubject_2(int idTest) // Pokusaj da se ID promeni
        {
            var bodyData = new
            {
                id = idTest,
                firstName = "Chris",
                lastName = "Redfield",
                height = 190,
                weight = 100,
                age = 25,
                status = "Alive",
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            string ID = "1";

            var response = await _httpClient.PutAsync($"/api/Subject/{ID}", content);

            Assert.AreEqual(System.Net.HttpStatusCode.NoContent, response.StatusCode);

        }

        [Test]
        public async Task PutSubject_3() // Pogresni tipovi
        {
            var bodyData = new
            {
                id = 1,
                firstName = "Chris",
                lastName = "Redfield",
                height = 190.5,
                weight = 100,
                age = 25,
                status = "Alive",
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            string ID = "1";

            var response = await _httpClient.PutAsync($"/api/Subject/{ID}", content);

            Assert.AreEqual(System.Net.HttpStatusCode.NoContent, response.StatusCode, "Numbers should be rounded up");

        }

        [Test]
        public async Task DeleteSubject_1() // Pokusaj da se izbrise nepostojeci Subject
        {
            string ID = "5";

            var response = await _httpClient.DeleteAsync($"/api/Subject/{ID}");

            Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [TestCase("3")]
        [TestCase("ABC")]
        [TestCase("3A")]
        public async Task DeleteSubject_2(string idTest) // Nevalidni ID
        {

            var response = await _httpClient.DeleteAsync($"/api/Subject/{idTest}");

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Test]
        public async Task DeleteSubject_3() // Proverava konkuretnost
        {
            int numberOfConcurrentRequests = 5;
            Task[] tasks = new Task[numberOfConcurrentRequests];

            string ID = "2";

            for (int i = 0; i < numberOfConcurrentRequests; i++)
            {
                tasks[i] = Task.Run(() => DeleteSubjectConcurrent(ID));
            }

            await Task.WhenAll(tasks);
        }

        private async Task DeleteSubjectConcurrent(string ID)
        {
            var response = await _httpClient.DeleteAsync($"/api/Subject/{ID}");

            Assert.AreNotEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}