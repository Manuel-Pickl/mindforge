import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./SwipeModal.scss";

interface SwipeModalProps {
    animationDuration?: number;
    backdropOpacity?: number;
    barColor?: string;
    closeTrigger?: "swipe"|"height";
    closeTriggerPercentage?: number;
    closeTriggerSpeed?: number;
    disableSwipe?: boolean;
    modalColor?: string;
    hideBar?: boolean;
    swipeOnlyFromBar?: boolean;
    // additonal styling
    backdropStyle?: React.CSSProperties;
    barStyle?: React.CSSProperties; 
    modalStyle?: React.CSSProperties;

    children: React.ReactNode;
}

export interface SwipeModalRef {
    show: () => void;
    close: () => void;
}

const SwipeModal = forwardRef<SwipeModalRef, SwipeModalProps>(({
    animationDuration = 350, // ms
    backdropOpacity = 0.3,
    barColor = "dimgrey",
    closeTrigger = "swipe",
    closeTriggerPercentage = 50, // in %
    closeTriggerSpeed = 500, // px/s
    disableSwipe = false,
    modalColor = "hsl(0, 0%, 10%)", // bright black
    hideBar = false,
    swipeOnlyFromBar = false,
    // additonal styling
    backdropStyle,
    barStyle,
    modalStyle,
    
    children,
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
            backdrop.style.opacity = backdropOpacity.toString();   
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

    const barRef = useRef<HTMLDivElement>(null)
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
        const bar = barRef.current;
        const element = swipeOnlyFromBar ? bar : modal;
        if (!modal || !element) {
            return;
        }

        resetPositionRef.current = document.documentElement.clientHeight - modal.getBoundingClientRect().height

        element.addEventListener('touchstart', onTouchStart);
        element.addEventListener('touchmove', onTouchMove);
        element.addEventListener('touchend', onTouchEnd);

        return () => {
            element.removeEventListener('touchstart', onTouchStart);
            element.removeEventListener('touchmove', onTouchMove);
            element.removeEventListener('touchend', onTouchEnd);
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
        
        var closeModal: boolean = false;
        switch (closeTrigger) {
            case "swipe":
                closeModal = closeOnSwipe();    
                break;
        
            case "height":
                closeModal = closeOnHeight();
                break;

            default:
                throw Error(`unknown closeTrigger '${closeTrigger}'`);
        }

        if (closeModal) {
            setVisible(false);
        } else {
            toggleModal(true);
        }

        // reset y values
        positionsByTime.current = { };
    };

    function closeOnSwipe(): boolean {
        const swipeSpeed: number = calculateSwipeSpeed();
        const closeModal = swipeSpeed > closeTriggerSpeed;

        return closeModal;
    }

    function closeOnHeight(): boolean {
        if (!modalRef.current) {
            return false;
        }

        const modalBoundingBox = modalRef.current.getBoundingClientRect();
        const openValue = document.documentElement.clientHeight - modalBoundingBox.top;
        const openPercentage = openValue / modalBoundingBox.height * 100;
        const closeModal = openPercentage < closeTriggerPercentage;

        return closeModal;
    }
    
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
            style={{
                "--animationDurationInMs": `${animationDuration}ms`,
                "--backdropOpacity": backdropOpacity,
                "--barColor": barColor,
                "--modalColor": modalColor,
            } as React.CSSProperties}
        >
            <div
                ref={backdropRef}
                className="backdrop"
                onClick={() => setVisible(false)}
                style={backdropStyle}
            />
            
            <div
                ref={modalRef} 
                className="modal"
                style={modalStyle}
            >
                {!hideBar &&
                    <div
                        ref={barRef} 
                        className="bar-touchzone"
                        >
                        <div 
                            className="bar"
                            style={barStyle}
                        />
                    </div>
                }

                {children}
            </div>
        </div>
    );
})

export default SwipeModal;