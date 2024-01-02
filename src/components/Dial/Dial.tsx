import { useEffect, useRef } from "react";
import "./Dial.scss";
import { debugLog } from "../../services/Logger";

interface DialProps {
    hideHand: boolean;
    showSolution: boolean;
    solution: number;
    onDialChange?: (value: number) => void;
    dial?: number;
    scale: [string, string];
}
  
function Dial({
    hideHand,
    showSolution,
    solution,
    onDialChange,
    dial,
    scale }: DialProps)
{
    const isDraggingRef = useRef<boolean>(false);
    const dialComponentRef = useRef<HTMLDivElement | null>(null);
    const handRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleMouseUp);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, []);
    
    function handleMouseDown() {
        debugLog("dial move start")
        isDraggingRef.current = true;
    };
    
    function handleMouseUp() {
        if (!isDraggingRef.current) {
            return;
        }

        debugLog("dial move end")
        isDraggingRef.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        moveDial(e.clientX, e.clientY)
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        moveDial(e.touches[0].clientX, e.touches[0].clientY);
    };

    function moveDial(mouseX: number, mouseY: number) {
        if (!isDraggingRef.current
            || !dialComponentRef.current
            || !handRef.current) {
            return;
        }

        // bottom middle
        const spectrumBoundingBox = dialComponentRef.current.getBoundingClientRect();
        const dialCenterX = spectrumBoundingBox.left + spectrumBoundingBox.width / 2;
        const dialCenterY = spectrumBoundingBox.bottom - spectrumBoundingBox.height / 2 - handRef.current.clientWidth / 2;
        
        // Calculate the angle based on mouse position
        const angleRadian = Math.atan2(
            dialCenterY - mouseY,
            dialCenterX - mouseX,     
        );
        const angle = (angleRadian * 180) / Math.PI;
        const angleRounded = Math.round(angle);

        // correct angle if user is under dial
        let angleCorrected: number = angleRounded;
        if (angleCorrected < 0 && angleCorrected > -90) {
            angleCorrected = 0;
        } 
        else if (angleCorrected < 0) {
            angleCorrected = 180;
        }
        
        onDialChange?.(angleCorrected);
    }

    return (
        <div 
            ref={dialComponentRef}
            className="dialComponent"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            <div className="dial">
                <div className="dialBackground" />
                
                {showSolution &&
                <div 
                    className="solution"
                    style={{ '--angle': `${solution}deg` } as React.CSSProperties}
                >
                    <div className="sector points1 points1-left">
                        <span>1</span>
                    </div>
                    <div className="sector points2 points2-left active">
                        <span>2</span>
                    </div>
                    <div className="sector points3">
                        <span>3</span>
                    </div>
                    <div className="sector points2 points2-right">
                        <span>2</span>
                    </div>
                    <div className="sector points1 points1-right">
                        <span>1</span>
                    </div>
                </div>
                }
            </div>
            
            {!hideHand &&
            <>
                <div
                    ref={handRef}
                    className="hand"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    style={{ transform: `rotate(${(dial ?? 0) - 90}deg)` }}
                />
                <div className="handRoot" />
            </> 
            }

            <div className="scales">
                <div className="scale">
                    <span>{"<---"}</span>
                    <span>{scale ? scale[0] : ""}</span>
                </div>
                <div className="scale">
                    <span>{"--->"}</span>
                    <span>{scale ? scale[1] : ""}</span>
                </div>
            </div>
        </div>
    );
}

export default Dial;