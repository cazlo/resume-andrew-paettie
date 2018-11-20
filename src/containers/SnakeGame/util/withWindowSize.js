import React from 'react';

function withWindowSize(WrappedComponent) {
  return class WindowSizeProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        innerWidth: 800,
        innerHeight: 800,
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
        innerWidth: window.innerWidth * 0.98,
        innerHeight: window.innerHeight * 0.70,
      });
    };

    render() {
      return (
        <WrappedComponent
          ref={node => {
            this.node = node;
          }}
          key={`${this.state.innerHeight} ${this.state.innerWidth}`}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}

export default withWindowSize;
