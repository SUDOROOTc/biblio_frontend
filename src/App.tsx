import { useState, type FormEvent } from 'react'
import { connecter } from './api/auth'
import { DashboardContent } from './DashboardContent'
import { Icon } from './Icon'

function App() {
  const [screen, setScreen] = useState<'dashboard' | 'landing' | 'login'>('dashboard')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')
    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!username || !password) {
      setLoginError('Renseignez votre identifiant et votre mot de passe.')
      return
    }

    setLoginLoading(true)
    void connecter(username, password).then(() => {
      setScreen('dashboard')
    }).catch((requestError: unknown) => {
      setLoginError(requestError instanceof Error ? requestError.message : 'La connexion a échoué.')
    }).finally(() => {
      setLoginLoading(false)
    })
  }

  if (screen === 'landing') {
    return (
      <main className="public-shell">
        <nav className="public-nav">
          <a className="brand" href="#accueil" onClick={() => setScreen('landing')}><span className="brand-mark">B</span><span>Biblio</span></a>
          <div className="public-links">
            <a href="#fonctionnalites">Découvrir</a>
            <button className="text-button" onClick={() => setScreen('login')}>Se connecter</button>
          </div>
        </nav>
        <section className="public-hero product-hero" id="accueil">
          <div className="hero-copy">
            <p className="eyebrow">LE PUPITRE DES BIBLIOTHÈQUES DE PROXIMITÉ</p>
            <h1>Une bibliothèque plus fluide, <em>à chaque journée.</em></h1>
            <p className="subtitle">Biblio rassemble votre catalogue, vos adhérents et vos réservations dans un espace calme, lisible et pensé pour le comptoir.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setScreen('login')}>Accéder à mon espace <Icon name="arrow" /></button>
              <a className="secondary-link" href="#fonctionnalites">Voir comment ça marche</a>
            </div>
          </div>
          <div className="dashboard-preview" aria-label="Aperçu du tableau de bord Biblio">
            <div className="preview-topbar"><span className="preview-brand"><span className="preview-mark">B</span> Biblio</span><span className="preview-avatar">AM</span></div>
            <div className="preview-body">
              <p className="preview-kicker">SAMEDI 1 NOVEMBRE 2026</p>
              <h2>Bonjour, Alex</h2>
              <div className="preview-stats"><span><b>1 248</b><small>Livres</small></span><span><b>86</b><small>Emprunts</small></span><span><b>12</b><small>Retards</small></span></div>
              <div className="preview-list"><div><span className="preview-book book-one">LE</span><span><b>L’Étranger</b><small>Albert Camus</small></span><i>Disponible</i></div><div><span className="preview-book book-two">UC</span><span><b>Une chambre à soi</b><small>Virginia Woolf</small></span><i className="preview-borrowed">Emprunté</i></div></div>
            </div>
          </div>
        </section>
        <section className="feature-strip" id="fonctionnalites">
          <article><span className="feature-number">01</span><div><h2>Le catalogue en main</h2><p>Retrouvez un ouvrage, son emplacement et sa disponibilité en quelques secondes.</p></div></article>
          <article><span className="feature-number">02</span><div><h2>Des adhérents bien suivis</h2><p>Une fiche claire pour accompagner chaque lecteur avec attention.</p></div></article>
          <article><span className="feature-number">03</span><div><h2>Une circulation sereine</h2><p>Réservations, emprunts et retours restent visibles au même endroit.</p></div></article>
        </section>
        <footer className="public-footer"><span>© 2026 Biblio</span><span>Un outil pensé pour les bibliothèques de quartier</span></footer>
      </main>
    )
  }

  if (screen === 'login') {
    return (
      <main className="auth-shell">
        <a className="brand auth-brand" href="#accueil" onClick={() => setScreen('landing')}><span className="brand-mark">B</span><span>Biblio</span></a>
        <section className="auth-card">
          <p className="eyebrow">ESPACE BIBLIOTHÉCAIRE</p>
          <h1>Bienvenue dans votre bibliothèque.</h1>
          <p className="subtitle">Connectez-vous pour retrouver votre tableau de bord.</p>
          {loginError && <p className="form-error" role="alert">{loginError}</p>}
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Identifiant</label>
            <input id="username" name="username" autoComplete="username" required />
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
            <button className="primary-button auth-submit" type="submit" disabled={loginLoading}>{loginLoading ? 'Connexion en cours…' : 'Se connecter'}</button>
          </form>
          <button className="text-button" onClick={() => setScreen('landing')}>Retour à l’accueil</button>
        </section>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">B</span><span>Biblio</span></div>
        <div className="menu-label">MENU PRINCIPAL</div>
        <nav>
          <a className="nav-item active" href="#dashboard" onClick={() => setScreen('dashboard')}><Icon name="grid" /> Tableau de bord</a>
          <a className="nav-item" href="#books"><Icon name="book" /> Catalogue <span className="nav-count">1 248</span></a>
          <a className="nav-item" href="#members"><Icon name="users" /> Membres</a>
        </nav>
        <div className="menu-label menu-label-bottom">CONFIGURATION</div>
        <nav><a className="nav-item" href="#settings"><Icon name="settings" /> Paramètres</a></nav>
        <div className="sidebar-footer">
          <div className="profile"><div className="avatar">AM</div><div><strong>Alex Martin</strong><small>Administrateur</small></div><span className="dots">•••</span></div>
        </div>
      </aside>
      <main className="main-content"><DashboardContent /></main>
    </div>
  )
}

export default App
