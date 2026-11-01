import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { creerReservation, listerReservations, agirSurReservation, type Reservation } from './api/reservations'
import { listerLecteurs, type Lecteur } from './api/lecteurs'
import { rechercherLivres } from './api/livres'
import { Icon } from './Icon'
import type { Book, ReservationStatus } from './types'

const labels: Record<ReservationStatus, string> = { RESERVEE: 'Réservée', EMPRUNTEE: 'Empruntée', RETOURNEE: 'Retournée', ANNULEE: 'Annulée', EXPIREE: 'Expirée' }
const classes: Record<ReservationStatus, string> = { RESERVEE: 'status-reservee', EMPRUNTEE: 'status-empruntee', RETOURNEE: 'status-retournee', ANNULEE: 'status-annulee', EXPIREE: 'status-expiree' }

type Props = { creation?: boolean; onDone?: () => void }

export function ReservationsPage({ creation = false, onDone }: Props) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [lecteurs, setLecteurs] = useState<Lecteur[]>([])
  const [livreId, setLivreId] = useState('')
  const [lecteurId, setLecteurId] = useState('')
  const [loading, setLoading] = useState(!creation)
  const [actionId, setActionId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try { setReservations(await listerReservations()) } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Impossible de charger les réservations.') } finally { setLoading(false) }
  }
  useEffect(() => {
    void Promise.all([rechercherLivres(''), listerLecteurs()]).then(([catalogue, members]) => { setBooks(catalogue.books); setLecteurs(members) }).catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Impossible de charger les choix.'))
    if (!creation) void load()
  }, [creation])

  const names = useMemo(() => new Map(lecteurs.map((lecteur) => [lecteur.id, lecteur.nom])), [lecteurs])
  const titles = useMemo(() => new Map(books.map((book) => [book.id, book.title])), [books])
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setMessage('')
    if (!livreId || !lecteurId) { setError('Sélectionnez un livre et un lecteur.'); return }
    setActionId('creation')
    void creerReservation(livreId, lecteurId).then(() => { setMessage('La réservation a été créée.'); onDone?.(); return load() }).catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Impossible de créer la réservation.')).finally(() => setActionId(''))
  }
  const act = (reservationId: string, action: 'annuler' | 'emprunter' | 'retourner') => {
    setError(''); setMessage(''); setActionId(reservationId)
    void agirSurReservation(reservationId, action).then(() => { setMessage('La réservation a été mise à jour.'); return load() }).catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Action impossible.')).finally(() => setActionId(''))
  }

  if (creation) return <div className="content"><section className="welcome"><div><p className="eyebrow">CIRCULATION</p><h1>Créer une réservation</h1><p className="subtitle">Préparez le retrait d’un ouvrage par un lecteur.</p></div></section>
    {error && <div className="error-banner" role="alert">{error}</div>}{message && <div className="success-banner" role="status">{message}</div>}
    <section className="form-panel"><form onSubmit={submit}><label htmlFor="reservation-book">Livre</label><select id="reservation-book" value={livreId} onChange={(event) => setLivreId(event.target.value)}><option value="">Choisir un livre</option>{books.map((book) => <option value={book.id} key={book.id}>{book.title} — {book.author}</option>)}</select><label htmlFor="reservation-reader">Lecteur</label><select id="reservation-reader" value={lecteurId} onChange={(event) => setLecteurId(event.target.value)}><option value="">Choisir un lecteur</option>{lecteurs.map((lecteur) => <option value={lecteur.id} key={lecteur.id}>{lecteur.nom} — {lecteur.email}</option>)}</select><button className="primary-button" type="submit" disabled={actionId === 'creation'}><Icon name="plus" />Créer la réservation</button></form></section></div>

  return <div className="content"><header className="topbar"><div className="breadcrumb"><span>Bibliothèque</span><b>/</b><strong>Réservations</strong></div></header><section className="welcome"><div><p className="eyebrow">CIRCULATION</p><h1>Les réservations</h1><p className="subtitle">Suivez les retraits, emprunts et retours.</p></div></section>
    {error && <div className="error-banner" role="alert"><span>{error}</span><button onClick={() => void load()}><Icon name="refresh" /> Réessayer</button></div>}{message && <div className="success-banner" role="status">{message}</div>}
    <section className="table-card" aria-busy={loading}>{loading ? <div className="empty-state">Chargement des réservations...</div> : reservations.length === 0 ? <div className="empty-state">Aucune réservation enregistrée pour le moment.</div> : <div className="table-wrap"><table><thead><tr><th>LIVRE</th><th>LECTEUR</th><th>STATUT</th><th>DATE</th><th>ACTIONS</th></tr></thead><tbody>{reservations.map((reservation) => <tr key={reservation.id}><td>{titles.get(reservation.livre_id) ?? reservation.livre_id}</td><td>{names.get(reservation.lecteur_id) ?? reservation.lecteur_id}</td><td><span className={`reservation-status ${classes[reservation.statut]}`}>{labels[reservation.statut]}</span></td><td>{reservation.date_reservation ? new Date(reservation.date_reservation).toLocaleDateString('fr-FR') : '—'}</td><td className="action-buttons">{reservation.statut === 'RESERVEE' && <><button className="text-button" disabled={actionId === reservation.id} onClick={() => act(reservation.id, 'emprunter')}>Emprunter</button><button className="text-button" disabled={actionId === reservation.id} onClick={() => act(reservation.id, 'annuler')}>Annuler</button></>}{reservation.statut === 'EMPRUNTEE' && <button className="text-button" disabled={actionId === reservation.id} onClick={() => act(reservation.id, 'retourner')}>Retourner</button>}</td></tr>)}</tbody></table></div>}</section></div>
}
