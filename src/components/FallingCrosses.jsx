import { useEffect, useRef } from 'react'
import './FallingCrosses.css'

const FallingCrosses = () => {
  return (
    <div className="falling-crosses-container">
      {/* First layer - starts at top */}
      <div className="crosses-layer crosses-layer-1">
        <img src="/crosses.png" alt="" />
      </div>
      {/* Second layer - starts below first for seamless loop */}
      <div className="crosses-layer crosses-layer-2">
        <img src="/crosses.png" alt="" />
      </div>
    </div>
  )
}

export default FallingCrosses
