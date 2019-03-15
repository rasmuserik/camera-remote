import { install as installStyles } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import { store } from "./state";

installStyles();

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
    setInterval(
      () =>
        node.pubsub.publish(
          "solsort-stop-motion",
          Buffer.from(`hello from ${id} ` + window.navigator.userAgent)
        ),
      5000
    );
  } catch (e) {
    console.log("ipfserr", e);
  }
});
node.on("error", error => {
  console.error("IPFS Error:", error);
});

const theme = createMuiTheme({});
function render() {
  ReactDOM.render(
    <Provider store={store}>
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
