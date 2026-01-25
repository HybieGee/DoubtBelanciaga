import './FallingCrosses.css'

const FallingCrosses = () => {
  return (
    <div className="falling-crosses-container">
      {/* Left side - Upside down crosses rising upward */}
      <div className="crosses-left">
        <div className="cross-upside-layer"></div>
      </div>

      {/* Right side - Normal crosses falling downward */}
      <div className="crosses-right">
        <div className="cross-normal-layer"></div>
      </div>
    </div>
  )
}

export default FallingCrosses
