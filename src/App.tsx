import { HashRouter, Route, Routes } from 'react-router-dom'
import { CalendarStoreProvider } from './state/CalendarStore'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import EditorPage from './components/editor/EditorPage'
import PrintView from './components/print/PrintView'
import PublishedGallery from './components/published/PublishedGallery'
import ChangelogView from './components/changelog/ChangelogView'

export default function App() {
  return (
    <CalendarStoreProvider>
      <HashRouter>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<EditorPage />} />
              <Route path="/print" element={<PrintView />} />
              <Route path="/publicados" element={<PublishedGallery />} />
              <Route path="/changelog" element={<ChangelogView />} />
              <Route path="*" element={<EditorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </CalendarStoreProvider>
  )
}
