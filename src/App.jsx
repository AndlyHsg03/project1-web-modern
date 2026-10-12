import { useState, useMemo, useEffect } from "react";

/* ---------- Data menu ---------- */
const JENIS = [
  { id: "espresso", nama: "Espresso", harga: 15000, warna: "#2a140b", level: 0.42 },
  { id: "tubruk", nama: "Kopi Tubruk", harga: 12000, warna: "#3a1c0f", level: 0.9 },
  { id: "latte", nama: "Latte", harga: 25000, warna: "#a97b52", level: 1 },
  { id: "aren", nama: "Kopi Susu Gula Aren", harga: 22000, warna: "#8a5a36", level: 1 },
];
const UKURAN = [
  { id: "kecil", nama: "Kecil", ml: "180 ml", skala: 0.82, tambah: 0, isi: 0.62 },
  { id: "sedang", nama: "Sedang", ml: "260 ml", skala: 0.96, tambah: 4000, isi: 0.74 },
  { id: "besar", nama: "Besar", ml: "360 ml", skala: 1.1, tambah: 8000, isi: 0.86 },
];
const TOPPING = [
  { id: "susu", nama: "Busa susu" },
  { id: "krim", nama: "Krim kocok" },
  { id: "karamel", nama: "Saus karamel" },
  { id: "es", nama: "Es batu" },
];
const HARGA_TOPPING = 3000;
const RP = (n) => "Rp " + n.toLocaleString("id-ID");

/* ---------- Gelas (SVG) ---------- */
function Gelas({ jenis, ukuran, gula, topping, memesan }) {
  const has = (t) => topping.includes(t);
  const fill = ukuran.isi * jenis.level;
  const y = 214 - fill * 150; // permukaan kopi
  return (
    <svg viewBox="0 0 240 280" className="gelas" role="img"
      aria-label={`Gelas kopi ukuran ${ukuran.nama}, ${jenis.nama}`}>
      <defs>
        <clipPath id="isiGelas">
          <path d="M52 66 H168 L153 204 Q151 218 136 218 H84 Q69 218 67 204 Z" />
        </clipPath>
      </defs>

      {/* uap */}
      <g className={"uap" + (memesan ? " nyala" : "")} fill="none" stroke="#f4efe6" strokeWidth="6" strokeLinecap="round">
        <path className="u1" d="M92 52 C80 38 104 28 92 12" />
        <path className="u2" d="M120 52 C108 36 132 26 120 6" />
        <path className="u3" d="M148 52 C136 38 160 28 148 14" />
      </g>

      {/* gelas + isi, diskalakan sesuai ukuran */}
      <g className="skala" style={{ transform: `scale(${ukuran.skala})` }}>
        <path d="M168 90 C206 86 206 160 160 162" fill="none" stroke="#f4efe6" strokeWidth="11" strokeLinecap="round" />
        <path d="M52 66 H168 L153 204 Q151 218 136 218 H84 Q69 218 67 204 Z" fill="#f4efe6" opacity=".16" />

        <g clipPath="url(#isiGelas)">
          <g className="cairan" style={{ transform: `translateY(${y}px)` }}>
            <rect x="0" y="0" width="240" height="260" fill={jenis.warna} style={{ transition: "fill .6s" }} />
            <rect x="0" y="0" width="240" height="14" fill="#f3e5cf" className="lapis" style={{ opacity: has("susu") ? 1 : 0 }} />
            <path d="M52 4 q12 10 24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#d98c2b" strokeWidth="5"
              className="lapis" style={{ opacity: has("karamel") ? 1 : 0 }} />
            <g className="lapis" style={{ opacity: has("es") ? 1 : 0 }}>
              <rect x="78" y="20" width="26" height="26" rx="5" fill="#dff1f5" opacity=".75" transform="rotate(-12 91 33)" className="es e1" />
              <rect x="112" y="34" width="24" height="24" rx="5" fill="#dff1f5" opacity=".7" transform="rotate(14 124 46)" className="es e2" />
              <rect x="94" y="62" width="22" height="22" rx="5" fill="#dff1f5" opacity=".6" transform="rotate(6 105 73)" className="es e3" />
            </g>
          </g>
        </g>

        {/* krim kocok di atas bibir gelas */}
        <g className="krim" style={{ transform: `translateY(${y - 4}px) scale(${has("krim") ? 1 : 0})`, transformOrigin: "110px 0" }}>
          <ellipse cx="110" cy="-4" rx="42" ry="12" fill="#fffaf0" />
          <ellipse cx="110" cy="-16" rx="30" ry="11" fill="#fffaf0" />
          <ellipse cx="110" cy="-27" rx="17" ry="9" fill="#fffaf0" />
          <path d="M104 -36 q6 -12 12 0" fill="#fffaf0" />
        </g>

        <path d="M52 66 H168 L153 204 Q151 218 136 218 H84 Q69 218 67 204 Z" fill="none" stroke="#f4efe6" strokeWidth="5" strokeLinejoin="round" />
      </g>

      {/* piring alas + gula */}
      <ellipse cx="120" cy="244" rx="92" ry="14" fill="#f4efe6" />
      <ellipse cx="120" cy="241" rx="78" ry="9" fill="#e4dccb" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={188 + i * 0} y="226" width="14" height="14" rx="2" fill="#fff"
          stroke="#cfc6b3" className="gula"
          style={{
            opacity: gula > i ? 1 : 0,
            transform: `translate(${-i * 15 - (i === 2 ? -8 : 0)}px, ${gula > i ? (i === 2 ? -15 : 0) : -30}px)`,
          }} />
      ))}
    </svg>
  );
}

