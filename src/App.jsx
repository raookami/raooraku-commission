// ============================================================
// BELAJAR REACT: File ini adalah "App.jsx" — titik awal website
// .jsx = JavaScript + HTML digabung (namanya JSX)
// ============================================================

// "import" artinya kita ambil alat dari tempat lain
// useState = alat untuk menyimpan data yang bisa berubah
import { useState, useEffect } from 'react';
import { useTheme } from './src/hooks/useTheme';
import { getTheme, getStatusStyle } from './themes';
import { imgUrl } from './utils/cloudinary';
import ReviewMarquee from './ReviewMarquee';
import ReviewForm from './ReviewForm';
import AdminPanel from './AdminPanel';
import { supabase } from './supabase';
import ReviewList from './ReviewList';

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

const addons = [
  { id: 'extra_char', label: 'Extra Character', type: 'percent', value: 50 },
  {
    id: 'detailed_bg',
    label: 'Detailed BG',
    type: 'range',
    min: 50000,
    max: 100000,
  },
  { id: 'commercial', label: 'Commercial Use', type: 'multiplier', value: 2 },
  { id: 'psd', label: 'PSD File', type: 'percent', value: 90 },
];

// Contoh karya (portfolio) — biasanya ini dari gambar asli kamu
// Karena ini latihan, kita pakai warna placeholder
const portfolio = [
  {
    id: 1,
    label: 'Bust Up',
    imgs: [
      'Illustration29_sgd3xw.jpg',
      'mike_kowalski.5_qczuzy.jpg',
      'Ilustrasi_xiwq4u.jpg',
      '8d33286e_original_fpol3u.jpg',
      'Illustration42_sw3cwt.png',
    ],
  },
  {
    id: 2,
    label: 'Half Body',
    imgs: [
      'Illustration64_am25jb.png',
      'Illustration41_xmux38.png',
      'Illustration32_sk8qhl.jpg',
      'ryugamine_ichigo_commission_fjgnht.jpg',
      'Illustration31_qm27sz.jpg',
      'raoo5325_gt99nr.jpg',
      'Illustration35_ao7jz9.jpg',
      '160723-2_upby6p.jpg',
      '1NewCanvas11_mfeb4o.jpg',
      'commis_shiro6_krzo8t.jpg',
    ],
  },
  {
    id: 3,
    label: 'Full Body',
    imgs: [
      'Illustration58cmmk.png',
      'Illustration51_kgpo3c.png',
      'Ilustrasicmmc06524.1-1_gyy9g0.jpg',
      'Illustration45_oyhpiq.png',
      'Illustration11_bsfhrr.jpg',
      'puppy0_1_bkzaw9.jpg',
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
  function goToTab(tab) {
    setAnimKey((k) => k + 1);
    setActiveTab(tab);
  }
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
  const [loadedImgs, setLoadedImgs] = useState({});
  const [animKey, setAnimKey] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  function hitungEstimasi() {
    // Cari harga base dari commission yang dipilih
    const selected = commissions
      .flatMap((c) => c.variant.map((v) => ({ ...v, type: c.type })))
      .find((v) => `${v.type} — ${v.label}` === formData.type);

    if (!selected) return null;

    let minTotal = selected.price;
    let maxTotal = selected.price;

    selectedAddons.forEach((id) => {
      const addon = addons.find((a) => a.id === id);
      if (!addon) return;

      if (addon.type === 'percent') {
        minTotal += (selected.price * addon.value) / 100;
        maxTotal += (selected.price * addon.value) / 100;
      } else if (addon.type === 'range') {
        minTotal += addon.min;
        maxTotal += addon.max;
      } else if (addon.type === 'multiplier') {
        minTotal *= addon.value;
        maxTotal *= addon.value;
      } else if (addon.type === 'fixed') {
        minTotal += addon.value;
        maxTotal += addon.value;
      }
    });

    return { min: minTotal, max: maxTotal };
  }

  // Preload gambar prev & next saat lightbox aktif
  useEffect(() => {
    if (!lightbox) return;
    const { imgs, index } = lightbox;
    const preloadIndexes = [
      (index + 1) % imgs.length,
      (index - 1 + imgs.length) % imgs.length,
    ];
    preloadIndexes.forEach((i) => {
      const img = new Image();
      img.src = imgUrl(imgs[i], 1200);
    });
  }, [lightbox]);

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
✨ **Add-ons:** ${selectedAddons.length > 0 ? selectedAddons.map((id) => addons.find((a) => a.id === id)?.label).join(', ') : 'Tidak ada'}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h1 style={theme.logo}>🐺 RAOORAKU</h1>
              <p style={theme.tagline}>Illustrator · Commission Open</p>
            </div>
            <button
              onClick={toggleTheme}
              className="mobile-theme-toggle"
              style={{
                ...theme.themeToggle,
                display: 'none',
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

          {/* NAVIGASI — tombol untuk pindah halaman */}
          {/* "nav" = navigation, untuk aksesibilitas */}
          <nav style={theme.nav}>
            {[
              'home',
              'portfolio',
              'commission',
              'order',
              'ulasan',
              'reviews',
              'admin',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => goToTab(tab)}
                style={{
                  ...theme.navBtn,
                  ...(activeTab === tab ? theme.navBtnActive : {}),
                }}
              >
                {tab === 'admin'
                  ? '🔐'
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
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
          <div key={animKey} className="page-enter">
            <ReviewMarquee
              isDark={isDark}
              onClickReviews={() => goToTab('reviews')}
            />

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
                    onClick={() => goToTab('commission')}
                  >
                    IDR COMMISSION
                  </button>
                  <button
                    style={theme.btnSecondary}
                    onClick={() => goToTab('portfolio')}
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
          </div>
        )}

        {/* ===== HALAMAN PORTFOLIO ===== */}
        {activeTab === 'portfolio' && (
          <div key={animKey} className="page-enter" style={theme.page}>
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
                  {kategori.label} ({kategori.imgs.length})
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
                      style={{
                        ...theme.portfolioCard,
                        cursor: 'zoom-in',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onClick={() =>
                        setLightbox({
                          imgs: portfolio.find((k) => k.id === selectedCategory)
                            .imgs,
                          index,
                        })
                      }
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector('img').style.transform =
                          'scale(1.08)';
                        e.currentTarget.querySelector(
                          '.overlay',
                        ).style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector('img').style.transform =
                          'scale(1)';
                        e.currentTarget.querySelector(
                          '.overlay',
                        ).style.opacity = '0';
                      }}
                    >
                      {/* SKELETON */}
                      {!loadedImgs[img] && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                          }}
                        />
                      )}

                      {/* IMG */}
                      <img
                        src={imgUrl(img, 400)}
                        alt={`karya ${index + 1}`}
                        loading="lazy"
                        onLoad={() =>
                          setLoadedImgs((prev) => ({ ...prev, [img]: true }))
                        }
                        style={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                          display: 'block',
                          opacity: loadedImgs[img] ? 1 : 0,
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                        }}
                      />

                      {/* OVERLAY */}
                      <div
                        className="overlay"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          fontSize: 32,
                        }}
                      >
                        🔍
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Lightbox dengan navigasi prev/next */}
            {lightbox && (
              <div
                onClick={() => setLightbox(null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999,
                  cursor: 'zoom-out',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((lb) => ({
                      ...lb,
                      index: (lb.index - 1 + lb.imgs.length) % lb.imgs.length,
                    }));
                  }}
                  style={{
                    position: 'absolute',
                    left: 20,
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: 'white',
                    fontSize: 28,
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    cursor: 'pointer',
                  }}
                >
                  ‹
                </button>
                <img
                  src={imgUrl(lightbox.imgs[lightbox.index], 1200)}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    borderRadius: 12,
                    objectFit: 'contain',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((lb) => ({
                      ...lb,
                      index: (lb.index + 1) % lb.imgs.length,
                    }));
                  }}
                  style={{
                    position: 'absolute',
                    right: 20,
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: 'white',
                    fontSize: 28,
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    cursor: 'pointer',
                  }}
                >
                  ›
                </button>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    color: 'white',
                    fontSize: 13,
                    opacity: 0.7,
                  }}
                >
                  {lightbox.index + 1} / {lightbox.imgs.length}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== HALAMAN COMMISSION (HARGA) ===== */}
        {activeTab === 'commission' && (
          <div key={animKey} className="page-enter" style={theme.page}>
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
                            goToTab('order');
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
          <div key={animKey} className="page-enter" style={theme.page}>
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
                    goToTab('home');
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

                {/* Add-ons */}
                <div style={theme.formGroup}>
                  <label style={theme.label}>Add-ons (opsional)</label>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          cursor: 'pointer',
                          fontSize: 14,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={(e) => {
                            setSelectedAddons((prev) =>
                              e.target.checked
                                ? [...prev, addon.id]
                                : prev.filter((id) => id !== addon.id),
                            );
                          }}
                        />
                        <span>
                          <strong>{addon.label}</strong>
                          <span style={{ color: '#888', marginLeft: 6 }}>
                            {addon.type === 'percent' &&
                              `+${addon.value}% per karakter`}
                            {addon.type === 'range' &&
                              `+Rp ${addon.min.toLocaleString('id-ID')} – ${addon.max.toLocaleString('id-ID')}`}
                            {addon.type === 'multiplier' &&
                              `×${addon.value} total harga`}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Estimasi harga */}
                {formData.type &&
                  (() => {
                    const est = hitungEstimasi();
                    return est ? (
                      <div
                        style={{
                          background: isDark ? '#1e2a3a' : '#eef2ff',
                          borderRadius: 10,
                          padding: '12px 16px',
                          fontSize: 14,
                          marginBottom: 8,
                        }}
                      >
                        💰 <strong>Estimasi: </strong>
                        {est.min === est.max
                          ? `Rp ${est.min.toLocaleString('id-ID')}`
                          : `Rp ${est.min.toLocaleString('id-ID')} – ${est.max.toLocaleString('id-ID')}`}
                        <div
                          style={{ fontSize: 11, color: '#888', marginTop: 4 }}
                        >
                          *Harga final dikonfirmasi setelah diskusi
                        </div>
                      </div>
                    ) : null;
                  })()}

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

      {activeTab === 'ulasan' && (
        <div
          key={animKey}
          className="page-enter"
          style={{
            ...theme.page,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <h2 style={theme.sectionTitle}>✍️ Tulis Ulasan</h2>
          <p
            style={{
              fontSize: 14,
              color: isDark ? '#aaa' : '#888',
              marginBottom: 16,
            }}
          >
            Pernah order? Ceritain pengalaman kamu! 💙
          </p>
          <ReviewForm theme={theme} isDark={isDark} />
        </div>
      )}

      {activeTab === 'reviews' && (
        <div
          key={animKey}
          className="page-enter"
          style={{
            ...theme.page,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <h2 style={theme.sectionTitle}>⭐ Review Klien</h2>
          <p
            style={{
              fontSize: 14,
              color: isDark ? '#aaa' : '#888',
              marginBottom: 16,
            }}
          >
            Kata mereka yang udah pernah order 💙
          </p>
          <ReviewList isDark={isDark} />
        </div>
      )}

      {/* ===== HALAMAN ADMIN ===== */}
      {activeTab === 'admin' && (
        <div key={animKey} className="page-enter" style={theme.page}>
          <AdminPanel theme={theme} isDark={isDark} />
        </div>
      )}

      {/* FOOTER */}
      <footer style={theme.footer}>
        <p>© 2026 RAWRRAKU</p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Instagram: @raooraku_ · Discord: RAOORAKU
        </p>
      </footer>
      {/* BOTTOM NAVBAR — hanya muncul di mobile */}
      <nav
        style={{
          display: 'none', // default hidden, override lewat CSS
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: isDark ? '#1e1e2e' : '#ffffff',
          borderTop: isDark ? '1px solid #333' : '1px solid #e0e0e0',
          zIndex: 100,
          padding: '6px 0 10px',
        }}
        className="bottom-nav"
      >
        {[
          { tab: 'home', icon: '🏠', label: 'Home' },
          { tab: 'portfolio', icon: '🖼️', label: 'Portfolio' },
          { tab: 'commission', icon: '🎨', label: 'Commission' },
          { tab: 'order', icon: '📝', label: 'Order' },
          { tab: 'reviews', icon: '⭐', label: 'Ulasan' },
          { tab: 'writereview', icon: '✍️', label: 'Review' },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => goToTab(tab)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              color: activeTab === tab ? '#5e81d1' : isDark ? '#888' : '#aaa',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: activeTab === tab ? 700 : 400,
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>
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
