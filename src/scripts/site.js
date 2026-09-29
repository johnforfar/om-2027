(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = function (n, d) { return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  var QS = ["Q4 2026", "Q1 2027", "Q2 2027", "Q3 2027"], QF = [1.03, 1, 0.965, 0.93], qi = 1;
  var MK = [
    { id: "GPU",   cat: "cloud", tag: "GPU",  n: "GPU",        sub: "Accelerator · per GPU · hour",        p: 0.989, dec: 3, unit: "GPU-hr",  c: 1.42,  oi: "41.2M GPU-hr", vol: "$6.84M", f: 0.0041 },
    { id: "VCPU",  cat: "cloud", tag: "VCPU", n: "CPU",        sub: "Compute · per vCPU · month",          p: 42.05, dec: 2, unit: "vCPU-mo", c: 0.82,  oi: "2.4M vCPU-mo", vol: "$3.10M", f: 0.0018 },
    { id: "RAM",   cat: "cloud", tag: "CLOU", n: "RAM",        sub: "per GB · month",                      p: 3.04,  dec: 2, unit: "GB-mo",   c: -0.34, oi: "18.7M GB-mo",  vol: "$1.42M", f: -0.0012 },
    { id: "BLK",   cat: "cloud", tag: "BLK",  n: "Storage",    sub: "SSD · per TB · month",                p: 50.10, dec: 2, unit: "TB-mo",   c: 0.61,  oi: "412K TB-mo",   vol: "$2.21M", f: 0.0019 },
    { id: "BW",    cat: "cloud", tag: "BW",   n: "Network",    sub: "Egress · per TB",                     p: 5.00,  dec: 2, unit: "TB",      c: 0.12,  oi: "1.9M TB",      vol: "$0.96M", f: 0.0006 },
    { id: "HWCPU", cat: "hw",    tag: "REF",  n: "CPU",        sub: "USD per physical core",               ref: true, chg: -82.3, p: 17.7, dec: 2, unit: "index", c: -0.21, oi: "—", vol: "$0.41M", f: 0 },
    { id: "HWGPU", cat: "hw",    tag: "REF",  n: "GPU",        sub: "USD per FP32 TFLOPS at launch MSRP",  ref: true, chg: -98.9, p: 1.10, dec: 2, unit: "index", c: -0.08, oi: "—", vol: "$0.62M", f: 0 },
    { id: "HWRAM", cat: "hw",    tag: "RAM",  n: "RAM",        sub: "Memory · DRAM spot · per GB",         p: 9.13,  dec: 2, unit: "GB",      c: 2.24,  oi: "6.3M GB",      vol: "$2.74M", f: 0.0088 },
    { id: "HWSSD", cat: "hw",    tag: "HWSS", n: "SSD",        sub: "per GB",                              p: 0.090, dec: 3, unit: "GB",      c: -0.58, oi: "44M GB",       vol: "$0.91M", f: -0.0021 },
    { id: "HWHDD", cat: "hw",    tag: "REF",  n: "HDD",        sub: "USD per TB",                          ref: true, chg: -97.9, p: 2.10, dec: 2, unit: "index", c: -0.05, oi: "—", vol: "$0.18M", f: 0 },
    { id: "HWNET", cat: "hw",    tag: "REF",  n: "Networking", sub: "USD per Gbps of port capacity",       ref: true, chg: -99.3, p: 0.70, dec: 2, unit: "index", c: -0.02, oi: "—", vol: "$0.12M", f: 0 }
  ];
  var CATS = [["cloud", "Cloud compute"], ["hw", "Physical hardware"]];
  MK.forEach(function (m) { m.d = QS[qi]; m.base = m.p; m.spark = []; var v = m.p * rnd(0.94, 1.06); for (var i = 0; i < 28; i++) { v += v * rnd(-0.015, 0.016); m.spark.push(v); } m.spark[27] = m.p; });
  function label(m) { return m.n + " · " + m.tag; }
  function pDisp(m) { return m.ref ? (m.chg >= 0 ? "+" : "−") + Math.abs(m.chg).toFixed(1) + "%" : "$" + fmt(m.p, m.dec); }
  function setQuarter(i) { var old = qi; qi = i; MK.forEach(function (m) { if (m.ref) { m.d = QS[qi]; return; } m.p = m.p / QF[old] * QF[qi]; m.base = m.base / QF[old] * QF[qi]; m.d = QS[qi]; }); }

  var LAND_B64 = "AAgAAA8AAAAVAAAAABt////AACE/x//+AAAoH/L///wALh/4H///8AA0F/4H////wAA6B//Af////gAAQAAT+Af////4AEYAAEoA//////AATAAAA4Af//f//8AAUgAAAGAAAP8///wAAFgAAAAIAAAD+f//gABeAAAABAAAAAwD+XgAAGQAAAAAgAAAAAAAAAAAAGkAAAAAEAAAAAAAAAAAAABvAAAAAAAAAAAAAAAAAAAAdAAAAAAAAAAAAAAAAAAAAAB6AAAAAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAACEAAAAAAAAAAAAAAAAAAAAAAAAigAAAAAAMAAAAAAAAAAAAAAAAACPAAAAAAAgAAAAAAAAAAAAAAAAAJQAAAAAAAwAAAAAAAAAAAAAAAAAAJkAAAAAAA4AAAAAAAAAAAAAAAAAAACdAAAAAAADgAAAAAAAAAAAAAAAAAAAogAAAAAAAOAAAAAAAAAAAAAAAAAAAACnAAAAAAAAcAAAAAAAAAAAAAAAAABgAKsAAAAAAAAcAAAAAAAAAAAAAAAAAAYAALAAAAAAAAAPgAAAAAAAAAAAAAAAAQAYALQAAAAAAAAHgAAAAAAAAAAAAAAAADAAgAC4AAAAAAAAA/AAAAAAAAAAAAAAAAAAAAQAvAAAAAAAAAD/AAAAAAAAAAAAAAAAACAAYADAAAAAAAAAAH/AAAAAAAAAAAAAAAAAHwAAAMMAAAAAAAAAP+AAAAAAAAAAAAAAAAAP4AEAAMcAAAAAAAAAD/wAAAAAA4AAAAAAABwC/gAAAMoAAAAAAAAAB/8AAAAAAfgAAAAAAAPg/+AAAADOAAAAAAAAAAP/wAAAAAB/AAAAAAAAf//+AAAA0QAAAAAAAAAB//AAAAAAP+AAAAAAAB///8AAAADUAAAAAAAAAAD/+AAAAAAf+AAAAAAAB///8AAAANcAAAAAAAAAAH/8AAAAAAf+AAAAAAAB///+AAAA2gAAAAAAAAAAP/8AAAAAA//AgAAAAAA///+AAAAA3AAAAAAAAAAAH//AAAAAAf/wYAAAAAAf///AAAAA3wAAAAAAAAAAD//8AAAAAP/4OAAAAAAD///wAgAA4QAAAAAAAAAAB//+AAAAAH/8DgAAAAAAP//4AAAAAOMAAAAAAAAAAAf//wAAAAB//wcAAAAAAAP//AAAAADlAAAAAAAAAAAH///AAAAAP//DwAAAAAAA/+4AABAA5wAAAAAAAAAAD///4AAAAB//+OAAAAAAAB/zgAAAAOgAAAAAAAAAAB///+AAAAAP//wQAAAAAAAF4YAAAADqAAAAAAAAAAAf///wAAAAB//+AAAAAAAAADxAAAAAAOsAAAAAAAAAAB////gAAAAD//8AAAAAAAAAICAAAAAA7AAAAAAAAAAAH////AAAAAH//wAAAAAAAAEAAQAAAADtAAAAAAAAAAAf///+AAAAAf//AAAAAAAAfEAZAAAAAO4AAAAAAAAAAD////8AAAAB//+AAAAAAAeAAB8AAAAA7wAAAAAAAAAAP////wAAAAD//4AAAAAABAAAHwAAAADvAAAAAAAAAAA////8AAAAAf//wAAAAAAcAIB/AAAAAPAAAAAAAAAAAD///+AAAAAD///gAAAAABx9gFwAAAAA8AAAAAAAAAAAP///gAAAAAP///AAAAAAGHxAgAAAAADwAAAAAAAAAAAf//4AAAAAA///+AAAAAA4fOQAAAAAAPAAAAAAAAAAAA///AAAAAAB///8AAAAADg+AAAAAAAA8AAAAAAAAAAAD//8AAAAAAP///4AAAAAWAwAAAAAAADvAAAAAAAAAAAP//gAAAAwH////wAAAAEwDAAAAAAAAO4AAAAAAAAAAA//gAAAAP/////+AAAIAEAIQAAAAAAA7gAAAAAAAAAAX/8AAAAD//////8AAAgAgADgAAAAAADtAAAAAAAAAAEG/AAAAAP//////wAAUAEACQAAAAAAAOwAAAAAAAAAAgeAAAAAD//////nAADAADgCAAAAAAAA6gAAAAAAAAAOAQAAAAA//////4AAA4AF8AAAAAAAAADpAAAAAAAAAH4AAAAAAD/////+8AAHAA/gAAAAAAAAAOcAAAAAAAAA/AAAAAAAf/////n4AB4AP4CAAAAAAADmAAAAAAAAH+AAAAAAAH/////z/AA/Af4AgAAAAAAA5AAAAAAAAP3AHwAAAAD/////z/wA/gP5AgAAAAAAAOIAAQAAAAHwwMAAAAAB/////z/4Af4P8gAAAAAAAADfAAQAAAAD4AEAAAAAB/////z/8Bf4/8AAAAAAAADdAAAAAAAHwAgAAAAAB/////P/4H////yAAAAAAADaAAAAAABPwAAAAAAAD////8/yA/////IAAAAAAADYAAAAAAA/wBAAAAAAH////7/D//////AAAAAAANUAAAAAAX+AIAAAAAAf///8/z//////wAAAAAAA0gAAAAAD/4BAAAAAAB/////5//////8AAAAAAADPAAAAAAX//4AAAAAAP//f////////+AAAAAAAzAAAAAAP//8AAAAAAH/+cD///////+CAAAAAAMgAAAAAH///AAAAAAD/wAD///////4qAAAAAMUAAAAA////AAAAAAH/AAv///////CeAAAAAMEAAAAB////AAAAAAR8AK///////4wwAAAAAL0AAAAD///8AAAAADwGB/8f////+MAAAAAAuQAAAAf///gAAAAA8AE//P/////UCAAAAAC1AAAAD///+AAAAAPgL33j//////AAAAAAsQAAAB////wAAAAPwjwHP/////+GAAAAAK0AAAAf///4AAAAA9vwef//////EAAAAKgAAAA///++AAAAH//Tx//////wAAAApAAAAD////AAAAB//++//////4AAAACfAAAAf///4wAAB//////////6AAAAmgAAAP///wgAAAP/////////oAAAAJUAAAf//7/wAAJv/////////BAAAJAIAA/////AAA8/////////AwAAiwAAH//9/gAAKA///////8AwAACGAQB//8PwAABDH//////8BgAAgQDA//4HwAADBP//////4GAAAHwCg//4HQAAALP//////gYAAHYHz//wMAgAJ7///////MAAcQ///+HAYAA9///////+AABrI///wMOAAG///////+AAZU///+cODgOz//////gAYAf//88+AAAAAAAAAABaD/8vOPgAAAAAAAAAAFQPzcrH8APAv///sABO/////////////ABIAB64fwAAP/yAAEIAMAH4ABB4AAAAPAAVj+AAB4QAADYAQv8EACAAADAAL/hgBAAAKgA/4QCAAAAjAG4AAAAAHQCYAAAAFwAAAAARAAAAAAoAAA==";
  var LAND = (function () { var bin = atob(LAND_B64), pts = [], i = 0, row = 0; while (i < bin.length) { var n = (bin.charCodeAt(i) << 8) | bin.charCodeAt(i + 1); i += 2; var lat = -88 + row * 1.5, bytes = Math.ceil(n / 8); for (var j = 0; j < n; j++) { var byte = bin.charCodeAt(i + (j >> 3)), bit = (byte >> (7 - (j & 7))) & 1; if (bit) pts.push([lat, -180 + 360 * (j + 0.5) / n]); } i += bytes; row++; } return pts; })();
  var SITES = [[59.9,10.7,"OSL"],[52.5,13.4,"BER"],[50.1,8.7,"FRA"],[51.5,-0.1,"LON"],[48.9,2.3,"PAR"],[59.3,18.1,"STO"],[64.1,-21.9,"REY"],[40.7,-74,"NYC"],[39,-77.5,"IAD"],[41.9,-87.6,"CHI"],[32.8,-96.8,"DFW"],[37.4,-121.9,"SJC"],[45.5,-122.7,"PDX"],[25.8,-80.2,"MIA"],[1.35,103.8,"SIN"],[35.7,139.7,"TYO"],[37.6,127,"ICN"],[22.3,114.2,"HKG"],[-33.9,151.2,"SYD"],[19.1,72.9,"BOM"],[25.2,55.3,"DXB"],[-23.5,-46.6,"GRU"],[-26.2,28,"JNB"],[55.8,37.6,"MOW"],[43.7,-79.4,"YYZ"],[33.7,-84.4,"ATL"],[47.6,-122.3,"SEA"],[-34.6,-58.4,"EZE"],[13.8,100.5,"BKK"],[28.6,77.2,"DEL"]];
  var LINKS = [[0,2],[2,3],[3,7],[7,8],[8,11],[11,15],[15,14],[14,19],[19,20],[20,2],[1,5],[5,0],[6,3],[9,10],[10,13],[13,21],[21,22],[22,20],[16,17],[17,14],[18,14],[23,2],[24,7],[25,10],[26,11],[27,21],[28,14],[29,19],[12,11]];
  var rot = 0.8, tilt = -0.42;
  function sph(lat, lon, R) { var la = lat * Math.PI / 180, lo = lon * Math.PI / 180 + rot; var x = R * Math.cos(la) * Math.sin(lo), y = -R * Math.sin(la), z = R * Math.cos(la) * Math.cos(lo); var y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt); return [x, y2, z2]; }
  function renderGlobe(g2, cx, cy, R, st) {
    var glow = g2.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R * 1.1); glow.addColorStop(0, st.glowA); glow.addColorStop(0.6, st.glowB); glow.addColorStop(1, "rgba(0,0,0,0)");
    g2.fillStyle = glow; g2.beginPath(); g2.arc(cx, cy, R * 1.1, 0, Math.PI * 2); g2.fill();
    var body = g2.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.05, cx, cy, R); body.addColorStop(0, st.oceanA); body.addColorStop(0.75, st.oceanB); body.addColorStop(1, st.oceanC);
    g2.fillStyle = body; g2.beginPath(); g2.arc(cx, cy, R, 0, Math.PI * 2); g2.fill();
    g2.strokeStyle = st.ring; g2.lineWidth = st.ringW; g2.beginPath(); g2.arc(cx, cy, R, 0, Math.PI * 2); g2.stroke();
    var dr = Math.max(0.7, R * 0.0072);
    for (var li0 = 0; li0 < LAND.length; li0++) { var lp = sph(LAND[li0][0], LAND[li0][1], R); if (lp[2] <= 0) continue; var k = lp[2] / R; g2.fillStyle = st.land(k); g2.beginPath(); g2.arc(cx + lp[0], cy + lp[1], dr * (0.6 + 0.5 * k), 0, Math.PI * 2); g2.fill(); }
    var pts = SITES.map(function (s) { return sph(s[0], s[1], R); });
    LINKS.forEach(function (l, li) {
      var a = pts[l[0]], b = pts[l[1]]; if (a[2] < R * 0.05 || b[2] < R * 0.05) return;
      g2.beginPath();
      for (var t = 0; t <= 1.001; t += 0.05) { var x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t, len = Math.sqrt(x * x + y * y + z * z) || 1, lift = 1 + 0.18 * Math.sin(Math.PI * t); x = x / len * R * lift; y = y / len * R * lift; t ? g2.lineTo(cx + x, cy + y) : g2.moveTo(cx + x, cy + y); }
      var phase = ((Date.now() / 1400 + li * 0.37) % 1);
      g2.strokeStyle = st.link(0.5 + 0.5 * Math.sin(phase * Math.PI * 2)); g2.lineWidth = st.linkW; g2.stroke();
      var ax = a[0] + (b[0] - a[0]) * phase, ay = a[1] + (b[1] - a[1]) * phase, az = a[2] + (b[2] - a[2]) * phase, ln = Math.sqrt(ax * ax + ay * ay + az * az) || 1, lf = 1 + 0.18 * Math.sin(Math.PI * phase);
      g2.fillStyle = st.packet; g2.beginPath(); g2.arc(cx + ax / ln * R * lf, cy + ay / ln * R * lf, st.packetR, 0, Math.PI * 2); g2.fill();
    });
    g2.font = "10px Inter, sans-serif"; g2.textAlign = "left";
    pts.forEach(function (p, i) {
      var front = p[2] > 0, r = front ? st.nodeR : st.nodeR * 0.65;
      g2.beginPath(); g2.arc(cx + p[0], cy + p[1], r, 0, Math.PI * 2); g2.fillStyle = front ? st.node : st.nodeBack; g2.fill();
      if (front) { g2.beginPath(); g2.arc(cx + p[0], cy + p[1], r + 4 + 2 * Math.sin(Date.now() / 500 + i), 0, Math.PI * 2); g2.strokeStyle = st.pulse; g2.lineWidth = 1; g2.stroke(); if (st.labels && p[2] > R * 0.55) { g2.fillStyle = st.label; g2.fillText(SITES[i][2], cx + p[0] + 8, cy + p[1] + 4); } }
    });
  }

  var hc = document.getElementById("heroCanvas"), hx = hc.getContext("2d"), heroEl0 = document.getElementById("top");
  var series = [], N = 150, raw = 100, hv = 100;
  for (var i = 0; i < N; i++) { raw += rnd(-1.5, 1.72); hv += (raw - hv) * 0.22; series.push(hv); }
  var priceTag = document.getElementById("heroPrice"), mouse = null, heroSpot = document.getElementById("heroSpot"), heroVisible = true;
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(hc);
  var heroGeom = {}, g2save = 1;
  function drawHero() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = hc.clientWidth, H = hc.clientHeight; if (!W || !H) return;
    if (hc.width !== W * dpr) { hc.width = W * dpr; hc.height = H * dpr; }
    hx.setTransform(dpr, 0, 0, dpr, 0, 0); hx.clearRect(0, 0, W, H);
    var mn = Math.min.apply(null, series), mx = Math.max.apply(null, series), sp = (mx - mn) || 1;
    var small = W < 640, top = small ? H * 0.05 : H * 0.22, bot = small ? H * 0.34 : H * 0.8, left = -W * 0.02, right = small ? W * 0.94 : W * 0.985, scale = MK[0].p / series[N - 1];
    var x = function (i) { return left + (right - left) * i / (N - 1); }, y = function (v) { return bot - (v - mn) / sp * (bot - top); };
    heroGeom = { x: x, y: y, W: W, H: H };
    hx.strokeStyle = "rgba(255,255,255,0.06)"; hx.lineWidth = 1; hx.font = "10px Inter, sans-serif"; hx.fillStyle = "rgba(255,255,255,0.4)"; hx.textAlign = "right";
    for (var g = 0; g <= 4; g++) { var gv = mn + sp * g / 4, gy = y(gv); hx.beginPath(); hx.moveTo(0, gy); hx.lineTo(W, gy); hx.stroke(); hx.fillText((gv * scale).toFixed(3), W - 12, gy - 4); }
    hx.beginPath(); for (var k = 0; k < N; k++) { var v2 = series[k] * 0.93 - 2 + Math.sin(k / 11) * 1.6; k ? hx.lineTo(x(k), y(v2)) : hx.moveTo(x(k), y(v2)); }
    hx.strokeStyle = "rgba(255,255,255,0.28)"; hx.setLineDash([4, 6]); hx.lineWidth = 1.2; hx.stroke(); hx.setLineDash([]);
    var path = new Path2D(); path.moveTo(x(0), y(series[0])); for (var j = 1; j < N; j++) path.lineTo(x(j), y(series[j]));
    var fill = new Path2D(path); fill.lineTo(x(N - 1), H); fill.lineTo(x(0), H); fill.closePath();
    var grad = hx.createLinearGradient(0, top, 0, H); grad.addColorStop(0, "rgba(212,255,59,0.28)"); grad.addColorStop(0.6, "rgba(124,92,255,0.06)"); grad.addColorStop(1, "rgba(124,92,255,0)");
    hx.fillStyle = grad; hx.fill(fill);
    var lg = hx.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, "#7C5CFF"); lg.addColorStop(0.5, "#D4FF3B"); lg.addColorStop(1, "#F4FFC2");
    hx.save(); hx.shadowColor = "rgba(212,255,59,0.7)"; hx.shadowBlur = 22; hx.strokeStyle = lg; hx.lineWidth = 2.6; hx.lineJoin = "round"; hx.stroke(path); hx.restore();
    hx.strokeStyle = lg; hx.lineWidth = 2.6; hx.stroke(path);
    var ex = x(N - 1), ey = y(series[N - 1]), pulse = 0.5 + 0.5 * Math.sin(Date.now() / 420);
    hx.beginPath(); hx.arc(ex, ey, 14 + pulse * 8, 0, Math.PI * 2); hx.fillStyle = "rgba(212,255,59," + (0.35 - pulse * 0.2) + ")"; hx.fill();
    hx.beginPath(); hx.arc(ex, ey, 6, 0, Math.PI * 2); hx.fillStyle = "#D4FF3B"; hx.fill(); hx.beginPath(); hx.arc(ex, ey, 6, 0, Math.PI * 2); hx.strokeStyle = "#fff"; hx.lineWidth = 2; hx.stroke();
    hx.strokeStyle = "rgba(255,255,255,0.3)"; hx.setLineDash([3, 5]); hx.beginPath(); hx.moveTo(0, ey); hx.lineTo(ex, ey); hx.stroke(); hx.setLineDash([]);
    if (mouse) {
      var mi = Math.max(0, Math.min(N - 1, Math.round((mouse[0] - left) / (right - left) * (N - 1)))), cxp = x(mi), cyp = y(series[mi]);
      hx.strokeStyle = "rgba(255,255,255,0.3)"; hx.setLineDash([2, 4]); hx.beginPath(); hx.moveTo(cxp, top - 20); hx.lineTo(cxp, H); hx.moveTo(0, cyp); hx.lineTo(W, cyp); hx.stroke(); hx.setLineDash([]);
      hx.beginPath(); hx.arc(cxp, cyp, 5, 0, Math.PI * 2); hx.fillStyle = "#fff"; hx.fill();
      priceTag.className = "hero-price cross" + (cxp > W - 110 ? " edge" : ""); priceTag.style.left = cxp + "px"; priceTag.style.top = cyp + "px";
      priceTag.innerHTML = "<b>" + (series[mi] * scale).toFixed(3) + "</b><span>" + (mi === N - 1 ? "now" : "-" + (N - 1 - mi) * 4 + "m") + "</span>";
    } else {
      priceTag.className = "hero-price" + (ex > W - 110 ? " edge" : ""); priceTag.style.left = ex + "px"; priceTag.style.top = ey + "px";
      priceTag.innerHTML = "<b>" + fmt(MK[0].p, 3) + "</b><span>GPU · " + QS[qi].replace("20", "") + "</span>";
    }
  }
  drawHero(); window.addEventListener("resize", drawHero);
  heroEl0.addEventListener("mousemove", function (e) { var r = hc.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; heroSpot.style.setProperty("--mx", (mouse[0] / r.width * 100) + "%"); heroSpot.style.setProperty("--my", (mouse[1] / r.height * 100) + "%"); if (reduce) drawHero(); });
  heroEl0.addEventListener("mouseleave", function () { mouse = null; if (reduce) drawHero(); });
  if (!reduce) { (function heroLoop() { if (heroVisible) { drawHero(); } requestAnimationFrame(heroLoop); })(); setInterval(function () { series.shift(); raw += rnd(-1.5, 1.72); hv += (raw - hv) * 0.22; series.push(hv); }, 900); }

  var gc = document.getElementById("globeCanvas"), gx = gc.getContext("2d");
  function drawGlobe() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = gc.clientWidth, H = gc.clientHeight; if (!W || !H) return;
    if (gc.width !== W * dpr) { gc.width = W * dpr; gc.height = H * dpr; }
    gx.setTransform(dpr, 0, 0, dpr, 0, 0); gx.clearRect(0, 0, W, H);
    renderGlobe(gx, W * 0.5, H * 0.54, Math.min(H * 0.42, W * 0.36), { glowA: "rgba(212,255,59,0.1)", glowB: "rgba(212,255,59,0.03)", oceanA: "rgba(32,32,36,1)", oceanB: "rgba(20,20,23,1)", oceanC: "rgba(10,10,11,1)", ring: "rgba(255,255,255,0.14)", ringW: 1, land: function (k) { return "rgba(212,255,59," + (0.22 + 0.7 * k) + ")"; }, link: function (k) { return "rgba(124,92,255," + (0.4 + 0.5 * k) + ")"; }, linkW: 1.2, packet: "#fff", packetR: 1.8, node: "rgba(255,255,255,1)", nodeBack: "rgba(255,255,255,0.18)", nodeR: 3.2, pulse: "rgba(212,255,59,0.5)", labels: W > 480, label: "rgba(244,244,241,0.8)" });
  }
  drawGlobe(); window.addEventListener("resize", drawGlobe);
  var globeVisible = true; if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { globeVisible = en[0].isIntersecting; }, { rootMargin: "100px" }).observe(gc);
  if (!reduce) { (function gloop() { if (globeVisible) { rot += 0.0016; drawGlobe(); } requestAnimationFrame(gloop); })(); }

  var tt = document.getElementById("tickerTrack");
  function tickHTML() {
    var h = "";
    for (var pass = 0; pass < 2; pass++) MK.forEach(function (m, i) {
      h += '<div class="tick"><span class="ttag">' + m.tag + '</span><b>' + m.n + '</b><span>' + (m.ref ? 'index' : m.unit) + '</span><b class="num tp" data-i="' + i + '">' + pDisp(m) + '</b><span class="' + (m.c >= 0 ? 'up' : 'down') + ' num tc" data-i="' + i + '">' + (m.c >= 0 ? '+' : '−') + Math.abs(m.c).toFixed(2) + '%</span></div>';
    });
    return h;
  }
  tt.innerHTML = tickHTML();
  function tickUpdate() {
    tt.querySelectorAll(".tp").forEach(function (el) { var m = MK[+el.dataset.i], nv = pDisp(m); if (el.textContent !== nv) { el.classList.remove("flash-up", "flash-down"); el.classList.add(m.p >= m.prev ? "flash-up" : "flash-down"); el.textContent = nv; setTimeout(function () { el.classList.remove("flash-up", "flash-down"); }, 600); } });
    tt.querySelectorAll(".tc").forEach(function (el) { var m = MK[+el.dataset.i]; el.textContent = (m.c >= 0 ? '+' : '−') + Math.abs(m.c).toFixed(2) + '%'; el.className = "num tc " + (m.c >= 0 ? "up" : "down"); });
  }

  var cur = MK[0];
  var mktList = document.getElementById("mktList");
  function renderMkts() {
    var live = MK.length, h = '<div class="mk-head">Switch instrument · ' + live + ' of ' + live + ' live</div>';
    CATS.forEach(function (c) {
      h += '<div class="mk-cat"><span>' + c[1] + '</span><a href="#markets">view all →</a></div>';
      MK.filter(function (m) { return m.cat === c[0]; }).forEach(function (m) {
        h += '<div class="mkt' + (m === cur ? ' on' : '') + '" data-id="' + m.id + '"><span class="tag">' + m.tag + '</span><span class="nm"><b>' + m.n + '</b><small>' + m.sub + '</small></span><span class="pr num' + (m.ref ? (m.chg >= 0 ? ' up' : ' up') : '') + '">' + pDisp(m) + (m === cur ? ' <i class="chk">✓</i>' : '') + '</span></div>';
      });
    });
    mktList.innerHTML = h;
    var sel = document.getElementById("instSel"); if (sel && sel.options.length !== MK.length) { sel.innerHTML = MK.map(function (m) { return '<option value="' + m.id + '">' + m.n + ' · ' + m.tag + '</option>'; }).join(""); }
    if (sel) sel.value = cur.id;
  }
  mktList.addEventListener("click", function (e) {
    var el = e.target.closest(".mkt"); if (!el) return;
    cur = MK.filter(function (m) { return m.id === el.dataset.id; })[0];
    buildCandles(); renderMkts(); renderTop(); renderBook(); renderTicket();
  });
  var instSel = document.getElementById("instSel"); if (instSel) instSel.addEventListener("change", function () { selectMarket(this.value, false); });
  document.getElementById("dlvTabs").addEventListener("click", function (e) { if (e.target.tagName !== "BUTTON") return; [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on"); setQuarter(+e.target.dataset.q); buildCandles(); renderMkts(); renderTop(); renderBook(); renderTicket(); renderBoard(); });

  var side = "long", lev = 5, otype = "market";
  document.getElementById("btnLong").onclick = function () { side = "long"; renderTicket(); };
  document.getElementById("btnShort").onclick = function () { side = "short"; renderTicket(); };
  document.getElementById("levBtns").addEventListener("click", function (e) { if (e.target.tagName !== "BUTTON") return; lev = +e.target.dataset.l; [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on"); renderTicket(); });
  document.getElementById("otSeg").addEventListener("click", function (e) { if (e.target.tagName !== "BUTTON") return; otype = e.target.dataset.t; [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on"); document.getElementById("priceField").style.display = otype === "market" ? "none" : ""; renderTicket(); });
  var inSize = document.getElementById("inSize"), inPrice = document.getElementById("inPrice");
  inSize.addEventListener("input", renderTicket); inPrice.addEventListener("input", renderTicket);
  function num(s) { return parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0; }
  function renderTicket() {
    document.getElementById("btnLong").classList.toggle("on", side === "long");
    document.getElementById("btnShort").classList.toggle("on", side === "short");
    var go = document.getElementById("goBtn");
    go.className = "go " + side;
    go.textContent = (side === "long" ? "Long " : "Short ") + cur.n + (cur.tag !== cur.n.toUpperCase() ? " " + cur.tag : "") + " · " + cur.d.replace("20", "");
    document.getElementById("sizeUnit").textContent = cur.unit; document.getElementById("priceUnit").textContent = "USD";
    var entry = otype === "market" ? cur.p * (side === "long" ? 1.001 : 0.999) : (num(inPrice.value) || cur.p);
    var size = num(inSize.value), notional = size * entry, margin = notional / lev;
    var liq = side === "long" ? entry * (1 - 0.95 / lev) : entry * (1 + 0.95 / lev);
    document.getElementById("kEntry").textContent = fmt(entry, cur.dec);
    document.getElementById("kNot").textContent = "$" + fmt(notional, 0);
    document.getElementById("kMar").textContent = "$" + fmt(margin, 0);
    document.getElementById("kLiq").textContent = fmt(Math.max(0, liq), cur.dec);
  }
  var toast = document.getElementById("toast"), toastT;
  function showToast(html, ms) { toast.innerHTML = html; toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("on"); }, ms || 3200); }
  document.getElementById("goBtn").addEventListener("click", function () {
    showToast("<b>Trading opens at launch.</b> Join the waitlist for whitelist access — reference pricing is live in the app.", 4200);
    document.getElementById("updates").scrollIntoView({ behavior: "smooth" });
  });
  function renderTop() {
    document.getElementById("tSym").textContent = cur.n;
    document.getElementById("tTag").textContent = cur.tag;
    document.getElementById("tPeriod").textContent = cur.ref ? "Reference index" : cur.sub;
    document.getElementById("tUnit").textContent = cur.ref ? "index" : "USD / " + cur.unit;
    var tm = document.getElementById("tMark"); if (typeof lastMark !== "undefined" && cur.p !== lastMark) { tm.classList.remove("flash-up", "flash-down"); void tm.offsetWidth; tm.classList.add(cur.p > lastMark ? "flash-up" : "flash-down"); setTimeout(function () { tm.classList.remove("flash-up", "flash-down"); }, 500); } lastMark = cur.p; tm.textContent = fmt(cur.p, cur.dec);
    document.getElementById("tIndex").textContent = fmt(cur.p * 0.9986, cur.dec);
    var chg = document.getElementById("tChg");
    chg.textContent = (cur.c >= 0 ? "+" : "−") + Math.abs(cur.c).toFixed(2) + "%"; chg.className = "v num " + (cur.c >= 0 ? "up" : "down");
    document.getElementById("hsPrice").innerHTML = fmt(MK[0].p, 3) + '<span class="u">USD / GPU-hr · ' + MK[0].d.replace("20", "") + '</span>';
    document.getElementById("pMark").textContent = fmt(MK[0].p, 3);
    var pnl = (MK[0].p - 0.962) * 40000; var pp = (MK[0].p / 0.962 - 1) * 500;
    var pe = document.getElementById("pPnl"); pe.textContent = (pnl >= 0 ? "+" : "−") + "$" + fmt(Math.abs(pnl), 0) + " (" + (pp >= 0 ? "+" : "−") + Math.abs(pp).toFixed(1) + "%)"; pe.className = "num " + (pnl >= 0 ? "up" : "down");
    document.getElementById("tokVal").textContent = "$" + fmt(MK[0].p * 512, 0);
  }

  var cv = document.getElementById("candles"), cx = cv.getContext("2d");
  var candles = [];
  function buildCandles() {
    candles = []; var p = cur.p * rnd(0.9, 0.97), M = 90;
    for (var i = 0; i < M; i++) {
      var o = p, cl = o + o * rnd(-0.012, 0.0135), h = Math.max(o, cl) + o * rnd(0, 0.006), l = Math.min(o, cl) - o * rnd(0, 0.006);
      candles.push({ o: o, h: h, l: l, c: cl, v: rnd(0.2, 1) }); p = cl;
    }
    var last = candles[M - 1]; var k = cur.p / last.c;
    candles.forEach(function (c) { c.o *= k; c.h *= k; c.l *= k; c.c *= k; });
    drawCandles();
  }
  function drawCandles() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return;
    if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
    var padR = 58, padT = 34, padB = 26, volH = H * 0.16;
    var mn = Infinity, mx = -Infinity; candles.forEach(function (c) { mn = Math.min(mn, c.l); mx = Math.max(mx, c.h); });
    var span = mx - mn; mn -= span * 0.05; mx += span * 0.05;
    var plotH = H - padT - padB - volH, plotW = W - padR;
    var cw = plotW / candles.length, bw = Math.max(2, cw * 0.62);
    var y = function (v) { return padT + (mx - v) / (mx - mn) * plotH; };
    cx.font = "11px JetBrains Mono, monospace"; cx.textAlign = "left"; cx.fillStyle = "#5F5F68";
    for (var g = 0; g <= 5; g++) {
      var v = mn + (mx - mn) * g / 5, gy = y(v);
      cx.strokeStyle = "rgba(255,255,255,0.06)"; cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(plotW, gy); cx.stroke();
      cx.fillText(fmt(v, cur.dec), plotW + 8, gy + 4);
    }
    candles.forEach(function (c, i) {
      var x = i * cw + (cw - bw) / 2, up = c.c >= c.o;
      cx.fillStyle = up ? "rgba(74,222,128,0.2)" : "rgba(255,77,109,0.2)";
      var vh = c.v * volH; cx.fillRect(x, H - padB - vh, bw, vh);
    });
    candles.forEach(function (c, i) {
      var x = i * cw + cw / 2, up = c.c >= c.o, col = up ? "#4ADE80" : "#FF4D6D";
      cx.strokeStyle = col; cx.fillStyle = col; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(x, y(c.h)); cx.lineTo(x, y(c.l)); cx.stroke();
      var top = y(Math.max(c.o, c.c)), hgt = Math.max(1, Math.abs(y(c.o) - y(c.c)));
      cx.fillRect(x - bw / 2, top, bw, hgt);
    });
    var last = candles[candles.length - 1], ly = y(last.c);
    cx.setLineDash([3, 4]); cx.strokeStyle = "rgba(255,255,255,0.35)"; cx.beginPath(); cx.moveTo(0, ly); cx.lineTo(plotW, ly); cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = last.c >= last.o ? "#4ADE80" : "#FF4D6D"; cx.fillRect(plotW + 2, ly - 9, padR - 4, 18);
    cx.fillStyle = "#0A0A0B"; cx.font = "600 11px JetBrains Mono, monospace"; cx.fillText(fmt(last.c, cur.dec), plotW + 8, ly + 4);
    cx.fillStyle = "#5F5F68"; cx.font = "10px JetBrains Mono, monospace";
    var labels = ["-90h", "-72h", "-54h", "-36h", "-18h", "now"];
    labels.forEach(function (t, i) { cx.fillText(t, i * plotW / 5 + 2, H - 8); });
    document.getElementById("lO").textContent = fmt(last.o, cur.dec); document.getElementById("lH").textContent = fmt(last.h, cur.dec);
    document.getElementById("lL").textContent = fmt(last.l, cur.dec); document.getElementById("lC").textContent = fmt(last.c, cur.dec);
  }
  window.addEventListener("resize", drawCandles);
  document.getElementById("tfTabs").addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") return;
    [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on"); buildCandles();
  });

  function renderBook() {
    var asks = "", bids = "", step = cur.p < 2 ? 0.001 : (cur.p < 20 ? 0.01 : 0.05), maxQ = 4600;
    var ap = cur.p + step, bp = cur.p - step;
    for (var i = 0; i < 9; i++) {
      var qa = Math.round(rnd(300, 4400) * (1 - i * 0.05)), qb = Math.round(rnd(300, 4400) * (1 - i * 0.05));
      var pa = ap + step * i, pb = bp - step * i;
      asks = '<div class="ob-row a"><span class="num">' + fmt(pa, cur.dec) + '</span><span class="num">' + fmt(qa, 0) + '</span><span class="num">' + fmt(qa * pa / (cur.dec ? 1 : 1), 0) + '</span><i style="width:' + (qa / maxQ * 100) + '%"></i></div>' + asks;
      bids += '<div class="ob-row b"><span class="num">' + fmt(pb, cur.dec) + '</span><span class="num">' + fmt(qb, 0) + '</span><span class="num">' + fmt(qb * pb, 0) + '</span><i style="width:' + (qb / maxQ * 100) + '%"></i></div>';
    }
    document.getElementById("asks").innerHTML = asks; document.getElementById("bids").innerHTML = bids;
    document.getElementById("spread").textContent = fmt(step * 2, cur.dec);
    document.getElementById("spreadPct").textContent = (step * 2 / cur.p * 100).toFixed(2) + "%";
    document.getElementById("obStep").textContent = String(step);
    drawDepth();
  }
  document.getElementById("bookView").addEventListener("click", function (e) {
    var row = e.target.closest(".ob-row"); if (!row) return;
    var price = row.querySelector("span").textContent;
    otype = "limit"; inPrice.value = price.replace(/,/g, "");
    var seg = document.getElementById("otSeg"); [].forEach.call(seg.children, function (b) { b.classList.toggle("on", b.dataset.t === "limit"); });
    document.getElementById("priceField").style.display = "";
    side = row.classList.contains("a") ? "long" : "short"; renderTicket();
  });
  var obView = "book";
  document.getElementById("obTabs").addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") return; obView = e.target.dataset.v;
    [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on");
    document.getElementById("bookView").style.display = obView === "book" ? "" : "none";
    document.getElementById("depthView").style.display = obView === "depth" ? "" : "none";
    drawDepth();
  });
  var dc = document.getElementById("depthCanvas"), dx = dc.getContext("2d");
  function drawDepth() {
    if (obView !== "depth") return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = dc.clientWidth, H = dc.clientHeight; if (!W) return;
    if (dc.width !== W * dpr) { dc.width = W * dpr; dc.height = H * dpr; }
    dx.setTransform(dpr, 0, 0, dpr, 0, 0); dx.clearRect(0, 0, W, H);
    var n = 40, bids = [], asks = [], cb = 0, ca = 0;
    for (var i = 0; i < n; i++) { cb += rnd(200, 1400) * (1 + i * 0.08); ca += rnd(200, 1400) * (1 + i * 0.08); bids.push(cb); asks.push(ca); }
    var mx = Math.max(cb, ca) * 1.08, mid = W / 2, pad = 22;
    function area(arr, dir, col) {
      dx.beginPath(); dx.moveTo(mid, H - pad);
      arr.forEach(function (v, i) { var x = mid + dir * (i + 1) / n * (mid - 6), y = H - pad - v / mx * (H - pad - 14); dx.lineTo(x, y); });
      dx.lineTo(mid + dir * (mid - 6), H - pad); dx.closePath();
      dx.fillStyle = col.replace("1)", "0.16)"); dx.fill();
      dx.beginPath(); arr.forEach(function (v, i) { var x = mid + dir * (i + 1) / n * (mid - 6), y = H - pad - v / mx * (H - pad - 14); i ? dx.lineTo(x, y) : dx.moveTo(x, y); });
      dx.strokeStyle = col; dx.lineWidth = 1.5; dx.stroke();
    }
    area(bids, -1, "rgba(74,222,128,1)"); area(asks, 1, "rgba(255,77,109,1)");
    dx.strokeStyle = "rgba(255,255,255,0.3)"; dx.setLineDash([3, 4]); dx.beginPath(); dx.moveTo(mid, 8); dx.lineTo(mid, H - pad); dx.stroke(); dx.setLineDash([]);
    dx.fillStyle = "#5F5F68"; dx.font = "10px JetBrains Mono, monospace"; dx.textAlign = "left"; dx.fillText(fmt(cur.p * (cur.dec ? 0.985 : 0.985), cur.dec), 8, H - 7);
    dx.textAlign = "center"; dx.fillText(fmt(cur.p, cur.dec), mid, H - 7);
    dx.textAlign = "right"; dx.fillText(fmt(cur.p * 1.015, cur.dec), W - 8, H - 7);
    dx.textAlign = "left"; dx.fillStyle = "#4ADE80"; dx.fillText("Bids " + fmt(cb, 0), 8, 16); dx.textAlign = "right"; dx.fillStyle = "#FF4D6D"; dx.fillText("Asks " + fmt(ca, 0), W - 8, 16);
  }
  window.addEventListener("resize", drawDepth);
  var tradeList = document.getElementById("tradeList"), tcount = 0;
  function addTrade() {
    var up = Math.random() > 0.45, p = cur.p * (1 + rnd(-0.0015, 0.0015));
    var t = new Date(), ts = t.toTimeString().slice(0, 8);
    var row = document.createElement("div"); row.className = "tr-row new";
    row.innerHTML = '<span class="num ' + (up ? 'up' : 'down') + '">' + fmt(p, cur.dec) + '</span><span class="num">' + fmt(Math.round(rnd(40, 2400)), 0) + '</span><span class="num">' + ts + '</span>';
    tradeList.insertBefore(row, tradeList.firstChild);
    if (tradeList.children.length > 9) tradeList.removeChild(tradeList.lastChild);
  }
  for (var q = 0; q < 8; q++) addTrade();

  buildCandles(); renderTop(); renderBook(); renderTicket();

  var termVisible = true, termEl = document.getElementById("terminal");
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { termVisible = en[0].isIntersecting; }, { rootMargin: "200px" }).observe(termEl);
  if (!reduce) {
    setInterval(function () {
      MK.forEach(function (m) { m.prev = m.p; var v = m.ref ? 0.0002 : 0.0012; m.p = m.p + m.p * rnd(-v, v * 1.08); m.c = (m.p / m.base - 1) * 100 + (m.id === "GPU" ? 1.42 : m.c * 0.98); if (m.ref) m.chg = m.chg + rnd(-0.01, 0.01); });
      var last = candles[candles.length - 1]; var np = cur.p;
      last.c = np; last.h = Math.max(last.h, np); last.l = Math.min(last.l, np); last.v = Math.min(1, last.v + 0.02);
      renderTop(); renderTicket();
      if (termVisible) { drawCandles(); renderMkts(); addTrade(); if (Math.random() > 0.6) renderBook(); }
      tickUpdate();
      document.getElementById("liveTag").textContent = fmt(MK[0].p, 3);
      if (termVisible) renderBoard();
    }, 1500);
    setInterval(function () {
      var o = candles[candles.length - 1].c; candles.shift(); candles.push({ o: o, h: o, l: o, c: o, v: 0.1 });
      MK.forEach(function (m) { m.spark.shift(); m.spark.push(m.p); });
    }, 12000);
  }

  var filter = "all";
  document.getElementById("boardTabs").addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") return;
    [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on"); filter = e.target.dataset.f; renderBoard();
  });
  function spark(arr, up) {
    var mn = Math.min.apply(null, arr), mx = Math.max.apply(null, arr), w = 110, h = 30;
    var pts = arr.map(function (v, i) { return (i / (arr.length - 1) * w).toFixed(1) + "," + (h - 3 - (v - mn) / ((mx - mn) || 1) * (h - 6)).toFixed(1); }).join(" ");
    return '<svg class="spark" viewBox="0 0 110 30" preserveAspectRatio="none"><polyline points="' + pts + '" fill="none" stroke="' + (up ? '#4ADE80' : '#FF4D6D') + '" stroke-width="1.8"/></svg>';
  }
  function renderBoard() {
    var rows = MK.filter(function (m) { return filter === "all" || (filter === "ref" ? !!m.ref : m.cat === filter); });
    document.getElementById("boardBody").innerHTML = rows.map(function (m) {
      var up7 = m.spark[27] >= m.spark[0], catName = CATS.filter(function (c) { return c[0] === m.cat; })[0][1];
      return '<tr><td><span class="btag">' + m.tag + '</span></td><td><span class="nm">' + m.n + '</span><span class="sub">' + m.sub + '</span></td><td>' + catName + '</td><td>' + (m.ref ? "Index" : m.d) + '</td><td class="r num" style="font-weight:500">' + pDisp(m) + '</td><td class="r num ' + (m.c >= 0 ? 'up' : 'down') + '">' + (m.c >= 0 ? '+' : '−') + Math.abs(m.c).toFixed(2) + '%</td><td>' + spark(m.spark, up7) + '</td><td class="r num">' + m.oi + '</td><td class="r num">' + m.vol + '</td><td class="r num ' + (m.f >= 0 ? 'up' : 'down') + '">' + (m.ref ? "—" : (m.f >= 0 ? '' : '−') + Math.abs(m.f).toFixed(4) + '%') + '</td><td class="r"><a class="btn btn-ghost" href="#exchange">Trade</a></td></tr>';
    }).join("");
  }
  renderBoard();

  var CURVES = {
    GPU: { u: "USD / GPU-hr", d: 3, pts: [1.02, 0.989, 0.955, 0.92, 0.89, 0.86] },
    VCPU: { u: "USD / vCPU-month", d: 2, pts: [43.3, 42.05, 40.6, 39.4, 38.1, 37.0] },
    RAM: { u: "USD / GB-month", d: 2, pts: [3.13, 3.04, 2.96, 2.9, 2.84, 2.77] },
    BLK: { u: "USD / TB-month", d: 2, pts: [51.6, 50.1, 48.9, 47.8, 46.6, 45.5] },
    BW: { u: "USD / TB egress", d: 2, pts: [5.15, 5.00, 4.9, 4.82, 4.75, 4.68] }
  };
  var PERIODS = ["Spot", "Q1 27", "Q2 27", "Q3 27", "Q4 27", "Q1 28"];
  var svg = document.getElementById("curveSvg"), tip = document.getElementById("curveTip"), curveKey = "GPU";
  function drawCurve() {
    var c = CURVES[curveKey], pts = c.pts, W = 760, H = 420, L = 56, R = 24, T = 30, B = 46;
    var mn = Math.min.apply(null, pts), mx = Math.max.apply(null, pts), sp = mx - mn || 1; mn -= sp * 0.25; mx += sp * 0.25;
    var x = function (i) { return L + (W - L - R) * i / (pts.length - 1); }, y = function (v) { return T + (mx - v) / (mx - mn) * (H - T - B); };
    var s = '<defs><linearGradient id="cl" x1="0" x2="1"><stop offset="0" stop-color="#D4FF3B"/><stop offset="1" stop-color="#7C5CFF"/></linearGradient><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4FF3B" stop-opacity=".22"/><stop offset="1" stop-color="#7C5CFF" stop-opacity="0"/></linearGradient></defs>';
    for (var g = 0; g <= 4; g++) { var gv = mn + (mx - mn) * g / 4, gy = y(gv); s += '<line x1="' + L + '" y1="' + gy + '" x2="' + (W - R) + '" y2="' + gy + '" stroke="rgba(255,255,255,0.07)"/><text x="' + (L - 10) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="11" fill="#5F5F68" font-family="JetBrains Mono" font-family="Inter">' + fmt(gv, c.d) + '</text>'; }
    var d = pts.map(function (v, i) { return (i ? "L" : "M") + x(i) + " " + y(v); }).join(" ");
    s += '<path d="' + d + ' L' + x(pts.length - 1) + ' ' + (H - B) + ' L' + x(0) + ' ' + (H - B) + ' Z" fill="url(#cg)"/>';
    s += '<path class="glow" d="' + d + '" fill="none" stroke="url(#cl)" stroke-width="2.6" stroke-linejoin="round"/>';
    s += '<line x1="' + x(0) + '" y1="' + y(pts[0]) + '" x2="' + (W - R) + '" y2="' + y(pts[0]) + '" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3 5"/>';
    pts.forEach(function (v, i) {
      s += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="6" fill="#0A0A0B" stroke="#D4FF3B" stroke-width="2.5" data-i="' + i + '" class="cp" style="cursor:pointer"/>';
      s += '<text x="' + x(i) + '" y="' + (H - 16) + '" text-anchor="middle" font-size="11" fill="#9B9BA4" font-family="JetBrains Mono" letter-spacing="1">' + PERIODS[i].toUpperCase() + '</text>';
      s += '<text x="' + x(i) + '" y="' + (y(v) - 14) + '" text-anchor="middle" font-size="12" fill="#F4F4F1" font-weight="500" font-family="JetBrains Mono">' + fmt(v, c.d) + '</text>';
    });
    s += '<text x="' + (W - R) + '" y="' + (T - 10) + '" text-anchor="end" font-size="11" fill="#5F5F68" font-family="JetBrains Mono" font-family="Inter" letter-spacing="1.5">' + c.u.toUpperCase() + ' · DELIVERY QUARTER</text>';
    svg.innerHTML = s;
    var imp = (pts[5] / pts[0] - 1) * 100, shape = pts[5] < pts[0] ? "Backwardation" : "Contango";
    document.getElementById("crSpot").textContent = fmt(pts[0], c.d); document.getElementById("crFar").textContent = fmt(pts[5], c.d);
    document.getElementById("crShape").textContent = shape;
    var ie = document.getElementById("crImp"); ie.textContent = (imp >= 0 ? "+" : "−") + Math.abs(imp).toFixed(1) + "%"; ie.className = "v num " + (imp >= 0 ? "up" : "down");
  }
  drawCurve();
  document.getElementById("curveChips").addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") return;
    [].forEach.call(this.children, function (b) { b.classList.remove("on"); }); e.target.classList.add("on"); curveKey = e.target.dataset.c; drawCurve();
  });
  svg.addEventListener("mousemove", function (e) {
    var t = e.target; if (!t.classList || !t.classList.contains("cp")) { tip.classList.remove("on"); return; }
    var i = +t.dataset.i, c = CURVES[curveKey], r = svg.getBoundingClientRect(), pr = svg.parentNode.getBoundingClientRect();
    var sx = r.width / 760, sy = r.height / 420;
    tip.style.left = (r.left - pr.left + t.cx.baseVal.value * sx) + "px"; tip.style.top = (r.top - pr.top + t.cy.baseVal.value * sy) + "px";
    tip.innerHTML = PERIODS[i] + ' delivery<b class="num">' + fmt(c.pts[i], c.d) + ' <span style="color:#9a9da1;font-weight:400;font-size:11px">' + c.u + '</span></b>'; tip.classList.add("on");
  });
  svg.addEventListener("mouseleave", function () { tip.classList.remove("on"); });

  var heroEl = document.getElementById("top");
  requestAnimationFrame(function () { requestAnimationFrame(function () { heroEl.classList.add("in"); }); });
  document.querySelectorAll(".cnt").forEach(function (el) {
    var to = +el.dataset.to, dec = +el.dataset.dec, t0 = null, dur = reduce ? 0 : 1400;
    function step(ts) { if (!t0) t0 = ts; var k = dur ? Math.min(1, (ts - t0) / dur) : 1; k = 1 - Math.pow(1 - k, 3); el.textContent = fmt(to * k, dec); if (k < 1) requestAnimationFrame(step); }
    setTimeout(function () { requestAnimationFrame(step); }, 500);
  });

  var rvls = [].slice.call(document.querySelectorAll(".rvl")), rvlPending = false;
  function revealScan() { rvlPending = false; var vh = window.innerHeight; rvls = rvls.filter(function (el) { var r = el.getBoundingClientRect(); if (r.top < vh * 0.96 || r.bottom < 0) { el.classList.add("in"); return false; } return true; }); }
  if (reduce) { rvls.forEach(function (el) { el.classList.add("in"); }); rvls = []; }
  else { revealScan(); window.addEventListener("scroll", function () { if (!rvlPending && rvls.length) { rvlPending = true; requestAnimationFrame(revealScan); } }, { passive: true }); window.addEventListener("resize", revealScan); }

  var navA = document.querySelectorAll(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) navA.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id); }); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    navA.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) secObs.observe(s); });
  }

  var slot = 312884102, slotEl = document.getElementById("slot"), lastSettleT = Date.now() - 2000;
  if (!reduce) {
    setInterval(function () { slot += 1; slotEl.textContent = fmt(slot, 0); var s2 = document.getElementById("slot2"); if (s2) s2.textContent = fmt(slot, 0); }, 400);
    setInterval(function () {
      var latv = (2.4 + Math.random() * 1.6).toFixed(1) + " ms"; document.getElementById("lat").textContent = latv; var l2 = document.getElementById("lat2"); if (l2) l2.textContent = latv;
      document.getElementById("ops").textContent = fmt(Math.round(980 + Math.random() * 520), 0);
      var s = Math.round((Date.now() - lastSettleT) / 1000); document.getElementById("lastSettle").textContent = (s < 1 ? "now" : s + "s ago");
    }, 1000);
  }

  function sparkCanvas(id, base, amp, color) {
    var c = document.getElementById(id), x = c.getContext("2d"), data = [], v = base;
    for (var i = 0; i < 60; i++) { v += rnd(-amp, amp * 1.05); data.push(v); }
    function draw() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), W = c.clientWidth, H = c.clientHeight; if (!W) return;
      if (c.width !== W * dpr) { c.width = W * dpr; c.height = H * dpr; } x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      var mn = Math.min.apply(null, data), mx = Math.max.apply(null, data), sp = mx - mn || 1;
      x.beginPath(); data.forEach(function (d, i) { var px = i / (data.length - 1) * W, py = H - 3 - (d - mn) / sp * (H - 6); i ? x.lineTo(px, py) : x.moveTo(px, py); });
      x.strokeStyle = color; x.lineWidth = 1.5; x.stroke();
      x.lineTo(W, H); x.lineTo(0, H); x.closePath(); x.fillStyle = color.replace("1)", "0.12)"); x.fill();
    }
    draw(); window.addEventListener("resize", draw);
    return function () { data.shift(); v += rnd(-amp, amp * 1.05); data.push(v); draw(); };
  }
  var spkA = sparkCanvas("spk1", 100, 1.2, "rgba(74,222,128,1)"), spkB = sparkCanvas("spk2", 100, 2.5, "rgba(212,255,59,1)");
  var REGIONS = [["Europe", 38], ["N. America", 34], ["Asia-Pac", 19], ["Middle East", 5], ["LatAm", 4]];
  function renderRegions() {
    document.getElementById("regionBars").innerHTML = REGIONS.map(function (r) { return '<div><span>' + r[0] + '</span><i><b style="width:' + r[1] + '%"></b></i><span class="num" style="text-align:right;color:var(--fg)">' + r[1] + '%</span></div>'; }).join("");
  }
  renderRegions();
  var feed = document.getElementById("feed"), feedN = 0, gpuCount = 18400, settled = 2.91;
  var EV = [
    function () { var s = SITES[Math.floor(rnd(0, SITES.length))][2], q = [256, 512, 1024, 2048][Math.floor(rnd(0, 4))]; return ["mint", "Capacity token minted", q + " GPU-hr · GPU · " + QS[qi].replace("20", "") + " <span>· " + s + "</span>"]; },
    function () { var m = MK[Math.floor(rnd(0, 5))]; return ["fill", "Order filled", fmt(Math.round(rnd(200, 6000)), 0) + " " + m.unit + " · " + m.n + " " + m.tag + " " + m.d + " <span>@ " + fmt(m.p, m.dec) + "</span>"]; },
    function () { lastSettleT = Date.now(); settled += rnd(0.002, 0.008); document.getElementById("sysSettled").textContent = settled.toFixed(2) + "M"; var m = MK[Math.floor(rnd(0, 5))]; return ["settle", "Contract settled", fmt(Math.round(rnd(1000, 12000)), 0) + " " + m.unit + " · " + m.n + " " + m.tag + " " + m.d + " <span>· cash</span>"]; },
    function () { var s = SITES[Math.floor(rnd(0, SITES.length))][2]; return ["deliver", "Capacity delivered", fmt(Math.round(rnd(64, 1024)), 0) + " GPU-hr → workload <span>· " + s + "</span>"]; },
    function () { var m = MK[Math.floor(rnd(0, 5))]; return ["lp", "Liquidity added", "$" + fmt(Math.round(rnd(20, 400)) * 1000, 0) + " · " + m.n + " " + m.tag + " " + m.d]; },
    function () { gpuCount += [8, 16, 32, 64][Math.floor(rnd(0, 4))]; document.getElementById("sysGpu").textContent = fmt(gpuCount, 0); var s = SITES[Math.floor(rnd(0, SITES.length))][2]; return ["mint", "Site verified", "+" + [8, 16, 32, 64][Math.floor(rnd(0, 4))] + " H100 · attested <span>· " + s + "</span>"]; }
  ];
  function addEvent() {
    var e = EV[Math.floor(rnd(0, EV.length))](); feedN++;
    var t = new Date().toTimeString().slice(0, 8);
    var row = document.createElement("div"); row.className = "ev";
    row.innerHTML = '<span class="t ' + e[0] + '">' + e[0] + '</span><span class="d">' + e[1] + ' · ' + e[2] + '</span><span class="h num">' + t + '</span>';
    feed.insertBefore(row, feed.firstChild); while (feed.children.length > 18) feed.removeChild(feed.lastChild);
    document.getElementById("feedCount").textContent = fmt(feedN, 0) + " events";
  }
  for (var e0 = 0; e0 < 16; e0++) addEvent();
  var netVisible = true; if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { netVisible = en[0].isIntersecting; }, { rootMargin: "200px" }).observe(document.getElementById("network"));
  if (!reduce) setInterval(function () { if (!netVisible) return; addEvent(); spkA(); spkB(); if (Math.random() > 0.7) { REGIONS.forEach(function (r) { r[1] = Math.max(2, Math.min(45, r[1] + Math.round(rnd(-1, 1)))); }); renderRegions(); } }, 2200);

  var pipeSteps = document.querySelectorAll("#pipe > div"), pipeI = 0;
  var stateEls = document.querySelectorAll("#states .state"), stateI = 0, used = 0;
  if (!reduce) {
    setInterval(function () { pipeI = (pipeI + 1) % pipeSteps.length; pipeSteps.forEach(function (s, i) { s.classList.toggle("on", i <= pipeI); if (pipeI === 0 && i > 0) s.classList.remove("on"); }); }, 1800);
    setInterval(function () { stateI = (stateI + 1) % stateEls.length; stateEls.forEach(function (s, i) { s.classList.toggle("on", i === stateI); var b = s.querySelector(".bar b"); b.style.animation = "none"; void b.offsetWidth; b.style.animation = ""; }); if (stateI === 3) { used = 0; var iv = setInterval(function () { used = Math.min(512, used + 32); document.getElementById("stUsed").textContent = used + " GPU-hr"; if (used >= 512) clearInterval(iv); }, 140); } }, 2500);
  }

  var wallet = null, wm = document.getElementById("walletModal"), wbtn = document.getElementById("walletBtn");
  function providers() { var s = window.solana, sf = window.solflare, bp = window.backpack; return { phantom: (s && s.isPhantom) ? s : (window.phantom && window.phantom.solana) || null, solflare: (sf && (sf.isSolflare || sf.connect)) ? sf : null, backpack: (bp && bp.connect) ? bp : ((s && s.isBackpack) ? s : null) }; }
  function openWallet() { var pv = providers(); ["phantom", "solflare", "backpack"].forEach(function (k) { var el = document.getElementById("w" + k.charAt(0).toUpperCase() + k.slice(1)); if (pv[k]) { el.textContent = "Detected"; el.className = "ok"; } else { el.textContent = "Install"; el.className = ""; } }); wm.hidden = false; }
  function closeWallet() { wm.hidden = true; }
  wbtn.addEventListener("click", function () { if (wallet) { wallet = null; wbtn.classList.remove("connected"); wbtn.innerHTML = wbtn.getAttribute("data-orig"); showToast("Wallet disconnected."); return; } openWallet(); });
  wbtn.setAttribute("data-orig", wbtn.innerHTML);
  wm.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", closeWallet); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !wm.hidden) closeWallet(); });
  var WURL = { phantom: "https://phantom.app/download", solflare: "https://solflare.com/download", backpack: "https://backpack.app/download" };
  wm.querySelectorAll(".wallet").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.w, pv = providers()[k], name = b.querySelector("span:nth-child(2)").textContent;
      if (!pv) { window.open(WURL[k], "_blank", "noopener"); return; }
      var p = pv.connect ? pv.connect() : Promise.reject();
      Promise.resolve(p).then(function (res) {
        var key = (res && res.publicKey) ? res.publicKey.toString() : (pv.publicKey ? pv.publicKey.toString() : "");
        wallet = { name: name, key: key }; closeWallet();
        wbtn.classList.add("connected"); wbtn.textContent = key ? key.slice(0, 4) + "…" + key.slice(-4) : name;
        showToast("<b>Connected.</b> " + name + (key ? " · " + key.slice(0, 4) + "…" + key.slice(-4) : ""));
      }).catch(function () { showToast("Connection cancelled."); });
    });
  });
  function selectMarket(id, scroll) { var m = MK.filter(function (x) { return x.id === id; })[0]; if (!m) return; cur = m; buildCandles(); renderMkts(); renderTop(); renderBook(); renderTicket(); if (scroll) document.getElementById("exchange").scrollIntoView({ behavior: "smooth" }); }
  tt.addEventListener("click", function (e) { var t = e.target.closest(".tick"); if (!t) return; var i = +t.querySelector(".tp").dataset.i; selectMarket(MK[i].id, true); });
  document.getElementById("boardBody").addEventListener("click", function (e) { if (e.target.closest("a")) { e.preventDefault(); } var tr = e.target.closest("tr"); if (!tr) return; var idx = [].indexOf.call(tr.parentNode.children, tr); var rows = MK.filter(function (m) { return filter === "all" || (filter === "ref" ? !!m.ref : m.cat === filter); }); if (rows[idx]) selectMarket(rows[idx].id, true); });
  var lastMark = cur.p;

  var hv0 = document.querySelector(".hero-video"); if (hv0) { var tryPlay = function () { var pr = hv0.play(); if (pr && pr.catch) pr.catch(function () {}); }; tryPlay(); document.addEventListener("click", tryPlay, { once: true }); document.addEventListener("touchstart", tryPlay, { once: true, passive: true }); }

  var PAGES = { about: document.getElementById("page-about") }, home = document.getElementById("home");
  function route() {
    var h = (location.hash || "").replace("#", ""), pg = h.split("-")[0]; if (pg === "docs") pg = "about";
    if (PAGES[pg]) {
      home.hidden = true; Object.keys(PAGES).forEach(function (k) { PAGES[k].hidden = k !== pg; });
      document.body.classList.add("on-page");
      var target = h.indexOf("-") > -1 ? document.getElementById(h) : null;
      requestAnimationFrame(function () { if (target) target.scrollIntoView({ behavior: "smooth", block: "start" }); else window.scrollTo({ top: 0 }); });
      document.querySelectorAll(".doc-nav a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + h); });
    } else {
      var wasPage = home.hidden; home.hidden = false; Object.keys(PAGES).forEach(function (k) { PAGES[k].hidden = true; });
      document.body.classList.remove("on-page");
      if (h) { var el = document.getElementById(h); if (el) requestAnimationFrame(function () { el.scrollIntoView({ behavior: wasPage ? "instant" : "smooth" }); }); }
      else if (wasPage) window.scrollTo({ top: 0 });
      if (wasPage) { drawHero(); drawCandles(); drawGlobe(); revealScan(); }
    }
  }
  window.addEventListener("hashchange", route); route();
  document.querySelectorAll("[data-page]").forEach(function (a) { a.addEventListener("click", function () { }); });
  if ("IntersectionObserver" in window && PAGES.about) { var dh = PAGES.about.querySelectorAll("h1[id], h2[id]"), dobs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) document.querySelectorAll(".doc-nav a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); }); }); }, { rootMargin: "-20% 0px -70% 0px" }); dh.forEach(function (x) { dobs.observe(x); }); }

  var btn = document.getElementById("menuBtn"), menu = document.getElementById("mobileMenu");
  btn.addEventListener("click", function () { var open = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", open ? "true" : "false"); btn.textContent = open ? "✕" : "☰"; });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("open"); btn.textContent = "☰"; btn.setAttribute("aria-expanded", "false"); }); });
  var form = document.getElementById("updatesForm"), note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); var email = form.querySelector("input").value;
    try { localStorage.setItem("openmesh-early-access", email); } catch (err) {}
    form.querySelector("button").textContent = "You're on the list";
    note.textContent = "Saved. We'll email " + email + " when the first compute markets open.";
  });
})();
