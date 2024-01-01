import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { GameState } from '../../types/enums/GameState';

export const GameContext = createContext<{
    gameState: GameState;
    setGameState: Dispatch<SetStateAction<GameState>>;
} | undefined>(undefined);

export const useGameContext = () => {
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('GameContext is not provided-');
    }

    return context;
};