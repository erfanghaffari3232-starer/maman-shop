// ==================== محصولات ====================
var products = [
    {
        id: 1,
        name: '______',
        desc: '______',
        price: ______,
        oldPrice: ______,
        image: 'images/______.jpg',
        cat: '______',
        rating: ______,
        reviews: ______,
        stock: true
    },
    {
        id: 2,
        name: '______',
        desc: '______',
        price: ______,
        oldPrice: ______,
        image: 'images/______.jpg',
        cat: '______',
        rating: ______,
        reviews: ______,
        stock: true
    }
];

// ==================== وضعیت ====================
var cart = JSON.parse(localStorage.getItem('mamanCart') || '[]');
var favorites = JSON.parse(localStorage.getItem('mamanFav') || '[]');
var currentCat = 'all';

// ==================== اجرای اولیه ====================
buildHeader();
buildSlider();
buildCategories();
buildFilters();
buildFooter();
renderProducts();
updateCartUI();

// ==================== ساخت هدر ====================
function buildHeader() {
    document.getElementById('header').innerHTML = 
        '<a href="#" class="logo">______</a>' +
        '<div class="search-box">' +
            '<input type="text" id="searchInput" placeholder="🔍 دنبال چی میگردی؟">' +
            '<button onclick="searchProducts()">جستجو</button>' +
        '</div>' +
        '<div class="header-icons">' +
            '<button class="icon-btn" title="علاقه‌مندی">❤️<span class="badge" id="favCount">0</span></button>' +
            '<button class="icon-btn" onclick="openCart()" title="سبد خرید">🛒<span class="badge" id="cartCount">0</span></button>' +
        '</div>';
}

// ==================== ساخت اسلایدر ====================
function buildSlider() {
    document.getElementById('slider').innerHTML =
        '<h2>______</h2>' +
        '<p>______</p>' +
        '<button class="slider-btn" onclick="window.scrollTo({top:document.querySelector(\'.products-area\').offsetTop, behavior:\'smooth\'})">🛍️ مشاهده محصولات</button>';
}

// ==================== ساخت دسته‌بندی ====================
function buildCategories() {
    var cats = [
        { id: 'all', name: 'همه', icon: '🏠' },
        { id: 'cake', name: 'کیک و شیرینی', icon: '🎂' },
        { id: 'food', name: 'غذا', icon: '🍔' },
        { id: 'handmade', name: 'صنایع دستی', icon: '🧵' },
        { id: 'jam', name: 'ترشی و مربا', icon: '🍯' }
    ];
    
    document.getElementById('catNav').innerHTML = cats.map(function(c) {
        return '<div class="cat-item ' + (c.id === 'all' ? 'active' : '') + '" onclick="filterCategory(\'' + c.id + '\')">' +
            '<span class="cat-icon">' + c.icon + '</span>' + c.name +
        '</div>';
    }).join('');
}

// ==================== ساخت فیلترها ====================
function buildFilters() {
    document.getElementById('filters').innerHTML =
        '<h3>⚙️ فیلتر محصولات</h3>' +
        '<div class="filter-group">' +
            '<h4>دسته‌بندی</h4>' +
            '<label><input type="checkbox" checked> همه</label>' +
            '<label><input type="checkbox"> ______</label>' +
            '<label><input type="checkbox"> ______</label>' +
            '<label><input type="checkbox"> ______</label>' +
            '<label><input type="checkbox"> ______</label>' +
        '</div>' +
        '<div class="filter-group">' +
            '<h4>محدوده قیمت (تومان)</h4>' +
            '<div class="price-range">' +
                '<input type="number" id="priceFrom" placeholder="از">' +
                '<span>-</span>' +
                '<input type="number" id="priceTo" placeholder="تا">' +
            '</div>' +
        '</div>' +
        '<button class="filter-btn" onclick="applyFilters()">🔍 اعمال فیلتر</button>';
    
    document.getElementById('productsHeader').innerHTML =
        '<span style="color:#666;">📦 <strong id="productCount">0</strong> محصول</span>' +
        '<select class="sort-select" onchange="sortProducts(this.value)">' +
            '<option value="default">مرتب‌سازی: پیش‌فرض</option>' +
            '<option value="cheapest">ارزان‌ترین</option>' +
            '<option value="expensive">گران‌ترین</option>' +
            '<option value="popular">محبوب‌ترین</option>' +
        '</select>';
}

