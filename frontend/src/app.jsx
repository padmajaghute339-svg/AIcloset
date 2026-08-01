import React, { useState, useRef } from 'react';

// Sample Closet Dataset
const INITIAL_CLOSET = [
  { id: 'c1', name: 'Baby Pink Knit Cardigan', category: 'Tops', color: 'Pink', tags: ['Casual', 'Layering'], image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400', usageCount: 14, lastWorn: '2 days ago' },
  { id: 'c2', name: 'Silk White Blouse', category: 'Tops', color: 'White', tags: ['Office', 'Elegant'], image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', usageCount: 8, lastWorn: '1 week ago' },
  { id: 'c3', name: 'Tailored Rose Trousers', category: 'Bottoms', color: 'Pink', tags: ['Office', 'Formal'], image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400', usageCount: 22, lastWorn: 'Yesterday' },
  { id: 'c4', name: 'Classic Straight Denim', category: 'Bottoms', color: 'Blue', tags: ['Casual', 'Weekend'], image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', usageCount: 18, lastWorn: '3 days ago' },
  { id: 'c5', name: 'Minimalist White Sneakers', category: 'Footwear', color: 'White', tags: ['Casual', 'Comfy'], image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', usageCount: 30, lastWorn: 'Today' },
  { id: 'c6', name: 'Blush Pink Strappy Heels', category: 'Footwear', color: 'Pink', tags: ['Chic', 'Evening'], image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', usageCount: 5, lastWorn: '2 weeks ago' },
  { id: 'c7', name: 'Vintage Emerald Silk Slip Dress', category: 'Dresses', color: 'Green', tags: ['Party', 'Sustainable'], image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', usageCount: 0, lastWorn: 'Never (120 days in closet)' },
  { id: 'c8', name: 'Cream Wool Coat', category: 'Outerwear', color: 'Cream', tags: ['Cold Weather', 'Chic'], image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', usageCount: 12, lastWorn: '5 days ago' }
];

const SHOPPING_SUGGESTIONS = [
  { id: 's1', name: 'Blush Silk Scarf', price: '$45', reason: 'Fills cold-weather layering gap for your Cream Coat', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300' },
  { id: 's2', name: 'Rose Gold Hoop Earrings', price: '$35', reason: 'Complements your Pink Knit & White Blouse', image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=300' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [closet, setCloset] = useState(INITIAL_CLOSET);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  // Mix & Match Slots State
  const [canvasTop, setCanvasTop] = useState(INITIAL_CLOSET[0]);
  const [canvasBottom, setCanvasBottom] = useState(INITIAL_CLOSET[2]);
  const [canvasShoe, setCanvasShoe] = useState(INITIAL_CLOSET[4]);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your ClosetAI Stylist. How can I dress you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Refs for Smooth Navigation
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const dashboardRef = useRef(null);

  const filteredCloset = closet.filter(item => 
    categoryFilter === 'All' ? true : item.category === categoryFilter
  );

  // Delete Garment/Image from Closet
  const handleDeleteItem = (id) => {
    setCloset(prev => prev.filter(item => item.id !== id));
  };

  // Mix & Match Auto-Shuffle
  const handleShuffleMixMatch = () => {
    const tops = closet.filter(i => i.category === 'Tops');
    const bottoms = closet.filter(i => i.category === 'Bottoms');
    const shoes = closet.filter(i => i.category === 'Footwear');

    if (tops.length) setCanvasTop(tops[Math.floor(Math.random() * tops.length)]);
    if (bottoms.length) setCanvasBottom(bottoms[Math.floor(Math.random() * bottoms.length)]);
    if (shoes.length) setCanvasShoe(shoes[Math.floor(Math.random() * shoes.length)]);
  };

  // Swap Top & Bottom Items
  const handleSwapTopBottom = () => {
    const temp = canvasTop;
    setCanvasTop(canvasBottom);
    setCanvasBottom(temp);
  };

  const calculateStyleScore = () => {
    let score = 8.8;
    if (canvasTop?.color === 'Pink' || canvasBottom?.color === 'Pink') score += 1.0;
    return score > 9.9 ? 9.9 : score.toFixed(1);
  };

  const handleUploadClothing = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessingBg(true);
      const url = URL.createObjectURL(file);
      setUploadedImage(url);

      setTimeout(() => {
        setIsProcessingBg(false);
        const newItem = {
          id: `c_${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, "") || 'New Baby Pink Item',
          category: 'Tops',
          color: 'Soft Pink',
          tags: ['AI Cutout'],
          image: url,
          usageCount: 0,
          lastWorn: 'Just Added'
        };
        setCloset([newItem, ...closet]);
      }, 1500);
    }
  };

  const handleSaveOutfit = () => {
    const newOutfit = {
      id: Date.now(),
      top: canvasTop,
      bottom: canvasBottom,
      shoe: canvasShoe,
      score: calculateStyleScore(),
      date: new Date().toLocaleDateString()
    };
    setSavedOutfits([newOutfit, ...savedOutfits]);
    alert('✨ Saved custom outfit to your closet!');
  };

  return (
    <div style={{
      ...styles.container,
      backgroundColor: isDarkMode ? '#1f0914' : '#fdf2f8',
      color: isDarkMode ? '#fce7f3' : '#831843'
    }}>

      {/* NAVBAR */}
      <header style={{
        ...styles.navbar,
        backgroundColor: isDarkMode ? 'rgba(31, 9, 20, 0.92)' : 'rgba(253, 242, 248, 0.92)',
        borderBottom: '1px solid #fbcfe8'
      }}>
        <div style={styles.navBrand} onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <span style={{ fontSize: '1.4rem' }}>🌸</span>
          <div>
            <span style={styles.brandTitle}>Closet<span style={{ color: '#db2777' }}>AI</span></span>
            <span style={styles.brandSub}>SMART WARDROBE ENGINE</span>
          </div>
        </div>

        <nav style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}>Home</button>
          <button style={styles.navBtn} onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}>Features</button>
          <button style={styles.navBtnActive} onClick={() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' })}>Open Studio ➔</button>
        </nav>

        <button onClick={() => setIsDarkMode(!isDarkMode)} style={styles.modeToggleBtn}>
          {isDarkMode ? '🌙 Dark Rose' : '🌸 Baby Pink'}
        </button>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} style={styles.heroSection}>
        <div>
          <span style={styles.luxuryTag}>PREMIUM AI STYLING</span>
          <h1 style={styles.heroTitle}>
            Your Smart <br />
            <span style={styles.heroGradientText}>AI Wardrobe Stylist</span>
          </h1>
          <p style={styles.heroSub}>
            Organize your clothes, auto-remove backgrounds, and curate unlimited outfits with real-time color harmony scoring.
          </p>

          <div style={styles.heroCtaGroup}>
            <button onClick={() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' })} style={styles.ctaPrimary}>
              Upload Clothes ✨
            </button>
            <button onClick={() => { dashboardRef.current?.scrollIntoView({ behavior: 'smooth' }); setActiveTab('Mix & Match'); }} style={styles.ctaSecondary}>
              Mix & Match ✦
            </button>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.heroCardPink}>
            <span style={styles.badgeFloating}>Score: 9.8/10</span>
            <img src="https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600" alt="Hero Outfit" style={styles.hero3DImg} />
          </div>
        </div>
      </section>

      {/* FEATURES MATRIX STRIP */}
      <section ref={featuresRef} style={styles.featuresStrip}>
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>📸</span>
          <div>
            <strong>Auto Detection</strong>
            <p style={styles.featureDesc}>Identifies categories, colors, and styles automatically.</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>🪄</span>
          <div>
            <strong>Studio Cutouts</strong>
            <p style={styles.featureDesc}>Removes image backgrounds for clean wardrobe graphics.</p>
          </div>
        </div>
        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>🎨</span>
          <div>
            <strong>Color Harmony</strong>
            <p style={styles.featureDesc}>Calculates Real-Time Style Scores out of 10.</p>
          </div>
        </div>
      </section>

      {/* DASHBOARD WORKSPACE */}
      <section ref={dashboardRef} style={styles.dashboardSection}>
        <div style={styles.dashboardHeader}>
          <h2>Digital Closet Studio</h2>
          <div style={styles.tabBar}>
            {['Overview', 'Digital Closet', 'Mix & Match', 'AI Stylist Chat', 'Simple Analytics & Gaps'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.workspaceTabBtn,
                  backgroundColor: activeTab === tab ? '#db2777' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#db2777'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div style={styles.overviewGrid}>
            <div style={styles.glassCardPink}>
              <h3>📥 Upload & AI Background Removal</h3>
              <p>Upload a photo of your clothes. AI cuts out the background and adds it to your inventory.</p>
              <input type="file" accept="image/*" onChange={handleUploadClothing} style={{ marginTop: '1rem' }} />
              {isProcessingBg && <div style={styles.processingBanner}>✨ Processing Background Cutout...</div>}
              {uploadedImage && !isProcessingBg && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={uploadedImage} alt="Cutout" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#db2777' }}>Cutout Ready & Saved ✓</span>
                </div>
              )}
            </div>

            <div style={styles.glassCardPink}>
              <h3>✨ Active AI Outfit Pairing</h3>
              <div style={styles.spotlightRow}>
                {canvasTop && <img src={canvasTop.image} alt="Top" style={styles.spotlightImg} />}
                <span>+</span>
                {canvasBottom && <img src={canvasBottom.image} alt="Bottom" style={styles.spotlightImg} />}
                <span>+</span>
                {canvasShoe && <img src={canvasShoe.image} alt="Shoe" style={styles.spotlightImg} />}
              </div>
              <button onClick={handleSaveOutfit} style={{ ...styles.btnPink, marginTop: '1rem', width: '100%' }}>💾 Save Outfit</button>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL CLOSET WITH DELETE BUTTON */}
        {activeTab === 'Digital Closet' && (
          <div>
            <div style={styles.filterRow}>
              {['All', 'Tops', 'Bottoms', 'Footwear', 'Dresses', 'Outerwear'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    ...styles.filterPill,
                    backgroundColor: categoryFilter === cat ? '#db2777' : '#fbcfe8',
                    color: categoryFilter === cat ? '#fff' : '#831843'
                  }}
                >
                  {cat} ({cat === 'All' ? closet.length : closet.filter(i => i.category === cat).length})
                </button>
              ))}
            </div>

            <div style={styles.closetGrid}>
              {filteredCloset.map(item => (
                <div key={item.id} style={styles.closetCardPink}>
                  <div style={styles.closetImgBox}>
                    <img src={item.image} alt={item.name} style={styles.closetImg} />
                    <span style={styles.colorTagPink}>{item.color}</span>
                    
                    {/* Delete Image Button */}
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      style={styles.deleteBtn}
                      title="Delete Image"
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={{ padding: '0.8rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.category} • Worn {item.usageCount}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MIX & MATCH WITH ADVANCED CONTROLS */}
        {activeTab === 'Mix & Match' && (
          <div style={styles.glassCardPink}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3>🛠️ Mix & Match Outfit Studio</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleShuffleMixMatch} style={styles.btnPinkSmall}>🔀 Auto-Shuffle</button>
                <button onClick={handleSwapTopBottom} style={styles.btnPinkSmall}>🔃 Swap Top & Bottom</button>
              </div>
            </div>

            <div style={styles.canvasContainer}>
              <div style={styles.canvasSlot}>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Top Slot:</label>
                <select value={canvasTop?.id} onChange={e => setCanvasTop(closet.find(i => i.id === e.target.value))} style={styles.selectPink}>
                  {closet.filter(i => i.category === 'Tops').map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.color})</option>
                  ))}
                </select>
                {canvasTop && <img src={canvasTop.image} alt="Top" style={styles.canvasPreviewImg} />}
              </div>

              <div style={styles.canvasSlot}>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Bottom Slot:</label>
                <select value={canvasBottom?.id} onChange={e => setCanvasBottom(closet.find(i => i.id === e.target.value))} style={styles.selectPink}>
                  {closet.filter(i => i.category === 'Bottoms').map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.color})</option>
                  ))}
                </select>
                {canvasBottom && <img src={canvasBottom.image} alt="Bottom" style={styles.canvasPreviewImg} />}
              </div>

              <div style={styles.canvasSlot}>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Footwear Slot:</label>
                <select value={canvasShoe?.id} onChange={e => setCanvasShoe(closet.find(i => i.id === e.target.value))} style={styles.selectPink}>
                  {closet.filter(i => i.category === 'Footwear').map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.color})</option>
                  ))}
                </select>
                {canvasShoe && <img src={canvasShoe.image} alt="Shoe" style={styles.canvasPreviewImg} />}
              </div>
            </div>

            <button onClick={handleSaveOutfit} style={{ ...styles.btnPink, width: '100%', marginTop: '1.5rem' }}>
              Save Custom Outfit Pair
            </button>
          </div>
        )}

        {/* TAB 4: AI STYLIST CHAT */}
        {activeTab === 'AI Stylist Chat' && (
          <div style={styles.glassCardPink}>
            <h3>💬 Chat with AI Stylist</h3>
            <div style={styles.chatWindow}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  ...styles.chatBubble,
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#db2777' : '#fbcfe8',
                  color: msg.sender === 'user' ? '#fff' : '#831843'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Ask for styling advice..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={styles.chatInput} />
              <button onClick={() => { if (!chatInput) return; setChatMessages([...chatMessages, { sender: 'user', text: chatInput }, { sender: 'ai', text: 'That outfit combination looks great for a soft chic aesthetic!' }]); setChatInput(''); }} style={styles.btnPink}>Send</button>
            </div>
          </div>
        )}

        {/* TAB 5: SIMPLE ANALYTICS & GAPS */}
        {activeTab === 'Simple Analytics & Gaps' && (
          <div style={styles.easyAnalyticsLayout}>
            <div style={styles.glassCardPink}>
              <h3>📊 Simple Closet Analytics</h3>
              
              <div style={styles.simpleStatRow}>
                <div style={styles.easyStatCard}>
                  <span style={styles.easyStatNum}>{closet.length}</span>
                  <span>Total Items</span>
                </div>
                <div style={styles.easyStatCard}>
                  <span style={styles.easyStatNum}>85%</span>
                  <span>Wardrobe Active</span>
                </div>
                <div style={styles.easyStatCard}>
                  <span style={styles.easyStatNum}>🌸 Pink</span>
                  <span>Top Color Theme</span>
                </div>
              </div>

              <div style={styles.easyAlertBox}>
                <strong>💡 Quick Tip:</strong> You have 2 items not worn recently. Try pairing your Emerald Slip Dress with a Pink Cardigan!
              </div>
            </div>

            <div style={styles.glassCardPink}>
              <h3>🛍️ Missing Items to Buy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {SHOPPING_SUGGESTIONS.map(item => (
                  <div key={item.id} style={styles.easyItemCard}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name} ({item.price})</h4>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={{ fontWeight: 'bold' }}>Closet<span style={{ color: '#db2777' }}>AI</span></span>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>© 2026 ClosetAI Inc. Intelligent Smart Wardrobe Stylist.</p>
      </footer>
    </div>
  );
}

// STYLING SYSTEM
const styles = {
  container: { fontFamily: 'sans-serif', minHeight: '100vh', transition: 'all 0.3s ease' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' },
  brandTitle: { fontSize: '1.3rem', fontWeight: 'bold' },
  brandSub: { display: 'block', fontSize: '0.6rem', color: '#db2777', fontWeight: 'bold', letterSpacing: '1px' },
  navLinks: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  navBtn: { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' },
  navBtnActive: { backgroundColor: '#db2777', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' },
  modeToggleBtn: { backgroundColor: '#fbcfe8', border: 'none', color: '#831843', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' },
  heroSection: { display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', padding: '4rem 4rem 2rem 4rem', alignItems: 'center' },
  luxuryTag: { fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px', color: '#db2777' },
  heroTitle: { fontSize: '3.2rem', lineHeight: '1.1', fontWeight: 'bold', margin: '0.5rem 0 1rem 0' },
  heroGradientText: { color: '#db2777' },
  heroSub: { fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem' },
  heroCtaGroup: { display: 'flex', gap: '1rem' },
  ctaPrimary: { backgroundColor: '#db2777', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' },
  ctaSecondary: { backgroundColor: 'transparent', color: '#db2777', border: '2px solid #db2777', padding: '0.8rem 2rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' },
  heroRight: { textAlign: 'center' },
  heroCardPink: { backgroundColor: '#fbcfe8', borderRadius: '24px', padding: '1rem', position: 'relative' },
  badgeFloating: { position: 'absolute', top: '20px', right: '20px', backgroundColor: '#db2777', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.8rem' },
  hero3DImg: { width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px' },
  featuresStrip: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '2rem 4rem', backgroundColor: '#fce7f3', margin: '1rem 4rem', borderRadius: '20px' },
  featureItem: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
  featureIcon: { fontSize: '1.8rem' },
  featureDesc: { fontSize: '0.75rem', margin: '0.2rem 0 0 0', opacity: 0.8 },
  dashboardSection: { padding: '3rem 4rem' },
  dashboardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  tabBar: { display: 'flex', gap: '0.5rem', overflowX: 'auto' },
  workspaceTabBtn: { border: '1px solid #db2777', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  glassCardPink: { backgroundColor: '#fce7f3', borderRadius: '20px', padding: '1.8rem', border: '1px solid #fbcfe8' },
  processingBanner: { marginTop: '1rem', padding: '0.8rem', backgroundColor: '#fbcfe8', color: '#db2777', borderRadius: '10px', fontWeight: 'bold' },
  spotlightRow: { display: 'flex', gap: '0.8rem', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' },
  spotlightImg: { width: '90px', height: '100px', objectFit: 'cover', borderRadius: '10px' },
  btnPink: { backgroundColor: '#db2777', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  btnPinkSmall: { backgroundColor: '#fbcfe8', color: '#831843', border: '1px solid #db2777', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' },
  filterRow: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' },
  filterPill: { border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' },
  closetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1.2rem' },
  closetCardPink: { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #fbcfe8' },
  closetImgBox: { position: 'relative', height: '180px' },
  closetImg: { width: '100%', height: '100%', objectFit: 'cover' },
  colorTagPink: { position: 'absolute', bottom: '8px', left: '8px', backgroundColor: '#db2777', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' },
  deleteBtn: { position: 'absolute', top: '8px', right: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  canvasContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' },
  canvasSlot: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  selectPink: { padding: '0.6rem', borderRadius: '8px', border: '1px solid #db2777', backgroundColor: '#fff' },
  canvasPreviewImg: { height: '180px', width: '100%', objectFit: 'cover', borderRadius: '12px' },
  chatWindow: { height: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '1rem' },
  chatBubble: { maxWidth: '80%', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.85rem' },
  chatInput: { flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #db2777' },
  easyAnalyticsLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  simpleStatRow: { display: 'flex', justifyContent: 'space-around', margin: '1.5rem 0' },
  easyStatCard: { textAlign: 'center', backgroundColor: '#fff', padding: '1rem', borderRadius: '12px', width: '100px', border: '1px solid #fbcfe8' },
  easyStatNum: { display: 'block', fontSize: '1.4rem', fontWeight: 'bold', color: '#db2777' },
  easyAlertBox: { backgroundColor: '#fbcfe8', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', color: '#831843' },
  easyItemCard: { display: 'flex', gap: '0.8rem', alignItems: 'center', backgroundColor: '#fff', padding: '0.8rem', borderRadius: '10px', border: '1px solid #fbcfe8' },
  footer: { padding: '2rem 4rem', textAlign: 'center', borderTop: '1px solid #fbcfe8' }
};