import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, 
    doc, deleteDoc, updateDoc, serverTimestamp, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDMnqwF7Q3S68PDjtKhYLSCdJUzTHSGgTw",
  authDomain: "verse-ai-cc1c6.firebaseapp.com",
  projectId: "verse-ai-cc1c6",
  storageBucket: "verse-ai-cc1c6.firebasestorage.app",
  messagingSenderId: "2670754048",
  appId: "1:2670754048:web:21808e7908bd8b5eaf1be5",
  measurementId: "G-N6LEMNS4M1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allModsData = [];
let currentCategory = 'all';

// DOM Elements
const modForm = document.getElementById("mod-form");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const editDocIdInput = document.getElementById("edit-doc-id");

// Load Items Realtime
function fetchAdminMods() {
    const q = query(collection(db, "mods_data"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        allModsData = [];
        snapshot.forEach((docSnap) => {
            allModsData.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderAdminList();
    });
}

// Render Admin Items Grid
function renderAdminList() {
    const container = document.getElementById("admin-mods-list");
    container.innerHTML = "";

    const filtered = currentCategory === 'all' 
        ? allModsData 
        : allModsData.filter(item => item.section === currentCategory);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #8b949e;">No items found in this section.</p>`;
        return;
    }

    filtered.forEach((item) => {
        const itemCard = document.createElement("div");
        itemCard.className = "mod-item";
        itemCard.innerHTML = `
            <span class="badge-tag">${item.badge || 'MOD'}</span> | 
            <small style="color: #8b949e;">${item.section}</small>
            <h3 style="margin: 10px 0 5px 0;">${item.title}</h3>
            <p style="font-size: 13px; color: #8b949e; margin-bottom: 10px;">${item.desc}</p>
            <div class="actions">
                <button class="btn-edit" onclick="startEdit('${item.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteItem('${item.id}')">🗑️ Delete</button>
            </div>
        `;
        container.appendChild(itemCard);
    });
}

// Category Tab Switcher
window.filterCategory = function(cat, btnElement) {
    currentCategory = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    renderAdminList();
};

// Form Submission (Add or Edit)
modForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const section = document.getElementById("section").value;
    const badge = document.getElementById("badge").value;
    const desc = document.getElementById("desc").value;
    const link = document.getElementById("link").value;
    const docId = editDocIdInput.value;

    submitBtn.innerText = "Saving...";
    submitBtn.disabled = true;

    try {
        if (docId) {
            // UPDATE EXISTING ITEM
            const docRef = doc(db, "mods_data", docId);
            await updateDoc(docRef, { title, section, badge, desc, link });
            alert("✅ Item Updated Successfully!");
        } else {
            // ADD NEW ITEM
            await addDoc(collection(db, "mods_data"), {
                title, section, badge, desc, link,
                createdAt: serverTimestamp()
            });
            alert("🚀 Item Published Successfully!");
        }
        resetForm();
    } catch (err) {
        alert("❌ Error saving item: " + err.message);
    } finally {
        submitBtn.disabled = false;
    }
});

// Start Edit Mode
window.startEdit = function(id) {
    const item = allModsData.find(i => i.id === id);
    if (!item) return;

    editDocIdInput.value = item.id;
    document.getElementById("title").value = item.title;
    document.getElementById("section").value = item.section;
    document.getElementById("badge").value = item.badge || "badge-mod";
    document.getElementById("desc").value = item.desc;
    document.getElementById("link").value = item.link;

    formTitle.innerText = "✏️ Edit Item";
    submitBtn.innerText = "💾 Save Changes";
    cancelBtn.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Reset Form Mode
window.resetForm = function() {
    modForm.reset();
    editDocIdInput.value = "";
    formTitle.innerText = "➕ Add New Item";
    submitBtn.innerText = "🚀 Publish to Website";
    cancelBtn.style.display = "none";
};

// Delete Item
window.deleteItem = async function(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            await deleteDoc(doc(db, "mods_data", id));
            alert("🗑️ Deleted successfully!");
        } catch (err) {
            alert("❌ Delete failed: " + err.message);
        }
    }
};

// Start Fetching
fetchAdminMods();
