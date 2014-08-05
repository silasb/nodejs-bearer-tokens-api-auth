var FlashComponent = React.createClass({
  getInitialState: function() {
    return {shown: false, message: ''}
  },
  componentWillMount: function() {
    this.setState({
      shown: this.props.shown,
      message: this.props.message,
    });
  },

  render: function() {
    return <div className={this.state.shown ? 'alert alert-danger show' : 'hide'}>{this.state.message}</div>
  }
})

module.exports = FlashComponent;
