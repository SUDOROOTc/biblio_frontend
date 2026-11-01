import { useEffect, useState, type FormEvent } from 'react'
import { rechercherLivres } from './api'
import { Icon } from './Icon'
import type { Book } from './types'

type Props = { onAdd: () => void }

export function CataloguePage({ onAdd }: Props) {
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBooks = async (search = query) => {
    setLoading(true)
    setError('')
    try {
      const catalogue = await rechercherLivres(search)
      setBooks(catalogue.books)
      setTotal(catalogue.count)
    } catch (requestError) {
      setBooks([])
      setTotal(0)
      setError(requestError instanceof Error ? requestError.message : 'Impossible de charger le catalogue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadBooks('') }, [])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void loadBooks()
  }

  return (
    <>
      <header className="topbar">
        <div className="breadcrumb"><span>Bibliothèque</span><b>/</b><strong>Catalogue</strong></div>
        <div className="top-actions"><form className="search" onSubmit={handleSearch}><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un livre..." aria-label="Rechercher un livre" /></form></div>
      </header>
      <div className="content">
        <section className="welcome"><div><p className="eyebrow">FONDS DE LA BIBLIOTHÈQUE</p><h1>Le catalogue</h1><p className="subtitle">Retrouvez les ouvrages par titre ou par auteur.</p></div><button className="primary-button" onClick={onAdd}><Icon name="plus" /> Ajouter un livre</button></section>
        {error && <div className="error-banner" role="alert" aria-live="polite"><span>{error}</span><button onClick={() => void loadBooks()}><Icon name="refresh" /> Réessayer</button></div>}
        <section className="section-heading"><div><h2>{total.toLocaleString('fr-FR')} ouvrage{total > 1 ? 's' : ''}</h2><p>{query ? `Résultats pour « ${query} »` : 'Tous les ouvrages enregistrés'}</p></div></section>
        <section className="table-card" aria-busy={loading}>
          <div className="table-header"><div className="table-title"><span className="green-dot" /> Catalogue <b>{total.toLocaleString('fr-FR')}</b></div></div>
          {loading ? <div className="empty-state loading-state">Chargement du catalogue...</div> : books.length === 0 ? <div className="empty-state">{query ? `Aucun ouvrage ne correspond à « ${query} ».` : 'Le catalogue est vide pour le moment.'}</div> : <div className="table-wrap"><table><thead><tr><th>LIVRE</th><th>AUTEUR</th><th>ANNÉE</th><th>STATUT</th><th /></tr></thead><tbody>{books.map((book) => <tr key={book.id}><td><div className="book-cell"><span className={`book-cover cover-${book.cover.toLowerCase()}`}>{book.cover}</span><strong>{book.title}</strong></div></td><td>{book.author}</td><td>{book.year < 0 ? `${Math.abs(book.year)} av. J.-C.` : book.year}</td><td><span className={`status ${book.status === 'Disponible' ? 'available' : 'borrowed'}`}><i />{book.status}</span></td><td><button className="more-button" aria-label={`Options pour ${book.title}`}>•••</button></td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </>
  )
}
