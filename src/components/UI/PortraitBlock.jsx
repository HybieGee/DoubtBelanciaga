const PortraitBlock = () => (
  <div className="portrait-block">
    <div style={{ textAlign: 'center', fontFamily: "'Courier New', monospace", color: '#fff' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1.2rem', display: 'inline-block', animation: 'portraitSpin 2.5s ease-in-out infinite' }}>↻</div>
      <div style={{ fontSize: '1rem', letterSpacing: '0.35em', marginBottom: '0.6rem', fontWeight: 'bold' }}>ROTATE DEVICE</div>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)' }}>
        Landscape orientation required
      </div>
    </div>
  </div>
)
export default PortraitBlock
