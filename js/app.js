/* Raízes do Nordeste - protótipo front-end
   Tudo é simulado no navegador (localStorage). Não existe servidor nem pagamento real. */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- armazenamento ---------- */
const store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; }
    catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sem armazenamento: segue em memória */ } }
};

/* ---------- dados fictícios (mock data) ---------- */
const UNITS = {
  centro: { nome: "Unidade Centro", endereco: "Rua 4, 120, Centro", horario: "10h às 22h" },
  norte:  { nome: "Unidade Norte",  endereco: "Av. Anhanguera, 2500, Setor Norte", horario: "11h às 23h" },
  sul:    { nome: "Unidade Sul",    endereco: "Av. T-10, 800, Setor Bueno", horario: "10h às 22h" }
};

const WIKI = "https://thumb.wikimedia.org/wikipedia/commons/thumb/";
const IMG = {
  baiao: WIKI + "7/73/Bai%C3%A3o_de_dois_com_lingui%C3%A7a.jpg/960px-Bai%C3%A3o_de_dois_com_lingui%C3%A7a.jpg",
  carne: WIKI + "7/7d/Carne_de_sol_2022.jpg/960px-Carne_de_sol_2022.jpg",
  cuscuz: WIKI + "3/3f/Cuscuz_nordestino.jpg/960px-Cuscuz_nordestino.jpg",
  tapioca: WIKI + "4/41/Tapioca_Brasil.jpg/500px-Tapioca_Brasil.jpg",
  bebida: WIKI + "e/e7/Canned_soft_drinks_in_a_shop_fridge%2C_S%C3%A3o_Paulo.jpg/500px-Canned_soft_drinks_in_a_shop_fridge%2C_S%C3%A3o_Paulo.jpg",
  escondidinho: "https://upload.wikimedia.org/wikipedia/commons/1/19/Escondidinho_de_carne_seca.jpg",
  pastel: WIKI + "6/6d/Pastel_frito.jpg/960px-Pastel_frito.jpg"
};

const PRODUCTS = {
  centro: [
    { id: "c1", nome: "Baião de dois", cat: "Pratos", preco: 28, desc: "Arroz, feijão-fradinho, queijo coalho e linguiça.", img: IMG.baiao },
    { id: "c2", nome: "Carne de sol", cat: "Pratos", preco: 36, desc: "Carne de sol acebolada, com macaxeira e vinagrete.", img: IMG.carne },
    { id: "c3", nome: "Cuscuz recheado", cat: "Lanches", preco: 19, desc: "Cuscuz macio com recheio de carne seca e queijo.", img: IMG.cuscuz },
    { id: "c4", nome: "Tapioca da casa", cat: "Lanches", preco: 16, desc: "Feita na hora, com queijo coalho.", img: IMG.tapioca },
    { id: "c5", nome: "Suco de cajá", cat: "Bebidas", preco: 8, desc: "Copo de 400 ml, bem gelado.", img: IMG.bebida },
    { id: "c6", nome: "Refrigerante lata", cat: "Bebidas", preco: 7, desc: "Lata de 350 ml.", img: IMG.bebida }
  ],
  norte: [
    { id: "n1", nome: "Baião especial", cat: "Pratos", preco: 30, desc: "Com queijo coalho dourado e torresmo.", img: IMG.baiao },
    { id: "n2", nome: "Escondidinho de carne seca", cat: "Pratos", preco: 32, desc: "Purê de macaxeira e carne seca desfiada.", img: IMG.escondidinho },
    { id: "n3", nome: "Cuscuz com queijo", cat: "Lanches", preco: 17, desc: "Cuscuz com queijo coalho derretido.", img: IMG.cuscuz },
    { id: "n4", nome: "Tapioca de coco", cat: "Lanches", preco: 15, desc: "Tapioca com coco ralado e leite condensado.", img: IMG.tapioca },
    { id: "n5", nome: "Suco de acerola", cat: "Bebidas", preco: 8, desc: "Copo de 400 ml.", img: IMG.bebida }
  ],
  sul: [
    { id: "s1", nome: "Carne de sol na nata", cat: "Pratos", preco: 39, desc: "Carne de sol com creme de nata e farofa.", img: IMG.carne },
    { id: "s2", nome: "Baião tradicional", cat: "Pratos", preco: 27, desc: "Baião de dois simples, do jeito da casa.", img: IMG.baiao },
    { id: "s3", nome: "Pastel de carne de sol", cat: "Lanches", preco: 14, desc: "Massa fina e crocante.", img: IMG.pastel },
    { id: "s4", nome: "Tapioca de queijo", cat: "Lanches", preco: 16, desc: "Tapioca quentinha com queijo coalho.", img: IMG.tapioca },
    { id: "s5", nome: "Suco de umbu", cat: "Bebidas", preco: 9, desc: "Copo de 400 ml.", img: IMG.bebida }
  ]
};

