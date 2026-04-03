/* =====================================================
   SAREE PALACE – script.js
   Cart · Search · Toast · Back-to-top · Mobile Nav
   ===================================================== */

/* ── Product Data ── */
const PRODUCTS = [
  { id:1,  name:'Kanjivaram Silk Saree',        material:'Pure Kanjivaram Silk',   category:'silk',     badge:'Bestseller',   price:8499,  oldPrice:12999, img:'13.jfif' },
  { id:2,  name:'Banarasi Brocade Saree',        material:'Banarasi Silk Brocade',  category:'silk',     badge:'New Arrival',  price:7299,  oldPrice:10499, img:'saree.jpg.jfif' },
  { id:3,  name:'Cotton Handloom Saree',         material:'Handloom Cotton',        category:'cotton',   badge:'Daily Wear',   price:999,   oldPrice:1699,  img:'hand.jfif' },
  { id:4,  name:'Chanderi Silk Cotton',          material:'Chanderi Silk Cotton',   category:'cotton',   badge:'Trending',     price:2299,  oldPrice:3499,  img:'yellow.jfif' },
  { id:5,  name:'Organza Party Wear Saree',      material:'Pure Organza',           category:'party',    badge:'New Arrival',  price:3799,  oldPrice:5999,  img:'pink.jfif' },
  { id:6,  name:'Bridal Kanchi Pattu',           material:'Pure Silk Pattu',        category:'bridal',   badge:'Bestseller',   price:18999, oldPrice:26999, img:'12.jfif' },
  { id:7,  name:'Pochampally Ikat Saree',        material:'Handloom Ikat Cotton',   category:'cotton',   badge:'Handloom',     price:1799,  oldPrice:2799,  img:'hand.jfif' },
  { id:8,  name:'Bandhani Silk Saree',           material:'Bandhani Silk',          category:'designer', badge:'Designer',     price:4999,  oldPrice:7499,  img:'yellow.jfif' },
  { id:9,  name:'Kerala Kasavu Saree',           material:'Cotton with Zari Border',category:'cotton',   badge:'Traditional',  price:1499,  oldPrice:2299,  img:'hand.jfif' },
  { id:10, name:'Kalamkari Printed Saree',       material:'Cotton Kalamkari',       category:'designer', badge:'Artisan',      price:2799,  oldPrice:4299,  img:'saree.jpg.jfif' },
  { id:11, name:'Paithani Silk Saree',           material:'Pure Paithani Silk',     category:'silk',     badge:'New Arrival',  price:11499, oldPrice:16999, img:'13.jfif' },
  { id:12, name:'Lehenga Style Bridal Saree',    material:'Net & Silk Blend',       category:'bridal',   badge:'Bridal',       price:14999, oldPrice:21999, img:'118.jfif' },
  { id:13, name:'Georgette Party Saree',         material:'Premium Georgette',      category:'party',    badge:'Party Wear',   price:2499,  oldPrice:3799,  img:'pink.jfif' },
  { id:14, name:'Designer Embroidered Saree',    material:'Silk Georgette Blend',   category:'designer', badge:'Designer',     price:5999,  oldPrice:8999,  img:'yellow.jfif' },
  { id:15, name:'Mysore Silk Saree',             material:'Pure Mysore Silk',       category:'silk',     badge:'Bestseller',   price:6799,  oldPrice:9999,  img:'13.jfif' },
  { id:16, name:'Tant Cotton Saree',             material:'Handloom Tant Cotton',   category:'cotton',   badge:'Daily Wear',   price:749,   oldPrice:1299,  img:'hand.jfif' },
  { id:17, name:'Zardosi Bridal Silk',           material:'Heavy Zardosi Work Silk',category:'bridal',   badge:'Premium',      price:22999, oldPrice:32999, img:'12.jfif' },
  { id:18, name:'Sequin Party Saree',            material:'Net with Sequin Work',   category:'party',    badge:'Party Wear',   price:3299,  oldPrice:5199,  img:'pink.jfif' },
];

/* ── Cart ── */
function getCart() {
  try { return JSON.parse(localStorage.getItem('sp_cart') || '[]'); } catch(e) { return []; }
}
function saveCart(c) {
  try { localStorage.setItem('sp_cart', JSON.stringify(c)); } catch(e) {}
}
function updateCartCount() {
  const c = getCart();
  const n = c.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = n);
}

