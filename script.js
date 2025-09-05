// Config API endpoint
const API_BASE_URL =
  window.location.hostname === "localhost" ? "http://localhost:3001" : ""; // Untuk production, gunakan relative URL (sama domain)

// API Key - bisa dikonfigurasi atau hardcode untuk frontend public
const API_KEY = "qris_api_key_change_this_to_secure_key"; // Sesuaikan dengan .env backend

// Generate QRIS dinamis otomatis
async function generateQRIS() {
  const staticQris = document.getElementById("staticQris").value.trim();
  const amount = parseInt(document.getElementById("amount").value, 10) || 0;
  const loadingIndicator = document.getElementById("loadingIndicator");
  const resultSection = document.querySelector(".result-section");

  if (!staticQris) {
    resultSection.style.display = "none";
    resultSection.classList.remove("show");
    return;
  }

  // Show loading
  loadingIndicator.style.display = "block";

  try {
    const res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({ staticQris, amount, fee: 0 }),
    });

    if (res.status === 401 || res.status === 403) {
      alert("API authentication failed. Please check API key configuration.");
      return;
    }

    const data = await res.json();

    if (data.dynamicQris && data.qrImage) {
      document.getElementById("qrImage").src = data.qrImage;
      document.getElementById("dynamicQris").value = data.dynamicQris;
      document.getElementById("downloadBtn").href = data.qrImage;

      // Show result with smooth animation
      resultSection.style.display = "block";
      setTimeout(() => resultSection.classList.add("show"), 10);
    }
  } catch (error) {
    console.error("Error generating QRIS:", error);
  } finally {
    // Hide loading
    loadingIndicator.style.display = "none";
  }
}

// Auto generate saat input berubah (dengan debounce)
let debounceTimer;
function debounceGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateQRIS, 300);
}

document
  .getElementById("staticQris")
  .addEventListener("input", debounceGenerate);
document.getElementById("amount").addEventListener("input", debounceGenerate);

// Auto generate di awal jika sudah ada data
document.addEventListener("DOMContentLoaded", function () {
  const staticQris = document.getElementById("staticQris").value.trim();
  if (staticQris) {
    generateQRIS();
  }
});

document.getElementById("copyBtn").onclick = function () {
  const text = document.getElementById("dynamicQris").value;
  navigator.clipboard.writeText(text);

  // Visual feedback untuk copy
  const btn = document.getElementById("copyBtn");
  const originalText = btn.textContent;
  btn.textContent = "Copied!";
  btn.style.background = "#4ad";
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = "#6cf";
  }, 1000);
};

// Preview gambar QR jika dipilih
document.getElementById("qrImageInput").onchange = function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      document.getElementById("qrPreview").src = evt.target.result;
      document.getElementById("qrPreview").style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById("qrPreview").style.display = "none";
  }
};

// Parse QR dari gambar ke textarea
document.getElementById("parseBtn").onclick = async function () {
  const fileInput = document.getElementById("qrImageInput");
  if (!fileInput.files[0]) {
    alert("Please select a QR image first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  const res = await fetch(`${API_BASE_URL}/api/parse-image`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
    },
    body: formData,
  });

  if (res.status === 401 || res.status === 403) {
    alert("API authentication failed. Please check API key configuration.");
    return;
  }

  const data = await res.json();
  if (data.qris) {
    document.getElementById("staticQris").value = data.qris;
    generateQRIS(); // Auto generate setelah parse
  } else {
    alert("Failed to parse QR from image!");
  }
};