/* Tabela fictícia de cobertura de entrega por faixa de CEP */
const CEP_FAIXAS = [
  { de: 74000, ate: 74499, taxa: 5,  nome: "Faixa A" },
  { de: 74500, ate: 74999, taxa: 8,  nome: "Faixa B" },
  { de: 75000, ate: 75999, taxa: 12, nome: "Faixa C" }
];

const REWARD_PRODUCTS = [
  { nome: "Tapioca da casa", valor: 16 },
  { nome: "Suco do dia", valor: 9 },
  { nome: "Pastel de carne de sol", valor: 14 }
];

const PROMOS = [
  { codigo: "BEMVINDO10", titulo: "Primeiro pedido", texto: "10% de desconto no subtotal do seu primeiro pedido." },
  { codigo: "QUINTA5", titulo: "Quinta com sabor", texto: "R$ 5 de desconto em pedidos a partir de R$ 40." }
];

/* ---------- estados do pedido ---------- */
const S = {
  ATENDENTE: "Aguardando atendente",
  PAGAMENTO: "Aguardando pagamento",
  RECUSADO: "Recusado pelo atendente",
  PAGO: "Pagamento aprovado",
  PREPARO: "Em preparo",
  PRONTO: "Pronto para retirada",
  ROTA: "Saiu para entrega",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado"
};

/* ---------- estado da aplicação ---------- */
const state = {
  unit: "centro",
  category: "Todos",
  cart: [],
  coupon: null,
  email: store.get("rn-session", null),
  users: store.get("rn-users", {}),
  orders: store.get("rn-orders", []),
  config: store.get("rn-config", { indisponiveis: [], promosAtivas: { BEMVINDO10: true, QUINTA5: true } }),
  authMode: "login",
  payMethod: "pix",
  payingOrder: null,
  staffTab: "atendente"
};

const user = () => (state.email ? state.users[state.email] : null);
const myOrders = () => state.orders.filter((o) => o.email === state.email);
const persist = () => {
  store.set("rn-users", state.users);
  store.set("rn-orders", state.orders);
  store.set("rn-config", state.config);
  store.set("rn-session", state.email);
};

/* ---------- utilitários de interface ---------- */
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 3000);
}
const openOverlay = (id) => $("#" + id).classList.remove("hidden");
const closeOverlay = (id) => $("#" + id).classList.add("hidden");
function info(title, message) {
  $("#status-title").textContent = title;
  $("#status-message").textContent = message;
  openOverlay("status-overlay");
}

/* ---------- produtos ---------- */
const allProducts = () => Object.values(PRODUCTS).flat();
const isAvailable = (p) => !state.config.indisponiveis.includes(p.id);

function renderUnitInfo() {
  const u = UNITS[state.unit];
  $("#unit-info").textContent = `${u.endereco}. Aberto das ${u.horario}.`;
}

function renderPromos() {
  const ativas = PROMOS.filter((p) => state.config.promosAtivas[p.codigo]);
  $("#promo-strip").innerHTML = ativas.length
    ? ativas.map((p) => `<div class="promo-card"><span class="promo-code">${p.codigo}</span><strong>${p.titulo}</strong><p>${p.texto}</p></div>`).join("")
    : "";
}

function renderProducts() {
  const list = PRODUCTS[state.unit].filter((p) => isAvailable(p) && (state.category === "Todos" || p.cat === state.category));
  $("#product-grid").innerHTML = list.length
    ? list.map((p) => `
      <article class="product-card">
        <div class="product-art"><img src="${p.img}" alt="${esc(p.nome)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('image-fallback')"></div>
        <div class="product-info">
          <h3>${esc(p.nome)}</h3><p>${esc(p.desc)}</p>
          <div class="product-bottom"><span class="price">${money(p.preco)}</span><button class="add-button" data-add="${p.id}">Adicionar</button></div>
        </div>
      </article>`).join("")
    : '<p class="muted">Nenhum item disponível nesta categoria agora.</p>';
}

/* ---------- carrinho ---------- */
const cartItems = () => state.cart.map((i) => ({ ...i, p: allProducts().find((p) => p.id === i.id) })).filter((i) => i.p);
const subtotal = () => cartItems().reduce((s, i) => s + i.p.preco * i.qty, 0);

/* Retorna: null (CEP incompleto), -1 (fora da cobertura) ou o valor da taxa */
function taxaPorCep(valor) {
  const d = valor.replace(/\D/g, "");
  if (d.length !== 8) return null;
  const n = Number(d.slice(0, 5));
  const faixa = CEP_FAIXAS.find((f) => n >= f.de && n <= f.ate);
  return faixa ? faixa.taxa : -1;
}

