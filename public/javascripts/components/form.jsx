// Taken from here:
// http://clozeit.wordpress.com/2014/01/13/bootstrap-forms-using-react-js/
var Form = React.createClass({
  onSubmit: function(e) {
    e.preventDefault();
    // if (e.target.type == 'submit')
      // this.props.cal
  },

  render: function() {
    return this.transferPropsTo(
      <form onClick={this.onSubmit} action="#" className="form">
        {this.props.children}
      </form>
    )
  }
})

module.exports = Form;
