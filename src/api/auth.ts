import { request } from './client'
import type { UtilisateurConnecte } from '../types'

function lireCookie(nom: string): string | null {
  const cookie = document.cookie.split('; ').find((valeur) => valeur.startsWith(`${nom}=`))
  return cookie ? decodeURIComponent(cookie.substring(nom.length + 1)) : null
}

export async function initialiserCsrf(): Promise<void> {
  await request<{ detail: string }>('/api/auth/csrf')
}

export async function seConnecter(username: string, password: string): Promise<UtilisateurConnecte> {
  await initialiserCsrf()
  const csrfToken = lireCookie('csrftoken')
  if (!csrfToken) {
    throw new Error('Le cookie de sécurité CSRF est introuvable.')
  }

  const response = await request<{ utilisateur: UtilisateurConnecte }>('/api/auth/login', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken },
    body: JSON.stringify({ username, password }),
  })
  return response.utilisateur
}

export async function obtenirUtilisateurConnecte(): Promise<UtilisateurConnecte> {
  const response = await request<{ utilisateur: UtilisateurConnecte }>('/api/auth/me')
  return response.utilisateur
}

export async function seDeconnecter(): Promise<void> {
  if (!lireCookie('csrftoken')) await initialiserCsrf()
  const csrfToken = lireCookie('csrftoken')
  if (!csrfToken) {
    throw new Error('Le cookie de sécurité CSRF est introuvable.')
  }

  await request<void>('/api/auth/logout', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken },
    body: JSON.stringify({}),
  })
}
