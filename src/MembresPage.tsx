import { useState, type FormEvent } from 'react'
import { creerLecteur } from './api/lecteurs'
import { Icon } from './Icon'

export function MembresPage() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        <section className="welcome"><div><p className="eyebrow">LECTEURS DE LA BIBLIOTHÈQUE</p><h1>Les membres</h1><p className="subtitle">Créez une fiche lecteur pour suivre ses réservations.</p></div></section>
        {error && <div className="error-banner" role="alert" aria-live="polite"><span>{error}</span></div>}
        {message && <div className="success-banner" role="status" aria-live="polite">{message}</div>}
        <section className="form-panel">
          <div><p className="section-kicker">NOUVEAU LECTEUR</p><h2>Créer une fiche membre</h2><p>La liste complète des membres sera disponible dès que l’API fournira un endpoint de consultation.</p></div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="member-name">Nom complet</label>
            <input id="member-name" value={nom} onChange={(event) => setNom(event.target.value)} autoComplete="name" placeholder="Ada Lovelace" />
            <label htmlFor="member-email">Adresse e-mail</label>
            <input id="member-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="ada@example.com" />
            <button className="primary-button" type="submit" disabled={loading}><Icon name="plus" />{loading ? 'Création en cours…' : 'Créer le lecteur'}</button>
          </form>
        </section>
      </div>
    </>
  )
}
