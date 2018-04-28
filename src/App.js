import React, { Component } from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import SelectableArea from "./SelectableArea";
import SelectableComponent from './SelectableComponent';

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const selComponentStyle = {
  width: 50,
  height: 50
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startPointCoords: {},
      selectedObjects: []
    };
  }

  render() {
    return (
      <div style={{ width: 1000, height: 500 }}>
        <SelectableArea selectObjects={this.handleSelectObjects}>
          <SelectableComponent selectableId={'blue'} selectableComponentStyle={selComponentStyle}>
            <div style={{ margin: 10, background: "blue", width: 50, height: 50 }} />
          </SelectableComponent>
          <SelectableComponent selectableId={'green'} selectableComponentStyle={selComponentStyle}>
            <div style={{ margin: 10, background: "green", width: 50, height: 50 }} />
          </SelectableComponent>
          <SelectableComponent selectableId={'red'}selectableComponentStyle={selComponentStyle}>
            <div style={{ margin: 10, background: "red", width: 50, height: 50 }} />
          </SelectableComponent>
        </SelectableArea>
      </div>
    );
  }

  handleSelectObjects = (result) => this.setState({ selectedObjects: result })
}
