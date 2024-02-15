import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import "./SwipeModal.scss";

interface SwipeModalProps {
    children: ReactNode;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}

function SwipeModal({
    children,
    visible,
    setVisible,
}: SwipeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const animationDurationInMs = 350;
    const [resetPosition, setResetPosition] = useState<number>(0);
    const [touches, setTouches] = useState<number[]>([]);

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

    const onTouchMove = (e: any) => {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }
        
        const touch = e.touches[0].clientY;
        const translate = touch - resetPosition;
        if (translate < 1) {
            return;
        }

        modal.style.transform = `translateY(${translate}px)`;
        touches.push(touch)
    };
    
    const onTouchEnd = () => {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        // const touchEndTime = Date.now();
        // const touchDuration = touchEndTime - touchStartTime;
        // const speed = Math.abs(touchEndY - touchStartY) / touchDuration;

        const currentTouch = touches[touches.length - 1];
        const pastTouchCount = 15;
        const pastTouch = touches[touches.length - pastTouchCount];
        const speed = currentTouch - pastTouch;
        setTouches([])

        console.log({speed})
        if (speed > 40) { // Adjust the speed threshold as needed
            setVisible(false);
        } else {
            toggleModal(true);
        }
    };
    
    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) {
            return;
        }

        setResetPosition(document.documentElement.clientHeight - modal.getBoundingClientRect().height)

        modal.addEventListener('touchmove', onTouchMove);
        modal.addEventListener('touchend', onTouchEnd);

        return () => {
            modal.removeEventListener('touchmove', onTouchMove);
            modal.removeEventListener('touchend', onTouchEnd);
        };
    }, [modalRef.current]);

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