function validarCupom(codigo, sub) {
  const cod = codigo.trim().toUpperCase();
  if (!cod) return { ok: false, msg: "Digite um cupom." };
  const promo = PROMOS.find((p) => p.codigo === cod);
  if (!promo || !state.config.promosAtivas[cod]) return { ok: false, msg: "Cupom inválido ou encerrado." };
  if (cod === "BEMVINDO10") {
    if (!state.email) return { ok: false, msg: "Entre na sua conta para usar este cupom." };
    const jaComprou = myOrders().some((o) => ![S.CANCELADO, S.RECUSADO].includes(o.status));
    if (jaComprou) return { ok: false, msg: "Este cupom vale só para o primeiro pedido." };
    return { ok: true, codigo: cod, valor: Math.round(sub * 10) / 100 };
  }
  if (cod === "QUINTA5") {
    if (sub < 40) return { ok: false, msg: "Este cupom vale para pedidos a partir de R$ 40,00." };
    return { ok: true, codigo: cod, valor: 5 };
  }
  return { ok: false, msg: "Cupom inválido." };
}

function selectedVoucher() {
  const id = $("#voucher-select").value;
  return id ? (user()?.vouchers || []).find((v) => v.id === id) : null;
}

function calcTotals() {
  const sub = subtotal();
  const delivery = $("#fulfillment").value === "delivery";
  const taxa = delivery ? taxaPorCep($("#cep").value) : 0;
  const fee = taxa && taxa > 0 ? taxa : 0;
  let cupom = 0;
  if (state.coupon) {
    const r = validarCupom(state.coupon, sub);
    cupom = r.ok ? r.valor : 0;
    if (!r.ok) { state.coupon = null; $("#coupon-feedback").textContent = r.msg; }
  }
  const v = selectedVoucher();
  const voucher = v ? Math.min(v.valor, Math.max(0, sub - cupom)) : 0;
  const desconto = cupom + voucher;
  return { sub, fee, cupom, voucher, desconto, total: Math.max(0, sub + fee - desconto), taxa, delivery };
}

function renderCart() {
  const items = cartItems();
  $("#cart-count").textContent = items.reduce((s, i) => s + i.qty, 0);
  $("#cart-unit").textContent = items.length ? `Pedido na ${UNITS[state.unit].nome}` : "";
  $("#cart-items").innerHTML = items.length
    ? items.map((i) => `<div class="cart-row"><div><strong>${esc(i.p.nome)}</strong><small>${money(i.p.preco)} cada</small></div>
        <div class="quantity"><button data-qty="${i.id}" data-change="-1" aria-label="Diminuir">−</button><b>${i.qty}</b><button data-qty="${i.id}" data-change="1" aria-label="Aumentar">+</button></div></div>`).join("")
    : '<p class="muted">Seu carrinho está vazio. Escolha algo no cardápio.</p>';

  // recompensas da conta
  const sel = $("#voucher-select");
  const atual = sel.value;
  const vouchers = user()?.vouchers || [];
  sel.innerHTML = '<option value="">Não usar</option>' + vouchers.map((v) => `<option value="${v.id}">${esc(v.titulo)}</option>`).join("");
  if (vouchers.some((v) => v.id === atual)) sel.value = atual;

  const t = calcTotals();
  $("#subtotal").textContent = money(t.sub);
  $("#delivery-fee").textContent = money(t.fee);
  $("#discount-value").textContent = t.desconto > 0 ? "− " + money(t.desconto) : money(0);
  $("#total").textContent = money(t.total);
  $("#cep-field").classList.toggle("hidden", !t.delivery);
}

function addToCart(id) {
  const p = PRODUCTS[state.unit].find((x) => x.id === id);
  if (!p || !isAvailable(p)) return toast("Esse item não está disponível agora.");
  const found = state.cart.find((i) => i.id === id);
  if (found) found.qty++; else state.cart.push({ id, qty: 1 });
  renderCart();
  toast(`${p.nome} no carrinho.`);
}

function validateCep() {
  const taxa = taxaPorCep($("#cep").value);
  const fb = $("#cep-feedback");
  fb.className = "muted";
  if (taxa === null) { fb.textContent = "Digite os 8 números do CEP."; return false; }
  if (taxa < 0) { fb.textContent = "Ainda não entregamos nesse CEP. Você pode escolher retirar na unidade."; fb.className = "bad"; return false; }
  fb.textContent = `Entregamos aí! Taxa: ${money(taxa)}.`;
  fb.className = "good";
  return true;
}

function applyCoupon() {
  const r = validarCupom($("#coupon").value, subtotal());
  const fb = $("#coupon-feedback");
  if (!r.ok) { state.coupon = null; fb.textContent = r.msg; fb.className = "bad"; }
  else { state.coupon = r.codigo; fb.textContent = `Cupom ${r.codigo} aplicado: − ${money(r.valor)}.`; fb.className = "good"; }
  renderCart();
}

