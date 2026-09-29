import { useEffect } from 'react'

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — wedesygn'
    const description = 'wedesygn privacy policy covering analytics, contact forms and website data.'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [])

  return (
    <main className="privacy-page">
      <div className="privacy-page__inner">
        <a className="privacy-page__back" href="/">← Back to wedesygn</a>
        <p className="privacy-page__eyebrow">wedesygn</p>
        <h1>Privacy Policy</h1>
        <p className="privacy-page__updated">Last updated: September 29, 2026</p>

        <section><h2>Overview</h2><p>wedesygn respects your privacy. This policy explains what information may be collected when you use wedesygn.com and how it is used.</p></section>
        <section><h2>Information you provide</h2><p>If you contact wedesygn, we may receive your name, email address and project details. We use this information only to respond to your enquiry and provide requested services.</p></section>
        <section><h2>Analytics</h2><p>With your permission, Google Analytics collects privacy-conscious usage information such as pages visited, approximate location and device/browser information. Analytics consent can be rejected through the banner. We do not intentionally send email addresses, phone numbers or other sensitive information to Google Analytics.</p></section>
        <section><h2>Cookies and local storage</h2><p>The site uses local storage to remember your analytics choice. Essential site functionality may use browser storage or technical data. You can manage cookies through your browser settings.</p></section>
        <section><h2>Sharing and retention</h2><p>We do not sell your personal information. Information is shared only with service providers needed to operate the website or respond to your request, including Google Analytics when you consent. We keep enquiry information only as long as reasonably necessary for communication and business records.</p></section>
        <section><h2>Your choices</h2><p>You can reject analytics, clear your browser storage, or contact us with questions about your information. For privacy requests, email <a href="mailto:hello@wedesygn.com">hello@wedesygn.com</a>.</p></section>
        <section><h2>Updates</h2><p>We may update this policy when the website or its services change. The latest version will always be published on this page.</p></section>
      </div>
    </main>
  )
}
