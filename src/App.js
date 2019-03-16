import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class App extends Component {
  state = {
    uiType: undefined
  };
  render() {
    const { classes } = this.props;
    const { uiType } = this.state;
    if (!uiType) {
      return (
        <center>
          <Typography>Is this a animation UI or a Camera?</Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.setState({ uiType: "ui" })}
          >
            UI
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => this.setState({ uiType: "camera" })}
          >
            Camera
          </Button>
        </center>
      );
    }
    return <div>{uiType}</div>;
  }
}

export default withStyles(styles)(App);
