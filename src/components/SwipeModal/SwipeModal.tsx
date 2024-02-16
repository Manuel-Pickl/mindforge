import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import "./SwipeModal.scss";
import { defaultSwipeCloseRelevantTime, defaultSwipeCloseSpeedThreshold } from "../../Settings";

interface SwipeModalProps {
    children: ReactNode;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    swipeCloseSpeedThreshold?: number;
    swipeCloseRelevantTime?: number;

}

function SwipeModal({
    children,
    visible,
    setVisible,
    swipeCloseSpeedThreshold = defaultSwipeCloseSpeedThreshold,
    swipeCloseRelevantTime = defaultSwipeCloseRelevantTime,
}: SwipeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const animationDurationInMs = 350;
    const resetPositionRef = useRef<number>(0);
    
    // for swipe gesture
    const isDraggingRef = useRef<boolean>(false);
    const modalYsRef = useRef<{[key: number]: number }>({ 0: 0 });
    const motionUpdatesPerSecond = 30;
    const intervalSpeedInMs = 1000 / motionUpdatesPerSecond;
    const touchOffset = useRef<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDraggingRef.current) {
                return;
            }

            const currentY = getModalY();
            const timestamp = roundToHundred(Date.now());
            
            modalYsRef.current[timestamp] = currentY;

            // prevent overflow
            const overflowThreshold: number = 1000;
            const timestamps = Object.keys(modalYsRef.current);
            const tooManyTimeStamps: boolean = timestamps.length > overflowThreshold;
            if (tooManyTimeStamps) {
                timestamps
                    .sort().slice(0, overflowThreshold / 2)
                    .forEach(timestamp => {
                        delete modalYsRef.current[Number(timestamp)];
                });
            }
        }, intervalSpeedInMs);

        return () => {
            clearInterval(interval);
        };
    });

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        resetPositionRef.current = document.documentElement.clientHeight - modal.getBoundingClientRect().height

        modal.addEventListener('touchstart', onTouchStart);
        modal.addEventListener('touchmove', onTouchMove);
        modal.addEventListener('touchend', onTouchEnd);

        return () => {
            modal.removeEventListener('touchstart', onTouchStart);
            modal.removeEventListener('touchmove', onTouchMove);
            modal.removeEventListener('touchend', onTouchEnd);
        };
    }, [modalRef.current]);

    useEffect(() => {
        if (visible) {
            showBackdrop();
            toggleModal(true);
        } else {
            hideBackdrop();
            toggleModal(false);
        }
    }, [visible]);

    function showBackdrop() {
        const backdrop: HTMLDivElement | null = backdropRef?.current;
        if (!backdrop) {
            return;
        }

        backdrop.style.display = "block";
        requestAnimationFrame(() => {
            backdrop.style.opacity = "0.3";   
        });
    }

    function hideBackdrop() {
        const backdrop: HTMLDivElement | null = backdropRef?.current;
        if (!backdrop) {
            return;
        }

        backdrop.style.opacity = "0";
        setTimeout(() => {
            backdrop.style.display = "none";
        }, animationDurationInMs);
    }

    function toggleModal(isOpen: boolean) {
        const modal: HTMLDivElement | null = modalRef?.current;
        if (!modal) {
            return;
        }

        modal.style.transition = `transform ${animationDurationInMs}ms`;

        requestAnimationFrame(() => {
            const transform: string = isOpen 
                ? "translateY(0)"
                : "translateY(110%)";
            modal.style.transform = transform;
        });
        
        setTimeout(() => {
            modal.style.transition = `transform 0ms`;
        }, animationDurationInMs);
    }

    function onTouchStart(e: TouchEvent) {
        isDraggingRef.current = true;
        touchOffset.current = e.touches[0].clientY - getModalY();
    }

    function onTouchMove(e: TouchEvent) {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }
        
        const touch = e.touches[0].clientY;
        const translate = touch - touchOffset.current - resetPositionRef.current;
        if (translate < 1) {
            return;
        }

        modal.style.transform = `translateY(${translate}px)`;
    };
    
    function onTouchEnd() {
        isDraggingRef.current = false;

        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        const currentModalY = getModalY();
        const pastModalY = 
            modalYsRef.current[roundToHundred(Date.now()) - swipeCloseRelevantTime] // past y before {swipeCloseRelevantTime} milliseconds
            ?? Object.entries(modalYsRef.current)[0][1]; // fallback initial value
        const deltaModalY = currentModalY - pastModalY;

        // console.log({currentModalY})
        // console.log({pastModalY})
        // reset y values
        modalYsRef.current = { };
console.log(deltaModalY)
        if (deltaModalY > swipeCloseSpeedThreshold) {
            setVisible(false);
        } else {
            toggleModal(true);
        }
    };

    function getModalY(): number {
        const modalY: number = modalRef.current?.getBoundingClientRect().top ?? 0;

        return modalY;
    }
    function roundToHundred(value: number): number {
        const factor = 100;
        return Math.floor(value / factor) * factor;
    }
    
    return (
        <div 
            className="SwipeModal"
            style={{"--animationDurationInMs": `${animationDurationInMs}ms` } as React.CSSProperties}
        >
            <div
                ref={backdropRef}
                className="backdrop"
                onClick={() => setVisible(false)}
            />
            
            <div
                ref={modalRef} 
                className="modal"
            >
                <div className="swipe-bar" />

                {children}
            </div>
        </div>
    );
}

export default SwipeModal;
