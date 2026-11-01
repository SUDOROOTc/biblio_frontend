export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export class ErreurApi extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ErreurApi'
  }
}

function lireCookie(nom: string): string | null {
  const cookie = document.cookie.split('; ').find((valeur) => valeur.startsWith(`${nom}=`))
  return cookie ? decodeURIComponent(cookie.substring(nom.length + 1)) : null
}

async function obtenirTokenCsrf(): Promise<string> {
  let token = lireCookie('csrftoken')
  if (token) return token

  const response = await fetch(`${API_URL}/api/auth/csrf`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new ErreurApi('Impossible d’initialiser la protection CSRF.', response.status)
  }

  token = lireCookie('csrftoken')
  if (!token) {
    throw new ErreurApi('Le cookie de sécurité CSRF est introuvable.', response.status)
  }
  return token
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase()
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers.set('X-CSRFToken', await obtenirTokenCsrf())
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    let message = `La requête a échoué (${response.status})`
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await response.json() as { detail?: string }
      if (body.detail) message = body.detail
    }
    throw new ErreurApi(message, response.status)
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new ErreurApi('Le serveur a renvoyé une réponse inattendue.', response.status)
  }
  return response.json() as Promise<T>
}
