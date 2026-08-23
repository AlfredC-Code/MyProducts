const state = {
  products: [],
  filter: "all",
  search: "",
  activeProduct: null,
  activeImageIndex: 0
};

const gallery = document.getElementById("gallery");
const emptyState = document.getElementById("emptyState");
const itemCount = document.getElementById("itemCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = [...document.querySelectorAll(".filter-btn")];

const dialog = document.getElementById("productDialog");
const closeDialog = document.getElementById("closeDialog");
const dialogImage = document.getElementById("dialogImage");
const dialogTitle = document.getElementById("dialogTitle");
const dialogPrice = document.getElementById("dialogPrice");
const dialogDescription = document.getElementById("dialogDescription");
const dialogCondition = document.getElementById("dialogCondition");
const dialogStatus = document.getElementById("dialogStatus");
const dialogStatusText = document.getElementById("dialogStatusText");
const thumbs = document.getElementById("thumbs");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

function normalizeStatus(status) {
  return String(status || "Available").trim().toLowerCase();
}

function escapeText(value) {
  return String(value ?? "");
}

function statusClass(status) {
  return `status-${normalizeStatus(status)}`;
}

function getFilteredProducts() {
  const query = state.search.trim().toLowerCase();

  return state.products.filter(product => {
    const matchesStatus =
      state.filter === "all" || normalizeStatus(product.status) === state.filter;

    const haystack = [
      product.name,
      product.description,
      product.condition,
      product.price,
      product.status
    ].join(" ").toLowerCase();

    return matchesStatus && (!query || haystack.includes(query));
  });
}

function renderGallery() {
  const products = getFilteredProducts();
  gallery.innerHTML = "";

  products.forEach(product => {
    const article = document.createElement("article");
    article.className = "product-card";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "card-button";
    button.setAttribute("aria-label", `View ${product.name}`);

    const imageCount = Array.isArray(product.images) ? product.images.length : 0;
    const leadImage = imageCount ? product.images[0] : "images/placeholder.svg";

    button.innerHTML = `
      <div class="card-image">
        <img src="${leadImage}" alt="${escapeText(product.name)}" loading="lazy">
        ${imageCount > 1 ? `<span class="photo-count">${imageCount} photos</span>` : ""}
      </div>
      <div class="card-content">
        <span class="status-badge ${statusClass(product.status)}">${escapeText(product.status)}</span>
        <div class="card-topline">
          <h2 class="card-title">${escapeText(product.name)}</h2>
          <p class="price">${escapeText(product.price)}</p>
        </div>
        <p class="card-description">${escapeText(product.description)}</p>
      </div>
    `;

    button.addEventListener("click", () => openProduct(product));
    article.appendChild(button);
    gallery.appendChild(article);
  });

  emptyState.hidden = products.length !== 0;

  const visibleCount = products.length;
  const totalCount = state.products.length;
  itemCount.textContent =
    state.filter === "all" && !state.search
      ? `${totalCount} item${totalCount === 1 ? "" : "s"}`
      : `${visibleCount} of ${totalCount} items`;
}

function openProduct(product) {
  state.activeProduct = product;
  state.activeImageIndex = 0;

  dialogTitle.textContent = product.name || "";
  dialogPrice.textContent = product.price || "";
  dialogDescription.textContent = product.description || "";
  dialogCondition.textContent = product.condition || "Not specified";
  dialogStatus.textContent = product.status || "Available";
  dialogStatus.className = `status-badge ${statusClass(product.status)}`;
  dialogStatusText.textContent = product.status || "Available";

  renderViewer();

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function renderViewer() {
  const product = state.activeProduct;
  const images =
    product && Array.isArray(product.images) && product.images.length
      ? product.images
      : ["images/placeholder.svg"];

  state.activeImageIndex =
    (state.activeImageIndex + images.length) % images.length;

  const current = images[state.activeImageIndex];
  dialogImage.src = current;
  dialogImage.alt = `${product.name} photo ${state.activeImageIndex + 1}`;

  prevImage.hidden = images.length <= 1;
  nextImage.hidden = images.length <= 1;

  thumbs.innerHTML = "";

  images.forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `thumb-btn${index === state.activeImageIndex ? " active" : ""}`;
    button.setAttribute("aria-label", `View photo ${index + 1}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    button.appendChild(img);

    button.addEventListener("click", () => {
      state.activeImageIndex = index;
      renderViewer();
    });

    thumbs.appendChild(button);
  });
}

function changeImage(delta) {
  if (!state.activeProduct) return;
  state.activeImageIndex += delta;
  renderViewer();
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle("active", btn === button));
    renderGallery();
  });
});

searchInput.addEventListener("input", () => {
  state.search = searchInput.value;
  renderGallery();
});

closeDialog.addEventListener("click", () => dialog.close());
prevImage.addEventListener("click", () => changeImage(-1));
nextImage.addEventListener("click", () => changeImage(1));

dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

document.addEventListener("keydown", event => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") changeImage(-1);
  if (event.key === "ArrowRight") changeImage(1);
});

async function init() {
  try {
    const response = await fetch("products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    state.products = Array.isArray(data) ? data : [];
    renderGallery();
  } catch (error) {
    console.error("Could not load products.json", error);
    gallery.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1">
        <h2>Gallery could not be loaded</h2>
        <p>Check that products.json exists and contains valid JSON.</p>
      </div>
    `;
    itemCount.textContent = "Unavailable";
  }
}

init();
