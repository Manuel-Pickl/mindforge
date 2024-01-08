import { ReactNode } from "react";
import "./Card.scss";

interface CardProps {
    children: ReactNode;
}

function Card({
    children 
}: CardProps) {
    return (
        <div className="cardComponent">
            {children}
        </div>
    );
}

export default Card;