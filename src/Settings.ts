export const solutionSectorDegrees: number = 12; // only even values!

// home
export const usernameMaxLength: number = 12;
export const roomIdMaxLength: number = 4;

// lobby
export const maxPlayers: number = 8;

// prepare
export const prepareSplashscreenDuration: number = 5;
export const prepareTime: number = 300;
export const clueMaxLength: number = 30;
export const skipsPerCard: number = 1;

// play
export const gameSplashscreenDuration: number = 6;
export const userTouchDuration: number = 1;
export const gameSolutionDuration: number = 5;

// debug
export const debug: boolean = true;
export const debugRoom: string = "ZZZZ";

// website name
export const websiteUrl: string = "mindforge.netlify.app";

// broker
const debugBrokerRunning: boolean = false;

// debug
const debugProtocoll: string = "ws";
const debugAddress: string = "localhost:9001";
const debugPort: string = "9001";

// release
const releaseProtocoll: string = "wss";
const releaseAddress: string = "test.mosquitto.org";
const releasePort: string = "8081";

const protocoll: string = debugBrokerRunning ? debugProtocoll : releaseProtocoll;
const address: string = debugBrokerRunning ? debugAddress : releaseAddress;
const port: string = debugBrokerRunning ? debugPort : releasePort;
export const mqttUrl = `${protocoll}://${address}:${port}`;