import { useEffect } from 'react';
import { Page } from '../types/enums/Page';

interface PreventLeaveProps {
    page: Page;
}
function PreventLeave({
    page,
}: PreventLeaveProps) {
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [page]);

    function handleBeforeUnload(e: BeforeUnloadEvent) {
        if (page == Page.Offline
            || page == Page.Home) {
            return;
        }

        e.preventDefault();
        e.returnValue = ''; // Chrome requires `returnValue` to be set.
    }

    return null;
};

export default PreventLeave;