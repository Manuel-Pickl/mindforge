import { useEffect, useRef, useState } from "react";
import "./Dial.scss";

function Dial()
    // onDialChange: (aValue: number) => void)
{
    const [value, setValue] = useState<number>(90);
    const isDraggingRef = useRef<boolean>(false);
    const dialComponentRef = useRef<HTMLDivElement | null>(null);
    const handRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    
    function handleMouseDown() {
        console.log("start")
        isDraggingRef.current = true;
    };
    
    function handleMouseUp() {
        if (!isDraggingRef.current) {
            return;
        }

        console.log("end")
        isDraggingRef.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        moveDial(e.clientX, e.clientY)
    };

    function moveDial(mouseX: number, mouseY: number) {
        if (!isDraggingRef.current
            || !dialComponentRef.current
            || !handRef.current) {
            return;
        }

        // bottom middle
        const spectrumBoundingBox = dialComponentRef.current.getBoundingClientRect();
        const dialOriginX = spectrumBoundingBox.left + spectrumBoundingBox.width / 2;
        const dialOriginY = spectrumBoundingBox.bottom - handRef.current.clientWidth / 2;
        
        // Calculate the angle based on mouse position
        const angleRadian = Math.atan2(
            dialOriginY - mouseY,
            dialOriginX - mouseX,     
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
        
        setValue(angleCorrected)
    }

    return (
        <div 
            ref={dialComponentRef}
            className="dialComponent"
            onMouseMove={handleMouseMove}
        >
            <div className="dial" />
            <div
                ref={handRef}
                className="hand"
                onMouseDown={handleMouseDown}
                style={{ transform: `rotate(${value - 90}deg)` }}
            />
            <div className="handRoot" />
        </div>
    );
}

export default Dial;