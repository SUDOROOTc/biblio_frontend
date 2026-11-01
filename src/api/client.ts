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

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
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
