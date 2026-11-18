import type { City } from "./schema";

const apiStatusEl = document.getElementById("api-status")!;
const buildingCountEl = document.getElementById("building-count")!;
const cityJsonEl = document.getElementById("city-json")!;
const errorEl = document.getElementById("error")!;
const btnRefresh = document.getElementById("btn-refresh") as HTMLButtonElement;
const btnSample = document.getElementById("btn-sample") as HTMLButtonElement;

async function fetchHealth() {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) throw new Error("API unreachable");
    const data = await res.json();
    apiStatusEl.textContent = "ONLINE";
    apiStatusEl.style.color = "#00ff9d";
    buildingCountEl.textContent = String(data.buildingCount);
  } catch {
    apiStatusEl.textContent = "OFFLINE";
    apiStatusEl.style.color = "#ff6b8a";
    buildingCountEl.textContent = "—";
  }
}

async function fetchCity() {
  errorEl.hidden = true;
  try {
    const res = await fetch("/api/city");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const city: City = await res.json();
    cityJsonEl.textContent = JSON.stringify(city, null, 2);
    buildingCountEl.textContent = String(city.buildings.length);
  } catch (err: any) {
    errorEl.textContent = err.message || "Failed to load city";
    errorEl.hidden = false;
    cityJsonEl.textContent = "—";
  }
}

async function loadSample() {
  btnSample.disabled = true;
  try {
    // Minimal valid payload – server will re-validate through loadCity
    const sample = {
      name: "Tron City",
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      buildings: [
        {
          id: "disc-core",
          name: "Disc Core",
          type: "landmark",
          height: 120,
          position: { x: 0, y: 0, z: 0 },
          neonColor: "#00f0ff",
          isLandmark: true,
        },
        {
          id: "end-of-line",
          name: "End of Line Club",
          type: "club",
          height: 45,
          position: { x: 80, y: -40 },
          neonColor: "#ff00aa",
        },
      ],
    };

    const res = await fetch("/api/city", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sample),
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error(JSON.stringify(data.issues, null, 2));
    }
    await fetchCity();
  } catch (err: any) {
    errorEl.textContent = err.message || "Failed to load sample";
    errorEl.hidden = false;
  } finally {
    btnSample.disabled = false;
  }
}

btnRefresh.addEventListener("click", () => {
  fetchHealth();
  fetchCity();
});

btnSample.addEventListener("click", loadSample);

// Initial load
fetchHealth();
fetchCity();