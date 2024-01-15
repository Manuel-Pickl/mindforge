import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { HomeTab } from '../../types/enums/HomeTab';

export const HomeContext = createContext<{
    homeTab: HomeTab;
    setHomeTab: Dispatch<SetStateAction<HomeTab>>;
} | undefined>(undefined);

export const useHomeContext = () => {
    const context = useContext(HomeContext);

    if (!context) {
        throw new Error('HomeContext is not provided-');
    }

    return context;
};