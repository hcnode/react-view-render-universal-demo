var React = require('react');

var Error = React.createClass({
  render: function() {
    return <div><h3>{this.props.message}</h3>{require('util').inspect(this.props.error)}</div>;
}
});

module.exports = Error;