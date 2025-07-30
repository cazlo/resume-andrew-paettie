/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Grid from './Grid';

const { DEFAULT_BOX_SIZE, DEFAULT_BOARD_SIZE } = Grid;

function withWindowSize(WrappedComponent) {
  return class WindowSizeProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        innerWidth: DEFAULT_BOARD_SIZE * DEFAULT_BOX_SIZE,
        innerHeight: DEFAULT_BOARD_SIZE * DEFAULT_BOX_SIZE,
      };
    }

    componentDidMount() {
      this.mounted = true;
      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();
    }

    componentWillUnmount() {
      this.mounted = false;
      window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
      if (!this.mounted) return;

      this.setState({
        innerWidth: Math.floor((window.innerWidth * 0.98) / DEFAULT_BOX_SIZE) * DEFAULT_BOX_SIZE,
        innerHeight: Math.floor((window.innerHeight * 0.7) / DEFAULT_BOX_SIZE) * DEFAULT_BOX_SIZE,
      });
    };

    render() {
      const { innerHeight, innerWidth } = this.state;
      return (
        <WrappedComponent
          ref={node => {
            this.node = node;
          }}
          key={`${innerHeight} ${innerWidth}`}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}

export default withWindowSize;
