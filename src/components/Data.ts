import { Topic } from "./Topic";

export class PeerData {
    topic: Topic;
    data: any;

    constructor(topic: Topic, data: any) {
        this.topic = topic;
        this.data = data;    
    }
}