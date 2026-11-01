import { request } from './client'

export async function changerMotDePasse(nouveauMotDePasse: string): Promise<void> {
  await request<void>('/api/auth/changer-mot-de-passe', {
    method: 'POST',
    body: JSON.stringify({ nouveau_mot_de_passe: nouveauMotDePasse }),
  })
}
