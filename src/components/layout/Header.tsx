import { NavLink, useNavigate } from 'react-router-dom'
import { APP_EMOJI, APP_NAME, APP_TAGLINE, APP_VERSION } from '../../config'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const navigate = useNavigate()
  return (
    <header className="site-header">
      <div className="inner">
        <div className="brand">
          <span className="emoji" aria-hidden>
            {APP_EMOJI}
          </span>
          <span>{APP_NAME}</span>
          <span className="tagline">{APP_TAGLINE}</span>
          <button
            className="version-tag"
            title="Ver el historial de cambios"
            onClick={() => navigate('/changelog')}
          >
            v{APP_VERSION}
          </button>
        </div>
        <nav className="header-nav">
          <NavLink to="/" end>
            Editor
          </NavLink>
          <NavLink to="/print">Imprimir / PDF</NavLink>
          <NavLink to="/publicados">Publicados</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