function addToCart(id) {
  const c = getCart();
  const i = c.findIndex(x => x.id === id);
  if (i > -1) c[i].qty++;
  else c.push({ id, qty: 1 });
  saveCart(c);
  updateCartCount();
  const p = PRODUCTS.find(x => x.id === id);
  showToast('✦ ' + (p ? p.name : 'Item') + ' added to cart!');
}

function removeFromCart(id) {
  const c = getCart().filter(x => x.id !== id);
  saveCart(c);
  renderCart();
  updateCartCount();
}

function changeQty(id, delta) {
  const c = getCart();
  const i = c.findIndex(x => x.id === id);
  if (i > -1) {
    c[i].qty = Math.max(1, c[i].qty + delta);
    saveCart(c);
    renderCart();
    updateCartCount();
  }
}

function renderCart() {
  const cartBody = document.getElementById('cart-body');
  if (!cartBody) return;
  const c = getCart();
  const emptyEl = document.getElementById('cart-empty');
  const tableWrap = document.getElementById('cart-table-wrap');
  if (!c.length) {
    if (emptyEl) emptyEl.style.display = '';
    if (tableWrap) tableWrap.style.display = 'none';
    updateSummary(0);
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (tableWrap) tableWrap.style.display = '';

  cartBody.innerHTML = c.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `<tr>
      <td><img src="${p.img}" class="cart-img" alt="${p.name}"/></td>
      <td>
        <div class="cart-item-name">${p.name}</div>
        <div style="font-size:11px;color:var(--lt-muted)">${p.material}</div>
      </td>
      <td class="hide-m">₹${p.price.toLocaleString('en-IN')}</td>
      <td>
        <div class="cart-qty-wrap">
          <button class="cq-btn" onclick="changeQty(${p.id},-1)">−</button>
          <span style="font-size:13px;font-weight:600;min-width:20px;text-align:center">${item.qty}</span>
          <button class="cq-btn" onclick="changeQty(${p.id},1)">+</button>
        </div>
      </td>
      <td style="font-weight:700;color:var(--burg)">₹${(p.price * item.qty).toLocaleString('en-IN')}</td>
      <td><button class="cart-del" onclick="removeFromCart(${p.id})" title="Remove">✕</button></td>
    </tr>`;
  }).join('');

  const subtotal = c.reduce((s, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
  updateSummary(subtotal);
}

function updateSummary(subtotal) {
  const shipping = subtotal >= 1499 ? 0 : 99;
  const nudge = document.getElementById('shipping-nudge');
  if (nudge) {
    nudge.textContent = shipping === 0
      ? '✓ You get free shipping!'
      : `Add ₹${(1499 - subtotal).toLocaleString('en-IN')} more for free shipping`;
  }
  if (document.getElementById('subtotal')) {
    document.getElementById('subtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
    document.getElementById('shipping').textContent  = shipping === 0 ? 'FREE' : '₹99';
    document.getElementById('total').textContent     = '₹' + (subtotal + shipping).toLocaleString('en-IN');
  }
}

/* ── Search ── */
function setupSearch(inputId, panelId) {
  const inp = document.getElementById(inputId);
  const panel = document.getElementById(panelId);
  if (!inp || !panel) return;

  inp.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    if (!q) { panel.classList.remove('open'); return; }
    const results = PRODUCTS.filter(p =>
      (p.name + p.material + p.category + p.badge).toLowerCase().includes(q)
    ).slice(0, 6);
    if (!results.length) { panel.classList.remove('open'); return; }
    panel.innerHTML = results.map(p =>
      `<div class="srp-item" onclick="location.href='product.html?id=${p.id}'">
        <img src="${p.img}" alt="${p.name}"/>
        <div>
          <div style="font-weight:600;color:var(--burg-dk);font-size:12px">${p.name}</div>
          <div style="font-size:11px;color:var(--lt-muted)">₹${p.price.toLocaleString('en-IN')}</div>
        </div>
      </div>`
    ).join('');
    panel.classList.add('open');
  });

  document.addEventListener('click', function(e) {
    if (!inp.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}

/* ── Toast ── */
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── Back to Top ── */
function setupBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  setupSearch('d-search', 'd-srp');
  setupSearch('m-search', 'm-srp');
  setupBackTop();
  if (document.getElementById('cart-body')) renderCart();
});
