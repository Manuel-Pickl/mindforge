// main.tsx
import './index.scss'
import "./stackingContext.scss";
import ReactDOM from 'react-dom/client'
import App, { AppProvider } from './components/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './components/Game/Game.tsx'
import { PlayProvider } from './components/Game/Play/Play.tsx'
import { PrepareProvider } from './components/Game/Prepare/Prepare.tsx'
import { ResultProvider } from './components/Game/Result/Result.tsx'
import { ConnectionManagerProvider } from './components/ConnectionManager/ConnectionManager.tsx'
import { ServerProvider } from './components/Server/Server.tsx'
import { HomeProvider } from './components/Home/Home.tsx'
import { DialProvider } from './components/Dial/Dial.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppProvider>
        <ServerProvider>
        <PlayProvider>
        <ConnectionManagerProvider>
        <HomeProvider>
        <DialProvider>
        <GameProvider>
        <PrepareProvider>
        <ResultProvider>
            <App />
        </ResultProvider>
        </PrepareProvider>
        </GameProvider>
        </DialProvider>
        </HomeProvider>
        </ConnectionManagerProvider>
        </PlayProvider>
        </ServerProvider>
        </AppProvider>
    </BrowserRouter>
)