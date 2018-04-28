import React, { Component } from "react";
import { PropTypes } from 'prop-types';

export default class SelectableComponent extends Component {

    static defaultProps = {
        selectableId: 'noId',
        selectableComponentStyle: {}
    }
    
    render() {
        return <div id={`react-selectaria-${this.props.selectableId}`} style={this.props.selectableComponentStyle}> {this.props.children} </div>
    }
}