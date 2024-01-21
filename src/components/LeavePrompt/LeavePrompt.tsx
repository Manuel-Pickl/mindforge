import { useEffect } from 'react';
import { Page } from '../../types/enums/Page';

interface LeavePromptProps {
    page: Page;
}
function LeavePrompt({
    page,
}: LeavePromptProps) {
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [page]);

    function handleBeforeUnload(e: BeforeUnloadEvent) {
        if (page == Page.Offline
            || page == Page.Start
            || page == Page.Home) {
            return;
        }

        e.preventDefault();
        e.returnValue = ''; // Chrome requires `returnValue` to be set.
    }

    return null;
};

export default LeavePrompt;