import { useState } from 'react'

const CONSENT_KEY = 'wedesygn_analytics_consent'

function setAnalyticsConsent(granted: boolean) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  })
  localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied')
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY))

  if (!visible) return null

  return (
    <aside className="cookie-consent" aria-label="Cookie settings">
      <div>
        <strong>Privacy choices</strong>
        <p>
          wedesygn uses Google Analytics only with your permission to understand website usage and improve the experience. Read our{' '}
          <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__reject" onClick={() => { setAnalyticsConsent(false); setVisible(false) }}>
          Reject analytics
        </button>
        <button type="button" className="cookie-consent__accept" onClick={() => { setAnalyticsConsent(true); setVisible(false) }}>
          Allow analytics
        </button>
      </div>
    </aside>
  )
}
