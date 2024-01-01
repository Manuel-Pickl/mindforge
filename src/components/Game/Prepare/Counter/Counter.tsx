import "./Counter.scss";

interface CounterProps {
    startTime: number;
    remainingTime: number;
}
  
function Counter({
    startTime,
    remainingTime }: CounterProps)
{
    function formatTime(): string {
        const minutes: number = Math.floor(remainingTime / 60);
        const seconds: number = remainingTime % 60;

        const minutesString: string = minutes > 0 ? `${minutes}:` : "";
        const secondsString: string = seconds < 10 && minutes > 0 ? `0${seconds}` : seconds.toString();

        const formattedTime: string = `${minutesString}${secondsString}`;
    
        return formattedTime;
    }

    return (
    <div
        className="counterComponent"
        style={{ '--startTime': startTime } as React.CSSProperties}
    >
        {formatTime()}
    </div>
    );
}

export default Counter;