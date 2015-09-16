'use strict';

(function() {
  var exec = window.require('child_process').exec;
  var React = require('react');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  injectTapEventPlugin();

  var mui = require('material-ui');
  var ThemeManager = new mui.Styles.ThemeManager();
  var Colors = mui.Styles.Colors;
  var RaisedButton = mui.RaisedButton;
  var Snackbar = mui.Snackbar;
  var Dialog = mui.Dialog;

  var Loading = require('react-loading');

  var DnDInput = require('./dndinput.jsx');
  var DnDArea = require('./dndarea.jsx');

  var App = React.createClass({
    getInitialState: function() {
      return {
        snackMessage: '',
        dialogMessage: ''
      };
    },
    childContextTypes: {
      muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      };
    },
    onReceiveDrop1: function(e) {
      this.onReceiveDrop({
        target: this.refs.area1,
        path: e.path
      });
    },
    onReceiveDrop2: function(e) {
      this.onReceiveDrop({
        target: this.refs.area2,
        path: e.path
      });
    },
    onReceiveDrop: function(e) {
      var input = null;

      switch (e.target) {
      case this.refs.area1:
        input = this.refs.target1;
        break;
      case this.refs.area2:
        input = this.refs.target2;
        break;
      }

      if (input) {
        input.setPath(e.path);
      }
    },
    doClick: function() {
      var path1 = this.refs.target1.state.path;
      var path2 = this.refs.target2.state.path;

      if (0 === path1.length || 0 === path2.length) {
        this.setState({ snackMessage: '比較するファイル/フォルダを指定してください。'});
        this.refs.snakbar.show();
        return;
      }

      this.refs.loadingDlg.show();

      var self = this;
      exec('/usr/local/bin/meld ' + path1 + ' ' + path2, function(error, stdout, stderr) {
        self.refs.loadingDlg.dismiss();
        if (error !== null) {
          self.setState({ dialogMessage: error.message + '(' + error.code + ')' });
          self.refs.alertDlg.show();
        }
      });
    },
    render: function() {
      var styles = {
        app: {
          textAlign: 'center',
          margin: '0px 10px 10px 10px'
        },
        controller: {
          marginTop: '60px'
        },
        compareButton: {
          width: '90%'
        }
      };

      return (
        <div id="app-div" style={styles.app}>
          <DnDInput ref='target1' hintText='Path 1' floatingLabelText='Target 1' />
          <DnDInput ref='target2' hintText='Path 2' floatingLabelText='Target 2' />
          <DnDArea ref='area1' title="Target 1" receiveDrop={this.onReceiveDrop1}>DROP HERE!</DnDArea>
          <DnDArea ref='area2' title="Target 2" receiveDrop={this.onReceiveDrop2}>DROP HERE!</DnDArea>
          <div id="controller" style={styles.controller}>
            <RaisedButton className="compare-button"
                          backgroundColor={Colors.indigoA100}
                          style={styles.compareButton} onClick={this.doClick} label='Compare' />
          </div>
          <Snackbar ref='snakbar' message={this.state.snackMessage} />
          <Dialog ref='alertDlg' title='Meld Launcher' actions={[{ text: 'OK'}]} modal={true}>
            {this.state.dialogMessage}
          </Dialog>
          <Dialog ref="loadingDlg" title="Meld Launcher" modal={true}>
            <p>Running Meld ...</p>
            <Loading type='cubes' />
          </Dialog>
        </div>
      );
    }
  });

  React.render(
    <App />,
    document.getElementById('app')
  );
})();
