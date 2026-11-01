import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getBooks, getStats } from './api'
import type { Book, LibraryStats } from './types'

const fallbackStats: LibraryStats = { totalBooks: 1248, borrowedBooks: 86, members: 324, overdueBooks: 12 }
const recentReservations = [
  { reader: 'Camille Durand', book: 'L’Étranger', status: 'Réservée', time: 'Il y a 12 min' },
  { reader: 'Thomas Bernard', book: 'Une chambre à soi', status: 'Empruntée', time: 'Il y a 34 min' },
  { reader: 'Nina Morel', book: 'Le Petit Prince', status: 'Retournée', time: 'Hier, 16:42' },
]

function Icon({ name }: { name: 'grid' | 'book' | 'users' | 'settings' | 'search' | 'bell' | 'arrow' | 'plus' | 'refresh' }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-2v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.6 15a1.7 1.7 0 0 0-1.55-1H8v-2h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V6h2v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 11c.08.6.52 1 1.1 1h.09v2h-.09a1.7 1.7 0 0 0-1.1 1Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" /></>,
  }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function App() {
  const [screen, setScreen] = useState<'dashboard' | 'landing' | 'login'>('dashboard')
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<LibraryStats>(fallbackStats)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [bookData, statData] = await Promise.all([getBooks(), getStats()])
      setBooks(bookData)
      setStats(statData)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Impossible de charger les données')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadData() }, [])

  const filteredBooks = useMemo(() => books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase()),
  ), [books, query])

  const statCards = [
    { label: 'Livres au total', value: stats.totalBooks.toLocaleString('fr-FR'), detail: '+ 8 ce mois', tone: 'purple' },
    { label: 'Emprunts en cours', value: stats.borrowedBooks, detail: '3 à retourner bientôt', tone: 'orange' },
    { label: 'Membres actifs', value: stats.members, detail: '+ 12 ce mois', tone: 'blue' },
    { label: 'Retards', value: stats.overdueBooks, detail: 'À vérifier rapidement', tone: 'red' },
  ]

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
    window.setTimeout(() => {
      setLoginLoading(false)
      setScreen('dashboard')
    }, 350)
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

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Bibliothèque</span><b>/</b><strong>Vue d’ensemble</strong></div>
          <div className="top-actions"><div className="search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un livre..." aria-label="Rechercher un livre" /></div><button className="icon-button" aria-label="Notifications"><Icon name="bell" /><i /></button></div>
        </header>
        <div className="content">
          <section className="welcome"><div><p className="eyebrow">SAMEDI 1 NOVEMBRE 2026</p><h1>Bonjour, Alex <span>✦</span></h1><p className="subtitle">Voici ce qui se passe dans votre bibliothèque aujourd’hui.</p></div><button className="primary-button"><Icon name="plus" /> Ajouter un livre</button></section>
          {error && <div className="error-banner"><span>{error}. Vérifiez la connexion à votre API.</span><button onClick={() => void loadData()}><Icon name="refresh" /> Réessayer</button></div>}
          <section className="stats-grid">{statCards.map((card) => <article className="stat-card" key={card.label}><div className={`stat-icon ${card.tone}`}><Icon name={card.tone === 'blue' ? 'users' : card.tone === 'orange' ? 'book' : card.tone === 'red' ? 'bell' : 'grid'} /></div><div><p>{card.label}</p><strong>{loading ? '—' : card.value}</strong><small className={card.tone === 'red' ? 'warning' : ''}>{card.detail}</small></div></article>)}</section>
          <section className="quick-actions">
            <div><p className="section-kicker">ACTIONS RAPIDES</p><h2>Que souhaitez-vous faire ?</h2></div>
            <div className="quick-action-list"><button><Icon name="plus" /><span><b>Ajouter un livre</b><small>Enrichir le catalogue</small></span><Icon name="arrow" /></button><button><Icon name="users" /><span><b>Ajouter un lecteur</b><small>Créer une fiche adhérent</small></span><Icon name="arrow" /></button><button><Icon name="book" /><span><b>Créer une réservation</b><small>Préparer un retrait</small></span><Icon name="arrow" /></button></div>
          </section>
          <section className="section-heading"><div><h2>Catalogue récent</h2><p>Les derniers livres ajoutés à votre bibliothèque</p></div><a href="#books">Voir tout <Icon name="arrow" /></a></section>
          <section className="table-card"><div className="table-header"><div className="table-title"><span className="green-dot" /> Livres disponibles <b>{books.filter((book) => book.status === 'Disponible').length || '—'}</b></div><button className="filter-button">Tous les statuts <span>⌄</span></button></div>{loading ? <div className="empty-state">Chargement du catalogue...</div> : filteredBooks.length === 0 ? <div className="empty-state">Aucun livre trouvé.</div> : <div className="table-wrap"><table><thead><tr><th>LIVRE</th><th>AUTEUR</th><th>CATÉGORIE</th><th>ANNÉE</th><th>STATUT</th><th /></tr></thead><tbody>{filteredBooks.map((book) => <tr key={book.id}><td><div className="book-cell"><span className={`book-cover cover-${book.cover.toLowerCase()}`}>{book.cover}</span><strong>{book.title}</strong></div></td><td>{book.author}</td><td><span className="category">{book.category}</span></td><td>{book.year < 0 ? `${Math.abs(book.year)} av. J.-C.` : book.year}</td><td><span className={`status ${book.status === 'Disponible' ? 'available' : 'borrowed'}`}><i />{book.status}</span></td><td><button className="more-button" aria-label={`Options pour ${book.title}`}>•••</button></td></tr>)}</tbody></table></div>}</section>
          <section className="section-heading reservation-heading"><div><h2>Réservations récentes</h2><p>Les dernières activités de circulation</p></div><a href="#reservations">Voir tout <Icon name="arrow" /></a></section>
          <section className="reservation-card">{recentReservations.map((reservation) => <article key={`${reservation.reader}-${reservation.book}`}><div className="reservation-avatar">{reservation.reader.split(' ').map((part) => part[0]).join('')}</div><div className="reservation-info"><b>{reservation.reader}</b><span>{reservation.book}</span></div><span className={`reservation-status status-${reservation.status.toLowerCase()}`}>{reservation.status}</span><time>{reservation.time}</time></article>)}</section>
          <footer><span>© 2026 Biblio</span><span><i className="secure-dot" /> Données synchronisées</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
