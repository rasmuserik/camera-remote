import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import jsQR from "jsqr";
import ReactMarkdown from "react-markdown";
import QRCode from "qrcode.react";
import { node } from "./ipfs";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function decode(bytes) {
  try {
    return JSON.parse(new TextDecoder("utf-8").decode(bytes));
  } catch (e) {
    return undefined;
  }
}
function encode(data) {
  return Buffer.from(JSON.stringify(data));
}

class App extends Component {
  state = {
    chan: window.location.hash.slice(1) || undefined,
    uiType: undefined,
    msgs: []
  };
  async startComputer() {
    let { chan, msgs } = this.state;
    this.setState({ uiType: "computer" });

    if (!chan) {
      chan = Math.random()
        .toString(36)
        .slice(2);
      this.setState({ chan });
    }

    await node.pubsub.subscribe("solsort-stop-motion-" + chan, msg => {
      const data = decode(msg.data);
      console.log("solsort-stop-motion-" + chan, "data", data, msg);
      if (data) {
        this.setState({ msgs: [data].concat(msgs) });
      }
    });
    console.log("solsort-stop-motion-" + chan);
    setInterval(
      () =>
        node.pubsub.publish(
          "solsort-stop-motion-" + chan,
          encode({
            ua: window.navigator.userAgent,
            chan,
            time: new Date().toISOString()
          })
        ),
      5000
    );
  }

  async startCamera() {
    try {
      let { chan } = this.state;
      this.setState({ uiType: "camera" });
      await sleep(300);

      // setup camera
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      });
      const video = document.getElementById("cameraPreview");
      video.srcObject = stream;
      video.play();
      window.stream = stream;
      video.onclick = () => {
        const canvas = document.getElementById("capturedFrame");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(data, canvas.width, canvas.height);
        console.log("jsqr", code);
      };

      // setup ipfs
      console.log("solsort-stop-motion-" + chan);
      node.pubsub.publish(
        "solsort-stop-motion-" + chan,
        encode({ hello: 123 })
      );

      await node.pubsub.subscribe("solsort-stop-motion", msg =>
        console.log("pubsub", new TextDecoder("utf-8").decode(msg.data))
      );
      node.pubsub.publish(
        "solsort-stop-motion",
        Buffer.from(`camera from ${chan} ` + window.navigator.userAgent)
      );
    } catch (e) {
      console.log("startCamera error", e);
      throw e;
    }
  }
  renderComputer() {
    const { classes } = this.props;
    const { chan, msgs } = this.state;
    const qrUrl = window.location.href.replace(/#.*./, "") + "#" + chan;
    return (
      <div>
        <center>
          <br />
          <div
            style={{ display: "inline-block", width: 520, textAlign: "left" }}
          >
            <div style={{ float: "right", marginLeft: 8 }}>
              <QRCode value={qrUrl} />
            </div>
            <Typography variant="h3" gutterBottom={true}>
              Connect camera
            </Typography>
            <Typography>
              To connect a camera, open the web-app, scan the QR-code, or open
              the following url on your mobile phone / device: <br />{" "}
              <code>{qrUrl}</code>
              <br />
            </Typography>
          </div>
        </center>
        <pre>{JSON.stringify(msgs, null, 4)}</pre>
      </div>
    );
  }
  renderCamera() {
    const { classes } = this.props;
    const { chan } = this.state;
    return (
      <center>
        {!chan && (
          <div
            style={{
              position: "fixed",
              left: "50%",
              width: 320,
              marginLeft: -160,
              top: 50,
              display: "inline-block",
              textShadow: "1px 1px 4px white"
            }}
          >
            <Typography variant="h4" gutterBottom={true}>
              Point the camera to the QR-code on the computer to connect.
            </Typography>
          </div>
        )}
        <video
          style={{ maxWidth: window.innerWidth, maxHeight: window.innerHeight }}
          id="cameraPreview"
        />{" "}
        <br />
        <canvas id="capturedFrame" />
      </center>
    );
  }
  render() {
    const { uiType } = this.state;
    const { classes } = this.props;

    if (uiType === "computer") {
      return this.renderComputer();
    }
    if (uiType === "camera") {
      return this.renderCamera();
    }

    return (
      <center>
        <Typography gutterBottom={true} variant="h2">
          Stop Motion
        </Typography>
        <Typography>
          Is this the UI on a computer/tablet or is it a camera/tablet/phone?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => this.startComputer()}
        >
          Computer
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => this.startCamera()}
        >
          Camera
        </Button>
        <Typography component="div">
          <div style={{ textAlign: "left", maxWidth: "60ex" }}>
            <ReactMarkdown
              source={`

### About


This is a simple tool for making stop motion animations, with a UI running on a computer/tablet while using a mobile phone or similar as a remote controlled camera. 


            `}
            />
          </div>
        </Typography>
      </center>
    );
  }
}

export default withStyles(styles)(App);

/*
export const chan =
  window.location.hash.slice(1) ||
  Math.random()
    .toString(36)
    .slice(2);
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
      <button onClick={openCamera}>open camera</button>
      <video id="video" width={100} />
      <canvas id="frame" />
      */
