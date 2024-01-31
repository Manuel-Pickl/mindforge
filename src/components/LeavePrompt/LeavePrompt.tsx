import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function LeavePrompt() {
    const location = useLocation();

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [location.pathname]);

    function handleBeforeUnload(e: BeforeUnloadEvent) {
        const leavePromptPaths = ["/lobby", "/game", "/result"];

        if (!leavePromptPaths.includes(location.pathname)) {
            return;
        }

        e.preventDefault();
        e.returnValue = ''; // Chrome requires `returnValue` to be set.
    }

    return null;
};

export default LeavePrompt;
