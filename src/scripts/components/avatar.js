var React = require('react');

var Avatar = React.createClass({

  getDefaultProps: function () {
    return {
      size: 32,
      model: [0,0,0,0]
    };
  },

  render: function() {
    return (
      <img className="avatar" src={this.getImageData()} />
    );
  },

  getImageData: function () {
    var size = this.props.size;

    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    var ctx = canvas.getContext('2d');
    var imgData = ctx.createImageData(size, size);

    var originalSize = Math.floor(Math.sqrt(this.props.model.length));
    var ratio = originalSize / this.props.size;

    for (var i = 0; i < (imgData.data.length / 4); ++i) {
      var x = i % size;
      var y = Math.floor(i / size);

      var originalX = Math.floor(x * ratio);
      var originalY = Math.floor(y * ratio);

      var pixel = this.props.model[originalSize * originalY + originalX];
      var pixelVal = pixel ? 0 : 255;

      imgData.data[i * 4 + 0] = pixelVal;
      imgData.data[i * 4 + 1] = pixelVal;
      imgData.data[i * 4 + 2] = pixelVal;
      imgData.data[i * 4 + 3] = pixelVal ? 0 : 255;
    }

    ctx.putImageData(imgData, 0, 0);

    var dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

});

module.exports = Avatar;
