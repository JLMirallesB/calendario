import { AUTHOR, REPO_URL } from '../../config'
import { useI18n } from '../../i18n'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="site-footer">
      <div className="inner">
        <span>
          {t('footer.designedBy')}{' '}
          <a href={AUTHOR.site} target="_blank" rel="noreferrer">
            {AUTHOR.name} (jlmirall.es)
          </a>{' '}
          {t('footer.withClaude')}
        </span>
        <span className="sep">·</span>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          {t('footer.repo')}
        </a>
        <span className="sep">·</span>
        <a href={`mailto:${AUTHOR.email}`}>{t('footer.contact')}</a>
        <span className="sep">·</span>
        <a href={AUTHOR.kofi} target="_blank" rel="noreferrer">
          {t('footer.kofi')}
        </a>
      </div>
    </footer>
  )
}