// ==================== ساخت فوتر ====================
function buildFooter() {
    document.getElementById('footer').innerHTML =
        '<div class="footer-grid">' +
            '<div class="footer-col"><h4>______</h4><p>______</p><p>______</p></div>' +
            '<div class="footer-col"><h4>📞 تماس با ما</h4><p>______</p><p>______</p><p>______</p></div>' +
            '<div class="footer-col"><h4>🔗 دسترسی سریع</h4><a href="#">درباره ما</a><a href="#">قوانین</a><a href="#">پیگیری</a></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
            '<p id="bankInfoFooter"></p>' +
            '<p>© ______ - تمام حقوق محفوظ است | ساخته شده با ❤️</p>' +
        '</div>';
    
    if (typeof showBankInfo === 'function') {
        document.getElementById('bankInfoFooter').textContent = showBankInfo();
    }
}

// ==================== نمایش محصولات ====================
function renderProducts(list) {
    var data = list || products;
    document.getElementById('productCount').textContent = data.length;
    var grid = document.getElementById('productsGrid');
    
    if (data.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">😔 محصولی یافت نشد</div>';
        return;
    }

    grid.innerHTML = data.map(function(p) {
        var starsHtml = '';
        for (var i = 1; i <= 5; i++) {
            starsHtml += i <= Math.round(p.rating) ? '⭐' : '☆';
        }
        
        return '<div class="product-card">' +
            '<img src="' + p.image + '" class="product-img" alt="' + p.name + '" onerror="this.src=\'https://via.placeholder.com/300x230/f9f9f9/999?text=' + encodeURIComponent(p.name) + '\'">' +
            '<span class="stock-badge ' + (p.stock ? 'in-stock' : 'out-stock') + '">' + (p.stock ? '✅ موجود' : '❌ ناموجود') + '</span>' +
            (p.oldPrice > 0 ? '<span class="stock-badge in-stock" style="top:50px;">🔥 ' + Math.round((1-p.price/p.oldPrice)*100) + '%</span>' : '') +
            '<div class="product-actions">' +
                '<button class="action-btn ' + (favorites.includes(p.id) ? 'liked' : '') + '" onclick="toggleFav(' + p.id + ')">❤️</button>' +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-category">' + getCatName(p.cat) + '</div>' +
                '<div class="product-name">' + p.name + '</div>' +
                '<div class="stars">' + starsHtml + ' ' + p.rating + ' (' + p.reviews + ')</div>' +
                '<div class="price-row">' +
                    '<span class="price">' + p.price.toLocaleString('fa-IR') + ' تومان</span>' +
                    (p.oldPrice > 0 ? '<span class="old-price">' + p.oldPrice.toLocaleString('fa-IR') + '</span>' : '') +
                '</div>' +
                '<button class="add-cart-btn" onclick="addToCart(' + p.id + ')" ' + (!p.stock ? 'disabled style="background:#ccc;"' : '') + '>' +
                    (p.stock ? '🛒 افزودن به سبد' : 'ناموجود') +
                '</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ==================== توابع فروشگاه ====================
function getCatName(cat) {
    var names = { cake: '🎂 ______', food: '🍔 ______', handmade: '🧵 ______', jam: '🍯 ______' };
    return names[cat] || cat;
}

function addToCart(id) {
    var p = products.find(function(x) { return x.id === id; });
    var c = cart.find(function(x) { return x.id === id; });
    if (c) { c.qty++; }
    else { cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 }); }
    saveCart(); updateCartUI(); openCart();
}

function toggleFav(id) {
    var idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); }
    else { favorites.push(id); }
    localStorage.setItem('mamanFav', JSON.stringify(favorites));
    document.getElementById('favCount').textContent = favorites.length;
    renderProducts();
}

