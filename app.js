const products=[
{id:1,name:"La Roche-Posay Effaclar Gel Moussant",price:8500,old:10000,cat:"Dermatologie",format:"200 ml",rating:4.8,stock:"Disponible",img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80"},
{id:2,name:"Doliprane 1000 mg",price:3500,old:0,cat:"Médicaments",format:"8 comprimés",rating:4.7,stock:"Selon disponibilité",img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80"},
{id:3,name:"CeraVe Crème Hydratante",price:12500,old:0,cat:"Dermatologie",format:"340 g",rating:4.9,stock:"Disponible",img:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80"},
{id:4,name:"Avène Eau Thermale",price:7500,old:0,cat:"Hygiène",format:"300 ml",rating:4.8,stock:"Disponible",img:"https://images.unsplash.com/photo-1600428877878-1a0e5a6b0bfc?auto=format&fit=crop&w=900&q=80"},
{id:5,name:"Mustela Hydra Bébé",price:9500,old:0,cat:"Bébé",format:"300 ml",rating:4.8,stock:"Disponible",img:"https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80"},
{id:6,name:"Eucerin Anti-Pigment",price:18500,old:21000,cat:"Dermatologie",format:"50 ml",rating:4.7,stock:"Disponible",img:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80"},
{id:7,name:"Bioderma Atoderm Crème",price:11000,old:0,cat:"Dermatologie",format:"500 ml",rating:4.8,stock:"Disponible",img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80"},
{id:8,name:"Soin Bucco-Dentaire",price:4500,old:0,cat:"Bucco-dentaire",format:"75 ml",rating:4.6,stock:"Disponible",img:"https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80"}
];
const categories=["Médicaments","Douleur & fièvre","Rhume & allergies","Digestion","Dermatologie","Hygiène","Bébé","Santé femme","Santé homme","Vitamines & bien-être","Bucco-dentaire","Ophtalmologie","Auriculaire"];
const filters=["Tous","Peau sèche","Peau grasse","Acné","Taches","Peau sensible","Hydratation","Bébé"];
const money=n=>new Intl.NumberFormat("fr-FR").format(n)+" FCFA";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function splitText(el){el.innerHTML=el.textContent.trim().split(/\s+/).map((w,i)=>`<span class="word" style="--delay:${i*38}ms">${w}</span>`).join(" ")}
$$(".split").forEach(splitText);

function card(p){
return `<article class="product-card">
<div class="product-img"><img src="${p.img}" loading="lazy" alt="${p.name}"></div>
<div class="product-body"><span class="mono">${p.cat}</span><h3>${p.name}</h3><p>${p.format} · ★ ${p.rating}</p><span class="product-price">${money(p.price)}</span>${p.old?` <del>${money(p.old)}</del>`:""}
<div class="product-foot"><small class="mono">${p.stock}</small><button class="add" data-add="${p.id}">Ajouter</button></div></div></article>`}

$("#productRail").innerHTML=products.slice(0,6).map(card).join("");
function renderPara(type="Tous"){
let arr=products.filter(p=>["Dermatologie","Bébé","Hygiène","Bucco-dentaire"].includes(p.cat));
if(type==="Bébé")arr=arr.filter(p=>p.cat==="Bébé");
if(type==="Hydratation")arr=arr.filter(p=>/CeraVe|Atoderm|Mustela/i.test(p.name));
$("#paraGrid").innerHTML=arr.map(card).join("");
}
renderPara();

$("#categoryGrid").innerHTML=categories.map((x,i)=>`<a class="category" href="#products"><span class="mono">${String(i+1).padStart(2,"0")}</span><h3>${x}</h3><span>→</span></a>`).join("");
$("#priceTable").innerHTML=products.map(p=>`<tr><td>${p.name}</td><td>${p.cat}</td><td>${p.format}</td><td class="td-price">${money(p.price)}</td><td>${p.stock}</td></tr>`).join("");
$("#filters").innerHTML=filters.map((x,i)=>`<button class="filter ${i===0?"active":""}" data-filter="${x}">${x}</button>`).join("");
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderPara(b.dataset.filter)});

let cart=JSON.parse(localStorage.getItem("pharma_cart")||"[]");
function save(){localStorage.setItem("pharma_cart",JSON.stringify(cart));renderCart()}
function renderCart(){
$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
$("#cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(y=>y.id===x.id);return `<div class="cart-line"><div><b>${p.name}</b><br><small>${money(p.price)}</small></div><div class="qty"><button data-minus="${p.id}">−</button>${x.qty}<button data-plus="${p.id}">+</button></div></div>`}).join(""):`<p class="mono">PANIER VIDE</p>`;
let total=cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0);$("#cartTotal").textContent=money(total);
}
document.addEventListener("click",e=>{
let add=e.target.closest("[data-add]");if(add){let id=+add.dataset.add,i=cart.find(x=>x.id===id);i?i.qty++:cart.push({id,qty:1});save();openCart()}
let plus=e.target.closest("[data-plus]");if(plus){cart.find(x=>x.id===+plus.dataset.plus).qty++;save()}
let minus=e.target.closest("[data-minus]");if(minus){let i=cart.find(x=>x.id===+minus.dataset.minus);i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.id!==i.id);save()}
});
const drawer=$("#cartDrawer"),overlay=$("#overlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("open")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open")}
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;overlay.onclick=closeCart;$("#checkout").onclick=()=>alert("Connectez cette action à votre backend de commande.");
renderCart();

$("#openMenu").onclick=()=>$("#mobileNav").classList.toggle("open");
$$(".mobile-nav a").forEach(a=>a.onclick=()=>$("#mobileNav").classList.remove("open"));
$("#openSearch").onclick=()=>{document.querySelector("#searchSection").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#searchInput").focus(),400)};

function search(q){
let s=q.toLowerCase().trim(),arr=s?products.filter(p=>(p.name+" "+p.cat+" "+p.format).toLowerCase().includes(s)):products.slice(0,4);
$("#searchResults").innerHTML=arr.map(p=>`<div class="result"><span>${p.name} · ${p.cat}</span><strong>${money(p.price)}</strong></div>`).join("")||"<span class='mono'>AUCUN RÉSULTAT</span>";
}
$("#searchInput").oninput=e=>search(e.target.value);search("");

const drop=$("#dropzone"),file=$("#prescriptionFile");
file.onchange=()=>$("#fileName").textContent=file.files[0]?.name||"";
["dragenter","dragover"].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.add("drag")}));
["dragleave","drop"].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.remove("drag")}));
drop.ondrop=e=>{let f=e.dataTransfer.files[0];if(f)$("#fileName").textContent=f.name};

