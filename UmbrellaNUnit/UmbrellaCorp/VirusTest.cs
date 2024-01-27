using Microsoft.VisualStudio.TestPlatform.Common;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Text;
using System.Xml.Linq;


namespace UmbrellaCorp
{
    public class VirusTest
    {
        private const string BaseUrl = "http://localhost:5016";

        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            _httpClient = new HttpClient { BaseAddress = new Uri(BaseUrl) };
        }

        [Test, Timeout(1000)]
        public async Task GetAll_1() // Proverava da li je potrebno previse vremena da se dobije response
        {

            var stopwatch = Stopwatch.StartNew();

            var response = await _httpClient.GetAsync("/api/Virus");

            stopwatch.Stop();

            response.EnsureSuccessStatusCode();

            Assert.Less(stopwatch.ElapsedMilliseconds, 1000);

            Assert.AreEqual(System.Net.HttpStatusCode.OK, response.StatusCode);
        }

        [TestCase("Low")]
        [TestCase("Medium")]
        [TestCase("High")]
        [TestCase("Unknown")]
        public async Task GetAll_2(string lethTest) // Proverava da li postoji Virus sa odredjenim lethality
        {
            var response = await _httpClient.GetAsync("/api/Virus");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            List<Virus> viruses = JsonConvert.DeserializeObject<List<Virus>>(jsonContent);

            Assert.IsTrue(viruses.Any(vir => vir.lethality == lethTest), "The virus doesn't exist");
        }

        [TestCase(1)]
        [TestCase(0)]
        [TestCase(5)]
        public async Task GetAll_3(int nTest) // Proverava da li postoji odredjen broj Virusa
        {
            var response = await _httpClient.GetAsync("/api/Virus");

            response.EnsureSuccessStatusCode();

            string jsonContent = await response.Content.ReadAsStringAsync();

            List<Virus> viruses = JsonConvert.DeserializeObject<List<Virus>>(jsonContent);

            Assert.IsTrue(viruses.Count == nTest, "The number of expected viruses does not match");
        }

        [TestCase(1)]
        [TestCase(105)]
        [TestCase(2)]
        public async Task GetVirus_1(int id) // Proverava osnovne funkcije
        {

            var response = await _httpClient.GetAsync($"/api/Virus/{id}");

            Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);

        }

        [Test]
        public async Task GetVirus_2() // Pokusa da requestije predugi ID
        {
            string invalidUuid = new string('1', 10000);

            var response = await _httpClient.GetAsync($"/api/Virus/{invalidUuid}");

            Assert.AreEqual(System.Net.HttpStatusCode.RequestUriTooLong, response.StatusCode);

        }

        [TestCase("AB")]
        [TestCase("2")]
        [TestCase(" ")]
        public async Task GetVirus_3(string idTest) // Validni i neavalidni request
        {
            var response = await _httpClient.GetAsync($"/api/virus/{idTest}");

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }


        [Test] // Da li vec postoji
        public async Task PostVirus_1()
        {
            var bodyData = new
            {
                id = 1,
                name = "G-Virus",
                type = "Parasitic",
                family = "G",
                desc = "UNDISCLOSED",
                lethality = "High",
                genCode = 9978441
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Virus/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Conflict, response.StatusCode);
        }

        [Test]
        public async Task PostVirus_2()
        {
            var bodyData = new
            {
                id = 1,
                name = "G-Virus",
                type = "Parasitic",
                family = "G",
                desc = "UNDISCLOSED",
                lethality = "High",
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Virus/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }
        [TestCase(2,"G-Virus", "Parasitic", "G", "Undisclosed", "High", 9978441)]
        [TestCase(3, "F-Virus", "Alien", "X", "Found in Ripley's body on the Nostromo SS", "Medium", 75512)]
        public async Task PostVirus_3(int id, string name, string type, string family, string desc, string leth, int gen)
        {
            var bodyData = new
            {
                id = id,
                name = name,
                type = type,
                family = family,
                desc = desc,
                lethality = leth,
                genCode = gen
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/Virus/", content);

            Assert.AreEqual(System.Net.HttpStatusCode.Created, response.StatusCode);
        }
        [TestCase(75512 + 1)]
        [TestCase(75512 + 100)]
        [TestCase(75512 + 105)]
        public async Task PutVirus_1(int genCode) // Provarava gencode
        {
            var bodyData = new
            {
                id = 3,
                name = "F-Virus",
                type = "Alien",
                family = "X",
                desc = "Found in Ripley's body on the Nostromo SS",
                lethality = "High",
                genCode = genCode
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync("/api/Virus/3", content);

            Assert.AreEqual(System.Net.HttpStatusCode.NotModified, response.StatusCode);
        }

        [Test]
        public async Task PutVirus_2() // Proverava konkuretnost
        {
            int numberOfConcurrentRequests = 5;
            Task[] tasks = new Task[numberOfConcurrentRequests];

            for (int i = 0; i < numberOfConcurrentRequests; i++)
            {
                tasks[i] = Task.Run(() => PutVirusConcurrently());
            }

            await Task.WhenAll(tasks);
        }

        private async Task PutVirusConcurrently()
        {
            var bodyData = new
            {
                id = 3,
                name = "F-Virus",
                type = "Alien",
                family = "X",
                desc = "Found in Ripley's body on the Nostromo SS",
                lethality = "High",
                genCode = 75626 + 14
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync("/api/Virus/3", content);

            Assert.AreEqual(System.Net.HttpStatusCode.NoContent, response.StatusCode);
        }

        [TestCase("High")]
        [TestCase("low")]
        [TestCase("Unknown")]
        public async Task PutVirus_3(string lethality) // Provarava validnost
        {
            var bodyData = new
            {
                id = 3,
                name = "F-Virus",
                type = "Alien",
                family = "X",
                desc = "Found in Ripley's body on the Nostromo SS",
                lethality = lethality,
                genCode = 9999999
            };

            string jsonContent = JsonConvert.SerializeObject(bodyData);

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync("/api/Virus/3", content);

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [TestCase("3")]
        [TestCase("ABC")]
        [TestCase("3A")]
        public async Task DeleteVirus_1(string idTest) // Nevalidni ID
        {

            var response = await _httpClient.DeleteAsync($"/api/Virus/{idTest}");

            Assert.AreEqual(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Test]
        public async Task DeleteVirus_2() // Bez ID-a
        {

            var response = await _httpClient.DeleteAsync($"/api/Virus/");

            Assert.AreEqual(System.Net.HttpStatusCode.MethodNotAllowed, response.StatusCode);
        }

        [Test]
        public async Task DeleteVirus_3() // Dobar ID
        {
            int id = 5;
            var response = await _httpClient.DeleteAsync($"/api/Virus/{id}");

            Assert.AreEqual(System.Net.HttpStatusCode.NoContent, response.StatusCode);
        }
    }
}
