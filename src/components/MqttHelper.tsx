import { MqttClient } from "mqtt";
import { Topic } from "../types/Topic";
import { forwardRef, useImperativeHandle } from "react";

interface MqttHelperProps {
    mqttClient: MqttClient | null;
}

function MqttHelper({
    mqttClient}: MqttHelperProps,
    ref: React.Ref<any>)
{
    // gets added to socket topic to avoid collision on the public broker
    const applicationId: string = "fU72HrJ8fjr7fJ87fjwEjmfE5HN7Fo91Kz5DT";
 
    function publish(aTopic: Topic, aData: any = "") {
        mqttClient?.publish(
            padTopic(aTopic),
            JSON.stringify(aData)
        );
    }
    
    function subscribe(aTopic: Topic) {
        mqttClient?.subscribe(padTopic(aTopic));
    }
    
    function parseMessage(aPaddedTopic: string, aJsonData: string) {
        const topic = stripTopic(aPaddedTopic)
        const data: any = JSON.parse(aJsonData);

        return { topic, data };
    }

    function padTopic(aTopic: Topic): string {
        const fullTopic = `${applicationId}/${aTopic}`
        return fullTopic;
    }
    
    function stripTopic(aPaddedTopic: string): string {
        const strippedTopic: string = aPaddedTopic.split('/')[1];
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
