import { createContext, useContext } from 'react';
import { UserTouch } from '../../types/class/UserTouch';

export const DialContext = createContext<{
    showUserTouch: (aUserTouch: UserTouch) => void;
} | undefined>(undefined);

export const useDialContext = () => {
    const context = useContext(DialContext);

    if (!context) {
        throw new Error('DialContext is not provided-');
    }

    return context;
};