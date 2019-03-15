import { install as installStyles } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { store } from "./state";
import jsQR from "jsqr";

installStyles();

const chan =
  window.location.hash.slice(1) ||
  Math.random()
    .toString(36)
    .slice(2);
var QRCode = require("qrcode.react");
const IPFS = require("ipfs");
const node = new IPFS({
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

async function openCamera() {
  console.log("here");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    });
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.play();
    window.stream = stream;
    video.onclick = () => {
      const canvas = document.getElementById("frame");
      console.log("capture", canvas);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data, canvas.width, canvas.height);
      console.log("jsqr", code);
    };
  } catch (e) {
    console.log("video error", e);
    console.log(e);
    throw e;
  }
}

const theme = createMuiTheme({});
function render() {
  ReactDOM.render(
    <Provider store={store}>
      <button onClick={openCamera}>open camera</button>
      <QRCode value={window.location.href.replace(/#.*/, "") + "#" + chan} />
      <video id="video" width={100} />
      <canvas id="frame" />
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById("root")
  );
}
render();

if (module.hot) {
  module.hot.accept(["./App"], render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
