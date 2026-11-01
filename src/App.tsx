import { useEffect, useMemo, useState } from 'react'
import { getBooks, getStats } from './api'
import type { Book, LibraryStats } from './types'

const fallbackStats: LibraryStats = { totalBooks: 1248, borrowedBooks: 86, members: 324, overdueBooks: 12 }

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

  if (screen === 'landing') {
    return (
      <main className="public-shell">
        <nav className="public-nav">
          <a className="brand" href="#accueil" onClick={() => setScreen('landing')}><span className="brand-mark">B</span><span>Biblio</span></a>
          <button className="primary-button" onClick={() => setScreen('login')}>Se connecter</button>
        </nav>
        <section className="public-hero" id="accueil">
          <p className="eyebrow">GESTION DE BIBLIOTHÈQUE DE QUARTIER</p>
          <h1>Le plaisir des livres,<br /><em>la simplicité au comptoir.</em></h1>
          <p className="subtitle">Biblio accompagne les bibliothécaires dans la gestion quotidienne des livres, des lecteurs et des réservations.</p>
          <button className="primary-button" onClick={() => setScreen('login')}>Accéder à mon espace <Icon name="arrow" /></button>
        </section>
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
          <form onSubmit={(event) => { event.preventDefault(); setScreen('dashboard') }}>
            <label htmlFor="username">Identifiant</label>
            <input id="username" name="username" autoComplete="username" required />
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
            <button className="primary-button auth-submit" type="submit">Se connecter</button>
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
          <section className="section-heading"><div><h2>Catalogue récent</h2><p>Les derniers livres ajoutés à votre bibliothèque</p></div><a href="#books">Voir tout <Icon name="arrow" /></a></section>
          <section className="table-card"><div className="table-header"><div className="table-title"><span className="green-dot" /> Livres disponibles <b>{books.filter((book) => book.status === 'Disponible').length || '—'}</b></div><button className="filter-button">Tous les statuts <span>⌄</span></button></div>{loading ? <div className="empty-state">Chargement du catalogue...</div> : filteredBooks.length === 0 ? <div className="empty-state">Aucun livre trouvé.</div> : <div className="table-wrap"><table><thead><tr><th>LIVRE</th><th>AUTEUR</th><th>CATÉGORIE</th><th>ANNÉE</th><th>STATUT</th><th /></tr></thead><tbody>{filteredBooks.map((book) => <tr key={book.id}><td><div className="book-cell"><span className={`book-cover cover-${book.cover.toLowerCase()}`}>{book.cover}</span><strong>{book.title}</strong></div></td><td>{book.author}</td><td><span className="category">{book.category}</span></td><td>{book.year < 0 ? `${Math.abs(book.year)} av. J.-C.` : book.year}</td><td><span className={`status ${book.status === 'Disponible' ? 'available' : 'borrowed'}`}><i />{book.status}</span></td><td><button className="more-button" aria-label={`Options pour ${book.title}`}>•••</button></td></tr>)}</tbody></table></div>}</section>
          <footer><span>© 2026 Biblio</span><span><i className="secure-dot" /> Données synchronisées</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
