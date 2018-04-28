import React, { Component } from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import App from "./App";
import SelectableArea from "./SelectableArea";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

export default class Main extends Component {
  state = {
    startPointCoords: {},
    selectedObjects: [1, 2, 3]
  };

  render() {
    return <App />;
  }
}

render(<Main />, document.getElementById("root"));
