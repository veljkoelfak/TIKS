using Microsoft.VisualStudio.TestPlatform.Common;
using Newtonsoft.Json;
using NUnit.Framework.Internal;
using System.Diagnostics;
using System.Text;
using System.Xml.Linq;


namespace UmbrellaCorp
{
    public class ExperimentTest
    {
        private const string BaseUrl = "http://localhost:5016";

        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            _httpClient = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        }

        [Test]
        public async Task GetAll_1() // Proverava da li postoji Experiment sa Virus ID 1
        {
            var response = await _httpClient.GetAsync("/api/Experiment");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            List<Experiment> exps = JsonConvert.DeserializeObject<List<Experiment>>(jsonContent);

            Assert.IsTrue(exps.Any(exp => exp.virusId == 1), "The virus doesn't exist");
        }

        [Test]
        public async Task GetAll_2() // Proverava da li je prazno
        {
            var response = await _httpClient.GetAsync("/api/Experiment");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            Assert.IsNotNull(jsonContent, "The returned JSON should not be null.");

        }

        [Test]
        public async Task GetAll_3() // Proverava da li postoji T-Virus Experiment
        {
            var response = await _httpClient.GetAsync("/api/Experiment");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            List<Experiment> exps = JsonConvert.DeserializeObject<List<Experiment>>(jsonContent);

            Assert.IsTrue(exps.Any(exp => exp.desc.Contains("T-Virus") == true), "The virus doesn't exist");

        }

        [Test, Timeout(10)]
        public async Task GetExperiment_1() // Proverava koliko je vremena potrebno
        {
            var stopwatch = Stopwatch.StartNew();

            var response = await _httpClient.GetAsync("/api/Experiment/1");

            stopwatch.Stop();

            response.EnsureSuccessStatusCode();

            Assert.Less(stopwatch.ElapsedMilliseconds, 1000);

            Assert.AreEqual(System.Net.HttpStatusCode.OK, response.StatusCode);
        }

        [TestCase("AB")]
        [TestCase("2")]
        [TestCase(" ")]
        public async Task GetExperiment_2(string idTest) // Validni i neavalidni request
        {
            var response = await _httpClient.GetAsync($"/api/Experiment/{idTest}");

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [TestCase("Fatal")]
        [TestCase("Failed")]
        public async Task GetExperiment_3(string test) // Da li sadrzi x
        {
            var response = await _httpClient.GetAsync($"/api/Experiment/1");

            string jsonContent = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(jsonContent.Contains(test));
        }

        [TestCase("1")]
        [TestCase("50")]
        [TestCase("AB")]
        public async Task GetExperiment_4(string id)
        {
            var response = await _httpClient.GetAsync($"/api/Experiment/Virus/{id}");

            string jsonContent = await response.Content.ReadAsStringAsync();

            Assert.IsNotNull(jsonContent);
        }

        [TestCase("1")]
        [TestCase("50")]
        [TestCase("AB")]
        public async Task GetExperiment_5(string id)
        {
            var response = await _httpClient.GetAsync($"/api/Experiment/Subject/{id}");

            string jsonContent = await response.Content.ReadAsStringAsync();

            Assert.IsNotNull(jsonContent);
        }

        [Test]
        public async Task PostExperiment_1() // Proverava nepostojeci virus
        {
            var bodyData = new
            {
                id = 10,
                subjectId = 1,
                virusId = 88,
                desc = "test",
                outcome = "test",
                notes = "test"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Experiment/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.UnprocessableContent, response.StatusCode);

        }

        [Test]
        public async Task PostExperiment_2() // Proverava nepostojeci subject
        {
            var bodyData = new
            {
                id = 10,
                subjectId = 88,
                virusId = 1,
                desc = "test",
                outcome = "test",
                notes = "test"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Experiment/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);

        }

        [Test]
        public async Task PostExperiment_3() // Pokusaj na postojeci Experiment
        {
            var bodyData = new
            {
                id = 1,
                subjectId = 1,
                virusId = 1,
                desc = "test",
                outcome = "test",
                notes = "test"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Experiment/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Conflict, response.StatusCode);

        }

        [Test]
        public async Task PutExperiment_1() // Pokusaj da se promeni ID
        {
            var bodyData = new
            {
                id = 10,
                subjectId = 1,
                virusId = 1,
                desc = "test",
                outcome = "test",
                notes = "test"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync("/api/Experiment/1", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Conflict, response.StatusCode);

        }

        [Test]
        public async Task PutExperiment_2() // Pokusaj da se promeni ID
        {
            var bodyData = new
            {
                id = 10,
                subjectId = 1,
                virusId = 1,
                desc = "test",
                outcome = "test",
                notes = "test"
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync("/api/Experiment/1", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Conflict, response.StatusCode);

        }

        [Test]
        public async Task PutExperiment_3() // Nevalidno
        { 
            var bodyData = new
            {
                id = 2,
                subjectId = 1,
                virusId = 1,
                desc = "test",
                outcome = "test",
                notes = 555
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync("/api/Experiment/2", content);

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);

        }

        public async Task DeleteExperiment_1() // Pokusaj da se izbrise nepostojeci Experiment
        {
            string ID = "5";

            var response = await _httpClient.DeleteAsync($"/api/Experiment/{ID}");

            Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }

        [TestCase("3")]
        [TestCase("ABC")]
        [TestCase("3A")]
        public async Task DeleteExperiment_2(string idTest) // Nevalidni ID
        {

            var response = await _httpClient.DeleteAsync($"/api/Experiment/{idTest}");

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Test]
        public async Task DeleteExperiment_3() // Proverava konkuretnost
        {
            int numberOfConcurrentRequests = 5;
            Task[] tasks = new Task[numberOfConcurrentRequests];

            string ID = "2";

            for (int i = 0; i < numberOfConcurrentRequests; i++)
            {
                tasks[i] = Task.Run(() => DeleteExperimentConcurrent(ID));
            }

            await Task.WhenAll(tasks);
        }

        private async Task DeleteExperimentConcurrent(string ID)
        {
            var response = await _httpClient.DeleteAsync($"/api/Experiment/{ID}");

            Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
