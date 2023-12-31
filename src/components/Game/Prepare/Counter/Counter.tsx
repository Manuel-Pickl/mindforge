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
        const secondsDecimal: number = Math.floor(remainingTime % 60 / 10);
        const secondsSingular: number = remainingTime % 10;

        const minutesString: string = minutes > 0 ? `${minutes}:` : "";
        const secondsDecimalString: string = minutes > 0 || secondsDecimal > 0 ? secondsDecimal.toString() : ""
        const secondsSingularString: string = secondsSingular.toString();

        const formattedTime: string = `${minutesString}${secondsDecimalString}${secondsSingularString}`;
    
        return formattedTime;
    }

    console.log(startTime)

    return (
    <div className="counterComponent">
        {formatTime()}
    </div>
    );
}

export default Counter;