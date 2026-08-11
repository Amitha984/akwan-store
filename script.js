// 1. Data Array (සියලුම items වල downloadUrl නිවැරදි කර ඇත)
const items = [
  {
    id: 1,
    title: "Cap Cut",
    type: "software",
    category: "Editing",
    desc: "Advanced video editor with templates, filters, and smart tools.",
    icon: "fa-video",
    image: "images/CapCut.png",
    downloadUrl: "https://viamaker.en.uptodown.com/android/download",
    features: ["AI Video Effects", "Keyframe Animation", "Text & Speed Control", "Cloud Export"]
  },
  {
    id: 2,
    title: "DesignStudio X",
    type: "software",
    category: "Design",
    desc: "Professional graphic design suite for creatives and agencies.",
    icon: "fa-paint-brush",
    image: "images/AKWAN TEAM CLEAR.png",
    downloadUrl: "https://www.mediafire.com",
    features: ["Vector Editing", "Layer Support", "Export to 4K", "Custom Plugins"]
  },
  {
    id: 3,
    title: "Cyber Racer 2077",
    type: "games",
    category: "Racing",
    desc: "High-octane futuristic racing game with ultra HD graphics.",
    icon: "fa-gamepad",
    image: "images/cyber_racer.jpg",
    downloadUrl: "https://www.mediafire.com",
    features: ["Ultra HD Graphics", "Multiplayer Mode", "Offline Story Mode", "Custom Vehicles"]
  },
  {
    id: 4,
    title: "TaskFlow",
    type: "software",
    category: "Productivity",
    desc: "Project management and team collaboration platform.",
    icon: "fa-list-check",
    image: "images/taskflow.jpg",
    downloadUrl: "https://www.mediafire.com",
    features: ["Kanban Boards", "Time Tracking", "Cloud Integration", "Encrypted Data"]
  },
  {
    id: 5,
    title: "Shadow Warrior",
    type: "games",
    category: "Action",
    desc: "Fast-paced action RPG game with intense combat.",
    icon: "fa-dragon",
    image: "",
    downloadUrl: "https://www.mediafire.com",
    features: ["Open World", "60 FPS Support", "Boss Fights", "Multiple Weapons"]
  },
  {
    id: 6,
    title: "CodeMaster Pro",
    type: "software",
    category: "Development",
    desc: "Advanced IDE with AI-powered code completion and debugging tools.",
    icon: "fa-code",
    image: "images/codemaster.jpg",
    downloadUrl: "https://www.mediafire.com",
    features: ["AI Code Completion", "Real-time Collaboration", "50+ Languages", "Cloud Sync"]
  }
];

// LocalStorage මගින් History එක ලබාගැනීම
let downloadHistory = JSON.parse(localStorage.getItem('kwanStore_history')) || [];

// 2. Main Render Functions
function renderGrid(data) {
  if (document.getElementById("itemGrid")) {
    renderGridData(data, "itemGrid");
  }
}

function renderPageItems(type, containerId) {
  const filtered = items.filter(i => i.type === type);
  renderGridData(filtered, containerId);
}

// 3. Grid එකේ Cards පෙන්වීමට (Get Button එක සහිතව)
function renderGridData(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #8b8a99;">No items found.</p>`;
    return;
  }

  data.forEach(item => {
    const mediaHTML = item.image 
      ? `<img src="${item.image}" alt="${item.title}" class="card-img" onerror="this.outerHTML='<i class=\\'fa-solid ${item.icon}\\'></i>'">`
      : `<i class="fa-solid ${item.icon}"></i>`;

    container.innerHTML += `
      <div class="card" onclick="openModal(${item.id})">
        <div class="card-media">${mediaHTML}</div>
        <div class="card-category">${item.category}</div>
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.desc}</div>
        <div class="card-footer">
          <span class="price-free">FREE</span>
          <button class="btn-get" onclick="event.stopPropagation(); handleGetDownload(${item.id})">
            Get
          </button>
        </div>
      </div>
    `;
  });
  updateHistoryUI();
}

// 4. "Get" Button එක ක්ලික් කළ විට Auto Download වී History එකට එකතු වීම
function handleGetDownload(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.downloadUrl) {
    window.open(item.downloadUrl, '_blank');
  } else {
    alert("Download link එක එකතු කර නැත!");
    return;
  }

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const historyEntry = {
    ...item,
    downloadedAt: timeString
  };

  downloadHistory = downloadHistory.filter(h => h.id !== id);
  downloadHistory.unshift(historyEntry);

  localStorage.setItem('kwanStore_history', JSON.stringify(downloadHistory));
  updateHistoryUI();
}

