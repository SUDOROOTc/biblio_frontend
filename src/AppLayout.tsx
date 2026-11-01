import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { Screen, UtilisateurConnecte } from './types'

type Props = {
  screen: Screen
  utilisateur: UtilisateurConnecte | null
  navigate: (screen: Screen) => void
  onLogout: () => void
  theme: 'clair' | 'sombre'
  onToggleTheme: () => void
  children: ReactNode
}

export function AppLayout({ screen, utilisateur, navigate, onLogout, theme, onToggleTheme, children }: Props) {
  const initials = utilisateur?.username.slice(0, 2).toUpperCase() ?? 'OU'
  const link = (target: Screen, label: string, icon: 'grid' | 'book' | 'users' | 'settings') => (
    <a className={`nav-item ${screen === target || (target === 'catalogue' && screen === 'catalogue-nouveau') || (target === 'reservations' && screen === 'reservations-nouveau') ? 'active' : ''}`} href={`/${target}`} onClick={(event) => { event.preventDefault(); navigate(target) }}>
      <Icon name={icon} /> {label}
    </a>
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('dashboard')}><span className="brand-mark">B</span><span>Biblio</span></button>
        <div className="menu-label">MENU PRINCIPAL</div>
        <nav>
          {link('dashboard', 'Tableau de bord', 'grid')}
          {link('catalogue', 'Catalogue', 'book')}
          {link('membres', 'Membres', 'users')}
          {link('reservations', 'Réservations', 'book')}
        </nav>
        <div className="menu-label menu-label-bottom">CONFIGURATION</div>
        <nav>{link('parametres', 'Paramètres', 'settings')}</nav>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Activer le thème ${theme === 'sombre' ? 'clair' : 'sombre'}`}>
          <span className="theme-toggle-icon">{theme === 'sombre' ? '☼' : '◐'}</span>
          <span>Thème {theme === 'sombre' ? 'sombre' : 'clair'}</span>
        </button>
        <div className="sidebar-footer">
          <div className="profile"><div className="avatar">{initials}</div><div><strong>{utilisateur?.username ?? 'Ouedraogo'}</strong><small>{utilisateur?.role ?? 'Bibliothécaire'}</small></div></div>
          <button className="text-button" onClick={onLogout}>Se déconnecter</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  )
}