/* ---------- envio do pedido ---------- */
function checkout() {
  if (!state.cart.length) return toast("Adicione pelo menos um item ao carrinho.");
  if (!user()) { closeOverlay("cart-overlay"); openAuth("login"); return toast("Entre ou crie sua conta para enviar o pedido."); }
  const t = calcTotals();
  if (t.delivery && !validateCep()) return toast("Confira o CEP de entrega.");
  const voucher = selectedVoucher();

  const order = {
    id: String(Date.now()).slice(-6),
    email: state.email,
    nomeCliente: user().nome,
    unit: state.unit,
    unitNome: UNITS[state.unit].nome,
    itens: cartItems().map((i) => ({ id: i.id, nome: i.p.nome, preco: i.p.preco, qty: i.qty })),
    entrega: t.delivery,
    cep: t.delivery ? $("#cep").value : "",
    subtotal: t.sub, taxa: t.fee, desconto: t.desconto, total: t.total,
    cupom: state.coupon, voucher: voucher || null,
    status: S.ATENDENTE, pontos: 0, erroPagamento: "",
    criadoEm: new Date().toISOString()
  };
  if (voucher) user().vouchers = user().vouchers.filter((v) => v.id !== voucher.id);
  state.orders.unshift(order);
  state.cart = []; state.coupon = null;
  $("#coupon").value = ""; $("#coupon-feedback").textContent = "";
  persist(); renderCart(); renderOrders(); closeOverlay("cart-overlay");
  info(`Pedido #${order.id} enviado`, "O atendente vai conferir os itens e como você quer receber. Quando ele confirmar, o botão de pagar aparece em “Meus pedidos”.");
}

/* ---------- pedidos do cliente ---------- */
function stepsFor(order) {
  const fim = order.entrega ? ["Saiu para entrega", S.ROTA] : ["Pronto para retirada", S.PRONTO];
  return [
    ["Enviado", S.ATENDENTE], ["Confirmado", S.PAGAMENTO], ["Pago", S.PAGO], ["Em preparo", S.PREPARO], fim, ["Concluído", S.CONCLUIDO]
  ];
}
const stepIndex = (o) => ({ [S.ATENDENTE]: 0, [S.PAGAMENTO]: 1, [S.PAGO]: 2, [S.PREPARO]: 3, [S.PRONTO]: 4, [S.ROTA]: 4, [S.CONCLUIDO]: 5 }[o.status]);

function renderOrders() {
  const el = $("#orders-list");
  if (!user()) { el.innerHTML = '<div class="order-card"><strong>Entre para ver seus pedidos.</strong><p>Seus pedidos ficam ligados à sua conta.</p><button class="button button-primary" data-action="open-auth">Entrar</button></div>'; return; }
  const orders = myOrders();
  if (!orders.length) { el.innerHTML = '<div class="order-card"><strong>Nenhum pedido por enquanto.</strong><p>Quando você fizer um pedido, o andamento aparece aqui.</p></div>'; return; }
  el.innerHTML = orders.map((o) => {
    const idx = stepIndex(o);
    const stepper = idx === undefined ? "" : `<ol class="stepper">${stepsFor(o).map((s, i) => `<li class="${i < idx ? "done" : i === idx ? "current" : ""}"><span></span>${s[0]}</li>`).join("")}</ol>`;
    const acoes = [];
    if (o.status === S.PAGAMENTO) acoes.push(`<button class="button button-primary" data-pay="${o.id}">Pagar agora</button>`);
    if (o.status === S.ATENDENTE || o.status === S.PAGAMENTO) acoes.push(`<button class="button button-outline" data-cancel="${o.id}">Cancelar pedido</button>`);
    return `<article class="order-card">
      <div class="order-head"><strong>Pedido #${o.id}</strong><span class="status-pill st-${o.status === S.RECUSADO || o.status === S.CANCELADO ? "bad" : o.status === S.CONCLUIDO ? "ok" : "wait"}">${o.status}</span></div>
      <p>${o.unitNome}. ${o.entrega ? "Entrega" : "Retirada no balcão"}. Total de ${money(o.total)}.</p>
      <p>${o.itens.map((i) => `${i.qty}x ${esc(i.nome)}`).join(", ")}</p>
      ${stepper}
      ${o.status === S.RECUSADO ? '<p class="bad">O atendente não pôde confirmar este pedido. Sua recompensa, se houver, voltou para a conta.</p>' : ""}
      ${o.erroPagamento ? `<p class="bad">${esc(o.erroPagamento)}</p>` : ""}
      ${o.pontos ? `<p class="good">+${o.pontos} pontos creditados.</p>` : ""}
      ${acoes.length ? `<div class="order-actions">${acoes.join("")}</div>` : ""}
    </article>`;
  }).join("");
}

function setStatus(id, status) {
  const o = state.orders.find((x) => x.id === id);
  if (!o) return;
  o.status = status;
  persist(); renderOrders(); renderStaff(); renderPoints();
}

function devolverVoucher(order) {
  const u = state.users[order.email];
  if (order.voucher && u && !u.vouchers.some((v) => v.id === order.voucher.id)) u.vouchers.push(order.voucher);
}

function cancelOrder(id) {
  const o = state.orders.find((x) => x.id === id);
  if (!o || ![S.ATENDENTE, S.PAGAMENTO].includes(o.status)) return;
  devolverVoucher(o);
  setStatus(id, S.CANCELADO);
  toast("Pedido cancelado. Nenhum ponto foi gerado.");
}

