import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import "./SwipeModal.scss";

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
    swipeCloseSpeedThreshold = 60, // in px
    swipeCloseRelevantTime = 150, // in ms
}: SwipeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const animationDurationInMs = 350;
    const resetPositionRef = useRef<number>(0);
    
    // for swipe gesture
    const isDraggingRef = useRef<boolean>(false);
    const yValuesRef = useRef<{[key: number]: number }>({ 0: 0 });
    const fps = 30;
    const intervalSpeedInMs = 1000 / fps;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDraggingRef.current) {
                return;
            }

            const currentY = getCurrentY();
            const timestamp = roundToHundred(Date.now());
            
            yValuesRef.current[timestamp] = currentY;
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
        
        // add backup for y values
        yValuesRef.current[0] = resetPositionRef.current;

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

    function onTouchStart() {
        isDraggingRef.current = true;
    }

    function onTouchMove(e: any) {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }
        
        const touch = e.touches[0].clientY;
        const translate = touch - resetPositionRef.current;
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

        const currentY = getCurrentY();
        const pastY = 
            yValuesRef.current[roundToHundred(Date.now()) - swipeCloseRelevantTime] // past y before {swipeCloseRelevantTime} milliseconds
            ?? Object.entries(yValuesRef.current)[0][1]; // fallback initial value
        const speed = currentY - pastY;

        // reset y values
        yValuesRef.current = { 0: resetPositionRef.current };
console.log(speed)
        if (speed > swipeCloseSpeedThreshold) {
            setVisible(false);
        } else {
            toggleModal(true);
        }
    };

    function getCurrentY(): number {
        const currentY: number = modalRef.current?.getBoundingClientRect().top ?? 0;

        return currentY;
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
