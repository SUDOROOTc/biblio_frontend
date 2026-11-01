import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { creerLecteur, listerLecteurs, type Lecteur } from './api/lecteurs'
import { Icon } from './Icon'

export function MembresPage() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lecteurs, setLecteurs] = useState<Lecteur[]>([])
  const [listeLoading, setListeLoading] = useState(true)
  const [listeError, setListeError] = useState('')
  const [recherche, setRecherche] = useState('')

  const chargerLecteurs = async () => {
    setListeLoading(true)
    setListeError('')
    try {
      setLecteurs(await listerLecteurs())
    } catch (requestError) {
      setListeError(requestError instanceof Error ? requestError.message : 'Impossible de charger les membres.')
    } finally {
      setListeLoading(false)
    }
  }

  useEffect(() => { void chargerLecteurs() }, [])

  const lecteursFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase()
    if (!terme) return lecteurs
    return lecteurs.filter((lecteur) => `${lecteur.nom} ${lecteur.email}`.toLowerCase().includes(terme))
  }, [lecteurs, recherche])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    const nomNettoye = nom.trim()
    const emailNettoye = email.trim()
    if (!nomNettoye || !emailNettoye) {
      setError('Renseignez le nom et l’adresse e-mail du lecteur.')
      return
    }

    setLoading(true)
    void creerLecteur(nomNettoye, emailNettoye).then((lecteur) => {
      setMessage(`Le lecteur ${lecteur.nom} a été créé.`)
      setNom('')
      setEmail('')
      return chargerLecteurs()
    }).catch((requestError: unknown) => {
      setError(requestError instanceof Error ? requestError.message : 'Impossible de créer le lecteur.')
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb"><span>Bibliothèque</span><b>/</b><strong>Membres</strong></div>
      </header>
      <div className="content">
        <section className="welcome"><div><p className="eyebrow">LECTEURS DE LA BIBLIOTHÈQUE</p><h1>Les membres</h1><p className="subtitle">Créez une fiche lecteur et retrouvez ses coordonnées.</p></div></section>
        {error && <div className="error-banner" role="alert" aria-live="polite"><span>{error}</span></div>}
        {message && <div className="success-banner" role="status" aria-live="polite">{message}</div>}
        <section className="form-panel">
          <div><p className="section-kicker">NOUVEAU LECTEUR</p><h2>Créer une fiche membre</h2><p>Ajoutez un lecteur au registre de la bibliothèque.</p></div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="member-name">Nom complet</label>
            <input id="member-name" value={nom} onChange={(event) => setNom(event.target.value)} autoComplete="name" placeholder="Ada Lovelace" />
            <label htmlFor="member-email">Adresse e-mail</label>
            <input id="member-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="ada@example.com" />
            <button className="primary-button" type="submit" disabled={loading}><Icon name="plus" />{loading ? 'Création en cours…' : 'Créer le lecteur'}</button>
          </form>
        </section>
        <section className="section-heading"><div><h2>{lecteurs.length.toLocaleString('fr-FR')} membre{lecteurs.length > 1 ? 's' : ''}</h2><p>Lecteurs enregistrés dans la bibliothèque</p></div><div className="search member-search"><Icon name="search" /><input value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Rechercher un membre..." aria-label="Rechercher un membre" /></div></section>
        <section className="table-card" aria-busy={listeLoading}>
          <div className="table-header"><div className="table-title"><span className="green-dot" /> Membres <b>{lecteursFiltres.length}</b></div></div>
          {listeLoading ? <div className="empty-state">Chargement des membres...</div> : listeError ? <div className="empty-state"><p>{listeError}</p><button className="text-button" onClick={() => void chargerLecteurs()}><Icon name="refresh" /> Réessayer</button></div> : lecteursFiltres.length === 0 ? <div className="empty-state">{recherche ? `Aucun membre ne correspond à « ${recherche} ».` : 'Aucun membre enregistré pour le moment.'}</div> : <div className="table-wrap"><table><thead><tr><th>NOM</th><th>E-MAIL</th><th>STATUT</th></tr></thead><tbody>{lecteursFiltres.map((lecteur) => <tr key={lecteur.id}><td><div className="book-cell"><span className="reservation-avatar">{lecteur.nom.split(' ').map((partie) => partie[0]).join('').slice(0, 2)}</span><strong>{lecteur.nom}</strong></div></td><td>{lecteur.email}</td><td><span className="status available"><i />Actif</span></td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </>
  )
}
