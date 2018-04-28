import React, { Component } from "react";
import { PropTypes } from 'prop-types';

export default class SelectableArea extends Component {
  static propTypes = {
    selectBoxBackgroundColor: PropTypes.string,
    selectBoxBorderStyle: PropTypes.string,
    selectBoxOpacity: PropTypes.number,
    selectAreaStyle: PropTypes.object,
    resultType: PropTypes.oneOf('ids', 'elements'),
    selectObjects: PropTypes.func
  }

  static defaultProps = {
    selectBoxBackgroundColor: 'rgba(55, 99, 163, 0.5)',
    selectBoxBorderStyle: '1px solid blue',
    selectBoxOpacity: 0.5,
    selectAreaStyle: {
      background: "rgba(55, 99, 163, 0.1)",
      position: "absolute",
      width: '100%',
      height: '100%'
    },
    resultType: 'ids',
    selectObjects: () => {}
  }

  constructor(props) {
    super(props);

    this.state = {
      clickPosX: null,
      clickPosY: null,
      currentAreaLeft: null,
      currentAreaTop: null,
      areaWidth: null,
      areaHeight: null
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.mouseDown = false;
  }

  componentDidMount() {
    const areaInfo = this.selArea.getBoundingClientRect();
    this.setState({
      containerOffsetLeft: areaInfo.left,
      containerOffsetTop: areaInfo.top,
      containerWidth: areaInfo.width,
      containerHeight: areaInfo.height
    });
    window.addEventListener('resize', e => {
      const areaInfo = this.selArea.getBoundingClientRect();
      this.setState({
        containerOffsetLeft: areaInfo.left,
        containerOffsetTop: areaInfo.top,
        containerWidth: areaInfo.width,
        containerHeight: areaInfo.height
      });
    })
  }

  render() {
    const { children, selectBoxBorderStyle, selectBoxBackgroundColor, selectBoxOpacity, selectAreaStyle } = this.props;
    const { currentAreaLeft, currentAreaTop, areaHeight, areaWidth, containerOffsetLeft, containerOffsetTop } = this.state;
    const selectedAreaStyle = {
      width: areaWidth,
      height: areaHeight,
      background: selectBoxBackgroundColor,
      opacity: selectBoxOpacity,
      border: selectBoxBorderStyle,
      left: currentAreaLeft - containerOffsetLeft,
      top: currentAreaTop - containerOffsetTop,
      position: "absolute",
      boxSizing: 'border-box'
    };

    return (
      <div
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        ref={selArea => (this.selArea = selArea)}
        style={selectAreaStyle}
      >
        {this.props.children}
        {currentAreaLeft && (
          <div
            style={selectedAreaStyle}
            ref={select => (this.select = select)}
          />
        )}
      </div>
    );
  }

  handleMouseDown(event) {
    event.preventDefault();
    this.setState({
      clickPosX: event.pageX,
      clickPosY: event.pageY,
    });
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseMove(event) {
    event.preventDefault();
    const { clickPosX, clickPosY, containerOffsetLeft, containerOffsetTop, containerWidth, containerHeight } = this.state;

    let currentAreaLeft = event.pageX >= clickPosX ? clickPosX : event.pageX;
    let currentAreaTop = event.pageY >= clickPosY ? clickPosY : event.pageY;

    if (currentAreaLeft < containerOffsetLeft) {
      currentAreaLeft = containerOffsetLeft
    }

    if (currentAreaTop < containerOffsetTop) {
      currentAreaTop = containerOffsetTop
    }
  
    let areaWidth = clickPosX !== currentAreaLeft ? Math.abs(currentAreaLeft - clickPosX) : Math.abs(event.pageX - clickPosX);
    let areaHeight = clickPosY !== currentAreaTop ? Math.abs(currentAreaTop - clickPosY) : Math.abs(event.pageY - clickPosY);

    if (currentAreaLeft + areaWidth > containerOffsetLeft + containerWidth) {
      areaWidth = containerOffsetLeft + containerWidth - currentAreaLeft;
    }

    if (currentAreaTop + areaHeight > containerOffsetTop + containerHeight) {
      areaHeight = containerOffsetTop + containerHeight - currentAreaTop;
    }

    this.setState(state => ({
      currentAreaLeft,
      currentAreaTop,
      areaWidth,
      areaHeight
    }));
  }

  isIntersection = ({left: left1, top: top1, right: right1, bottom: bottom1}, {left: left2, top: top2, right: right2, bottom: bottom2}) => {
    return !(
      top1 > bottom2 ||
      right1 < left2 ||
      bottom1 < top2 ||
      left1 > right2
    );
  }

  handleMouseUp(event) {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    event.preventDefault();
    event.stopPropagation();
    const elements = [...this.selArea.querySelectorAll('[id^="react-selectaria"]')];
    const { currentAreaLeft, currentAreaTop, areaWidth, areaHeight } = this.state;
    let result = [];
    for (let element of elements) {
      const elementCoords = element.getBoundingClientRect();

      if (this.isIntersection({
        left: currentAreaLeft,
        top: currentAreaTop,
        right: currentAreaLeft + areaWidth,
        bottom: currentAreaTop + areaHeight
      }, elementCoords)) {
        result.push(element); 
      }

    }

    if (this.props.resultType === 'ids') {
      result = result.map(element =>  element.id.split('react-selectaria-')[1])
    }
    
    this.props.selectObjects(result)
    this.setState({
      clickPosX: null,
      clickPosY: null,
      currentAreaLeft: null,
      currentAreaTop: null,
      areaWidth: null,
      areaHeight: null
    });
  }
}