/* ---------- pagamento (serviço externo simulado) ---------- */
function openPay(id) {
  const o = state.orders.find((x) => x.id === id);
  if (!o || o.status !== S.PAGAMENTO) return;
  state.payingOrder = id;
  $("#pay-order-id").textContent = id;
  $("#pay-total").textContent = money(o.total);
  $("#pay-error").textContent = "";
  $("#pay-form").classList.remove("hidden");
  $("#pay-result").classList.add("hidden");
  $("#card-number").value = $("#card-exp").value = $("#card-cvv").value = "";
  setPayMethod("pix");
  openOverlay("pay-overlay");
}

function setPayMethod(m) {
  state.payMethod = m;
  $$("[data-paymethod]").forEach((b) => b.classList.toggle("active", b.dataset.paymethod === m));
  $("#pay-pix").classList.toggle("hidden", m !== "pix");
  $("#pay-card").classList.toggle("hidden", m !== "card");
}

function cartaoValido() {
  const n = $("#card-number").value.replace(/\D/g, "");
  const exp = $("#card-exp").value;
  const cvv = $("#card-cvv").value;
  if (n.length !== 16) return "Digite os 16 números do cartão.";
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return "Validade inválida. Use o formato MM/AA.";
  const fim = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59);
  if (fim < new Date()) return "Cartão vencido.";
  if (!/^\d{3,4}$/.test(cvv)) return "CVV inválido.";
  return "";
}

function sendPayment() {
  const o = state.orders.find((x) => x.id === state.payingOrder);
  if (!o) return;
  if (state.payMethod === "card") {
    const erro = cartaoValido();
    if (erro) { $("#pay-error").textContent = erro; return; }
  }
  $("#pay-error").textContent = "";
  const recusar = state.payMethod === "card" && $("#card-number").value.replace(/\D/g, "").endsWith("0000");
  $("#pay-form").classList.add("hidden");
  const res = $("#pay-result");
  res.classList.remove("hidden");
  res.innerHTML = '<div class="spinner"></div><p><strong>Aguardando o serviço de pagamento…</strong></p><p class="muted tiny">A rede enviou a solicitação e espera o retorno.</p>';

  setTimeout(() => {
    if (recusar) {
      o.erroPagamento = "O pagamento foi recusado pelo emissor. Tente outro cartão ou use PIX.";
      persist(); renderOrders();
      res.innerHTML = `<div class="result-icon bad">!</div><h3>Pagamento não aprovado</h3><p class="muted">${o.erroPagamento}</p><button class="button button-primary full" data-action="pay-retry">Tentar de novo</button>`;
    } else {
      o.erroPagamento = "";
      o.pontos = Math.floor(o.total);
      state.users[o.email].points += o.pontos;
      setStatus(o.id, S.PAGO);
      res.innerHTML = `<div class="result-icon ok">✓</div><h3>Pagamento aprovado</h3><p class="muted">Seu pedido seguiu para a cozinha. Você ganhou <strong>${o.pontos} pontos</strong>.</p><button class="button button-primary full" data-close="pay-overlay">Acompanhar pedido</button>`;
    }
  }, 1800);
}

/* ---------- fidelidade ---------- */
function renderPoints() {
  $("#points-balance").textContent = user()?.points ?? 0;
  const vs = user()?.vouchers || [];
  $("#voucher-list").innerHTML = vs.length
    ? vs.map((v) => `<div class="voucher"><strong>${esc(v.titulo)}</strong><span class="muted tiny">Aparece no carrinho, no campo “Recompensa”.</span></div>`).join("")
    : '<p class="muted">Você ainda não tem recompensas resgatadas.</p>';
}

function redeemDiscount() {
  if (!user()) return openAuth("login");
  if (user().points < 100) return toast("Você precisa de 100 pontos.");
  user().points -= 100;
  user().vouchers.push({ id: "v" + Date.now(), titulo: "R$ 10 de desconto", valor: 10 });
  persist(); renderPoints(); renderCart();
  toast("Desconto resgatado. Use no carrinho.");
}

function openRedeemProduct() {
  if (!user()) return openAuth("login");
  if (user().points < 500) return toast("Você precisa de 500 pontos.");
  $("#reward-options").innerHTML = REWARD_PRODUCTS.map((r, i) => `<button class="reward-option" data-reward="${i}"><strong>${r.nome}</strong><span class="muted">grátis, até ${money(r.valor)}</span></button>`).join("");
  openOverlay("reward-overlay");
}

function redeemProduct(i) {
  const r = REWARD_PRODUCTS[i];
  user().points -= 500;
  user().vouchers.push({ id: "v" + Date.now(), titulo: `${r.nome} grátis`, valor: r.valor });
  persist(); closeOverlay("reward-overlay"); renderPoints(); renderCart();
  toast(`${r.nome} resgatado. Use no carrinho.`);
}

