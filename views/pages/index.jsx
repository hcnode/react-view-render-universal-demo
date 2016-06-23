var React = require('react');

var Index = React.createClass({
	getInitialState : function() {
		return {showTips : false}
	},
	componentDidMount : function () {
		this.setState({showTips : true})
	},
	buy : function () {
		alert('button click.')
	},
	render: function() {
		var {items} = this.props.data;
		return <div>
			{
				this.state.showTips
					? <span style={{color:'red'}}>this is shown in life circle "componentDidMount"</span> : null
			}
			<h2>新品首发</h2>
			{
				items.map(item => <div>
					<a href={'/detail?id=' + item.id}><img src={item.image} />{item.name}</a>
					<button onClick={this.buy}>购买</button>
				</div>)
			}
		</div>;
	}
});

module.exports = Index;
