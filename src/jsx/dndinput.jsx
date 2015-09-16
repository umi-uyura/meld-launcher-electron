'use strict';

var React = require('react');
var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var TextField = mui.TextField;

var DnDInput = React.createClass({
  getInitialState: function() {
    return {
      hover: false,
      path: ''
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

    if (0 < e.dataTransfer.files.length) {
      this.setState({ path: e.dataTransfer.files[0].path });
    }
  },
  setPath: function(path) {
    this.setState({ path: path });
  },
  render: function() {
    var styles = {
      textField: {
        width: '90%'
      },
      floatingLabel: {
        color: Colors.orangeA700
      },
      underline: {
        borderColor: Colors.orangeA200
      },
      underlineFocused: {
        borderColor: Colors.orangeA700
      }
    };

    return (
      <TextField style={styles.textField}
                 hintText={this.props.hintText}
                 floatingLabelText={this.props.floatingLabelText}
                 floatingLabelStyle={styles.floatingLabel}
                 underlineStyle={styles.underline}
                 underlineFocusStyle={styles.underlineFocused}
                 value={this.state.path}
                 onDragOver={this.doDragOver} onDragLeave={this.doDragLeave} onDrop={this.doDrop} readOnly />
    );
  }
});

module.exports = DnDInput;
