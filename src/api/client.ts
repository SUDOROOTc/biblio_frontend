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
    try {
      const body = await response.json() as { detail?: string }
      if (body.detail) message = body.detail
    } catch {
      // Le backend peut répondre sans JSON, le statut reste alors le message utile.
    }
    throw new ErreurApi(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