/* ---------- Form ---------- */
export default function CoffeeOrderForm() {
  const [nama, setNama] = useState("");
  const [jenisId, setJenisId] = useState("latte");
  const [ukuranId, setUkuranId] = useState("sedang");
  const [gula, setGula] = useState(2);
  const [topping, setTopping] = useState([]);
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState({});
  const [pesanan, setPesanan] = useState(null);

  const jenis = JENIS.find((j) => j.id === jenisId);
  const ukuran = UKURAN.find((u) => u.id === ukuranId);
  const total = useMemo(
    () => jenis.harga + ukuran.tambah + topping.length * HARGA_TOPPING,
    [jenis, ukuran, topping]
  );

  // uap hilang sendiri setelah beberapa detik
  const [uapNyala, setUapNyala] = useState(false);
  useEffect(() => {
    if (!pesanan) return;
    setUapNyala(true);
    const t = setTimeout(() => setUapNyala(false), 6000);
    return () => clearTimeout(t);
  }, [pesanan]);

  const toggleTopping = (id) =>
    setTopping((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const validasi = () => {
    const e = {};
    if (nama.trim().length < 3) e.nama = "Nama minimal 3 huruf agar barista bisa memanggilmu.";
    if (!/^[\p{L}\s.'-]+$/u.test(nama.trim()) && nama.trim()) e.nama = "Nama hanya boleh berisi huruf.";
    if (catatan.length > 80) e.catatan = "Catatan maksimal 80 karakter.";
    return e;
  };

  const kirim = (ev) => {
    ev.preventDefault();
    const e = validasi();
    setError(e);
    if (Object.keys(e).length) return;
    setPesanan({ nama: nama.trim(), jenis: jenis.nama, ukuran: ukuran.nama, gula, topping, total, catatan });
  };

  const ulang = () => {
    setPesanan(null);
    setUapNyala(false);
    setNama("");
    setCatatan("");
    setTopping([]);
  };

  return (
    <main className="kedai">
      <style>{css}</style>

      <section className="panggung" aria-label="Pratinjau gelas">
        <h1>Kedai Kopi Sore</h1>
        <p className="sub">Racik kopimu, lihat gelasnya terisi.</p>
        <Gelas jenis={jenis} ukuran={ukuran} gula={gula} topping={topping} memesan={uapNyala} />
        <p className="harga" aria-live="polite">{RP(total)}</p>
      </section>

      <section className="kartu">
        {pesanan ? (
          <div className="sukses" role="status">
            <h2>Pesanan masuk, {pesanan.nama}!</h2>
            <p>Barista sedang menyeduh. Uapnya sudah mengepul di gelas.</p>
            <dl>
              <dt>Kopi</dt><dd>{pesanan.jenis}, {pesanan.ukuran}</dd>
              <dt>Gula</dt><dd>{["Tanpa gula", "Sedikit", "Normal", "Manis"][pesanan.gula]}</dd>
              <dt>Topping</dt>
              <dd>{pesanan.topping.length ? pesanan.topping.map((t) => TOPPING.find((x) => x.id === t).nama).join(", ") : "Tidak ada"}</dd>
              {pesanan.catatan && (<><dt>Catatan</dt><dd>{pesanan.catatan}</dd></>)}
              <dt>Total</dt><dd><strong>{RP(pesanan.total)}</strong></dd>
            </dl>
            <button type="button" className="tombol" onClick={ulang}>Pesan lagi</button>
          </div>
        ) : (
          <form onSubmit={kirim} noValidate>
            <div className="bidang">
              <label htmlFor="nama">Nama pemesan</label>
              <input id="nama" value={nama} onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Rani" aria-invalid={!!error.nama} aria-describedby="err-nama" />
              {error.nama && <p className="err" id="err-nama">{error.nama}</p>}
            </div>

            <div className="bidang">
              <label htmlFor="jenis">Jenis kopi</label>
              <select id="jenis" value={jenisId} onChange={(e) => setJenisId(e.target.value)}>
                {JENIS.map((j) => <option key={j.id} value={j.id}>{j.nama} - {RP(j.harga)}</option>)}
              </select>
            </div>

            <fieldset className="bidang">
              <legend>Ukuran gelas</legend>
              <div className="pilihan tiga">
                {UKURAN.map((u) => (
                  <label key={u.id} className="chip">
                    <input type="radio" name="ukuran" checked={ukuranId === u.id} onChange={() => setUkuranId(u.id)} />
                    <span><b>{u.nama}</b><small>{u.ml}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="bidang">
              <label htmlFor="gula">Level gula: <b>{["Tanpa gula", "Sedikit", "Normal", "Manis"][gula]}</b></label>
              <input id="gula" type="range" min="0" max="3" step="1" value={gula}
                onChange={(e) => setGula(Number(e.target.value))} />
            </div>

            <fieldset className="bidang">
              <legend>Topping (+{RP(HARGA_TOPPING)} per item)</legend>
              <div className="pilihan dua">
                {TOPPING.map((t) => (
                  <label key={t.id} className="chip">
                    <input type="checkbox" checked={topping.includes(t.id)} onChange={() => toggleTopping(t.id)} />
                    <span><b>{t.nama}</b></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="bidang">
              <label htmlFor="catatan">Catatan untuk barista (opsional)</label>
              <input id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: es batunya sedikit saja" aria-invalid={!!error.catatan} />
              {error.catatan && <p className="err">{error.catatan}</p>}
            </div>

            <button type="submit" className="tombol">Pesan sekarang - {RP(total)}</button>
          </form>
        )}
      </section>
    </main>
  );
}

/* ---------- Gaya ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&display=swap');
.kedai{--hijau:#12332f;--hijau2:#1b4a44;--krem:#f4efe6;--kuning:#f2b33d;--merah:#ff9d8a;
  min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:var(--hijau);
  font-family:'Bricolage Grotesque',system-ui,sans-serif;color:var(--krem)}
.kedai *{box-sizing:border-box}
.panggung{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;
  background:radial-gradient(circle at 50% 60%,var(--hijau2),var(--hijau) 70%)}
.panggung h1{font-size:clamp(2rem,4vw,3.2rem);font-weight:800;margin:0;letter-spacing:-.02em}
.sub{margin:6px 0 8px;opacity:.8}
.gelas{width:min(360px,80%);height:auto;overflow:visible}
.harga{font-size:2rem;font-weight:800;color:var(--kuning);margin:4px 0 0}
.skala{transform-origin:120px 218px;transition:transform .6s cubic-bezier(.34,1.4,.64,1)}
.cairan{transition:transform .9s cubic-bezier(.3,.9,.3,1)}
.lapis{transition:opacity .5s}
.krim{transition:transform .6s cubic-bezier(.34,1.56,.64,1)}
.gula{transition:opacity .35s,transform .45s cubic-bezier(.34,1.56,.64,1)}
.es{animation:apung 3s ease-in-out infinite}.e2{animation-delay:-1s}.e3{animation-delay:-2s}
@keyframes apung{50%{translate:0 -4px}}
.uap path{opacity:0;stroke-dasharray:60;stroke-dashoffset:60}
.uap.nyala path{animation:kepul 2.6s ease-in-out infinite}
.uap .u2{animation-delay:.5s!important}.uap .u3{animation-delay:1s!important}
@keyframes kepul{0%{opacity:0;stroke-dashoffset:60;transform:translateY(10px)}
  40%{opacity:.9}100%{opacity:0;stroke-dashoffset:0;transform:translateY(-14px)}}
.kartu{background:var(--krem);color:#2a1a10;padding:clamp(24px,5vw,56px);display:flex;align-items:center}
.kartu form,.sukses{width:100%;max-width:460px;margin:0 auto}
.bidang{margin:0 0 18px;border:0;padding:0}
.bidang label,.bidang legend{display:block;font-weight:600;margin-bottom:8px;padding:0}
input[type=text],input:not([type]),select{width:100%;padding:12px 14px;font:inherit;border:2px solid #cdbfa8;
  border-radius:10px;background:#fffdf8;color:inherit}
input:focus-visible,select:focus-visible,.tombol:focus-visible,.chip input:focus-visible+span{outline:3px solid var(--kuning);outline-offset:2px}
input[aria-invalid=true]{border-color:#c0392b}
input[type=range]{width:100%;accent-color:#8a5a36}
.pilihan{display:grid;gap:10px}.tiga{grid-template-columns:repeat(3,1fr)}.dua{grid-template-columns:repeat(2,1fr)}
.chip{position:relative;margin:0!important;cursor:pointer}
.chip input{position:absolute;opacity:0;inset:0}
.chip span{display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 8px;text-align:center;
  border:2px solid #cdbfa8;border-radius:10px;background:#fffdf8;transition:all .2s}
.chip small{opacity:.65}
.chip input:checked+span{background:var(--hijau);border-color:var(--hijau);color:var(--krem)}
.err{color:#b3261e;margin:6px 0 0;font-size:.9rem}
.tombol{width:100%;padding:15px;font:inherit;font-weight:800;font-size:1.05rem;border:0;border-radius:12px;
  background:var(--kuning);color:#2a1a10;cursor:pointer;transition:transform .15s,background .2s}
.tombol:hover{background:#ffc45c}.tombol:active{transform:scale(.97)}
.sukses h2{margin:0 0 6px;font-size:1.7rem}
.sukses dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:20px 0;padding:16px;
  border:2px dashed #cdbfa8;border-radius:12px}
.sukses dt{font-weight:600}.sukses dd{margin:0}
@media(max-width:820px){.kedai{grid-template-columns:1fr}.panggung{padding:24px 16px}.gelas{width:min(260px,70%)}}
@media(prefers-reduced-motion:reduce){.kedai *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;