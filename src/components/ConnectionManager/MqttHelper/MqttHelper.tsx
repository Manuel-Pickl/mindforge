import { MqttClient } from "mqtt";
import { forwardRef, useImperativeHandle } from "react";
import { useAppContext } from "../../../AppContext";
import { Topic } from "../../../types/Topic";

interface MqttHelperProps {
    mqttClient: MqttClient | null;
}

function MqttHelper({
    mqttClient}: MqttHelperProps,
    ref: React.Ref<any>)
{
    // gets added to socket topic to avoid collision on the public broker
    const applicationId: string = "fU72HrJ8fjr7fJ87fjwEjmfE5HN7Fo91Kz5DT";
 
    const {
        setRoom,
    } = useAppContext();

    function publish(aTopic: Topic, aData: any = "") {
        setRoom(aRoom => {

        mqttClient?.publish(
            padTopic(aTopic, aRoom),
            JSON.stringify(aData)
        );

        return aRoom})
    }
    
    function subscribe(aTopic: Topic) {
        setRoom(aRoom => {
        
        mqttClient?.subscribe(padTopic(aTopic, aRoom));
        
        return aRoom})
    }
    
    function parseMessage(aPaddedTopic: string, aJsonData: string) {
        const topic = stripTopic(aPaddedTopic)
        const data: any = JSON.parse(aJsonData);

        return { topic, data };
    }

    function padTopic(aTopic: Topic, aRoom: string): string
    {
        const fullTopic = `${applicationId}_${aRoom}__${aTopic}`
        return fullTopic;
    }
    
    function stripTopic(aPaddedTopic: string): string {
        const strippedTopic: string = aPaddedTopic.split('__')[1];
        return strippedTopic;
    }

    // Expose methods through ref forwarding
    useImperativeHandle(ref, () => ({
        publish,
        subscribe,
        parseMessage,
    }));
  
  return null;
}

export default forwardRef(MqttHelper);
