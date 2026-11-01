import { API_URL } from './client'

function lireCookie(nom: string): string | null {
  const cookie = document.cookie.split('; ').find((valeur) => valeur.startsWith(`${nom}=`))
  return cookie ? decodeURIComponent(cookie.substring(nom.length + 1)) : null
}

export async function connecter(username: string, password: string): Promise<void> {
  if (!API_URL) {
    throw new Error('API non configurée')
  }

  await fetch(`${API_URL}/api/auth/login/`, {
    credentials: 'include',
  })

  const csrfToken = lireCookie('csrftoken')
  if (!csrfToken) {
    throw new Error('Le cookie de sécurité CSRF est introuvable.')
  }

  const formulaire = new URLSearchParams({ username, password, csrfmiddlewaretoken: csrfToken })
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    credentials: 'include',
    redirect: 'follow',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: `${API_URL}/api/auth/login/`,
      'X-CSRFToken': csrfToken,
    },
    body: formulaire,
  })

  if (!response.ok || response.url.endsWith('/api/auth/login/')) {
    throw new Error('Identifiant ou mot de passe incorrect.')
  }
}
