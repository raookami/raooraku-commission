// ============================================================
// BELAJAR REACT: File ini adalah "App.jsx" — titik awal website
// .jsx = JavaScript + HTML digabung (namanya JSX)
// ============================================================

// "import" artinya kita ambil alat dari tempat lain
// useState = alat untuk menyimpan data yang bisa berubah
import { useState } from 'react';

// Data commission kita simpan di sini (di luar komponen)
// Ini seperti "daftar menu" yang nanti ditampilkan
const commissions = [
  {
    id: 1,
    type: 'Bust Up',
    emoji: '🎨',
    variant: [
      {
        label: 'Simple BG',
        price: 100000,
        desc: 'Gambar karakter dengan background sederhana.',
      },
      {
        label: 'Normal BG',
        price: 130000,
        desc: 'Gambar karakter dengan normal background.',
      },
    ],
    slots: 5,
  },
  {
    id: 2,
    type: 'Half Body',
    emoji: '🐻‍❄️',
    variant: [
      {
        label: 'Simple BG',
        price: 200000,
        desc: 'Gambar karakter dengan background sederhana.',
      },
      {
        label: 'Normal BG',
        price: 250000,
        desc: 'Gambar karakter dengan normal background.',
      },
    ],
    slots: 3,
  },
  {
    id: 3,
    type: 'Full Body',
    emoji: '✨',
    variant: [
      {
        label: 'Simple BG',
        price: 300000,
        desc: 'Gambar karakter dengan background sederhana.',
      },
      {
        label: 'Normal BG',
        price: 380000,
        desc: 'Gambar karakter dengan normal background.',
      },
    ],
    slots: 2,
  },
];

// Contoh karya (portfolio) — biasanya ini dari gambar asli kamu
// Karena ini latihan, kita pakai warna placeholder
const portfolio = [
  {
    id: 1,
    label: 'Bust Up',
    imgs: [
      '/Illustration29.jpg',
      '/mike kowalski.5.jpg',
      '/Ilustrasi.jpg',
      '/8d33286e_original.jpg',
      '/Illustration42.png',
    ],
  },
  {
    id: 2,
    label: 'Half Body',
    imgs: [
      '/Illustration64.png',
      '/Illustration41.png',
      '/Illustration32.jpg',
      '/ryugamine ichigo commission.jpg',
      '/Illustration31.jpg',
      '/raoo5325.jpg',
      '/Illustration35.jpg',
      '/160723-2.jpg',
      '/1NewCanvas11.jpg',
      '/commis shiro6.jpg',
    ],
  },
  {
    id: 3,
    label: 'Full Body',
    imgs: [
      '/Illustration58.png',
      '/Illustration51.png',
      '/Ilustrasicmmc06524.1-1.jpg',
      '/Illustration45.png',
      '/Illustration11.jpg',
      '/puppy0 (1).jpg',
    ],
  },
];

