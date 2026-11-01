import { useState, type FormEvent } from 'react'
import { creerLivre } from './api/livres'
import { Icon } from './Icon'

type Props = { onDone: () => void }

export function LivreFormPage({ onDone }: Props) {
  const [titre, setTitre] = useState('')
  const [auteur, setAuteur] = useState('')
  const [annee, setAnnee] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const year = Number(annee)
    if (!titre.trim() || !auteur.trim() || !Number.isInteger(year)) {
      setError('Renseignez le titre, l’auteur et une année valide.')
      return
    }
    setLoading(true)
    void creerLivre(titre.trim(), auteur.trim(), year).then(onDone).catch((requestError: unknown) => {
      setError(requestError instanceof Error ? requestError.message : 'Impossible de créer le livre.')
    }).finally(() => setLoading(false))
  }

  return <div className="content"><section className="welcome"><div><p className="eyebrow">CATALOGUE</p><h1>Ajouter un livre</h1><p className="subtitle">Enrichissez le fonds de la bibliothèque.</p></div></section>
    {error && <div className="error-banner" role="alert">{error}</div>}
    <section className="form-panel"><form onSubmit={submit}>
      <label htmlFor="book-title">Titre</label><input id="book-title" value={titre} onChange={(event) => setTitre(event.target.value)} required />
      <label htmlFor="book-author">Auteur</label><input id="book-author" value={auteur} onChange={(event) => setAuteur(event.target.value)} required />
      <label htmlFor="book-year">Année de publication</label><input id="book-year" type="number" value={annee} onChange={(event) => setAnnee(event.target.value)} required />
      <button className="primary-button" type="submit" disabled={loading}><Icon name="plus" />{loading ? 'Création en cours…' : 'Créer le livre'}</button>
    </form></section></div>
}
