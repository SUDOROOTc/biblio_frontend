export type Book = {
  id: string
  title: string
  author: string
  category: string
  status: 'Disponible' | 'Emprunté'
  cover: string
  year: number
}

export type LibraryStats = {
  totalBooks: number
}

export type ReservationStatus = 'RESERVEE' | 'EMPRUNTEE' | 'RETOURNEE' | 'ANNULEE' | 'EXPIREE'
