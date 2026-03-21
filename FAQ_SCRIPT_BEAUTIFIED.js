// ============================================================
// FAQ SCRIPT - Google Sheets Integration
// ============================================================

// Global Variables
let CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTmXlYWWNdXs6thlC2poHskHWJS9Wya4th-EZRNebUrBddehx2_zKnoR_d7t-xOw2PAfonJ3uar3GEe/pub?output=csv";
let allFAQs = [];
let filteredFAQs = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentCategory = "all";
let isLoading = false;

// ============================================================
// MAIN FUNCTION: Load FAQs from Google Sheets
// ============================================================
async function loadFAQs() {
  if (!isLoading) {
    isLoading = true;

    // Get DOM elements
    var faqLoader = document.getElementById("faq-loader");
    var faqContainer = document.getElementById("faq-container");
    var faqError = document.getElementById("faq-error");
    let faqSuccess = document.getElementById("faq-success");
    var refreshBtn = document.getElementById("refresh-btn");
    var connectionStatus = document.getElementById("connection-status");

    // Show loading state
    faqLoader.style.display = "block";
    faqContainer.innerHTML = "";
    faqError.classList.add("hidden");
    faqSuccess.classList.add("hidden");
    refreshBtn.classList.add("spinning");
    connectionStatus.textContent = "Connecting to Google Sheets...";
    connectionStatus.className = "mt-2 text-xs text-blue-600";

    try {
      // Fetch CSV with cache-busting timestamp
      var cacheTimestamp = "&t=" + Date.now();
      var response = await fetch(CSV_URL + cacheTimestamp, {
        method: "GET",
        headers: {
          Accept: "text/csv"
        }
      });

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      var csvText = await response.text();

      // Validation checks
      if (!csvText || csvText.trim().length === 0) {
        throw new Error("Empty response from Google Sheets");
      }

      if (csvText.includes("<!DOCTYPE html>") || csvText.includes("<html>")) {
        throw new Error("Invalid response format - received HTML instead of CSV");
      }

      // Parse CSV
      var parsedData = parseCSV(csvText);

      if (parsedData.length === 0) {
        throw new Error("No valid FAQ data found in spreadsheet");
      }

      // Update FAQ data
      allFAQs = parsedData;
      filteredFAQs = [...allFAQs];
      generateCategoryFilters();
      displayFAQs();
      document.getElementById("faq-count").textContent = allFAQs.length + " Questions Loaded";

      // Success status
      connectionStatus.textContent = "✓ Last updated: " + new Date().toLocaleTimeString();
      connectionStatus.className = "mt-2 text-xs text-green-600";
      faqSuccess.classList.remove("hidden");

      // Hide success message after 3 seconds
      setTimeout(() => {
        faqSuccess.classList.add("hidden");
      }, 3000);

    } catch (error) {
      console.error("Error loading FAQs:", error);
      faqError.classList.remove("hidden");
      connectionStatus.textContent = "✗ Error: " + error.message;
      connectionStatus.className = "mt-2 text-xs text-red-600";
      loadSampleFAQs(); // Fallback to sample data

    } finally {
      faqLoader.style.display = "none";
      refreshBtn.classList.remove("spinning");
      isLoading = false;
    }
  }
}

// ============================================================
// CSV Parser Function
// ============================================================
function parseCSV(csvContent) {
  var lines = csvContent.split("\n");

  if (lines.length < 2) {
    return [];
  }

  // Parse header row
  var headers = parseCSVLine(lines[0]);
  var faqArray = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      let values = parseCSVLine(lines[i]);

      if (values.length >= 3) {
        // Map CSV columns to object properties
        let row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : "";
        });

        // Extract FAQ fields (flexible column naming)
        var faqItem = {
          category: row.Category || row.category || row.CATEGORY || "General",
          question: row.Question || row.question || row.QUESTION || row.Q || "",
          answer: row.Answer || row.answer || row.ANSWER || row.A || "",
          keywords: row.Keywords || row.keywords || row.KEYWORDS || row.tags || "",
          priority: row.Priority || row.priority || row.PRIORITY || "Normal"
        };

        // Validate and add to array
        if (faqItem.question && faqItem.answer && faqItem.question.length > 5) {
          faqArray.push(faqItem);
        }
      }
    }
  }

  return faqArray;
}

