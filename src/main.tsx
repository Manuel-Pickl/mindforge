import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './components/Game/Game.tsx'
import { PlayProvider } from './components/Game/Play/Play.tsx'
import { PrepareProvider } from './components/Game/Prepare/Prepare.tsx'
import { ResultProvider } from './components/Game/Result/Result.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <GameProvider>
        <PrepareProvider>
        <PlayProvider>
        <ResultProvider>
            <App />
        </ResultProvider>
        </PlayProvider>
        </PrepareProvider>
        </GameProvider>
    </BrowserRouter>
)