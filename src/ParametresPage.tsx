import { useState, type FormEvent } from 'react'
import { changerMotDePasse } from './api/parametres'
import type { UtilisateurConnecte } from './types'

type Props = { utilisateur: UtilisateurConnecte | null }

export function ParametresPage({ utilisateur }: Props) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(''); setError('')
    if (!currentPassword || password.length < 8 || password !== confirmation) { setError('Renseignez votre ancien mot de passe, puis un nouveau mot de passe d’au moins 8 caractères identique à sa confirmation.'); return }
    setLoading(true)
    void changerMotDePasse(currentPassword, password).then(() => { setMessage('Mot de passe modifié avec succès.'); setCurrentPassword(''); setPassword(''); setConfirmation('') }).catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Impossible de modifier le mot de passe.')).finally(() => setLoading(false))
  }
  return <div className="content"><section className="welcome"><div><p className="eyebrow">CONFIGURATION</p><h1>Paramètres</h1><p className="subtitle">Gérez votre compte bibliothécaire.</p></div></section>
    <section className="form-panel"><div><p className="section-kicker">COMPTE CONNECTÉ</p><h2>{utilisateur?.username ?? 'Bibliothécaire'}</h2><p>{utilisateur?.email ?? 'Session active'}</p></div><form onSubmit={submit}><label htmlFor="current-password">Ancien mot de passe</label><input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /><label htmlFor="new-password">Nouveau mot de passe</label><input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><label htmlFor="password-confirmation">Confirmation</label><input id="password-confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /><button className="primary-button" type="submit" disabled={loading}>{loading ? 'Modification en cours…' : 'Modifier le mot de passe'}</button></form></section>
    {error && <div className="error-banner" role="alert">{error}</div>}{message && <div className="success-banner" role="status">{message}</div>}
  </div>
}