// 5. History UI, Close Button & "Download Another File" Button Fixes
function updateHistoryUI() {
  const historyCount = document.getElementById("history-count") || document.getElementById("cart-count");
  if (historyCount) historyCount.innerText = downloadHistory.length;

  const historyContainer = document.getElementById("historyItems") || document.getElementById("cartItems");

  // පල්ලෙහා Button එක "Download Another File" ලෙස වෙනස් කිරීම
  const actionBtn = document.getElementById("cartDownloadBtn") || document.querySelector(".btn-checkout");
  if (actionBtn) {
    actionBtn.innerText = "Download Another File";
    actionBtn.onclick = function() {
      toggleHistory(); // Panel එක වසා තවත් File එකක් Download කිරීමට ඉඩ සලසයි
    };
  }

  if (!historyContainer) return;

  if (downloadHistory.length === 0) {
    historyContainer.innerHTML = '<p class="empty-msg" style="color: #8b8a99; text-align: center; padding: 20px;">History is empty.</p>';
    return;
  }

  historyContainer.innerHTML = downloadHistory.map(item => `
    <div class="history-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
      <div>
        <strong style="color: #fff; font-size: 14px;">${item.title}</strong>
        <br><small style="color: #10b981;">Downloaded at ${item.downloadedAt}</small>
      </div>
      <a href="${item.downloadUrl}" target="_blank" style="background: #007aff; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold;">Re-get</a>
    </div>
  `).join("");
}

// History Panel එක Open/Close කිරීම
function toggleHistory() {
  const panel = document.getElementById("historyPanel") || document.getElementById("cartPanel");
  if (panel) {
    panel.classList.toggle("open");
  }
}

// 6. Modal / Popup Display
function openModal(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const modalMedia = document.getElementById("modalIcon");
  if (modalMedia) {
    modalMedia.innerHTML = item.image 
      ? `<img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.outerHTML='<i class=\\'fa-solid ${item.icon}\\'></i>'">`
      : `<i class="fa-solid ${item.icon}"></i>`;
  }

  if(document.getElementById("modalCategory")) document.getElementById("modalCategory").innerText = item.category;
  if(document.getElementById("modalTitle")) document.getElementById("modalTitle").innerText = item.title;
  if(document.getElementById("modalDesc")) document.getElementById("modalDesc").innerText = item.desc;
  
  const featuresList = document.getElementById("modalFeatures");
  if (featuresList && item.features) {
    featuresList.innerHTML = item.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join("");
  }

  const getBtn = document.getElementById("modalAddBtn");
  if (getBtn) {
    getBtn.innerText = "Get Now";
    getBtn.onclick = function() {
      handleGetDownload(item.id);
      closeModal();
    };
  }

  const modal = document.getElementById("itemModal");
  if (modal) modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("itemModal");
  if (modal) modal.style.display = "none";
}

// 7. Search & Category Filters
function filterItems() {
  const query = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(query) || i.category.toLowerCase().includes(query)
  );
  
  if (document.getElementById("itemGrid")) {
    renderGridData(filtered, "itemGrid");
  } else if (document.getElementById("softwareGrid")) {
    renderGridData(filtered.filter(i => i.type === "software"), "softwareGrid");
  } else if (document.getElementById("gamesGrid")) {
    renderGridData(filtered.filter(i => i.type === "games"), "gamesGrid");
  }
}

function filterCategory(cat, btn) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  if (cat === "all") {
    renderGrid(items);
  } else {
    renderGrid(items.filter(i => i.type === cat));
  }
}

// 8. Contact / Support Page
function sendWhatsApp() {
  const phone = "94786465433"; 
  const name = document.getElementById("custName")?.value;
  const issue = document.getElementById("custIssue")?.value;
  const msg = document.getElementById("custMessage")?.value;

  if (!name || !msg) {
    alert("කරුණාකර ඔබේ නම සහ විස්තරය ඇතුළත් කරන්න.");
    return;
  }

  const formattedMsg = `*AKWAN Store Support Request*%0A%0A*Name:* ${name}%0A*Issue:* ${issue}%0A*Message:* ${msg}`;
  window.open(`https://wa.me/${phone}?text=${formattedMsg}`, '_blank');
}

function sendMessenger() {
  const pageUsername = "yourpageusername";
  window.open(`https://m.me/${pageUsername}`, '_blank');
}

// 9. Initial Load
document.addEventListener("DOMContentLoaded", () => {
  updateHistoryUI();

  if (document.getElementById("itemGrid")) {
    renderGrid(items);
  }
});