// ============================================================
// CSV Line Parser (handles quoted fields)
// ============================================================
function parseCSVLine(csvLine) {
  var fields = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < csvLine.length; i++) {
    var char = csvLine[i];
    var nextChar = csvLine[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      fields.push(currentField);
      currentField = "";
    } else {
      currentField += char;
    }
  }

  // Add last field
  fields.push(currentField);
  return fields;
}

// ============================================================
// Fallback: Load Sample FAQs
// ============================================================
function loadSampleFAQs() {
  console.log("Loading sample FAQs as fallback...");

  allFAQs = [
    {
      category: "Cataract",
      question: "What is cataract surgery and how safe is it?",
      answer: "Cataract surgery is the removal of the cloudy natural lens and replacement with an artificial intraocular lens (IOL). Modern cataract surgery at Sri Chakra Eye Clinic uses micro-incision phacoemulsification technology, which is extremely safe with a success rate of over 99%. The procedure is stitchless, painless, and takes only 15-20 minutes.",
      keywords: "cataract, surgery, safety, phacoemulsification",
      priority: "High"
    },
    {
      category: "Cataract",
      question: "What is the cost of cataract surgery in Anantapur?",
      answer: "Cataract surgery costs at Sri Chakra Eye Clinic range from ₹15,000 to ₹80,000 per eye depending on the IOL chosen. Monofocal lenses (covered under Aarogyasri) start at ₹15,000-25,000, while premium multifocal and toric lenses range from ₹40,000 to ₹80,000. We also accept all major insurance plans and government schemes.",
      keywords: "cost, price, cataract, Anantapur, Aarogyasri",
      priority: "High"
    },
    {
      category: "LASIK",
      question: "What is the cost of LASIK surgery in Anantapur?",
      answer: "LASIK surgery costs at our clinic range from ₹25,000 to ₹1,30,000 for both eyes depending on the technology: Standard LASIK (₹25,000-35,000), Bladeless Femto-LASIK (₹70,000-90,000), Contoura Vision (₹90,000-1,10,000), and SMILE (₹1,00,000-1,30,000). EMI options are available.",
      keywords: "LASIK, cost, price, laser surgery",
      priority: "High"
    },
    {
      category: "General",
      question: "Do you accept Aarogyasri health scheme?",
      answer: "Yes, Sri Chakra Eye Clinic is empaneled with Aarogyasri Health Scheme. The scheme covers standard cataract surgery with monofocal IOLs for eligible BPL families. We also accept all major health insurance plans, ECHS, and CGHS. Our staff can help you with the documentation process.",
      keywords: "Aarogyasri, insurance, payment, government scheme",
      priority: "High"
    }
  ];

  filteredFAQs = [...allFAQs];
  generateCategoryFilters();
  displayFAQs();
  document.getElementById("faq-count").textContent = allFAQs.length + " Sample Questions (Connection Failed)";
}

// ============================================================
// Generate Category Filter Buttons
// ============================================================
function generateCategoryFilters() {
  var categories = [...new Set(allFAQs.map(faq => faq.category))].sort();
  let filtersContainer = document.getElementById("category-filters");

  // Add "All Questions" button
  filtersContainer.innerHTML = `
    <button onclick="filterByCategory('all')" class="faq-category-btn active px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-primary transition-all">
      All Questions
    </button>
  `;

  // Add category buttons
  categories.forEach(category => {
    var count = allFAQs.filter(faq => faq.category === category).length;
    var btn = document.createElement("button");
    btn.className = "faq-category-btn px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-primary transition-all";
    btn.onclick = () => filterByCategory(category);
    btn.textContent = category + ` (${count})`;
    filtersContainer.appendChild(btn);
  });
}

