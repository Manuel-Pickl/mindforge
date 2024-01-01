import ReactDOM from 'react-dom/client'
import App, { AppProvider } from './components/App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './components/Game/Game.tsx'
import { PlayProvider } from './components/Game/Play/Play.tsx'
import { PrepareProvider } from './components/Game/Prepare/Prepare.tsx'
import { ResultProvider } from './components/Game/Result/Result.tsx'
import { ConnectionManagerProvider } from './components/ConnectionManager/ConnectionManager.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppProvider>
        <ConnectionManagerProvider>
        <GameProvider>
        <PrepareProvider>
        <PlayProvider>
        <ResultProvider>

            <App />
        
        </ResultProvider>
        </PlayProvider>
        </PrepareProvider>
        </GameProvider>
        </ConnectionManagerProvider>
        </AppProvider>
    </BrowserRouter>
)