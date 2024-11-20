const productContainer = document.getElementById('product-container');
const loadProductsButton = document.getElementById('load-products');
const sortOptions = document.getElementById('sort-options');
const headerImage=document.getElementById('background-image');
// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch('https://interveiw-mock-api.vercel.app/api/getProducts');
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.data.map(item => item.product); // Extract the 'product' data
  } catch (error) {
    console.error(error);
    alert('Error fetching products!');
    return [];
  }
}

// Render products to the DOM
function renderProducts(products) {
  productContainer.innerHTML = ''; // Clear existing products
  products.forEach((product, index) => {
    const { title, variants, image } = product;
    const price = variants[0]?.price || "N/A"; // Handle price
    const imageSrc = image?.src || 'placeholder.jpg'; // Handle missing images

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.style.animationDelay = `${index * 0.1}s`; // Staggered animation

    productCard.innerHTML = `
      <img src="${imageSrc}" alt="${title}">
      <h3>${title}</h3>
      <div class="product-details">
        <p class="price">₹${price}</p>
        <button class="add-to-cart"> <i class="fas fa-shopping-cart"></i> Add to Cart</button>
      </div>
    `;
    productContainer.appendChild(productCard);
  });
}

// Load products on button click
loadProductsButton.addEventListener('click', async () => {
  loadProductsButton.textContent = 'Loading...';
  loadProductsButton.classList.add('loading');
  loadProductsButton.disabled = true;

  const products = await fetchProducts();
  if (products.length > 0) {
    renderProducts(products);
    loadProductsButton.style.display = 'none'; // Hide the button after loading
    sortOptions.style.display = "block";  //Showing the sorting option once products are loaded
    // headerImage.style.display="block";
    // console.log("Removing background image...");

    //document.body.style.cssText = "background-image: none;";
} else {
    productContainer.innerHTML = '<p>No products available.</p>';
  }
});

// Sort products and re-render
sortOptions.addEventListener('change', async (e) => {
  const products = await fetchProducts();
  if (!products) return;

  const sortValue = e.target.value;
  if (sortValue === 'asc') {
    products.sort((a, b) => parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price));
  } else if (sortValue === 'desc') {
    products.sort((a, b) => parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price));
  }
  else if (sortValue === "newest") {
     products.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }
    else {
     products; // Default: No sorting
  }
  renderProducts(products);
});
