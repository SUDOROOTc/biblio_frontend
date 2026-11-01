import { request } from './client'
import type { ReservationStatus } from '../types'

export type Reservation = {
  id: string
  livre_id: string
  lecteur_id: string
  statut: ReservationStatus
  date_reservation: string | null
  date_emprunt: string | null
  date_retour: string | null
}

export async function listerReservations(): Promise<Reservation[]> {
  return request<Reservation[]>('/api/reservations')
}

export async function creerReservation(livreId: string, lecteurId: string): Promise<Reservation> {
  return request<Reservation>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify({ livre_id: livreId, lecteur_id: lecteurId }),
  })
}

export async function agirSurReservation(
  reservationId: string,
  action: 'annuler' | 'emprunter' | 'retourner',
): Promise<void> {
  await request<void>(`/api/reservations/${reservationId}/${action}`, { method: 'POST' })
}
