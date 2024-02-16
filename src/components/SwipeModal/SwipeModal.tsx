import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./SwipeModal.scss";

interface SwipeModalProps {
    children: React.ReactNode;
    closingSpeed?: number;
    animationDuration?: number;
    disableSwipe?: boolean;
}

export interface SwipeModalRef {
    show: () => void;
    close: () => void;
}

const SwipeModal = forwardRef<SwipeModalRef, SwipeModalProps>(({
    children,
    closingSpeed = 500, // px/s
    animationDuration = 350, // ms
    disableSwipe = false,
}, ref) => {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const resetPositionRef = useRef<number>(0);
    
    useEffect(() => {
        initializePositionInterval();        

        return () => {
            clearInterval(positionInterval.current);
        };
    });

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
        }, animationDuration);
    }

    function toggleModal(isOpen: boolean) {
        const modal: HTMLDivElement | null = modalRef?.current;
        if (!modal) {
            return;
        }

        modal.style.transition = `transform ${animationDuration}ms`;

        requestAnimationFrame(() => {
            const transform: string = isOpen 
                ? "translateY(0)"
                : "translateY(100%)";
            modal.style.transform = transform;
        });
        
        setTimeout(() => {
            modal.style.transition = `transform 0ms`;
        }, animationDuration);
    }

    //#region touch functionality

    const isDraggingRef = useRef<boolean>(false);
    const positionsByTime = useRef<{[key: number]: number }>({ });
    const motionUpdatesPerSecond = 60;
    const intervalSpeedInMs = 1000 / motionUpdatesPerSecond;
    const touchOffset = useRef<number>(0);
    const relevantTimeForCalculations = 300;
    const positionInterval = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (disableSwipe) {
            return;
        }
        
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

    function addPosition() {
        const currentY = getPosition();
        const timestamp = Date.now();
        
        positionsByTime.current[timestamp] = currentY;
    }

    function checkPositionCountLimit() {
        const positionCountLimit: number = 1000;
        const timestamps = Object.keys(positionsByTime.current);
        const limitExceeded: boolean = timestamps.length > positionCountLimit;

        if (limitExceeded) {
            timestamps
                .sort().slice(0, positionCountLimit / 2)
                .forEach(timestamp => {
                    delete positionsByTime.current[Number(timestamp)];
            });
        }
    }

    function initializePositionInterval() {
        positionInterval.current = setInterval(() => {
            if (!isDraggingRef.current) {
                return;
            }

            addPosition();
            checkPositionCountLimit()
        }, intervalSpeedInMs);
    }

    function onTouchStart(e: TouchEvent) {
        touchOffset.current = e.touches[0].clientY - getPosition();
        isDraggingRef.current = true;
        addPosition();
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
        addPosition();
        
        const swipeSpeed: number = calculateSwipeSpeed();
        if (swipeSpeed > closingSpeed) {
            setVisible(false);
        } else {
            toggleModal(true);
        }

        // reset y values
        positionsByTime.current = { };
    };

    function calculateSwipeSpeed(): number {
        // y values are in px
        // time values are in ms

        const times = Object.keys(positionsByTime.current).map(time => Number(time));
        
        const currentTime = times[times.length - 1];
        const currentPosition = positionsByTime.current[currentTime];

        // past position data
        const idealPastTime = currentTime - relevantTimeForCalculations;
        const pastTime = findClosestTime(times, idealPastTime);
        const pastPosition = positionsByTime.current[pastTime]

        // delta calculations
        const deltaPosition = currentPosition - pastPosition;
        const deltaTime = currentTime - pastTime;

        const swipeSpeed: number = Math.round(deltaPosition / deltaTime * 1000); // in px/s
        // console.log({deltaPosition});
        // console.log({deltaTime});
        // console.log({swipeSpeed});

        return swipeSpeed;
    }

    function findClosestTime(times: number[], idealTime: number) {
        let start = 0;
        let end = times.length - 1;
        let closest = times[0];
    
        while (start <= end) {
            let mid = Math.floor((start + end) / 2);
            closest = Math.abs(times[mid] - idealTime) < Math.abs(closest - idealTime) ? times[mid] : closest;
    
            if (times[mid] < idealTime) {
                start = mid + 1;
            } else if (times[mid] > idealTime) {
                end = mid - 1;
            } else {
                // Exact match found
                return times[mid];
            }
        }
    
        // Return the closest timestamp found
        return closest;
    }
    
    function getPosition(): number {
        const modal = modalRef.current;
        if (!modal) {
            throw Error("can't be O.o")
        }
        const modalBoundingBox = modalRef.current.getBoundingClientRect();
        const position = Math.round(modalBoundingBox.top);

        return position;
    }

    //#endregion
    
    useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
        close: () => setVisible(false),
    }));

    return (
        <div 
            className="SwipeModal"
            style={{"--animationDurationInMs": `${animationDuration}ms` } as React.CSSProperties}
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
})

export default SwipeModal;