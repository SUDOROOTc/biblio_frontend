import { useEffect, useMemo, useState } from 'react'
import { rechercherLivres } from './api'
import { Icon } from './Icon'
import type { Book, LibraryStats, ReservationStatus } from './types'

const recentReservations = [
  { reader: 'Camille Durand', book: 'L’Étranger', status: 'RESERVEE' as const, time: 'Il y a 12 min' },
  { reader: 'Thomas Bernard', book: 'Une chambre à soi', status: 'EMPRUNTEE' as const, time: 'Il y a 34 min' },
  { reader: 'Nina Morel', book: 'Le Petit Prince', status: 'RETOURNEE' as const, time: 'Hier, 16:42' },
  { reader: 'Louis Petit', book: 'Sapiens', status: 'EXPIREE' as const, time: 'Hier, 14:08' },
]
const reservationStatusLabels: Record<ReservationStatus, string> = {
  RESERVEE: 'Réservée',
  EMPRUNTEE: 'Empruntée',
  RETOURNEE: 'Retournée',
  ANNULEE: 'Annulée',
  EXPIREE: 'Expirée',
}
const reservationStatusClasses: Record<ReservationStatus, string> = {
  RESERVEE: 'status-reservee',
  EMPRUNTEE: 'status-empruntee',
  RETOURNEE: 'status-retournee',
  ANNULEE: 'status-annulee',
  EXPIREE: 'status-expiree',
}

export function DashboardContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<LibraryStats>({ totalBooks: 0 })
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const catalogue = await rechercherLivres('')
      setBooks(catalogue.books)
      setStats({ totalBooks: catalogue.count })
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
    { label: 'Emprunts en cours', value: '—', detail: 'Donnée API à venir', tone: 'orange' },
    { label: 'Membres actifs', value: '—', detail: 'Donnée API à venir', tone: 'blue' },
    { label: 'Retards', value: '—', detail: 'Donnée API à venir', tone: 'red' },
  ]

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb"><span>Bibliothèque</span><b>/</b><strong>Vue d’ensemble</strong></div>
        <div className="top-actions"><div className="search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un livre..." aria-label="Rechercher un livre" /></div><button className="icon-button" aria-label="Notifications"><Icon name="bell" /><i /></button></div>
      </header>
      <div className="content">
        <section className="welcome"><div><p className="eyebrow">SAMEDI 1 NOVEMBRE 2026</p><h1>Bonjour, Alex <span>✦</span></h1><p className="subtitle">Voici ce qui se passe dans votre bibliothèque aujourd’hui.</p></div><button className="primary-button"><Icon name="plus" /> Ajouter un livre</button></section>
        {error && <div className="error-banner" role="alert" aria-live="polite"><span>{error}. Vérifiez la connexion à votre API.</span><button onClick={() => void loadData()}><Icon name="refresh" /> Réessayer</button></div>}
        <section className="stats-grid">{statCards.map((card) => <article className="stat-card" key={card.label}><div className={`stat-icon ${card.tone}`}><Icon name={card.tone === 'blue' ? 'users' : card.tone === 'orange' ? 'book' : card.tone === 'red' ? 'bell' : 'grid'} /></div><div><p>{card.label}</p><strong>{loading ? '—' : card.value}</strong><small className={card.tone === 'red' ? 'warning' : ''}>{card.detail}</small></div></article>)}</section>
        <section className="quick-actions">
          <div><p className="section-kicker">ACTIONS RAPIDES</p><h2>Que souhaitez-vous faire ?</h2></div>
          <div className="quick-action-list"><button><Icon name="plus" /><span><b>Ajouter un livre</b><small>Enrichir le catalogue</small></span><Icon name="arrow" /></button><button><Icon name="users" /><span><b>Ajouter un lecteur</b><small>Créer une fiche adhérent</small></span><Icon name="arrow" /></button><button><Icon name="book" /><span><b>Créer une réservation</b><small>Préparer un retrait</small></span><Icon name="arrow" /></button></div>
        </section>
        <section className="section-heading"><div><h2>Catalogue récent</h2><p>Les derniers livres ajoutés à votre bibliothèque</p></div><a href="/catalogue">Voir tout <Icon name="arrow" /></a></section>
        <section className="table-card" aria-busy={loading}>
          <div className="table-header"><div className="table-title"><span className="green-dot" /> Livres disponibles <b>{books.filter((book) => book.status === 'Disponible').length}</b></div><button className="filter-button">Tous les statuts <span>⌄</span></button></div>
          {loading ? <div className="empty-state loading-state">Chargement du catalogue...</div> : books.length === 0 ? <div className="empty-state">Le catalogue est vide pour le moment.</div> : filteredBooks.length === 0 ? <div className="empty-state">Aucun livre ne correspond à « {query} ».</div> : <div className="table-wrap"><table><thead><tr><th>LIVRE</th><th>AUTEUR</th><th>CATÉGORIE</th><th>ANNÉE</th><th>STATUT</th><th /></tr></thead><tbody>{filteredBooks.map((book) => <tr key={book.id}><td><div className="book-cell"><span className={`book-cover cover-${book.cover.toLowerCase()}`}>{book.cover}</span><strong>{book.title}</strong></div></td><td>{book.author}</td><td><span className="category">{book.category}</span></td><td>{book.year < 0 ? `${Math.abs(book.year)} av. J.-C.` : book.year}</td><td><span className={`status ${book.status === 'Disponible' ? 'available' : 'borrowed'}`}><i />{book.status}</span></td><td><button className="more-button" aria-label={`Options pour ${book.title}`}>•••</button></td></tr>)}</tbody></table></div>}
        </section>
        <section className="section-heading reservation-heading"><div><h2>Réservations récentes</h2><p>Les dernières activités de circulation</p></div><a href="#reservations">Voir tout <Icon name="arrow" /></a></section>
        <section className="reservation-card" aria-label="Réservations récentes">{recentReservations.map((reservation) => <article key={`${reservation.reader}-${reservation.book}`}><div className="reservation-avatar">{reservation.reader.split(' ').map((part) => part[0]).join('')}</div><div className="reservation-info"><b>{reservation.reader}</b><span>{reservation.book}</span></div><span className={`reservation-status ${reservationStatusClasses[reservation.status]}`}>{reservationStatusLabels[reservation.status]}</span><time>{reservation.time}</time></article>)}</section>
        <footer><span>© 2026 Biblio</span><span><i className="secure-dot" /> Données synchronisées</span></footer>
      </div>
    </>
  )
}
