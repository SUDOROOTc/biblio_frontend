import { request } from './client'

export async function changerMotDePasse(ancienMotDePasse: string, nouveauMotDePasse: string): Promise<void> {
  await request<void>('/api/auth/changer-mot-de-passe', {
    method: 'POST',
    body: JSON.stringify({
      ancien_mot_de_passe: ancienMotDePasse,
      nouveau_mot_de_passe: nouveauMotDePasse,
    }),
  })
}
