import { useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

function App() {
  const [step, setStep] = useState<'ask' | 'success' | 'final'>('ask')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [noButtonStyle, setNoButtonStyle] = useState<React.CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const moveButton = () => {
    const btnW = 100 // Ukuran tombol diperkirakan
    const btnH = 50
    const padding = 20
    const winW = window.innerWidth
    const winH = window.innerHeight

    // Cari posisi acak di seluruh layar
    let newX = Math.random() * (winW - btnW - padding * 2) + padding
    let newY = Math.random() * (winH - btnH - padding * 2) + padding

    // Cek apakah posisi baru menabrak kotak card
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      const safeMargin = 40
      
      // Jika menabrak card, dorong ke pojok yang paling jauh dari card
      if (
        newX + btnW > cardRect.left - safeMargin &&
        newX < cardRect.right + safeMargin &&
        newY + btnH > cardRect.top - safeMargin &&
        newY < cardRect.bottom + safeMargin
      ) {
        // Pilih sisi layar yang lebih luas untuk pindah
        newX = newX < winW / 2 ? padding : winW - btnW - padding
        newY = newY < winH / 2 ? padding : winH - btnH - padding
      }
    }
    
    setNoButtonStyle({
      position: 'fixed',
      left: `${newX}px`,
      top: `${newY}px`,
      transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 1000,
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    })
  }

  const handleYes = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF3B7E', '#6C5CE7', '#90DBFF', '#FF99C8']
    })
    setStep('success')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
      const webhookURL = "https://discord.com/api/webhooks/1491148371183009996/k5NhWiHT08iUpm2BzIcyADKUwUr9NTHqbp5_Pcrx08b715_Zp8SefnXi36QR52PexDkk";
      
      try {
        await fetch(webhookURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `💖 **Nomor WhatsApp Kiky Baru!**\n📱 Nomor: \`${phoneNumber}\`\n✨ Semoga lancar ya bro!`
          })
        });
      } catch (err) {
        console.error("Gagal kirim ke Discord:", err);
      }
      
      setStep('final')
    }
  }

  return (
    <div className="container" ref={containerRef}>
      <div className="bg-element sphere-1"></div>
      <div className="bg-element sphere-2"></div>
      <div className="bg-element sphere-3"></div>
      <div className="bg-element sphere-4"></div>

      {step === 'ask' && (
        <div className="card fade-in" ref={cardRef}>
          <h1 className="title">Boleh minta nomor telponnya? 🥺💖</h1>
          <div className="button-group">
            <button className="btn btn-yes" onClick={handleYes}>Iya</button>
            <button 
              className="btn btn-no" 
              style={noButtonStyle}
              onMouseEnter={moveButton}
              onClick={moveButton}
              onTouchStart={moveButton}
            >
              Tdk
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="card fade-in">
          <h1 className="title">Yeay! Makasih yaa 🥰</h1>
          <p className="subtitle">Boleh ketik nomornya di sini?</p>
          <form onSubmit={handleSubmit} className="form">
            <input 
              type="tel" 
              placeholder="0812xxxxxx" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-field"
              required
              autoFocus
            />
            <button type="submit" className="btn btn-submit">Kirim ✨</button>
          </form>
        </div>
      )}

      {step === 'final' && (
        <div className="card fade-in">
          <h1 className="title">Makasih Kak Kiky! ✨</h1>
          <p className="encouragement-text">
            Maaf kalau kurang bagus heheh ohiye sebenarnya paska tembak ki nanti mau kasiki begini hahah tapi biar mi sekarang hahah karena kalau sekarang ku tembak ki belum pih pasti mauuki terimaka jadi biarmi nomornya dulu heheh,
            <br /><br />
            Dan kalau sudah mi interview di lihat ini selamat kak atas kelancaran interviewnya dan kalau blum pih, semangatki yaah semogah di perlancar segalah urusanta nanti sampai di terimaki amiin,
            <br /><br />
            Dan tak semua usaha itu di permudahkan tapi semua yang berusaha pasti akan berubah dan sekalilagi semnagaat kaka gemooyku yang tembem pipinya love you :)
          </p>
          <div className="heart-icon">💝</div>
        </div>
      )}
    </div>
  )
}

export default App
