import { useTheme } from '../../lib/theme'

export default function ThemeToggle() {
  const [theme, toggle] = useTheme()
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={toggle}
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
