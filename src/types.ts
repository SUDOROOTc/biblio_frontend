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

export type UtilisateurConnecte = {
  username: string
  email: string
  role: string
}

export type Screen = 'dashboard' | 'landing' | 'login' | 'catalogue' | 'catalogue-nouveau' | 'membres' | 'reservations' | 'reservations-nouveau' | 'parametres'
