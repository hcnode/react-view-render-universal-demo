var React = require('react');

var Error = React.createClass({
  render: function() {
    return <div><h3>{this.props.msg}</h3></div>;
}
});

module.exports = Error;