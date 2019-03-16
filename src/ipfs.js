const IPFS = require("ipfs");
export const node = new IPFS({
  EXPERIMENTAL: { pubsub: true, dht: true },
  config: {
    Addresses: {
      Swarm: [
        "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
      ]
    }
  }
});
const id = Math.random()
  .toString(36)
  .slice(2);
window.ipfs = node;
node.on("ready", async () => {
  try {
    console.log("IPFS READY");
    await node.pubsub.subscribe("solsort-stop-motion", msg =>
      console.log("pubsub", new TextDecoder("utf-8").decode(msg.data))
    );
    node.pubsub.publish(
      "solsort-stop-motion",
      Buffer.from(`hello from ${id} ` + window.navigator.userAgent)
    );
  } catch (e) {
    console.log("ipfserr", e);
  }
});
node.on("error", error => {
  console.error("IPFS Error:", error);
});