
function handlePassword() {
  const input = document.getElementById("passwordInput").value;
  const saved = localStorage.getItem("soulSafePassword");

  if (!saved) {
    // First time user
    localStorage.setItem("soulSafePassword", input);
    unlockApp();
  } else {
    if (input === saved) {
      unlockApp();
    } else {
      document.getElementById("errorText").textContent = "Wrong password!";
    }
  }
}

function unlockApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  displayEntries();
}

// --- JOURNAL ENTRY SYSTEM ---

document.getElementById("entryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("entryDate").value;
  const mood = document.getElementById("entryMood").value;
  const text = document.getElementById("entryText").value;

  const entry = {
    date: date,
    mood: mood,
    text: btoa(text) // base64 encoding for simple privacy
  };

  let entries = JSON.parse(localStorage.getItem("soulsafeEntries")) || [];
  entries.push(entry);
  localStorage.setItem("soulsafeEntries", JSON.stringify(entries));

  this.reset();
  displayEntries();
});

function displayEntries() {
  const entries = JSON.parse(localStorage.getItem("soulsafeEntries")) || [];
  const list= document.getElementById("entriesList");
  list.innerHTML = "";

  entries.forEach((entry, index) => {
    const div = document.createElement("div");
    div.innerHTML= `
    <p><strong>${entry.date}</strong>-${entry.mood}</p>
    <p id="entry-${index}">encrypted(click unlock)</p>
     <button onclick="revealEntry(${index})">Unlock</button>
<button onclick="deleteEntry(${index})"style="color:red;">Delete</button>
</hr>`;
    list.appendChild(div);
  });
}

function revealEntry(index) {
  const entries = JSON.parse(localStorage.getItem("soulsafeEntries")) || [];
  const decrypted = atob(entries[index].text);
  document.getElementById(`entry-${index}`).textContent = decrypted;
}
function deleteEntry(index) {
const confirmDelete=confirm("Are you sure you want to delete this entry?");
if(!confirmDelete) return;
let entries=
JSON.parse(localStorage.getItem("soulsafeEntries")) || [];
entries.splice(index, 1);
localStorage.setItem("soulsafeEntries",JSON.stringify(entries));
displayEntries();
}
function resetApp() {
  const confirmReset = confirm("⚠️ This will DELETE all your data and password. Are you sure?");
  if (confirmReset) {
    localStorage.removeItem("soulSafePassword");
    localStorage.removeItem("soulsafeEntries");
    location.reload(); // Reload the app to start fresh
  }
}

