import nats, { Stan } from "node-nats-streaming";
class NatsWrapper {
  private _client?: Stan;
  get client() {
    if (!this._client)
      throw new Error("Please connect nats streaming before accessing client!");
    return this._client;
  }
  public async connect(): Promise<void> {
    this._client = nats.connect("nats-streaming", "1234", {
      url: "http://nats-streaming-service:4222",
    });

    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Nats Streaming connected!");
        resolve();
      });
      this._client!.on("error", (error) => {
        reject(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
