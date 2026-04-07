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
    if (!cardRef.current) return
    const cardRect = cardRef.current.getBoundingClientRect()
    
    const padding = 30
    const btnW = 140
    const btnH = 70
    const winW = window.innerWidth
    const winH = window.innerHeight

    // Define 4 safe rectangles outside the card area
    const safeZones = [
      { // Zone 1: Above the card
        minX: padding, maxX: winW - btnW - padding,
        minY: padding, maxY: cardRect.top - btnH - padding
      },
      { // Zone 2: Below the card
        minX: padding, maxX: winW - btnW - padding,
        minY: cardRect.bottom + padding, maxY: winH - btnH - padding
      },
      { // Zone 3: Left of the card
        minX: padding, maxX: cardRect.left - btnW - padding,
        minY: cardRect.top, maxY: cardRect.bottom - btnH
      },
      { // Zone 4: Right of the card
        minX: cardRect.right + padding, maxX: winW - btnW - padding,
        minY: cardRect.top, maxY: cardRect.bottom - btnH
      }
    ]

    // Filter zones that actually have enough space for the button
    const validZones = safeZones.filter(z => z.maxX > z.minX && z.maxY > z.minY)

    let newX, newY

    if (validZones.length > 0) {
      // Pick one of the safe background zones randomly
      const zone = validZones[Math.floor(Math.random() * validZones.length)]
      newX = zone.minX + Math.random() * (zone.maxX - zone.minX)
      newY = zone.minY + Math.random() * (zone.maxY - zone.minY)
    } else {
      // Extremely small screen fallback: just pick a random screen corner
      newX = Math.random() > 0.5 ? padding : winW - btnW - padding
      newY = Math.random() > 0.5 ? padding : winH - btnH - padding
    }
    
    setNoButtonStyle({
      position: 'fixed',
      left: `${newX}px`,
      top: `${newY}px`,
      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 1000,
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)' // More shadow when floating on BG
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
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
          <h1 className="title">Makasih Kak Gemooy! ✨</h1>
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
