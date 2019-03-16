import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import jsQR from "jsqr";
import ReactMarkdown from "react-markdown";
import QRCode from "qrcode.react";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class App extends Component {
  state = {
    chan: window.location.hash.slice(1) || undefined,
    uiType: undefined
  };
  render() {
    const { classes } = this.props;
    const { uiType, chan } = this.state;

    if (uiType === "computer") {
      const qrUrl = window.location.href.replace(/#.*./, "") + "#" + chan;
      return (
        <div>
          <div style={{ float: "left", marginRight: 8 }}>
            <QRCode value={qrUrl} />
          </div>
          <Typography variant="h4">Connect camera</Typography>
          <Typography>
            To connect a camera, scan the QR-code, or open <br /> the following
            url on your mobile phone / device: <br /> <code>{qrUrl}</code>
            <br />
          </Typography>
        </div>
      );
    }

    return (
      <center>
        <Typography gutterBottom={true} variant="h2">
          Stop Motion
        </Typography>
        <Typography>
          Is this the UI runing on a computer/tablet or is it a
          camera/tablet/phone?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => {
            this.setState({
              uiType: "computer",
              chan:
                chan ||
                Math.random()
                  .toString(36)
                  .slice(2)
            });
          }}
        >
          Computer
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => this.setState({ uiType: "camera" })}
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
