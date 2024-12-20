// HTML'den gerekli elementleri al
const cartContainer = document.getElementById("cart-container"); // Sepetin bulunduğu konteynır
const productsContainer = document.getElementById("products-container"); // Ürünlerin listelendiği konteynır
const dessertCards = document.getElementById("dessert-card-container"); // Tatlı kartlarının bulunduğu konteynır
const cartBtn = document.getElementById("cart-btn"); // Sepet düğmesi
const clearCartBtn = document.getElementById("clear-cart-btn"); // Sepeti temizle düğmesi
const totalNumberOfItems = document.getElementById("total-items"); // Toplam öğe sayısı
const cartSubTotal = document.getElementById("subtotal"); // Sepetin alt toplamı
const cartTaxes = document.getElementById("taxes"); // Sepetin vergisi
const cartTotal = document.getElementById("total"); // Sepetin toplamı
const showHideCartSpan = document.getElementById("show-hide-cart"); // Sepeti göster/gizle düğmesi

// Sepetin gösterilip gizlenmesi için bir değişken
let isCartShowing = false;

const products = [
  {
    id: 1,
    name: "Bülbül Yuvası",
    price: 1400,
    category: "Tatlı",
  },
  {
    id: 2,
    name: "Kadayıf",
    price: 500,
    category: "Tatlı",
  },
  {
    id: 3,
    name: "Karamelli Trileçe",
    price: 140,
    category: "Tatlı",
  },
  {
    id: 4,
    name: "Sütlaç",
    price: 180,
    category: "Tatlı",
  },
  {
    id: 5,
    name: "Kazandibi",
    price: 120,
    category: "Tatlı",
  },
  {
    id: 6,
    name: "Fıstıklı Baklava",
    price: 1000,
    category: "Tatlı",
  },
  {
    id: 7,
    name: "Soğuk Baklava",
    price: 640,
    category: "Tatlı",
  },
  {
    id: 8,
    name: "Fıstıklı Sarma",
    price: 1200,
    category: "Tatlı",
  },
  {
    id: 9,
    name: "Lotus Dondurma",
    price: 170,
    category: "Tatlı",
  },
  {
    id: 10,
    name: "Sufle",
    price: 140,
    category: "Tatlı",
  },
  {
    id: 11,
    name: "Künefe",
    price: 220,
    category: "Tatlı",
  },
  {
    id: 12,
    name: "Çay",
    price: 20,
    category: "Sıcak İçecek",
  },
  {
    id: 13,
    name: "Salep",
    price: 70,
    category: "Sıcak İçecek",
  },
  {
    id: 14,
    name: "Türk Kahvesi",
    price: 60,
    category: "Sıcak İçecek",
  },
  {
    id: 15,
    name: "Latte",
    price: 80,
    category: "Sıcak İçecek",
  },
  {
    id: 16,
    name: "Ihlamur",
    price: 50,
    category: "Sıcak İçecek",
  },
  {
    id: 17,
    name: "Limonata",
    price: 65,
    category: "Soğuk İçecekler",
  },
  {
    id: 18,
    name: "Çikolatalı Milkshake",
    price: 75,
    category: "Soğuk İçecekler",
  },
  {
    id: 19,
    name: "Çilekli Milkshake",
    price: 75,
    category: "Soğuk İçecekler",
  },
  {
    id: 20,
    name: "Cola-Fanta-Sprite",
    price: 40,
    category: "Soğuk İçecekler",
  },
];

// Ürünler listesindeki her ürün için bir kart oluştur
products.forEach(({ name, id, price, category }) => {
  dessertCards.innerHTML += `
      <div class="dessert-card">
        <h2>${name}</h2>
        <p class="dessert-price">${price} ₺</p>
        <p class="product-category">${category}</p>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Sepete Ekle
        </button>
      </div>
    `;
});

// Alışveriş Sepeti sınıfı tanımı
class ShoppingCart {
  constructor() {
    this.items = []; // Sepet öğeleri
    this.total = 0; // Sepetin toplamı
    this.taxRate = 18; // Vergi oranı
  }

  // Ürünü sepete ekle
  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, price } = product;
    this.items.push(product);

    // Her ürünün sepette kaç adet olduğunu hesapla
    const totalCountPerProduct = {};
    this.items.forEach((dessert) => {
      totalCountPerProduct[dessert.id] =
        (totalCountPerProduct[dessert.id] || 0) + 1;
    });

    // Şu anki ürünün sepette kaç adet olduğunu al
    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(
      `product-count-for-id${id}`
    );

    // Eğer üründen sepette birden fazla varsa, adet sayısını göster
    // Yoksa, ürünü sepete ekleyerek HTML'e ekle
    currentProductCount > 1
      ? (currentProductCountSpan.textContent = `${currentProductCount}x`)
      : (productsContainer.innerHTML += `
      <div id=dessert${id} class="product">
        <p>
          <span class="product-count" id=product-count-for-id${id}></span>${name}
        </p>
        <p>${price}</p>
      </div>
      `);
  }

  // Sepetteki öğe sayısını al
  getCounts() {
    return this.items.length;
  }

  // Sepeti temizle
  clearCart() {
    if (!this.items.length) {
      alert("Sepetiniz zaten boş");
      return;
    }

    // Kullanıcıdan sepetin temizlenmesini onaylayıp onaylamadığını sor
    const isCartCleared = confirm(
      "Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?"
    );

    // Kullanıcı onay verirse, sepeti temizle
    if (isCartCleared) {
      this.items = []; // Sepet öğelerini temizle
      this.total = 0; // Sepet toplamını sıfırla
      productsContainer.innerHTML = ""; // Sepet içeriğini temizle
      totalNumberOfItems.textContent = 0; // Toplam öğe sayısını sıfırla
      cartSubTotal.textContent = 0; // Sepetin alt toplamını sıfırla
      cartTaxes.textContent = 0; // Sepetin vergisini sıfırla
      cartTotal.textContent = 0; // Sepetin toplamını sıfırla
    }
  }

  // Vergiyi hesapla
  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  // Toplamı hesapla ve HTML'i güncelle
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;

    // Türk Lirası biçiminde gösterim (örneğin, 1.290,00 ₺)
    cartSubTotal.textContent = `${subTotal.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ₺`;
    cartTaxes.textContent = `${tax.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ₺`;
    cartTotal.textContent = `${this.total.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ₺`;

    return this.total;
  }
}

// Yeni bir alışveriş sepeti oluştur
const cart = new ShoppingCart();

// Her ekleme düğmesine tıklandığında ürünü sepete ekle
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach((btn) => {
  btn.addEventListener("click", (event) => {
    cart.addItem(Number(event.target.id), products);
    totalNumberOfItems.textContent = cart.getCounts();
    cart.calculateTotal();
  });
});

// Sepeti göster/gizle düğmesine tıklama olayı ekle
cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Gizle" : "Göster";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

// Sepeti temizle düğmesine tıklama olayı ekle
clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));
