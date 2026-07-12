import { AUTHOR, REPO_URL } from '../../config'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <span>
          App diseñada por{' '}
          <a href={AUTHOR.site} target="_blank" rel="noreferrer">
            {AUTHOR.name} (jlmirall.es)
          </a>{' '}
          con ayuda de Claude.
        </span>
        <span className="sep">·</span>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          Repositorio
        </a>
        <span className="sep">·</span>
        <a href={`mailto:${AUTHOR.email}`}>Contacto</a>
        <span className="sep">·</span>
        <a href={AUTHOR.kofi} target="_blank" rel="noreferrer">
          Invitar a una orxata ☕
        </a>
      </div>
    </footer>
  )
}