// ============================================================
// KOMPONEN UTAMA: Fungsi ini adalah "isi" dari halaman kita
// Di React, setiap bagian UI dibuat sebagai "komponen" (fungsi)
// ============================================================
export default function App() {
  // useState = menyimpan data yang bisa berubah
  // "activeTab" = tab mana yang sedang aktif
  // "setActiveTab" = fungsi untuk mengubah tab
  const [activeTab, setActiveTab] = useState('home');

  // "formData" = data yang diisi user di form order
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    type: '',
    desc: '',
    ref: '',
  });

  // "submitted" = apakah form sudah dikirim?
  const [submitted, setSubmitted] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  // Fungsi ini dijalankan saat form dikirim
  async function handleSubmit(e) {
    e.preventDefault();

    const webhookUrl =
      'https://discord.com/api/webhooks/1508346926934917262/hGuyRQRUUYE00d7je0g4WTmO3AYOJ9GeKicy6bVxBGikoN8i6RUTeafSbUDH-qxImWpV';

    const pesan = `
🎨 **ORDER BARU!**
👤 **Nama:** ${formData.name}
📱 **Kontak Diskusi:** ${formData.contact}
📧 **Email:** ${formData.email}
🖌️ **Jenis:** ${formData.type}
📝 **Deskripsi:** ${formData.desc}
🔗 **Referensi:** ${formData.ref || 'Tidak ada'}
`;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: pesan }),
      });
      setSubmitted(true);
    } catch (err) {
      alert('Gagal mengirim order, coba lagi ya!');
    }
  }

  // Fungsi untuk mengupdate data form saat user mengetik
  function handleChange(e) {
    // "..." artinya salin semua data lama, lalu ubah satu field
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // ============================================================
  // RETURN = apa yang ditampilkan di layar
  // Di JSX, HTML ditulis hampir sama, tapi pakai "className"
  // bukan "class" (karena "class" sudah dipakai JavaScript)
  // ============================================================
  return (
    <div style={styles.app}>
      {/* HEADER — bagian atas halaman */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            {/* Nama artist kamu */}
            <h1 style={styles.logo}>🐺 RAOORAKU </h1>
            <p style={styles.tagline}>Illustrator · Commission Open</p>
          </div>

          {/* NAVIGASI — tombol untuk pindah halaman */}
          {/* "nav" = navigation, untuk aksesibilitas */}
          <nav style={styles.nav}>
            {/* Kita buat tombol untuk setiap tab */}
            {['home', 'portfolio', 'commission', 'order'].map((tab) => (
              // "key" dibutuhkan React saat membuat list
              <button
                key={tab}
                // Klik tombol → ganti tab
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.navBtn,
                  // Jika tab ini aktif, beri warna berbeda
                  ...(activeTab === tab ? styles.navBtnActive : {}),
                }}
              >
                {/* Capitalize huruf pertama nama tab */}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* KONTEN UTAMA — berubah sesuai tab yang aktif */}
      <main style={styles.main}>
        {/* Kondisi: tampilkan sesuai tab aktif */}
        {/* "&&" artinya "jika ... maka tampilkan ..." */}

        {/* ===== HALAMAN HOME ===== */}
        {activeTab === 'home' && (
          <div style={styles.page}>
            <div style={styles.hero}>
              <img
                src="/lv_0_20250116221257.gif"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '100%',
                  objectFit: 'cover',
                }}
              />
              <h2 style={styles.heroTitle}>HI! I'M RAOORAKU ✨</h2>
              <p style={styles.heroDesc}>
                specialize in cute male character design.
              </p>
              <div style={styles.heroButtons}>
                <button
                  style={styles.btnPrimary}
                  onClick={() => setActiveTab('commission')}
                >
                  IDR COMMISSION
                </button>
                <button
                  style={styles.btnSecondary}
                  onClick={() => setActiveTab('portfolio')}
                >
                  PORTFOLIO
                </button>
                <button
                  style={styles.btnSecondary}
                  onClick={() =>
                    window.open('https://vgen.co/raooraku_', '_blank')
                  }
                >
                  USD COMMISSION ↗
                </button>
              </div>
            </div>

            {/* Status commission */}
            <div
              style={{
                ...styles.statusBox,
                background: isOpen ? '#efffef' : '#fff0f0',
                border: `1.5px solid ${isOpen ? '#a0e0a0' : '#f0a0a0'}`,
              }}
            >
              <span
                style={{
                  ...styles.statusDot,
                  background: isOpen ? '#0c0' : '#e00',
                }}
              ></span>
              <strong>
                {isOpen ? 'COMMISSION OPEN' : 'COMMISSION CLOSED'}
              </strong>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 14px',
                  borderRadius: 999,
                  border: 'none',
                  background: isOpen ? '#e05' : '#0a7',
                  color: 'white',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {isOpen ? 'Tutup' : 'Buka'}
              </button>
            </div>

            {/* Info singkat */}
            <div style={styles.infoGrid}>
              {[
                { icon: '⏱️', label: 'Estimasi', value: '7–14 hari kerja' },
                {
                  icon: '💳',
                  label: 'Pembayaran',
                  value: 'Transfer Bank / E-WALLET',
                },
                { icon: '🔄', label: 'Revisi', value: '2x revisi minor' },
                { icon: '📩', label: 'Format', value: 'PNG / JPG 300dpi' },
              ].map((info) => (
                <div key={info.label} style={styles.infoCard}>
                  <div style={styles.infoIcon}>{info.icon}</div>
                  <div style={styles.infoLabel}>{info.label}</div>
                  <div style={styles.infoValue}>{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== HALAMAN PORTFOLIO ===== */}
        {activeTab === 'portfolio' && (
          <div style={styles.page}>
            <h2 style={styles.sectionTitle}>Portfolio</h2>

            {/* Tab kategori */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 24,
                flexWrap: 'wrap',
              }}
            >
              {portfolio.map((kategori) => (
                <button
                  key={kategori.id}
                  onClick={() => setSelectedCategory(kategori.id)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 999,
                    border: '1.5px solid ' + pink,
                    background:
                      selectedCategory === kategori.id ? pink : 'transparent',
                    color: selectedCategory === kategori.id ? 'white' : pink,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {kategori.label}
                </button>
              ))}
            </div>

            {/* Grid foto sesuai kategori yang dipilih */}
            {selectedCategory && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 12,
                }}
              >
                {portfolio
                  .find((k) => k.id === selectedCategory)
                  ?.imgs.map((img, index) => (
                    <div
                      key={index}
                      style={{ ...styles.portfolioCard, cursor: 'zoom-in' }}
                      onClick={() => setLightbox(img)}
                    >
                      <img
                        src={img}
                        alt={`karya ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* Lightbox — muncul saat foto diklik */}
            {lightbox && (
              <div
                onClick={() => setLightbox(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999,
                  cursor: 'zoom-out',
                }}
              >
                <img
                  src={lightbox}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    borderRadius: 12,
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* ===== HALAMAN COMMISSION (HARGA) ===== */}
        {activeTab === 'commission' && (
          <div style={styles.page}>
            <h2 style={styles.sectionTitle}>RAWRMISSION</h2>
            <h3 style={styles.sectionDesc}>
              Original character, personal use, commercial use, profile picture,
              banner, gift for friends, etc.
            </h3>
            <p style={styles.sectionDesc}>
              Pilih jenis commission yang kamu mau, lalu lanjut ke halaman
              Order!
            </p>

            <div style={styles.commissionGrid}>
              {commissions.map((c) => (
                <div key={c.id} style={styles.commCard}>
                  <div style={styles.commEmoji}>{c.emoji}</div>
                  <h3 style={styles.commType}>{c.type}</h3>
                  <div style={styles.commSlots}>
                    Slot tersisa:{' '}
                    <strong style={{ color: c.slots <= 1 ? '#e05' : '#0a7' }}>
                      {c.slots}
                    </strong>
                  </div>

                  {/* Tampilkan pilihan variant kalau card ini yang diklik */}
                  {selectedComm === c.id ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {c.variant.map((v) => (
                        <button
                          key={v.label}
                          style={styles.btnVariant}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              type: `${c.type} — ${v.label}`,
                            });
                            setActiveTab('order');
                            setSelectedComm(null);
                          }}
                        >
                          <strong>{v.label}</strong>
                          <span style={{ fontSize: 12, color: '#a06080' }}>
                            {' '}
                            · Rp {v.price.toLocaleString('id-ID')}
                          </span>
                          <div
                            style={{
                              fontSize: 11,
                              color: '#888',
                              marginTop: 2,
                            }}
                          >
                            {v.desc}
                          </div>
                        </button>
                      ))}
                      <button
                        style={{
                          ...styles.btnSecondary,
                          fontSize: 13,
                          padding: '6px 12px',
                        }}
                        onClick={() => setSelectedComm(null)}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      style={
                        c.slots > 0 ? styles.btnPrimary : styles.btnDisabled
                      }
                      disabled={c.slots === 0}
                      onClick={() => setSelectedComm(c.id)}
                    >
                      {c.slots > 0 ? 'Pilih Commission' : 'Slot Penuh'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ADD-ONS */}
            <div style={styles.tos}>
              <h3 style={styles.tosTitle}>✨ Add-ons</h3>
              <ul style={styles.tosList}>
                <li>
                  <strong>Extra character</strong> — +50% per karakter
                </li>
                <li>
                  <strong>Detailed BG</strong> — +Rp 50.000 – 100.000
                </li>
                <li>
                  <strong>Commercial use</strong> — 2× total harga
                </li>
                <li>
                  <strong>Character Design</strong> — Rp 500.000 – 1.000.000
                  <ul style={{ marginTop: 4 }}>
                    <li>
                      <em>Basic</em> — 1 fullbody pose, final colour
                    </li>
                    <li>
                      <em>Full</em> — 1 fullbody pose, outfit details, color
                      palette
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            {/* TOS */}
            <div style={styles.tos}>
              <h3 style={styles.tosTitle}>📋 Terms of Service </h3>
              <ul style={styles.tosList}>
                <li>Payment after sketch approval.</li>
                <li>No refunds after payment is made.</li>
                <li>
                  Turnaround time: 7–14 days (depends on queue). DON'T RUSH
                  PLEASE
                </li>
                <li>2x minor revision (small color / expression).</li>
                <li>I may decline a commission if I’m unable to take it.</li>
                <li>
                  Will not draw: NSFW, 18+, fetish, heavy gore, complex mecha.
                </li>
                <li>
                  Personal use only (commercial use available with extra fee).
                </li>
                <li>Credit me when reposting.</li>
                <li>NFT & AI training are not allowed.</li>
                <li>I may post the artwork as portfolio.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===== HALAMAN ORDER / FORM ===== */}
        {activeTab === 'order' && (
          <div style={styles.page}>
            <h2 style={styles.sectionTitle}>Form Order</h2>

            {/* Kondisi: tampilkan sukses ATAU form */}
            {submitted ? (
              // Tampilkan ini kalau form sudah dikirim
              <div style={styles.successBox}>
                <div style={{ fontSize: 48 }}>🎉</div>
                <h3>Order berhasil dikirim!</h3>
                <p>Aku akan balas dalam 1×24 jam ya. Cek DM atau email kamu!</p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '12px 0',
                  }}
                >
                  <img
                    src="/Animation5.gif"
                    alt=""
                    style={{ width: 160, height: 'auto' }}
                  />
                </div>
                <button
                  style={styles.btnPrimary}
                  onClick={() => {
                    // Reset form dan kembali ke home
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      contact: '',
                      type: '',
                      desc: '',
                      ref: '',
                    });
                    setActiveTab('home');
                  }}
                >
                  Kembali ke Beranda
                </button>
              </div>
            ) : (
              // Tampilkan form kalau belum dikirim
              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Setiap input punya label dan input field */}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama / Username</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="name"
                    placeholder="Nama kamu..."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Kontak Diskusi (Discord / Instagram / WA / FB / dll)
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="contact"
                    placeholder="@username, nomor WA, dll..."
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Email (untuk pengiriman file HD)
                  </label>
                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="emailkamu@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Jenis Commission</label>
                  {/* <select> = dropdown pilihan */}
                  <select
                    style={styles.input}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih jenis --</option>
                    {commissions.map((c) =>
                      c.variant.map((v) => (
                        <option
                          key={`${c.id}-${v.label}`}
                          value={`${c.type} — ${v.label}`}
                        >
                          {c.type} — {v.label} · Rp{' '}
                          {v.price.toLocaleString('id-ID')}
                          {c.slots === 0 ? ' (FULL)' : ''}
                        </option>
                      )),
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Deskripsi Karakter & Request
                  </label>
                  {/* <textarea> = input teks panjang */}
                  <textarea
                    style={{ ...styles.input, height: 120, resize: 'vertical' }}
                    name="desc"
                    placeholder="Ceritakan karaktermu: tampilan, warna rambut, kostum, ekspresi yang diinginkan..."
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Link Referensi (opsional)</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="ref"
                    placeholder="Link gambar referensi / Pinterest / dll..."
                    value={formData.ref}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" style={styles.btnPrimary}>
                  Kirim Order 🚀
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 RAWRRAKU</p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Instagram: @raooraku_ · Discord: RAOORAKU
        </p>
      </footer>
    </div>
  );
}

// ============================================================
// STYLES — Gaya tampilan ditulis sebagai objek JavaScript
// Ini seperti CSS, tapi ditulis dalam format JS
// Di React, "className" + file CSS juga bisa, ini cara alternatif
// ============================================================
const pink = '#5e81d1';
const pinkLight = '#fce7f0';

const styles = {
  app: {
    minHeight: '100vh',
    background: '#fff8fc',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#2a1a2e',
  },
  header: {
    background: '#fff',
    borderBottom: '2px solid ' + pinkLight,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  logo: {
    margin: 0,
    fontSize: 22,
    color: pink,
    fontWeight: 700,
  },
  tagline: {
    margin: '2px 0 0',
    fontSize: 12,
    color: '#a06080',
  },
  nav: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  navBtn: {
    padding: '8px 16px',
    borderRadius: 999,
    border: '1.5px solid ' + pinkLight,
    background: 'white',
    cursor: 'pointer',
    fontSize: 14,
    color: '#a06080',
    transition: 'all 0.2s',
  },
  navBtnActive: {
    background: pink,
    color: 'white',
    borderColor: pink,
  },
  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '20px 20px 60px',
  },
  page: {
    animation: 'fadeIn 0.3s ease',
  },
  hero: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  heroAvatar: {
    fontSize: 72,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: pink,
    margin: '0 0 12px',
  },
  heroDesc: {
    fontSize: 16,
    color: '#6b4060',
    maxWidth: 500,
    margin: '0 auto 24px',
    lineHeight: 1.7,
  },
  heroButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '12px 24px',
    borderRadius: 999,
    border: 'none',
    background: pink,
    color: 'white',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '12px 24px',
    borderRadius: 999,
    border: '2px solid ' + pink,
    background: 'transparent',
    color: pink,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: {
    padding: '12px 24px',
    borderRadius: 999,
    border: 'none',
    background: '#ddd',
    color: '#aaa',
    fontSize: 15,
    cursor: 'not-allowed',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#efffef',
    border: '1.5px solid #a0e0a0',
    borderRadius: 12,
    padding: '12px 20px',
    marginBottom: 24,
    fontSize: 15,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#0c0',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginTop: 8,
  },
  infoCard: {
    background: 'white',
    border: '1.5px solid ' + pinkLight,
    borderRadius: 16,
    padding: '20px 16px',
    textAlign: 'center',
  },
  infoIcon: { fontSize: 28, marginBottom: 8 },
  infoLabel: { fontSize: 12, color: '#a06080', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: 600 },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: pink,
    marginBottom: 8,
  },
  sectionDesc: {
    color: '#6b4060',
    marginBottom: 24,
  },
  portfolioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  portfolioCard: {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'white',
    border: '1.5px solid ' + pinkLight,
  },
  portfolioImg: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
  },
  portfolioLabel: {
    margin: 0,
    padding: '10px 14px',
    fontSize: 14,
    fontWeight: 600,
    color: '#4a2a3e',
  },
  tip: {
    marginTop: 24,
    padding: '14px 18px',
    background: '#fffbe6',
    border: '1.5px solid #ffe88a',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.6,
  },
  commissionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  commCard: {
    background: 'white',
    border: '1.5px solid ' + pinkLight,
    borderRadius: 20,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  commEmoji: { fontSize: 36 },
  commType: { margin: 0, fontSize: 18, fontWeight: 700 },
  commPrice: { margin: 0, fontSize: 22, fontWeight: 800, color: pink },
  commDesc: {
    margin: 0,
    fontSize: 13,
    color: '#6b4060',
    lineHeight: 1.5,
    flex: 1,
  },
  commSlots: { fontSize: 13, color: '#888' },
  tos: {
    background: '#fff8fc',
    border: '1.5px solid ' + pinkLight,
    borderRadius: 16,
    padding: '20px 24px',
  },
  tosTitle: { margin: '0 0 12px', fontSize: 16 },
  tosList: {
    margin: 0,
    paddingLeft: 20,
    lineHeight: 2,
    fontSize: 14,
    color: '#5a3050',
  },
  form: {
    background: 'white',
    border: '1.5px solid ' + pinkLight,
    borderRadius: 20,
    padding: 28,
    maxWidth: 580,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#4a2a3e',
  },
  input: {
    padding: '10px 14px',
    border: '1.5px solid ' + pinkLight,
    borderRadius: 10,
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    background: '#fff8fc',
  },
  successBox: {
    textAlign: 'center',
    padding: '48px 24px',
    background: 'white',
    border: '1.5px solid ' + pinkLight,
    borderRadius: 20,
    maxWidth: 400,
    margin: '0 auto',
  },
  footer: {
    textAlign: 'center',
    padding: '24px 20px',
    borderTop: '1.5px solid ' + pinkLight,
    fontSize: 14,
    color: '#a06080',
  },
  btnVariant: {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1.5px solid #fce7f0',
    background: '#fff8fc',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    fontSize: 14,
  },
};
