
			const React = require('react');
			const ReactDOM = require('react-dom');
			const Index = require('../pages/index.jsx');
			window.IndexComp = ReactDOM.render(<Index
				  data={window._react_data}
				  config={window._react_config}
			/>, document.getElementById('app'));
      	