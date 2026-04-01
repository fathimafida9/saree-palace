/* script.js – Saree Palace shared scripts */

/* ── PRODUCTS DATA ── */
const PRODUCTS = [
  { id:1, name:'Kanjivaram Silk Saree', material:'Pure Silk · Red & Gold', category:'silk', price:3499, oldPrice:5999, img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', badge:'Bestseller' },
  { id:2, name:'Banarasi Silk Saree', material:'Pure Silk · Royal Blue', category:'silk', price:4299, oldPrice:7000, img:'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600&q=80', badge:'New' },
  { id:3, name:'Chanderi Silk Saree', material:'Silk Cotton · Mint Green', category:'silk', price:2199, oldPrice:3500, img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', badge:'Sale' },
  { id:4, name:'Mysore Silk Saree', material:'Pure Silk · Lavender', category:'silk', price:3899, oldPrice:6500, img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', badge:'Trending' },
  { id:5, name:'Tant Cotton Saree', material:'Pure Cotton · Mustard', category:'cotton', price:799, oldPrice:1299, img:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80', badge:'New' },
  { id:6, name:'Handloom Cotton Saree', material:'Handloom · Indigo', category:'cotton', price:1099, oldPrice:1800, img:'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80', badge:'Bestseller' },
  { id:7, name:'Ikat Cotton Saree', material:'Cotton Ikat · Brick Red', category:'cotton', price:1299, oldPrice:2200, img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', badge:'Sale' },
  { id:8, name:'Jamdani Cotton Saree', material:'Fine Cotton · Teal Green', category:'cotton', price:1599, oldPrice:2500, img:'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600&q=80', badge:'Popular' },
  { id:9, name:'Bridal Kanjivaram', material:'Pure Silk · Bridal Red', category:'bridal', price:14999, oldPrice:22000, img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', badge:'Bridal' },
  { id:10, name:'Zari Banarasi Bridal', material:'Pure Silk · Gold & Ivory', category:'bridal', price:18499, oldPrice:28000, img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', badge:'Premium' },
  { id:11, name:'Patola Bridal Saree', material:'Patola Silk · Wine Purple', category:'bridal', price:11999, oldPrice:18500, img:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80', badge:'New' },
  { id:12, name:'Stone Embroidered Saree', material:'Georgette · Sapphire Blue', category:'bridal', price:8999, oldPrice:14000, img:'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80', badge:'Exclusive' },
  { id:13, name:'Printed Georgette Saree', material:'Georgette · Floral Print', category:'party', price:2499, oldPrice:3999, img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', badge:'Trending' },
  { id:14, name:'Chiffon Party Saree', material:'Chiffon · Rose Gold', category:'party', price:1899, oldPrice:3200, img:'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600&q=80', badge:'New' },
  { id:15, name:'Designer Embroidered Saree', material:'Net · Pearl White', category:'designer', price:5499, oldPrice:8000, img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', badge:'Exclusive' },
  { id:16, name:'Zardosi Work Saree', material:'Silk · Emerald Green', category:'designer', price:7299, oldPrice:12000, img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', badge:'Premium' },
];

/* ── CART ── */
let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');
function saveCart() { localStorage.setItem('sp_cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  showToast(`✦ ${p.name} added to cart!`);
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── SEARCH ── */
function initSearch() {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-panel');
  if (!input || !panel) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (!q) { panel.classList.remove('open'); return; }
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    if (results.length === 0) {
      panel.innerHTML = `<div class="search-no-results">😕 No sarees found for "<strong>${this.value}</strong>"</div>`;
    } else {
      panel.innerHTML = results.slice(0, 6).map(p => `
        <div class="search-result-item" onclick="window.location.href='product.html?id=${p.id}'">
          <img class="search-result-img" src="${p.img}" alt="${p.name}"/>
          <div>
            <div class="search-result-name">${p.name}</div>
            <div style="font-size:12px;color:var(--light-muted)">${p.material}</div>
            <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
          </div>
          <span style="margin-left:auto;font-size:11px;background:var(--cream-dk);color:var(--muted);padding:3px 8px;border-radius:24px">${p.badge}</span>
        </div>
      `).join('');
    }
    panel.classList.add('open');
  });

  document.addEventListener('click', function (e) {
    if (!input.contains(e.target) && !panel.contains(e.target)) panel.classList.remove('open');
  });
}

/* ── SCROLL BACK TO TOP ── */
function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── RENDER CART PAGE ── */
function renderCart() {
  const tbody = document.getElementById('cart-body');
  const emptyMsg = document.getElementById('cart-empty');
  const cartTable = document.getElementById('cart-table-wrap');
  const summaryWrap = document.getElementById('cart-summary-wrap');
  if (!tbody) return;

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (cartTable) cartTable.style.display = 'none';
    if (summaryWrap) summaryWrap.style.display = 'none';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (cartTable) cartTable.style.display = '';
  if (summaryWrap) summaryWrap.style.display = '';

  tbody.innerHTML = cart.map(item => `
    <tr>
      <td><img class="cart-item-img" src="${item.img}" alt="${item.name}"/></td>
      <td>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-material">${item.material}</div>
      </td>
      <td>₹${item.price.toLocaleString('en-IN')}</td>
      <td>
        <div class="qty-control" style="justify-content:center">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </td>
      <td style="font-weight:600;color:var(--burgundy)">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      <td><button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button></td>
    </tr>
  `).join('');
  updateSummary();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

function updateSummary() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 1499 ? 0 : 99;
  const total = subtotal + shipping;
  const el = id => document.getElementById(id);
  if (el('subtotal')) el('subtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
  if (el('shipping')) el('shipping').textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
  if (el('total')) el('total').textContent = '₹' + total.toLocaleString('en-IN');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  initSearch();
  initBackTop();
  if (document.getElementById('cart-body')) renderCart();
});
