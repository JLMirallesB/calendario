import { HashRouter, Route, Routes } from 'react-router-dom'
import { I18nProvider } from './i18n'
import { CalendarStoreProvider } from './state/CalendarStore'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WelcomePage from './components/home/WelcomePage'
import CevLoaderPage from './components/home/CevLoaderPage'
import EditorPage from './components/editor/EditorPage'
import PrintView from './components/print/PrintView'
import PublishedGallery from './components/published/PublishedGallery'
import ChangelogView from './components/changelog/ChangelogView'

export default function App() {
  return (
    <I18nProvider>
      <CalendarStoreProvider>
        <HashRouter>
          <div className="app-shell">
            <Header />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/nuevo/cev" element={<CevLoaderPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/print" element={<PrintView />} />
                <Route path="/publicados" element={<PublishedGallery />} />
                <Route path="/changelog" element={<ChangelogView />} />
                <Route path="*" element={<WelcomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </CalendarStoreProvider>
    </I18nProvider>
  )
}
