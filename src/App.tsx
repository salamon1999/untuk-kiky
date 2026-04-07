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
    
    const padding = 20
    const buttonWidth = 140
    const buttonHeight = 70
    
    let newX = 0
    let newY = 0
    let isInsideCard = true
    
    const maxX = window.innerWidth - buttonWidth - padding
    const maxY = window.innerHeight - buttonHeight - padding

    // Try to find a position outside the card
    for (let i = 0; i < 50; i++) {
      newX = Math.max(padding, Math.random() * maxX)
      newY = Math.max(padding, Math.random() * maxY)

      // Button rect
      const btnRight = newX + buttonWidth
      const btnBottom = newY + buttonHeight

      // Check overlap with card
      const overlaps = !(
        btnRight < cardRect.left || 
        newX > cardRect.right || 
        btnBottom < cardRect.top || 
        newY > cardRect.bottom
      )

      if (!overlaps) {
        isInsideCard = false
        break
      }
    }
    
    setNoButtonStyle({
      position: 'fixed',
      left: `${newX}px`,
      top: `${newY}px`,
      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 1000
    })
  }

  const handleYes = () => {
    // Fire confetti!
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
      {/* Decorative 3D Elements */}
      <div className="bg-element sphere-1"></div>
      <div className="bg-element sphere-2"></div>
      <div className="bg-element sphere-3"></div>

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
