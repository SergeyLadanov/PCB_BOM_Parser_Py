import { useEffect } from 'react'
import '../scss/styles.scss'

function LoadingIndicator() {
  return (
    <div className="row" style={{ textAlign: 'center' }} id="loading">
      <div className="col-md-12">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingIndicator
