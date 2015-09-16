'use strict';

var React = require('react');
var mui = require('material-ui');

var Colors = mui.Styles.Colors;
var Paper = mui.Paper;

var DnDArea = React.createClass({
  propTypes: {
    receiveDrop: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      hover: false
    };
  },
  doDragOver: function(e) {
    this.setState({ hover: true });
  },
  doDragLeave: function() {
    this.setState({ hover: false });
  },
  doDrop: function(e) {
    e.preventDefault();

    this.setState({ hover: false });

    if (0 < e.dataTransfer.files.length) {
      this.props.receiveDrop({
        target: e.target,
        path: e.dataTransfer.files[0].path
      });
    }
  },
  render: function() {
    var zDepth = this.state.hover ? 5 : 3;

    var styles = {
      wrap: {
        display: 'inline-block',
        width: '40%',
        height: '150px',
        margin: '20px 10px 10px 10px'
      },
      area: {
        background: Colors.orangeA200,
        height: '140px'
      },
      area_drag: {
        background: Colors.orangeA400,
        height: '140px'
      },
      title: {
        color: Colors.orangeA700,
        fontSize: '120%',
        fontWeight: 'bold'
      },
      content: {
        height: '100%',
        lineHeight: '130px',
        fontSize: '200%',
        fontWeight: 'bold'
      }
    };

    var styleArea = this.state.hover ? styles.area_drag : styles.area;

    return (
      <div style={styles.wrap}>
        <span style={styles.title}>{this.props.title}</span>
        <Paper style={styleArea}
               zDepth={zDepth}
               circle={true}
               onDragOver={this.doDragOver} onDragLeave={this.doDragLeave} onDrop={this.doDrop}>
          <p style={styles.content}>{this.props.children}</p>
        </Paper>
      </div>
    );
  }
});

module.exports = DnDArea;