/* ---------- conta ---------- */
async function hashSenha(s) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("raizes:" + s));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch { return "plain:" + s; }
}

function openAuth(mode) { setAuthMode(mode || "login"); $("#auth-error").textContent = ""; openOverlay("auth-overlay"); }

function setAuthMode(mode) {
  state.authMode = mode;
  $$("[data-auth]").forEach((b) => b.classList.toggle("active", b.dataset.auth === mode));
  ["name-wrap", "phone-wrap", "privacy-wrap", "marketing-wrap"].forEach((id) => $("#" + id).classList.toggle("hidden", mode !== "register"));
  $("#auth-title").textContent = mode === "register" ? "Criar conta" : "Entrar";
  $("#auth-submit").textContent = mode === "register" ? "Criar conta" : "Entrar";
  $("#auth-password").autocomplete = mode === "register" ? "new-password" : "current-password";
  $("#auth-error").textContent = "";
}

async function handleAuth(e) {
  e.preventDefault();
  const err = (m) => { $("#auth-error").textContent = m; };
  const email = $("#auth-email").value.trim().toLowerCase();
  const senha = $("#auth-password").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err("Digite um e-mail válido.");

  if (state.authMode === "register") {
    const nome = $("#auth-name").value.trim();
    const tel = $("#auth-phone").value.replace(/\D/g, "");
    if (nome.length < 2) return err("Digite seu nome.");
    if (tel.length < 10 || tel.length > 11) return err("Digite o telefone com DDD.");
    if (senha.length < 6) return err("A senha precisa ter pelo menos 6 caracteres.");
    if (state.users[email]) return err("Já existe uma conta com esse e-mail. Tente entrar.");
    if (!$("#privacy").checked) return err("Para criar a conta, confirme a leitura do aviso de privacidade.");
    state.users[email] = { nome, email, telefone: $("#auth-phone").value.trim(), senha: await hashSenha(senha), marketing: $("#marketing").checked, points: 0, vouchers: [], criadoEm: new Date().toISOString() };
  } else {
    const u = state.users[email];
    if (!u || u.senha !== (await hashSenha(senha))) return err("E-mail ou senha incorretos.");
  }
  state.email = email;
  persist(); afterAuthChange();
  closeOverlay("auth-overlay");
  $("#auth-form").reset();
  toast(`Olá, ${user().nome.split(" ")[0]}!`);
  if (state.cart.length) { renderCart(); openOverlay("cart-overlay"); }
}

function logout() {
  state.email = null; persist(); afterAuthChange(); toast("Você saiu da conta.");
}

function afterAuthChange() {
  const u = user();
  const btn = $("#user-button");
  btn.textContent = u ? `Sair (${u.nome.split(" ")[0]})` : "Entrar";
  btn.dataset.action = u ? "logout" : "open-auth";
  renderOrders(); renderPoints(); renderPrivacy(); renderCart();
}

/* ---------- privacidade (LGPD) ---------- */
function renderPrivacy() {
  const u = user();
  const el = $("#privacy-panel");
  if (!u) { el.innerHTML = '<div class="order-card"><strong>Entre para gerenciar seus dados.</strong><p>Com a conta aberta você pode mudar o consentimento, baixar uma cópia ou excluir tudo.</p><button class="button button-primary" data-action="open-auth">Entrar</button></div>'; return; }
  el.innerHTML = `
    <div class="order-card">
      <h3>Seus consentimentos</h3>
      <label class="switch-row"><input type="checkbox" id="marketing-toggle" ${u.marketing ? "checked" : ""}><span>Receber ofertas e campanhas por e-mail e telefone <em class="muted">(opcional, não é preciso para pedir)</em></span></label>
    </div>
    <div class="order-card">
      <h3>Direitos do titular</h3>
      <p>Você pode pedir uma cópia dos seus dados ou a exclusão da conta a qualquer momento.</p>
      <div class="order-actions"><button class="button button-outline" data-action="export-data">Baixar meus dados</button><button class="button button-danger" data-action="delete-account">Excluir minha conta</button></div>
    </div>`;
}