// ============================================================
// Filter by Category
// ============================================================
function filterByCategory(category) {
  currentCategory = category;
  currentPage = 1;

  // Update button active states
  document.querySelectorAll(".faq-category-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.includes(category) || ("all" === category && btn.textContent.includes("All"))) {
      btn.classList.add("active");
    }
  });

  applyFilters();
}

// ============================================================
// Search FAQs
// ============================================================
function searchFAQs(searchValue) {
  document.getElementById("clear-search").classList.toggle("hidden", !searchValue);
  currentPage = 1;
  applyFilters();
}

// ============================================================
// Clear Search
// ============================================================
function clearSearch() {
  document.getElementById("faqSearch").value = "";
  document.getElementById("clear-search").classList.add("hidden");
  currentPage = 1;
  applyFilters();
}

// ============================================================
// Apply Filters (Category + Search)
// ============================================================
function applyFilters() {
  let searchQuery = document.getElementById("faqSearch").value.toLowerCase();

  filteredFAQs = allFAQs.filter(faq => {
    var categoryMatch = currentCategory === "all" || faq.category === currentCategory;
    var searchMatch = !searchQuery ||
                      faq.question.toLowerCase().includes(searchQuery) ||
                      faq.answer.toLowerCase().includes(searchQuery) ||
                      (faq.keywords && faq.keywords.toLowerCase().includes(searchQuery));
    return categoryMatch && searchMatch;
  });

  displayFAQs();
}

// ============================================================
// Display FAQs
// ============================================================
function displayFAQs() {
  var faqContainer = document.getElementById("faq-container");
  var noResults = document.getElementById("no-results");

  if (filteredFAQs.length === 0) {
    faqContainer.innerHTML = "";
    noResults.classList.remove("hidden");
    document.getElementById("pagination").innerHTML = "";
  } else {
    noResults.classList.add("hidden");

    var totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var pageItems = filteredFAQs.slice(startIndex, endIndex);

    faqContainer.innerHTML = pageItems.map((faq, index) => `
      <div class="faq-item bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow" data-category="${faq.category}">
        <button onclick="toggleFaq(this)" class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors group">
          <div class="flex items-start gap-3 pr-4">
            <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary mt-0.5">
              ${faq.category}
            </span>
            <span class="font-semibold text-gray-900 group-hover:text-primary transition-colors">${highlightText(faq.question)}</span>
          </div>
          <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        <div class="hidden px-6 pb-4 text-gray-600 border-t border-gray-100 bg-gray-50/50">
          <div class="pt-4 leading-relaxed">
            ${highlightText(faq.answer)}
          </div>
          ${faq.keywords ? `
            <div class="mt-3 flex flex-wrap gap-2">
              ${faq.keywords.split(",").map(tag => tag.trim() ? `<span class="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">${tag.trim()}</span>` : "").join("")}
            </div>
          ` : ""}
        </div>
      </div>
    `).join("");

    renderPagination(totalPages);
  }
}

// ============================================================
// Highlight Search Terms
// ============================================================
function highlightText(text) {
  var searchQuery = document.getElementById("faqSearch").value;
  if (!searchQuery) {
    return text;
  }

  var regex = new RegExp(`(${searchQuery})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// ============================================================
// Pagination Rendering
// ============================================================
function renderPagination(totalPages) {
  var paginationContainer = document.getElementById("pagination");

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
  } else {
    let html = "";

    // Previous button
    html += `
      <button onclick="changePage(${currentPage - 1})"
              class="pagination-btn ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}"
              ${currentPage === 1 ? "disabled" : ""}>
        Previous
      </button>
    `;

    // Page numbers
    let startPage = Math.max(1, currentPage - Math.floor(2.5));
    let endPage = Math.min(totalPages, startPage + 5 - 1);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 5 + 1);
    }

    if (startPage > 1) {
      html += '<button onclick="changePage(1)" class="pagination-btn">1</button>';
      if (startPage > 2) {
        html += '<span class="px-2">...</span>';
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `
        <button onclick="changePage(${i})"
                class="pagination-btn ${i === currentPage ? "active" : ""}">
          ${i}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += '<span class="px-2">...</span>';
      }
      html += `<button onclick="changePage(${totalPages})" class="pagination-btn">${totalPages}</button>`;
    }

    // Next button
    html += `
      <button onclick="changePage(${currentPage + 1})"
              class="pagination-btn ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}"
              ${currentPage === totalPages ? "disabled" : ""}>
        Next
      </button>
    `;

    paginationContainer.innerHTML = html;
  }
}

