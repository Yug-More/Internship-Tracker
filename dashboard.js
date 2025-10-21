const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("themeToggle");

let applications = JSON.parse(localStorage.getItem("applications")) || [];

// THEME HANDLER
let currentTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);
themeToggle.textContent = currentTheme === "light" ? "🌞" : "🌙";

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  themeToggle.textContent = currentTheme === "light" ? "🌞" : "🌙";
});

function getEmojiForRole(role) {
  const text = role.toLowerCase();
  if (text.includes("software") || text.includes("developer")) return "💻";
  if (text.includes("data") || text.includes("analyst")) return "📊";
  if (text.includes("design") || text.includes("ui") || text.includes("ux")) return "🎨";
  if (text.includes("product") || text.includes("manager")) return "🧭";
  if (text.includes("marketing")) return "📢";
  return "✨";
}

function renderTable(data = applications) {
  tableBody.innerHTML = "";
  data.forEach((app, index) => {
    const emoji = getEmojiForRole(app.position);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.company}</td>
      <td>${emoji} ${app.position}</td>
      <td>${app.location}</td>
      <td>${app.dateApplied}</td>
      <td>
        <select class="status-dropdown" onchange="updateStatus(${index}, this.value)">
          <option value="Applied" ${app.status === "Applied" ? "selected" : ""}>Applied</option>
          <option value="Interview Scheduled" ${app.status === "Interview Scheduled" ? "selected" : ""}>Interview</option>
          <option value="Rejected" ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
          <option value="Offer Received" ${app.status === "Offer Received" ? "selected" : ""}>Offer</option>
        </select>
      </td>
      <td>
        <button class="action-btn" onclick="editApplication(${index})">✏️</button>
        <button class="action-btn" onclick="deleteApplication(${index})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateStats();
}

function updateStats() {
  document.getElementById("totalCount").textContent = applications.length;
  document.getElementById("interviewCount").textContent = applications.filter(
    (a) => a.status === "Interview Scheduled"
  ).length;
  document.getElementById("offerCount").textContent = applications.filter(
    (a) => a.status === "Offer Received"
  ).length;
}

function addApplication() {
  const company = document.getElementById("company").value.trim();
  const position = document.getElementById("position").value.trim();
  const location = document.getElementById("location").value.trim();
  const dateApplied = document.getElementById("dateApplied").value;
  const status = document.getElementById("status").value;

  if (!company || !position || !location || !dateApplied) {
    alert("Please fill all fields!");
    return;
  }

  applications.push({ company, position, location, dateApplied, status });
  localStorage.setItem("applications", JSON.stringify(applications));
  renderTable();
  clearFields();
}

function clearFields() {
  document.getElementById("company").value = "";
  document.getElementById("position").value = "";
  document.getElementById("location").value = "";
  document.getElementById("dateApplied").value = "";
  document.getElementById("status").value = "Applied";
}

function deleteApplication(index) {
  if (confirm("Delete this application?")) {
    applications.splice(index, 1);
    localStorage.setItem("applications", JSON.stringify(applications));
    renderTable();
  }
}

function editApplication(index) {
  const app = applications[index];
  document.getElementById("company").value = app.company;
  document.getElementById("position").value = app.position;
  document.getElementById("location").value = app.location;
  document.getElementById("dateApplied").value = app.dateApplied;
  document.getElementById("status").value = app.status;
  deleteApplication(index);
}

function updateStatus(index, newStatus) {
  applications[index].status = newStatus;
  localStorage.setItem("applications", JSON.stringify(applications));
  updateStats();
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(term) ||
      app.position.toLowerCase().includes(term)
  );
  renderTable(filtered);
});

addBtn.addEventListener("click", addApplication);
renderTable();
