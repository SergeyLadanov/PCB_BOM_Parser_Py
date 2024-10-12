import { useEffect } from 'react'
import '../scss/styles.scss'

function LoadingIndicator() {
  return (
    <div className="row" style={{ textAlign: 'center' }} id="loading">
      <p></p>
      <p>
        <div className="col-md-12">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </p>
    </div>
  )
}

export default LoadingIndicator
