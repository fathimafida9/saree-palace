/* ═══════════════════════════════════════════
   script.js – Saree Palace  (fully mobile-ready)
═══════════════════════════════════════════ */

/* ── PRODUCTS DATA ── */
const PRODUCTS = [
  { id:1,  name:'Kanjivaram Silk Saree',      material:'Pure Silk · Red & Gold',      category:'silk',     price:3499,  oldPrice:5999,  img:'12.jfif', badge:'Bestseller' },
  { id:2,  name:'Banarasi Silk Saree',         material:'Pure Silk · Royal Blue',      category:'silk',     price:4299,  oldPrice:7000,  img:'11.jfif', badge:'New' },
  { id:3,  name:'Chanderi Silk Saree',         material:'Silk Cotton · Mint Green',    category:'silk',     price:2199,  oldPrice:3500,  img:'114.jfif', badge:'Sale' },
  { id:4,  name:'Mysore Silk Saree',           material:'Pure Silk · Lavender',        category:'silk',     price:3899,  oldPrice:6500,  img:'15.jfif', badge:'Trending' },
  { id:5,  name:'Tant Cotton Saree',           material:'Pure Cotton · Mustard',       category:'cotton',   price:799,   oldPrice:1299,  img:'111.jfif', badge:'New' },
  { id:6,  name:'Handloom Cotton Saree',       material:'Handloom · Indigo',           category:'cotton',   price:1099,  oldPrice:1800,  img:'112.jfif', badge:'Bestseller' },
  { id:7,  name:'Ikat Cotton Saree',           material:'Cotton Ikat · Brick Red',     category:'cotton',   price:1299,  oldPrice:2200,  img:'113.jfif', badge:'Sale' },
  { id:8,  name:'Jamdani Cotton Saree',        material:'Fine Cotton · Teal Green',    category:'cotton',   price:1599,  oldPrice:2500,  img:'green.jfif', badge:'Popular' },
  { id:9,  name:'Bridal Kanjivaram',           material:'Pure Silk · Bridal Red',      category:'bridal',   price:14999, oldPrice:22000, img:'115.jfif', badge:'Bridal' },
  { id:10, name:'Zari Banarasi Bridal',        material:'Pure Silk · Gold & Ivory',    category:'bridal',   price:18499, oldPrice:28000, img:'116.jfif', badge:'Premium' },
  { id:11, name:'Patola Bridal Saree',         material:'Patola Silk · Wine Purple',   category:'bridal',   price:11999, oldPrice:18500, img:'120.jfif', badge:'New' },
  { id:12, name:'Stone Embroidered Saree',     material:'Georgette · Sapphire Blue',   category:'bridal',   price:8999,  oldPrice:14000, img:'blue.jfif', badge:'Exclusive' },
  { id:13, name:'Printed Georgette Saree',     material:'Georgette · Floral Print',    category:'party',    price:2499,  oldPrice:3999,  img:'117.jfif', badge:'Trending' },
  { id:14, name:'Chiffon Party Saree',         material:'Chiffon · Rose Gold',         category:'party',    price:1899,  oldPrice:3200,  img:'123.jfif', badge:'New' },
  { id:15, name:'Designer Embroidered Saree',  material:'Net · Pearl White',           category:'designer', price:5499,  oldPrice:8000,  img:'stone.jfif', badge:'Exclusive' },
  { id:16, name:'Zardosi Work Saree',          material:'Silk · Emerald Green',        category:'designer', price:7299,  oldPrice:12000, img:'bl.jfif', badge:'Premium' },
];

/* ── WISHLIST ── */
let wishlist = JSON.parse(localStorage.getItem('sp_wishlist') || '[]');
function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    if (btn) btn.textContent = '♥';
    showToast('❤ Added to wishlist');
  } else {
    wishlist.splice(idx, 1);
    if (btn) btn.textContent = '♡';
    showToast('Removed from wishlist');
  }
  localStorage.setItem('sp_wishlist', JSON.stringify(wishlist));
}
function isWishlisted(id) { return wishlist.includes(id); }

/* ── CART ── */
let cart = JSON.parse(localStorage.getItem('sp_cart') || '[]');

function saveCart() {
  localStorage.setItem('sp_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? '' : '';
  });
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  showToast(`✦ ${p.name} added to cart!`);
  /* Animate cart button */
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.classList.add('cart-bump');
    setTimeout(() => btn.classList.remove('cart-bump'), 400);
  });
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('sp-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'sp-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── DESKTOP SEARCH ── */
function initSearch() {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-panel');
  if (!input || !panel) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (!q) { panel.classList.remove('open'); return; }
    renderSearchResults(q, panel, 6);
    panel.classList.add('open');
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
      window.location.href = 'collections.html?q=' + encodeURIComponent(this.value.trim());
    }
  });

  document.addEventListener('click', function (e) {
    if (!input.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

/* ── MOBILE SEARCH ── */
function initMobileSearch() {
  const input = document.getElementById('mobile-search-input');
  const panel = document.getElementById('mobile-search-panel');
  if (!input || !panel) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (!q) { panel.style.display = 'none'; panel.innerHTML = ''; return; }
    renderSearchResults(q, panel, 5, true);
    panel.style.display = 'block';
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
      window.location.href = 'collections.html?q=' + encodeURIComponent(this.value.trim());
    }
  });
}

function renderSearchResults(q, panel, limit, mobile) {
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.material.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.badge.toLowerCase().includes(q)
  );

  if (results.length === 0) {
    panel.innerHTML = `<div class="search-no-results">😕 No sarees found for "<strong>${q}</strong>"</div>`;
    return;
  }

  panel.innerHTML = results.slice(0, limit).map(p => `
    <div class="search-result-item" onclick="window.location.href='product.html?id=${p.id}'">
      <img class="search-result-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
      <div style="flex:1;min-width:0">
        <div class="search-result-name">${p.name}</div>
        <div style="font-size:11px;color:var(--light-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.material}</div>
        <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
      </div>
      <span style="font-size:10px;background:var(--cream-dk);color:var(--muted);padding:3px 8px;border-radius:24px;white-space:nowrap;flex-shrink:0">${p.badge}</span>
    </div>
  `).join('') + (results.length > limit
    ? `<div class="search-result-item" onclick="window.location.href='collections.html?q=${encodeURIComponent(q)}'" style="justify-content:center;color:var(--burgundy);font-weight:600;font-size:13px">
        View all ${results.length} results →
      </div>` : '');
}

/* ── MOBILE NAV ── */
function initMobileNav() {
  const btn      = document.getElementById('hamburger-btn');
  const nav      = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('nav-close');
  const backdrop = document.getElementById('nav-backdrop');
  if (!nav) return;

  function openNav() {
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (btn) btn.classList.add('open');
  }
  function closeNav() {
    nav.classList.remove('open');
    document.body.style.overflow = '';
    if (btn) btn.classList.remove('open');
  }

  if (btn) btn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  if (backdrop) backdrop.addEventListener('click', closeNav);

  /* Close on Escape */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* Highlight active link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.split('?')[0] === path) a.classList.add('active');
  });
}

/* ── BACK TO TOP ── */
function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── HEADER SCROLL SHADOW ── */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(107,26,42,0.14)'
      : '0 2px 16px rgba(107,26,42,0.07)';
  }, { passive: true });
}

/* ── LAZY IMAGE ANIMATION ── */
function initImageObserver() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .category-card, .testimonial-card, .value-card, .offer-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
}

/* ── CART PAGE RENDER ── */
function renderCart() {
  const tbody      = document.getElementById('cart-body');
  const emptyMsg   = document.getElementById('cart-empty');
  const cartWrap   = document.getElementById('cart-table-wrap');
  const summaryWrap = document.getElementById('cart-summary-wrap');
  if (!tbody) return;

  if (cart.length === 0) {
    if (emptyMsg)    emptyMsg.style.display = 'block';
    if (cartWrap)    cartWrap.style.display = 'none';
    if (summaryWrap) summaryWrap.style.display = 'none';
    return;
  }
  if (emptyMsg)    emptyMsg.style.display = 'none';
  if (cartWrap)    cartWrap.style.display = '';
  if (summaryWrap) summaryWrap.style.display = '';

  tbody.innerHTML = cart.map(item => `
    <tr>
      <td><img class="cart-item-img" src="${item.img}" alt="${item.name}" loading="lazy"/></td>
      <td>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-material">${item.material}</div>
        <div class="cart-mobile-price" style="font-size:13px;color:var(--burgundy);font-weight:600;margin-top:4px">₹${item.price.toLocaleString('en-IN')}</div>
      </td>
      <td class="hide-mobile">₹${item.price.toLocaleString('en-IN')}</td>
      <td>
        <div class="qty-control" style="justify-content:center;gap:8px">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </td>
      <td style="font-weight:600;color:var(--burgundy)">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      <td><button class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove">✕</button></td>
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
  const shipping  = subtotal >= 1499 ? 0 : 99;
  const total     = subtotal + shipping;
  const get = id => document.getElementById(id);
  if (get('subtotal')) get('subtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
  if (get('shipping'))  get('shipping').textContent  = shipping === 0 ? 'FREE ✓' : '₹' + shipping;
  if (get('total'))     get('total').textContent     = '₹' + total.toLocaleString('en-IN');
  /* Show free-shipping nudge */
  const nudge = get('shipping-nudge');
  if (nudge) {
    if (shipping > 0) {
      const need = 1499 - subtotal;
      nudge.textContent = `Add ₹${need.toLocaleString('en-IN')} more for FREE shipping!`;
      nudge.style.display = 'block';
    } else {
      nudge.textContent = '🎉 You have free shipping!';
      nudge.style.display = 'block';
    }
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  initSearch();
  initMobileSearch();
  initMobileNav();
  initBackTop();
  initHeaderScroll();
  /* Slight delay so cards are rendered before observing */
  setTimeout(initImageObserver, 100);
  if (document.getElementById('cart-body')) renderCart();
});