function filterCategory(cat) {
    currentCat = cat;
    document.querySelectorAll('.cat-item').forEach(function(el) { el.classList.remove('active'); });
    event.target.closest('.cat-item').classList.add('active');
    var filtered = cat === 'all' ? products : products.filter(function(p) { return p.cat === cat; });
    renderProducts(filtered);
}

function searchProducts() {
    var q = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!q) { renderProducts(); return; }
    var filtered = products.filter(function(p) {
        return p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    });
    renderProducts(filtered);
}

function sortProducts(type) {
    var sorted = products.slice();
    if (type === 'cheapest') sorted.sort(function(a, b) { return a.price - b.price; });
    if (type === 'expensive') sorted.sort(function(a, b) { return b.price - a.price; });
    if (type === 'popular') sorted.sort(function(a, b) { return b.rating - a.rating; });
    renderProducts(sorted);
}

function applyFilters() {
    var from = parseInt(document.getElementById('priceFrom').value) || 0;
    var to = parseInt(document.getElementById('priceTo').value) || 99999999;
    var filtered = products.filter(function(p) { return p.price >= from && p.price <= to; });
    renderProducts(filtered);
}

// ==================== سبد خرید ====================
function saveCart() { localStorage.setItem('mamanCart', JSON.stringify(cart)); }

function updateCartUI() {
    var total = cart.reduce(function(s, c) { return s + c.qty; }, 0);
    document.getElementById('cartCount').textContent = total;
    document.getElementById('favCount').textContent = favorites.length;
    
    var panel = document.getElementById('cartPanel');
    
    if (cart.length === 0) {
        panel.innerHTML = 
            '<div class="cart-header"><span>🛒 سبد خرید</span><button class="close-cart" onclick="closeCart()">✕</button></div>' +
            '<div class="cart-items"><div style="text-align:center;color:#999;padding:40px;">😔 سبد خرید خالیه!</div></div>' +
            '<div class="cart-footer"><div class="cart-total">جمع: ۰ تومان</div></div>';
        return;
    }
    
    var itemsHtml = cart.map(function(c) {
        return '<div class="cart-item">' +
            '<img src="' + c.image + '" class="cart-item-img" onerror="this.style.background=\'#f0f0f0\'">' +
            '<div class="cart-item-info">' +
                '<div class="cart-item-name">' + c.name + '</div>' +
                '<div class="cart-item-price">' + (c.price * c.qty).toLocaleString('fa-IR') + ' تومان</div>' +
            '</div>' +
            '<div class="cart-item-qty">' +
                '<button class="qty-btn" onclick="changeQty(' + c.id + ', -1)">➖</button>' +
                '<span>' + c.qty + '</span>' +
                '<button class="qty-btn" onclick="changeQty(' + c.id + ', 1)">➕</button>' +
            '</div>' +
            '<button class="remove-item" onclick="removeFromCart(' + c.id + ')">🗑️</button>' +
        '</div>';
    }).join('');
    
    var sum = cart.reduce(function(s, c) { return s + (c.price * c.qty); }, 0);
    
    panel.innerHTML = 
        '<div class="cart-header"><span>🛒 سبد خرید (' + total + ')</span><button class="close-cart" onclick="closeCart()">✕</button></div>' +
        '<div class="cart-items">' + itemsHtml + '</div>' +
        '<div class="cart-footer">' +
            '<div class="cart-total">💰 جمع: ' + sum.toLocaleString('fa-IR') + ' تومان</div>' +
            '<button class="checkout-btn" onclick="checkout()">💳 ثبت سفارش و پرداخت</button>' +
        '</div>';
}

function changeQty(id, delta) {
    var c = cart.find(function(x) { return x.id === id; });
    c.qty += delta;
    if (c.qty <= 0) removeFromCart(id);
    else { saveCart(); updateCartUI(); }
}

function removeFromCart(id) {
    cart = cart.filter(function(c) { return c.id !== id; });
    saveCart(); updateCartUI();
}

function openCart() {
    document.getElementById('cartPanel').classList.add('open');
    document.getElementById('cartOverlay').classList.add('show');
}

function closeCart() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('show');
}

// checkout تابع  از payment.js میاد - اینجا چیزی ننویس

// ==================== رویدادها ====================
document.getElementById('cartOverlay').addEventListener('click', closeCart);
