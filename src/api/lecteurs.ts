import { request } from './client'

type LecteurResponse = {
  id: string
  nom: string
  email: string
  date_suppression: string | null
}

export async function creerLecteur(nom: string, email: string): Promise<LecteurResponse> {
  return request<LecteurResponse>('/api/lecteurs', {
    method: 'POST',
    body: JSON.stringify({ nom, email }),
  })
}
