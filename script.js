// Maman Shop - fixed version
// This file works with the existing HTML structure and does not rebuild static sections.

var products = [
    {
        id: 1,
        name: 'محصول نمونه ۱',
        desc: 'یک محصول خانگی باکیفیت',
        price: 100000,
        oldPrice: 0,
        image: 'images/product-1.jpg',
        cat: 'food',
        rating: 5,
        reviews: 0,
        stock: true
    },
    {
        id: 2,
        name: 'محصول نمونه ۲',
        desc: 'محصول دست‌ساز خانگی',
        price: 150000,
        oldPrice: 0,
        image: 'images/product-2.jpg',
        cat: 'handmade',
        rating: 5,
        reviews: 0,
        stock: true
    }
];

var cart = JSON.parse(localStorage.getItem('mamanCart') || '[]');
var favorites = JSON.parse(localStorage.getItem('mamanFav') || '[]');
var currentCat = 'all';

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return document.querySelectorAll(selector); }

function getCatName(cat) {
    var names = {
        all: '🏠 همه',
        cake: '🎂 کیک و شیرینی',
        food: '🍔 غذا',
        handmade: '🧵 صنایع دستی',
        jam: '🍯 ترشی و مربا'
    };
    return names[cat] || cat;
}

function renderProducts(list) {
    var data = Array.isArray(list) ? list : products;
    var count = $('#productCount');
    var grid = $('#productsGrid');
    if (!grid) return;

    if (count) count.textContent = data.length;

    if (!data.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999">😔 محصولی یافت نشد</div>';
        return;
    }

    grid.innerHTML = data.map(function(p) {
        var stars = '';
        for (var i = 1; i <= 5; i++) stars += i <= Math.round(Number(p.rating) || 0) ? '⭐' : '☆';
        var discount = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        var liked = favorites.indexOf(p.id) !== -1;

        return '<div class="product-card">' +
            '<img src="' + p.image + '" class="product-img" alt="' + escapeHtml(p.name) + '" onerror="this.style.background=\'#f5f5f5\'">' +
            '<span class="stock-badge ' + (p.stock ? 'in-stock' : 'out-stock') + '">' + (p.stock ? '✅ موجود' : '❌ ناموجود') + '</span>' +
            (discount ? '<span class="stock-badge in-stock" style="top:50px">🔥 ' + discount + '%</span>' : '') +
            '<div class="product-actions"><button class="action-btn ' + (liked ? 'liked' : '') + '" onclick="toggleFav(' + p.id + ')">❤️</button></div>' +
            '<div class="product-info">' +
                '<div class="product-category">' + getCatName(p.cat) + '</div>' +
                '<div class="product-name">' + escapeHtml(p.name) + '</div>' +
                '<div class="stars">' + stars + ' ' + (p.rating || 0) + ' (' + (p.reviews || 0) + ')</div>' +
                '<div class="price-row"><span class="price">' + Number(p.price).toLocaleString('fa-IR') + ' تومان</span>' +
                (p.oldPrice > 0 ? '<span class="old-price">' + Number(p.oldPrice).toLocaleString('fa-IR') + '</span>' : '') + '</div>' +
                '<button class="add-cart-btn" onclick="addToCart(' + p.id + ')" ' + (!p.stock ? 'disabled style="background:#ccc"' : '') + '>' + (p.stock ? '🛒 افزودن به سبد' : 'ناموجود') + '</button>' +
            '</div></div>';
    }).join('');
}

function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, function(c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
}

function addToCart(id) {
    var p = products.find(function(x) { return x.id === id; });
    if (!p || !p.stock) return;
    var item = cart.find(function(x) { return x.id === id; });
    if (item) item.qty++;
    else cart.push({id:p.id, name:p.name, price:p.price, image:p.image, qty:1});
    saveCart();
    updateCartUI();
    openCart();
}

function saveCart() {
    localStorage.setItem('mamanCart', JSON.stringify(cart));
}

function toggleFav(id) {
    var index = favorites.indexOf(id);
    if (index === -1) favorites.push(id);
    else favorites.splice(index, 1);
    localStorage.setItem('mamanFav', JSON.stringify(favorites));
    updateCounters();
    renderProducts();
}