const hero=$("#heroCanvas"),ctx=hero.getContext("2d"),dpr=Math.min(devicePixelRatio||1,2);
function resize(){hero.width=innerWidth*dpr;hero.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
resize();addEventListener("resize",resize);
let time=0;
function draw(){
ctx.clearRect(0,0,innerWidth,innerHeight);
for(let y=30;y<innerHeight;y+=48)for(let x=-20;x<innerWidth;x+=65){
let a=.03+.06*(.5+.5*Math.sin(time+x*.008+y*.003));ctx.strokeStyle=`rgba(232,62,54,${a})`;ctx.lineWidth=1;
let dx=Math.sin(time+x*.012)*8;ctx.beginPath();ctx.moveTo(x+dx,y);ctx.lineTo(x+dx+30,y+Math.sin(x*.04)*3);ctx.stroke()
}
time+=.008;requestAnimationFrame(draw)
}
draw();

function stageProgress(el){let r=el.getBoundingClientRect(),total=el.offsetHeight-innerHeight;return Math.max(0,Math.min(1,-r.top/Math.max(1,total)))}
let ticking=false;
addEventListener("scroll",()=>{
if(ticking)return;ticking=true;requestAnimationFrame(()=>{
ticking=false;
let h=stageProgress($(".hero-stage")),m=stageProgress($(".manifesto-stage")),r=stageProgress($(".products-stage")),s=stageProgress($(".spotlight-stage"));
document.documentElement.style.setProperty("--hero-y",`${-90*h}px`);
document.documentElement.style.setProperty("--hero-scale",1-.26*h);
document.documentElement.style.setProperty("--hero-alpha",1-h);
document.documentElement.style.setProperty("--wipe",`${m*100}%`);
document.documentElement.style.setProperty("--manifesto-scale",1+.05*m);
let rail=$("#productRail"),overflow=Math.max(0,rail.scrollWidth-innerWidth+innerWidth*.04);
document.documentElement.style.setProperty("--rail-x",`${-r*overflow}px`);
$("#railProgress").style.width=`${r*100}%`;
document.documentElement.style.setProperty("--packet-a",Math.min(1,s*2));
document.documentElement.style.setProperty("--packet-y",`${38*(1-Math.min(1,s*2))}px`);
document.documentElement.style.setProperty("--packet-scale",.78+.22*Math.min(1,s*2));
document.documentElement.style.setProperty("--packet-cut",Math.max(0,(s-.82)/.18));
let phase=Math.min(3,Math.floor(s*4.01));
$$(".cue").forEach((x,i)=>x.classList.toggle("active",i<=phase));
let states=["ANALYSE DU PRODUIT...","INDICATION IDENTIFIÉE","VÉRIFICATIONS TERMINÉES","PRÊT À ÊTRE COMMANDÉ"];
$("#spotStatus").textContent=states[phase];
$("#lot").textContent=phase>=1?"FR-2048":"—";$("#test").textContent=phase>=1?"96%":"PENDING";$("#window").textContent=phase>=2?"SEP → DEC":"—";
})},{passive:true});

const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");revealObserver.unobserve(e.target)}}),{threshold:.12});
$$(".split").forEach(x=>revealObserver.observe(x));

const chapterObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){let r=e.target.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height))),i=Math.min(2,Math.floor(p*3));$$(".chapter").forEach((c,n)=>c.classList.toggle("active",n===i))}}),{threshold:[.2,.5,.8]});
$$(".chapter").forEach(x=>chapterObs.observe(x));
