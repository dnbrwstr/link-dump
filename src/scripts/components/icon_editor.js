var React = require('react');

var IconEditor = React.createClass({

  getDefaultProps: function () {
    return {
      width: 16,
      height: 16
    };
  },

  getInitialState: function () {
    var pixels = [];

    for (var i = 0; i < this.props.width * this.props.height; ++i) {
      pixels.push(0);
    }

    return {
      pixels: pixels
    };
  },

  componentDidMount: function () {
    window.addEventListener('mouseup', this.onStopPaint);

    if (this.props.onChange) {
      this.props.onChange(this.state.pixels);
    }
  },

  componentWillUnmount: function () {
    window.removeEventListener('mouseup', this.onStopPaint);
  },

  render: function() {
    var _this = this;

    var pixelStyle = {
      width: 100 / this.props.width + '%',
      height: 100 / this.props.height + '%'
    };

    return (
      <div className="icon-editor">
        <div className="icon-editor-pixel-editor">
        <div className="icon-editor-pixels">
          { this.state.pixels.map(function (pixel, i) {
            return (
              <div className={_this.getClassesForPixel(pixel)} 
                style={pixelStyle}
                onMouseDown={_this.onStartPaint.bind(_this, i)}
                onMouseOver={_this.onMouseOverPixel.bind(_this, i)}>
              </div>
            );
          }) }
        </div>
        </div>
        <div className="icon-editor-controls">
          <a onClick={this.onReset}>Reset</a>
        </div>
      </div>
    );
  },

  getClassesForPixel: function (pixel) {
    return "icon-editor-pixel" + (pixel ? ' is-filled' : '');
  },

  onMouseOverPixel: function (index) {
    if (this.state.painting) {
      var pixels = this.state.pixels;

      if (this.state.mode === 'add') {
        this.state.pixels[index] = 1;
      } else if (this.state.mode === 'subtract') {
        this.state.pixels[index] = 0;
      }

      this.setState({
        pixels: pixels
      });

      if (this.props.onChange) {
        this.props.onChange(this.state.pixels);
      }
    }
  },

  onStartPaint: function (index) {
    var pixels = this.state.pixels;
    var pixel = pixels[index];
    var mode = pixel ? 'subtract' : 'add';
    
    pixels[index] = !pixel;

    this.setState({
      pixels: pixels,
      painting: true,
      mode: mode
    });
  },

  onStopPaint: function () {
    this.setState({
      painting: false
    });
  },

  onReset: function () {
    this.setState(this.getInitialState());
  }

});

module.exports = IconEditor;
