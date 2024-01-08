import { ReactNode } from "react";
import "./Scroll.scss";

interface ScrollProps {
    children: ReactNode;
    disabled?: boolean;
    highlighted?: boolean;
    onClick?: any;
    paperColor?: string;
    scrollColor?: string;
}

function Scroll({
    children,
    disabled = false,
    highlighted = false,
    onClick = () => {},
    paperColor = "#fcfce1",
    scrollColor = "hsl(0, 0%, 60%)",
}: ScrollProps) {
    return (
        <div 
            className="scrollComponent"
            data-disabled={disabled}
            data-highlighted={highlighted}
            onClick={() => {if (!disabled) onClick()}}
            style={{
                "--paper-color": paperColor,
                "--scroll-color": scrollColor
            } as React.CSSProperties}
        >
            <div className="rod left">
                <div className="rodEnd top-outer" />
                <div className="rodBody" />
                <div className="rodEnd bottom-outer" />
            </div>

            {children}

            <div className="rod right">
                <div className="rodEnd top-outer" />
                <div className="rodBody" />
                <div className="rodEnd bottom-outer" />
            </div>

            <div className="disabled" />
        </div>
    );
}

export default Scroll;