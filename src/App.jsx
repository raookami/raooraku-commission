// ============================================================
// BELAJAR REACT: File ini adalah "App.jsx" — titik awal website
// .jsx = JavaScript + HTML digabung (namanya JSX)
// ============================================================

// "import" artinya kita ambil alat dari tempat lain
// useState = alat untuk menyimpan data yang bisa berubah
import { useState } from 'react';
import { useTheme } from './src/hooks/useTheme';
import { getTheme, getStatusStyle } from './themes';

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

  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);

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
    <div style={theme.app}>
      {/* HEADER — bagian atas halaman */}
      <header style={theme.header}>
        <div style={theme.headerInner}>
          <div>
            {/* Nama artist kamu */}
            <h1 style={theme.logo}>🐺 RAOORAKU </h1>
            <p style={theme.tagline}>Illustrator · Commission Open</p>
          </div>

          {/* NAVIGASI — tombol untuk pindah halaman */}
          {/* "nav" = navigation, untuk aksesibilitas */}
          <nav style={theme.nav}>
            {['home', 'portfolio', 'commission', 'order'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...theme.navBtn,
                  ...(activeTab === tab ? theme.navBtnActive : {}),
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}

            {/* Tambahkan ini 👇 */}
            <button
              onClick={toggleTheme}
              style={theme.themeToggle}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* KONTEN UTAMA — berubah sesuai tab yang aktif */}
      <main style={theme.main}>
        {/* Kondisi: tampilkan sesuai tab aktif */}
        {/* "&&" artinya "jika ... maka tampilkan ..." */}

        {/* ===== HALAMAN HOME ===== */}
        {activeTab === 'home' && (
          <div style={theme.page}>
            <div style={theme.hero}>
              <img
                src="/lv_0_20250116221257.gif"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '100%',
                  objectFit: 'cover',
                }}
              />
              <h2 style={theme.heroTitle}>HI! I'M RAOORAKU ✨</h2>
              <p style={theme.heroDesc}>
                specialize in cute male character design.
              </p>
              <div style={theme.heroButtons}>
                <button
                  style={theme.btnPrimary}
                  onClick={() => setActiveTab('commission')}
                >
                  IDR COMMISSION
                </button>
                <button
                  style={theme.btnSecondary}
                  onClick={() => setActiveTab('portfolio')}
                >
                  PORTFOLIO
                </button>
                <button
                  style={theme.btnSecondary}
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
                ...theme.statusBox,
                ...getStatusStyle(isOpen, isDark),
                color: isOpen ? '#5ed15e' : '#ca5b5b',
              }}
            >
              <span
                style={{
                  ...theme.statusDot,
                  background: isOpen ? '#0c0' : '#e00',
                }}
              ></span>
              <strong>
                {isOpen ? 'COMMISSION OPEN' : 'COMMISSION CLOSED'}
              </strong>
              <button
                onClick={() => {
                  const pw = prompt('Password:');
                  if (pw === '09000') {
                    setIsOpen(!isOpen);
                  } else {
                    alert('Password salah!');
                  }
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 14px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'default',
                  fontSize: 12,
                }}
              ></button>
            </div>

            {/* Info singkat */}
            <div style={theme.infoGrid}>
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
                <div key={info.label} style={theme.infoCard}>
                  <div style={theme.infoIcon}>{info.icon}</div>
                  <div style={theme.infoLabel}>{info.label}</div>
                  <div style={theme.infoValue}>{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== HALAMAN PORTFOLIO ===== */}
        {activeTab === 'portfolio' && (
          <div style={theme.page}>
            <h2 style={theme.sectionTitle}>Portfolio</h2>

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
                      style={{ ...theme.portfolioCard, cursor: 'zoom-in' }}
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
          <div style={theme.page}>
            <h2 style={theme.sectionTitle}>RAWRMISSION</h2>
            <h3 style={theme.sectionDesc}>
              Original character, personal use, commercial use, profile picture,
              banner, gift for friends, etc.
            </h3>
            <p style={theme.sectionDesc}>
              Pilih jenis commission yang kamu mau, lalu lanjut ke halaman
              Order!
            </p>

            <div style={theme.commissionGrid}>
              {commissions.map((c) => (
                <div key={c.id} style={theme.commCard}>
                  <div style={theme.commEmoji}>{c.emoji}</div>
                  <h3 style={theme.commType}>{c.type}</h3>
                  <div style={theme.commSlots}>
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
                          style={theme.btnVariant}
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
                          ...theme.btnSecondary,
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
                      style={c.slots > 0 ? theme.btnPrimary : theme.btnDisabled}
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
            <div style={theme.tos}>
              <h3 style={theme.tosTitle}>✨ Add-ons</h3>
              <ul style={theme.tosList}>
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
            <div style={theme.tos}>
              <h3 style={theme.tosTitle}>📋 Terms of Service </h3>
              <ul style={theme.tosList}>
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
          <div style={theme.page}>
            <h2 style={theme.sectionTitle}>Form Order</h2>

            {/* Kondisi: tampilkan sukses ATAU form */}
            {submitted ? (
              // Tampilkan ini kalau form sudah dikirim
              <div style={theme.successBox}>
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
                  style={theme.btnPrimary}
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
              <form onSubmit={handleSubmit} style={theme.form}>
                {/* Setiap input punya label dan input field */}

                <div style={theme.formGroup}>
                  <label style={theme.label}>Nama / Username</label>
                  <input
                    style={theme.input}
                    type="text"
                    name="name"
                    placeholder="Nama kamu..."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={theme.formGroup}>
                  <label style={theme.label}>
                    Kontak Diskusi (Discord / Instagram / WA / FB / dll)
                  </label>
                  <input
                    style={theme.input}
                    type="text"
                    name="contact"
                    placeholder="@username, nomor WA, dll..."
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={theme.formGroup}>
                  <label style={theme.label}>
                    Email (untuk pengiriman file HD)
                  </label>
                  <input
                    style={theme.input}
                    type="email"
                    name="email"
                    placeholder="emailkamu@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={theme.formGroup}>
                  <label style={theme.label}>Jenis Commission</label>
                  {/* <select> = dropdown pilihan */}
                  <select
                    style={theme.input}
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

                <div style={theme.formGroup}>
                  <label style={theme.label}>
                    Deskripsi Karakter & Request
                  </label>
                  {/* <textarea> = input teks panjang */}
                  <textarea
                    style={{ ...theme.input, height: 120, resize: 'vertical' }}
                    name="desc"
                    placeholder="Ceritakan karaktermu: tampilan, warna rambut, kostum, ekspresi yang diinginkan..."
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={theme.formGroup}>
                  <label style={theme.label}>Link Referensi (opsional)</label>
                  <input
                    style={theme.input}
                    type="text"
                    name="ref"
                    placeholder="Link gambar referensi / Pinterest / dll..."
                    value={formData.ref}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" style={theme.btnPrimary}>
                  Kirim Order 🚀
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={theme.footer}>
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
