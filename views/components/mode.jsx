var React = require('react');

var Mode = React.createClass({
	getInitialState : function() {
		return {mode : this.props.config.mode};
	},
	render: function() {
		return <div>
			<input type="radio" name="mode" value="server"
				   checked={this.state.mode == 'server'} />&nbsp;server&nbsp;&nbsp;
			<input type="radio" name="mode" value="client"
				   checked={this.state.mode == 'client'} />&nbsp;client&nbsp;&nbsp;
			<input type="radio" name="mode" value="both"
				   checked={this.state.mode == 'both'} />&nbsp;both&nbsp;&nbsp;
		</div>;
	}
});

module.exports = Mode;