// ============================================================
// Change Page
// ============================================================
function changePage(pageNumber) {
  var totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    displayFAQs();
    document.getElementById("faq-section").scrollIntoView({
      behavior: "smooth"
    });
  }
}

// ============================================================
// Toggle FAQ Item (Expand/Collapse)
// ============================================================
function toggleFaq(button) {
  var content = button.nextElementSibling;
  var icon = button.querySelector("svg");
  var isHidden = content.classList.contains("hidden");

  // Collapse other FAQs
  document.querySelectorAll(".faq-item button").forEach(btn => {
    if (btn !== button) {
      btn.nextElementSibling.classList.add("hidden");
      btn.querySelector("svg").style.transform = "rotate(0deg)";
    }
  });

  // Toggle current FAQ
  if (isHidden) {
    content.classList.remove("hidden");
    icon.style.transform = "rotate(180deg)";
  } else {
    content.classList.add("hidden");
    icon.style.transform = "rotate(0deg)";
  }
}

// ============================================================
// OTHER UTILITY FUNCTIONS
// ============================================================

function toggleMobileMenu() {
  var mobileMenu = document.getElementById("mobile-menu");
  var menuIcon = document.getElementById("menu-icon");
  var closeIcon = document.getElementById("close-icon");
  var menuButton = document.querySelector('[aria-controls="mobile-menu"]');

  if (mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.remove("hidden");
    menuIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");
    menuButton.setAttribute("aria-expanded", "true");
  } else {
    mobileMenu.classList.add("hidden");
    menuIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  }
}

function toggleAccordion(contentId, iconId) {
  var content = document.getElementById(contentId);
  var icon = document.getElementById(iconId);

  if (content.classList.contains("active")) {
    content.classList.remove("active");
    content.style.maxHeight = null;
    icon.style.transform = "rotate(0deg)";
  } else {
    content.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
    icon.style.transform = "rotate(180deg)";
  }
}

function checkSymptoms(checkbox) {
  var checked = document.querySelectorAll('input[type="checkbox"]:checked');
  var alert = document.getElementById("symptom-alert");

  if (checked.length >= 2) {
    alert.classList.remove("hidden");
  } else {
    alert.classList.add("hidden");
  }
}

function scrollToSection(sectionId) {
  var section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });

    // Update active tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("onclick").includes(sectionId)) {
        btn.classList.add("active");
      }
    });
  }
}

function updateActiveTabOnScroll() {
  let scrollPosition = window.scrollY + 200;
  let sectionIds = ["cataract", "glaucoma", "retina", "lasik", "pediatric", "general", "faq-section"];

  sectionIds.forEach(sectionId => {
    var section = document.getElementById(sectionId);
    if (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll(".tab-btn").forEach(btn => {
          btn.classList.remove("active");
          if (btn.getAttribute("onclick").includes(sectionId)) {
            btn.classList.add("active");
          }
        });
      }
    }
  });
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Load FAQs when page loads
document.addEventListener("DOMContentLoaded", function() {
  loadFAQs();
});

// Hide mobile menu on resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    document.getElementById("mobile-menu").classList.add("hidden");
  }
});

// Update header shadow on scroll
window.addEventListener("scroll", () => {
  var header = document.getElementById("site-header");
  if (window.scrollY > 50) {
    header.classList.add("shadow-md");
  } else {
    header.classList.remove("shadow-md");
  }
  updateActiveTabOnScroll();
});

// Register Service Worker for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/public/service-worker.js")
      .then(registration => {
        console.log("Service Worker registered successfully:", registration);
      })
      .catch(error => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
