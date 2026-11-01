import { request } from './client'
import type { Book } from '../types'

type LivreResponse = {
  id: string
  titre: string
  auteur: string
  annee_publication: number
  date_suppression: string | null
}

type RechercheLivresResponse = {
  count: number
  next: number | null
  previous: number | null
  results: LivreResponse[]
}

const demoBooks: Book[] = [
  { id: '1', title: 'L’Étranger', author: 'Albert Camus', category: 'Roman', status: 'Disponible', cover: 'LE', year: 1942 },
  { id: '2', title: 'Une chambre à soi', author: 'Virginia Woolf', category: 'Essai', status: 'Emprunté', cover: 'UC', year: 1929 },
  { id: '3', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', category: 'Jeunesse', status: 'Disponible', cover: 'LP', year: 1943 },
  { id: '4', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Histoire', status: 'Disponible', cover: 'SA', year: 2011 },
  { id: '5', title: 'L’Odyssée', author: 'Homère', category: 'Classique', status: 'Emprunté', cover: 'LO', year: -700 },
]

function convertirLivre(livre: LivreResponse): Book {
  const cover = livre.titre.trim().split(/\s+/).map((mot) => mot[0]).join('').slice(0, 2).toUpperCase()
  return {
    id: livre.id,
    title: livre.titre,
    author: livre.auteur,
    category: 'Ouvrage',
    status: 'Disponible',
    cover,
    year: livre.annee_publication,
  }
}

export async function rechercherLivres(query: string): Promise<{ books: Book[]; count: number }> {
  if (!import.meta.env.VITE_API_URL) {
    const normalizedQuery = query.trim().toLowerCase()
    const books = demoBooks.filter((book) =>
      `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(normalizedQuery),
    )
    return { books, count: books.length }
  }

  const params = new URLSearchParams({ page: '1', page_size: '50' })
  if (query.trim()) params.set('q', query.trim())
  const response = await request<RechercheLivresResponse>(`/api/livres/recherche?${params}`)
  return { books: response.results.map(convertirLivre), count: response.count }
}

export async function getBooks(): Promise<Book[]> {
  return (await rechercherLivres('')).books
}
