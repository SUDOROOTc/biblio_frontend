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

function traduireErreurValidation(message: string): string {
  const traductions: Record<string, string> = {
    'This password is too common.': 'Ce mot de passe est trop courant. Choisissez une combinaison moins prévisible.',
    'This password is entirely numeric.': 'Le mot de passe ne peut pas être composé uniquement de chiffres.',
    'This password is too short. It must contain at least 8 characters.': 'Le mot de passe doit contenir au moins 8 caractères.',
  }
  return traductions[message] ?? message
}

function messagePourStatut(status: number): string {
  const messages: Record<number, string> = {
    400: 'La demande est invalide. Vérifiez les informations saisies.',
    401: 'Votre session n’est plus active. Reconnectez-vous.',
    403: 'Cette action n’est pas autorisée ou la protection de sécurité a expiré.',
    404: 'La ressource demandée est introuvable.',
    409: 'Cette action entre en conflit avec l’état actuel de la bibliothèque.',
    422: 'Les informations saisies ne peuvent pas être acceptées.',
    500: 'Le serveur rencontre un problème. Réessayez dans quelques instants.',
    502: 'Le serveur est momentanément indisponible.',
    503: 'Le service est momentanément indisponible.',
    504: 'Le serveur met trop de temps à répondre.',
  }
  return messages[status] ?? 'Une erreur est survenue. Réessayez dans quelques instants.'
}

function lireCookie(nom: string): string | null {
  const cookie = document.cookie.split('; ').find((valeur) => valeur.startsWith(`${nom}=`))
  return cookie ? decodeURIComponent(cookie.substring(nom.length + 1)) : null
}

async function obtenirTokenCsrf(): Promise<string> {
  let token = lireCookie('csrftoken')
  if (token) return token

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/auth/csrf`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new ErreurApi('Connexion au serveur impossible. Vérifiez que le backend est démarré.', 0)
  }
  if (!response.ok) {
    throw new ErreurApi(messagePourStatut(response.status), response.status)
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

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    })
  } catch {
    throw new ErreurApi('Connexion au serveur impossible. Vérifiez que le backend est démarré.', 0)
  }

  if (!response.ok) {
    let message = messagePourStatut(response.status)
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await response.json() as Record<string, unknown>
      if (typeof body.detail === 'string') {
        message = traduireErreurValidation(body.detail)
      } else {
        const validationMessages = Object.values(body).flatMap((value) => Array.isArray(value) ? value : [value]).filter((value): value is string => typeof value === 'string')
        if (validationMessages.length > 0) message = validationMessages.map(traduireErreurValidation).join(' ')
      }
    }
    throw new ErreurApi(message, response.status)
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') ?? ''
  const body = await response.text()
  if (!body.trim()) return undefined as T
  if (!contentType.includes('application/json')) {
    throw new ErreurApi('Le serveur a renvoyé une réponse inattendue.', response.status)
  }
  return JSON.parse(body) as T
}
