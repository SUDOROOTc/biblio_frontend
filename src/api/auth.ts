import { API_URL } from './client'

function lireCookie(nom: string): string | null {
  const cookie = document.cookie.split('; ').find((valeur) => valeur.startsWith(`${nom}=`))
  return cookie ? decodeURIComponent(cookie.substring(nom.length + 1)) : null
}

export async function connecter(username: string, password: string): Promise<void> {
  const pageConnexion = await fetch(`${API_URL}/api/auth/login/`, {
    credentials: 'include',
  })
  if (!pageConnexion.ok) {
    throw new Error('Le service de connexion est indisponible.')
  }

  const csrfToken = lireCookie('csrftoken')
  if (!csrfToken) {
    throw new Error('Le cookie de sécurité CSRF est introuvable.')
  }

  const formulaire = new URLSearchParams({ username, password, csrfmiddlewaretoken: csrfToken })
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    credentials: 'include',
    redirect: 'manual',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: `${API_URL}/api/auth/login/`,
      'X-CSRFToken': csrfToken,
    },
    body: formulaire,
  })

  const connexionAcceptee = response.status >= 300 && response.status < 400
  if (connexionAcceptee) return

  if (response.status === 200) {
    throw new Error('Identifiant ou mot de passe incorrect.')
  }

  throw new Error(`Le service de connexion a répondu avec le statut ${response.status}.`)
}