function exportData() {
  const u = { ...user() }; delete u.senha;
  const blob = new Blob([JSON.stringify({ conta: u, pedidos: myOrders() }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "meus-dados-raizes.json"; a.click();
  URL.revokeObjectURL(a.href);
}

function deleteAccount() {
  if (!confirm("Excluir sua conta, pedidos e pontos? Essa ação não pode ser desfeita.")) return;
  const email = state.email;
  delete state.users[email];
  state.orders = state.orders.filter((o) => o.email !== email);
  state.email = null; state.cart = [];
  persist(); afterAuthChange();
  info("Conta excluída", "Apagamos sua conta, seus pedidos e seus pontos deste navegador.");
}

/* ---------- painel da equipe (atendente, cozinha, gerente) ---------- */
function renderStaff() {
  const el = $("#staff-content");
  if (!el || $("#staff-view").classList.contains("hidden")) return;
  const card = (o, botoes) => `<article class="order-card"><div class="order-head"><strong>Pedido #${o.id}, ${o.unitNome}</strong><span class="status-pill st-wait">${o.status}</span></div>
    <p>${esc(o.nomeCliente.split(" ")[0])} pediu ${o.entrega ? "para entregar no CEP " + esc(o.cep) : "para retirar"}. Total de ${money(o.total)}.</p>
    <p>${o.itens.map((i) => `${i.qty}x ${esc(i.nome)}`).join(", ")}</p><div class="order-actions">${botoes}</div></article>`;
  const vazio = (t) => `<div class="order-card"><p>${t}</p></div>`;

  if (state.staffTab === "atendente") {
    const l = state.orders.filter((o) => o.status === S.ATENDENTE);
    el.innerHTML = `<h3 class="sub-title">Pedidos para conferir</h3><div class="orders-list">${l.length ? l.map((o) => card(o, `<button class="button button-primary" data-staff-act="confirm" data-id="${o.id}">Confirmar</button><button class="button button-outline" data-staff-act="reject" data-id="${o.id}">Recusar</button>`)).join("") : vazio("Nenhum pedido esperando conferência.")}</div>`;
  } else if (state.staffTab === "cozinha") {
    const l = state.orders.filter((o) => [S.PAGO, S.PREPARO, S.PRONTO, S.ROTA].includes(o.status));
    const acao = (o) => ({
      [S.PAGO]: `<button class="button button-primary" data-staff-act="prep" data-id="${o.id}">Iniciar preparo</button>`,
      [S.PREPARO]: `<button class="button button-primary" data-staff-act="ready" data-id="${o.id}">${o.entrega ? "Saiu para entrega" : "Pronto para retirada"}</button>`,
      [S.PRONTO]: `<button class="button button-primary" data-staff-act="done" data-id="${o.id}">Pedido retirado</button>`,
      [S.ROTA]: `<button class="button button-primary" data-staff-act="done" data-id="${o.id}">Pedido entregue</button>`
    }[o.status]);
    el.innerHTML = `<h3 class="sub-title">Pedidos pagos</h3><div class="orders-list">${l.length ? l.map((o) => card(o, acao(o))).join("") : vazio("Nenhum pedido pago na fila.")}</div>`;
  } else {
    el.innerHTML = `
      <h3 class="sub-title">Disponibilidade dos produtos</h3>
      <p class="muted tiny">Item indisponível some do cardápio do cliente.</p>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Unidade</th><th>Produto</th><th>Preço</th><th>Disponível</th></tr></thead><tbody>
      ${Object.entries(PRODUCTS).flatMap(([u, ps]) => ps.map((p) => `<tr><td>${UNITS[u].nome}</td><td>${esc(p.nome)}</td><td>${money(p.preco)}</td><td><input type="checkbox" data-avail="${p.id}" ${isAvailable(p) ? "checked" : ""} aria-label="Disponível: ${esc(p.nome)}"></td></tr>`)).join("")}
      </tbody></table></div>
      <h3 class="sub-title">Promoções</h3>
      <div class="orders-list">${PROMOS.map((p) => `<label class="order-card switch-row"><input type="checkbox" data-promo="${p.codigo}" ${state.config.promosAtivas[p.codigo] ? "checked" : ""}><span><strong>${p.codigo}:</strong> ${p.texto}</span></label>`).join("")}</div>
      <h3 class="sub-title">Cobertura de entrega (por CEP)</h3>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Faixa</th><th>CEPs</th><th>Taxa</th></tr></thead><tbody>
      ${CEP_FAIXAS.map((f) => `<tr><td>${f.nome}</td><td>${f.de}-000 a ${f.ate}-999</td><td>${money(f.taxa)}</td></tr>`).join("")}</tbody></table></div>`;
  }
}

function staffAction(act, id) {
  const o = state.orders.find((x) => x.id === id);
  if (!o) return;
  if (act === "confirm") setStatus(id, S.PAGAMENTO);
  if (act === "reject") { devolverVoucher(o); setStatus(id, S.RECUSADO); }
  if (act === "prep") setStatus(id, S.PREPARO);
  if (act === "ready") setStatus(id, o.entrega ? S.ROTA : S.PRONTO);
  if (act === "done") setStatus(id, S.CONCLUIDO);
}

/* ---------- navegação ---------- */
function showView(view) {
  ["menu", "orders", "rewards", "privacy", "staff"].forEach((v) => $("#" + v + "-view").classList.toggle("hidden", v !== view));
  $$(".nav-link").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $(".staff-toggle").classList.toggle("active", view === "staff");
  if (view === "orders") renderOrders();
  if (view === "rewards") renderPoints();
  if (view === "privacy") renderPrivacy();
  if (view === "staff") renderStaff();
  window.scrollTo({ top: $("#" + view + "-view").offsetTop - 110, behavior: "smooth" });
}

function setChannel(c) {
  document.body.classList.remove("channel-app", "channel-totem");
  if (c !== "web") document.body.classList.add("channel-" + c);
  $$("[data-channel]").forEach((b) => b.classList.toggle("active", b.dataset.channel === c));
  if (c === "totem") showView("menu");
}

/* ---------- eventos ---------- */
document.addEventListener("click", (e) => {
  const t = e.target;
  const q = (sel) => t.closest(sel);
  let el;
  if ((el = q("[data-add]"))) addToCart(el.dataset.add);
  if ((el = q("[data-qty]"))) {
    const item = state.cart.find((i) => i.id === el.dataset.qty);
    if (item) { item.qty += Number(el.dataset.change); if (item.qty <= 0) state.cart = state.cart.filter((i) => i !== item); }
    renderCart();
  }
  if ((el = q("[data-close]"))) closeOverlay(el.dataset.close);
  if ((el = q("[data-view]"))) { if (el.tagName === "A") e.preventDefault(); showView(el.dataset.view); }
  if ((el = q("[data-category]"))) { state.category = el.dataset.category; $$(".category").forEach((b) => b.classList.toggle("active", b === el)); renderProducts(); }
  if ((el = q("[data-channel]"))) setChannel(el.dataset.channel);
  if ((el = q("[data-auth]"))) setAuthMode(el.dataset.auth);
  if ((el = q("[data-paymethod]"))) setPayMethod(el.dataset.paymethod);
  if ((el = q("[data-pay]"))) openPay(el.dataset.pay);
  if ((el = q("[data-cancel]"))) cancelOrder(el.dataset.cancel);
  if ((el = q("[data-reward]"))) redeemProduct(Number(el.dataset.reward));
  if ((el = q("[data-staff]"))) { state.staffTab = el.dataset.staff; $$("[data-staff]").forEach((b) => b.classList.toggle("active", b === el)); renderStaff(); }
  if ((el = q("[data-staff-act]"))) staffAction(el.dataset.staffAct, el.dataset.id);
  if ((el = q("[data-action]"))) {
    const a = el.dataset.action;
    if (a === "open-auth") openAuth("login");
    if (a === "logout") logout();
    if (a === "redeem-discount") redeemDiscount();
    if (a === "redeem-product") openRedeemProduct();
    if (a === "export-data") exportData();
    if (a === "delete-account") deleteAccount();
    if (a === "pay-retry") { $("#pay-result").classList.add("hidden"); $("#pay-form").classList.remove("hidden"); }
    if (a === "dismiss-consent") { store.set("rn-aviso", true); $("#consent-bar").classList.add("hidden"); }
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.id === "marketing-toggle") { user().marketing = t.checked; persist(); toast(t.checked ? "Você aceitou receber ofertas." : "Você não vai mais receber ofertas."); }
  if (t.dataset.avail) {
    const id = t.dataset.avail;
    state.config.indisponiveis = t.checked ? state.config.indisponiveis.filter((x) => x !== id) : [...state.config.indisponiveis, id];
    persist(); renderProducts(); renderCart();
  }
  if (t.dataset.promo) { state.config.promosAtivas[t.dataset.promo] = t.checked; persist(); renderPromos(); }
});

$("#unit-select").addEventListener("change", (e) => {
  if (state.cart.length) { state.cart = []; state.coupon = null; toast("Você trocou de unidade, então esvaziamos o carrinho."); }
  state.unit = e.target.value;
  renderUnitInfo(); renderProducts(); renderCart();
});
$("#cart-open").addEventListener("click", () => { renderCart(); openOverlay("cart-overlay"); });
$("#hero-order").addEventListener("click", () => $("#menu-view").scrollIntoView({ behavior: "smooth" }));
$("#fulfillment").addEventListener("change", renderCart);
$("#cep").addEventListener("input", (e) => {
  let d = e.target.value.replace(/\D/g, "").slice(0, 8);
  e.target.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  renderCart();
  if (d.length === 8) validateCep(); else { $("#cep-feedback").textContent = "Digite o CEP para ver se entregamos aí."; $("#cep-feedback").className = "muted"; }
});
$("#coupon-apply").addEventListener("click", applyCoupon);
$("#voucher-select").addEventListener("change", renderCart);
$("#checkout-button").addEventListener("click", checkout);
$("#auth-form").addEventListener("submit", handleAuth);
$("#pay-submit").addEventListener("click", sendPayment);
$("#card-number").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "); });
$("#card-exp").addEventListener("input", (e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; });
$$(".overlay").forEach((ov) => ov.addEventListener("click", (e) => { if (e.target === ov) closeOverlay(ov.id); }));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".overlay").forEach((o) => o.classList.add("hidden")); });

/* ---------- início ---------- */
renderUnitInfo(); renderPromos(); renderProducts(); afterAuthChange();
if (state.email && !user()) { state.email = null; persist(); afterAuthChange(); }
if (!store.get("rn-aviso", false)) $("#consent-bar").classList.remove("hidden");