function updateCounters() {
    var cartCount = $('#cartCount');
    var favCount = $('#favCount');
    if (cartCount) cartCount.textContent = cart.reduce(function(s,c){ return s + Number(c.qty || 0); }, 0);
    if (favCount) favCount.textContent = favorites.length;
}

function updateCartUI() {
    updateCounters();
    var items = $('#cartItems');
    var totalEl = $('#cartTotal');
    if (!items) return;

    if (!cart.length) {
        items.innerHTML = '<div style="text-align:center;color:#999;padding:40px">😔 سبد خرید خالیه!</div>';
        if (totalEl) totalEl.textContent = '💰 جمع: ۰ تومان';
        return;
    }

    var total = 0;
    items.innerHTML = cart.map(function(c) {
        total += Number(c.price) * Number(c.qty);
        return '<div class="cart-item">' +
            '<img src="' + c.image + '" class="cart-item-img" onerror="this.style.background=\'#f0f0f0\'">' +
            '<div class="cart-item-info"><div class="cart-item-name">' + escapeHtml(c.name) + '</div>' +
            '<div class="cart-item-price">' + (Number(c.price)*Number(c.qty)).toLocaleString('fa-IR') + ' تومان</div></div>' +
            '<div class="cart-item-qty"><button class="qty-btn" onclick="changeQty(' + c.id + ',-1)">➖</button><span>' + c.qty + '</span><button class="qty-btn" onclick="changeQty(' + c.id + ',1)">➕</button></div>' +
            '<button class="remove-item" onclick="removeFromCart(' + c.id + ')">🗑️</button>' +
            '</div>';
    }).join('');

    if (totalEl) totalEl.textContent = '💰 جمع: ' + total.toLocaleString('fa-IR') + ' تومان';
}

function changeQty(id, delta) {
    var item = cart.find(function(x){ return x.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { saveCart(); updateCartUI(); }
}

function removeFromCart(id) {
    cart = cart.filter(function(x){ return x.id !== id; });
    saveCart();
    updateCartUI();
}

function openCart() {
    var panel = $('#cartPanel');
    var overlay = $('#cartOverlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('show');
}

function closeCart() {
    var panel = $('#cartPanel');
    var overlay = $('#cartOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

function filterCategory(cat) {
    currentCat = cat;
    $all('.cat-item').forEach(function(el){ el.classList.remove('active'); });
    if (typeof event !== 'undefined' && event && event.target) {
        var item = event.target.closest('.cat-item');
        if (item) item.classList.add('active');
    }
    renderProducts(cat === 'all' ? products : products.filter(function(p){ return p.cat === cat; }));
}

function searchProducts() {
    var input = $('#searchInput');
    var q = input ? input.value.trim().toLowerCase() : '';
    if (!q) { renderProducts(currentCat === 'all' ? products : products.filter(function(p){return p.cat === currentCat;})); return; }
    renderProducts(products.filter(function(p){ return String(p.name).toLowerCase().includes(q) || String(p.desc).toLowerCase().includes(q); }));
}

function sortProducts(type) {
    var data = products.slice();
    if (type === 'cheapest') data.sort(function(a,b){return a.price-b.price;});
    if (type === 'expensive') data.sort(function(a,b){return b.price-a.price;});
    if (type === 'popular') data.sort(function(a,b){return b.rating-a.rating;});
    if (currentCat !== 'all') data = data.filter(function(p){return p.cat === currentCat;});
    renderProducts(data);
}

function applyFilters() {
    var from = parseInt($('#priceFrom') ? $('#priceFrom').value : 0, 10) || 0;
    var to = parseInt($('#priceTo') ? $('#priceTo').value : 0, 10) || Infinity;
    var data = products.filter(function(p){
        return p.price >= from && p.price <= to && (currentCat === 'all' || p.cat === currentCat);
    });
    renderProducts(data);
}

document.addEventListener('DOMContentLoaded', function(){
    updateCounters();
    renderProducts();
    updateCartUI();

    var overlay = $('#cartOverlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    // payment.js is loaded after this file, so wait until DOM is ready before using it.
    var bankFooter = $('#bankInfoFooter');
    if (bankFooter && typeof showBankInfo === 'function') bankFooter.textContent = showBankInfo();
});
