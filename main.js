let myProductsArray = [];
let currentPage = 1;
const itemsPerPage = 6;

// Fetch data ....

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((res) => {
    myProductsArray = res;

    renderProducts(res);
  });
// Searching ....

document.getElementById("searchBtn").addEventListener("click", function () {
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();
  const selectedValue = document.getElementById("selectedItems").value;
  const minPriceValue =
    parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPriceValue =
    parseFloat(document.getElementById("maxPrice").value) || Infinity;
  const sortedValue = document.getElementById("sortedItems").value;

  const filtered = myProductsArray.filter(
    (obj) =>
      obj.title.toLowerCase().includes(searchValue) &&
      obj.category.includes(selectedValue) &&
      parseFloat(obj.price) >= minPriceValue &&
      parseFloat(obj.price) <= maxPriceValue
  );
  if (sortedValue === "Price") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortedValue === "Name") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortedValue === "Rating") {
    filtered.sort((a, b) => b.rating.rate - a.rating.rate);
  }

  renderProducts(filtered);
});

// Cart

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((item) => item.id == product.id);

  if (item) {
    item.count++;
  } else {
    product.count = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));



  displayCart();
}

function displayCart() {
  const cartItemsDiv = document.getElementById("add-cart");
  cartItemsDiv.innerHTML = "";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

     let totalCount = 0;  
    let totalPrice = 0; 

  cart.forEach((item) => {
    let itemDiv = document.createElement("div");
    
    let h4 = document.createElement("h4");
    h4.textContent = item.title;
    
    let p = document.createElement("p");
    
    let spanprice = document.createElement("span");
    spanprice.textContent = item.price;
    
    let spancount = document.createElement("span");
    spancount.textContent = item.count;
    
    let button = document.createElement("button");
    button.textContent = "Remove";
    button.addEventListener("click", function () {
      removeFromCart(item.id);
    });
    
    // create Stylee
    
    itemDiv.classList.add("cart-item");
    h4.classList.add("titleStyle");
    p.classList.add("pStyle");
    spanprice.classList.add("priceStyle");
    spancount.classList.add("countStyle");
    button.classList.add("buttonStyle");

    p.append(spanprice, spancount);
    itemDiv.append(h4, p, button);
    cartItemsDiv.append(itemDiv);

     totalCount += item.count;
      totalPrice += item.price * item.count;

  });
    let totalQuantity = document.createElement('p');
    totalQuantity.textContent = totalCount;
    totalQuantity .classList.add("styleQuantity");

    let totallPrice  = document.createElement('p');
    totallPrice.textContent = totalPrice;
    totallPrice.classList.add("stylePrice")
    
    const total = document.getElementById("total")
    total.innerHTML = '';
    total.append(totalQuantity ,totallPrice)
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id != id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

window.addEventListener("load", displayCart);



// Fetch data fe browser ......



function renderProducts(arr) {
  let productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = arr.slice(start, end);

  paginatedProducts.forEach((e) => {
    // create elements
    let cardItemDiv = document.createElement("div");
    let img = document.createElement("img");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    let viewCardButton = document.createElement("button");
    let addCardButton = document.createElement("button");

    // put some style in cardItemDiv
    cardItemDiv.classList.add("card-item");
    img.classList.add("img-size");
    h3.classList.add("h3-item");
    p.classList.add("p-price");
    viewCardButton.classList.add("viewCardButton-style");
    addCardButton.classList.add("viewCardButton-style", "addToCard");
    addCardButton.setAttribute("data-id", e.id);

    // inject data
    img.src = e.image;
    h3.textContent = e.title;
    p.textContent = `$${e.price}`;
    viewCardButton.textContent = "View details";
    addCardButton.textContent = "Add to Cart";

    addCardButton.addEventListener("click", function () {
      addToCart(e);
    });
        viewCardButton.addEventListener("click", function () {
      showProductDetails(e);
    });

    cardItemDiv.append(img, h3, p, viewCardButton, addCardButton);
    productsDiv.append(cardItemDiv);
  });

}

function showProductDetails(product) {
     
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalContent");

modalContent.innerHTML = `
  <div class="modal-card">
    <h2 class="modal-title">${product.title}</h2>
    <img class="modal-img" src="${product.image}" alt="${product.title}"/>
    <p class="modal-price">Price: $ ${product.price}</p>
    <p class="modal-category">Category: ${product.category}</p>
    <p class="modal-description">Description: ${product.description}</p>
  </div>
`;

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

document.querySelectorAll(".page").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentPage = parseInt(btn.dataset.page);
    renderProducts(myProductsArray);
  });
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderProducts(myProductsArray);
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (currentPage < 4) {
    currentPage++;
    renderProducts(myProductsArray);
  }
});

