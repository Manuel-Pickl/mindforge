// MqttHelper.ts
import { MqttClient } from "mqtt";
import { Topic } from "../types/Topic";
import { MutableRefObject } from "react";

// gets added to socket topic to avoid collision on the public broker
const applicationId: string = "fU72HrJ8fjr7fJ87fjwEjmfE5HN7Fo91Kz5DT";

export function useMqttHelper(mqttClientRef: MutableRefObject<MqttClient | null>) {
    function publish(aTopic: Topic, aData: any = "") {
        mqttClientRef.current?.publish(
            padTopic(aTopic),
            JSON.stringify(aData)
        );
    }
    
    function subscribe(aTopic: Topic) {
        mqttClientRef.current?.subscribe(padTopic(aTopic));
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

    return {
        publish,
        subscribe,
        parseMessage,
      };
}