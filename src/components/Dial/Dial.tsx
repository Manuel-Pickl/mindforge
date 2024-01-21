import "./Dial.scss";
import { ReactNode, useEffect, useRef } from "react";
import { debugLog } from "../../services/Logger";
import { solutionSectorDegrees, userTouchDuration } from "../../Settings";
import { Sector } from "../../types/enums/Sector";
import { getHitSector } from "../../services/ResultManager";
import AvatarBubble from "../AvatarBubble/AvatarBubble";
import { useAppContext } from "../AppContext";
import { UserTouch } from "../../types/class/UserTouch";
import { DialContext } from "./DialContext";

interface DialProps {
    hideHand: boolean;
    solutionVisible: boolean;
    solution: number;
    onDialChange?: (value: number, x: number, y: number) => void;
    dial?: number;
    scale: [string, string];
}

export const DialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const touchTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

    function showUserTouch(aUserTouch: UserTouch) {
        if (aUserTouch.username == "" || aUserTouch.x == -1 || aUserTouch.y == -1) {
            return;
        }

        const userTouchElement = document.getElementById(`touch-${aUserTouch.username}`);
        if (!userTouchElement) {
            return;
        }

        userTouchElement.style.left = `${aUserTouch.x}%`;
        userTouchElement.style.top = `${aUserTouch.y}%`;

         // Clear any existing timeout for this user
         if (touchTimeouts.current[aUserTouch.username]) {
            clearTimeout(touchTimeouts.current[aUserTouch.username]);
        }

        // Set a new timeout
        userTouchElement.style.opacity = "100%";
        const timeout = setTimeout(() => {
            userTouchElement.style.opacity = "0%";
        }, userTouchDuration * 1000);

        touchTimeouts.current[aUserTouch.username] = timeout;
    }

    return (<DialContext.Provider value={{ showUserTouch }}>{children}</DialContext.Provider>);
};

function Dial({
    hideHand,
    solutionVisible,
    solution,
    onDialChange,
    dial,
    scale,
}: DialProps) {
    const isDraggingRef = useRef<boolean>(false);
    const dialComponentRef = useRef<HTMLDivElement | null>(null);
    const handRef = useRef<HTMLDivElement | null>(null);
    
    const {
        players,
    } = useAppContext();

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleMouseUp);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, []);
    
    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        debugLog("dial move start")
        isDraggingRef.current = true;
        moveDial(e.clientX, e.clientY);
    };
    
    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        debugLog("dial move start")
        isDraggingRef.current = true;
        moveDial(e.touches[0].clientX, e.touches[0].clientY);
    };
    
    function handleMouseUp() {
        if (!isDraggingRef.current) {
            return;
        }

        debugLog("dial move end")
        isDraggingRef.current = false;
    };

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        moveDial(e.clientX, e.clientY)
    };

    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>){
        moveDial(e.touches[0].clientX, e.touches[0].clientY);
    };

    function moveDial(mouseX: number, mouseY: number) {
        if (!isDraggingRef.current
            || !dialComponentRef.current
            || !handRef.current) {
            return;
        }

        // bottom middle
        const dialBoundingBox = dialComponentRef.current.getBoundingClientRect();
        const dialCenterX = dialBoundingBox.left + dialBoundingBox.width / 2;
        const dialCenterY = dialBoundingBox.bottom - dialBoundingBox.height / 2 - handRef.current.clientWidth / 2;
        
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
        
        // calculate relative mouse position in percentage
        var relativeX: number = Math.round(((mouseX - dialBoundingBox.left) / dialBoundingBox.width) * 100);
        var relativeY: number = Math.round(((mouseY - dialBoundingBox.top) / dialBoundingBox.height * 2) * 100);
        
        // keep values inside percentage range
        if (relativeX < 0) relativeX = 0;
        if (relativeX > 100) relativeX = 100;
        if (relativeY < 0) relativeY = 0;
        if (relativeY > 100) relativeY = 100;

        onDialChange?.(angleCorrected, relativeX, relativeY);
    }

    function isSectorActive(aSector: Sector): boolean {
        if (!solutionVisible) {
            return false;
        }

        if (hideHand) {
            return false;
        }

        const hitSector: Sector = getHitSector(dial ?? 0, solution);
        const sectorIsActive: boolean = aSector == hitSector;
        return sectorIsActive;
    }

    function getStatusClass(aSector: Sector): string {
        const statusClass: string = isSectorActive(aSector)
            ? " enabled" : "";
        
        return statusClass;
    }

    return (
        <div 
            ref={dialComponentRef}
            className="dialComponent"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className="dial">
                <div className="dialBackground" />
                
                {players.map((player) => (
                    <div
                        key={player.username}
                        id={`touch-${player.username}`}
                        className="avatarWrapper"
                    >
                        <AvatarBubble
                            avatar={player.avatar}
                            username={player.username}
                        />
                    </div>
                ))}

                {solutionVisible &&
                <div 
                    className="solution"
                    style={{
                        "--angle": `${solution}deg`,
                        "--widthInDegrees": `${solutionSectorDegrees}deg`
                    } as React.CSSProperties}
                >
                    <div className={"sector points1 points1-left" + getStatusClass(Sector.OnePointLeft)}>
                        <span>1</span>
                    </div>
                    <div className={"sector points2 points2-left" + getStatusClass(Sector.TwoPointsLeft)}>
                        <span>2</span>
                    </div>
                    <div className={"sector points3" + getStatusClass(Sector.ThreePoints)}>
                        <span>3</span>
                    </div>
                    <div className={"sector points2 points2-right" + getStatusClass(Sector.TwoPointsRight)}>
                        <span>2</span>
                    </div>
                    <div className={"sector points1 points1-right" + getStatusClass(Sector.OnePointRight)}>
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
                    style={{ transform: `rotate(${(dial ?? 0) - 90}deg)` }}
                />
                <div className="handRoot" />
            </> 
            }

            <div className="scales outline">
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