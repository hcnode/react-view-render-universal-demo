这是一个使用react进行ui渲染实现前后端的universal/isomorphic的demo


### demo中react组件渲染的方式有三种，分别是server、client、both
#### **server**
当前mode特点:

* 不支持浏览器端事件
* 不支持生命周期
* 不支持state状态改变

缺点:

* 上面三条

优点:

* 浏览器不需要加载bundle
* stateless组件,性能更好
* 兼容所有低级浏览器,比如ie6,7,8

#### **client**
当前mode特点:

* 支持浏览器端事件
* 支持生命周期
* 支持state状态改变

优点:

* 上面三条
* 服务器端性能更好不需要渲染组件成html

缺点:

* 用户体验稍差点,需要加载bundle后才能渲染ui
* 引用polyfill后,也只能兼容最低ie8


#### **both**
当前mode特点:

* 支持浏览器端事件
* 支持生命周期
* 支持state状态改变

优点:

* 上面三条
* 服务器端渲染,浏览器端加载bundle后不会重新渲染
* 用户体验更好

缺点:

* 代码冗余,bundle里面有已经渲染过的代码
* 引用polyfill后,也只能兼容最低ie8

#### **auto** 
这个模式只是之前设想过还没有实现的第四种模式，可以通过判断组件比如是否是stateless，是否有事件，自动使用上面三种模式

	
**以下会将整个demo的实现一步步介绍给大家。**
### 首先创建express
使用express cli创建express项目模板，并添加react全家桶依赖：react、babel、webpack，并添加一个build script。

```json
{
  "name": "express-react",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "build": "webpack --progress --profile --colors --watch"
  },
  "dependencies": {
    "body-parser": "~1.12.0",
    "cookie-parser": "~1.3.4",
    "debug": "~2.1.1",
    "express": "~4.12.2",
    "express-react-views": "^0.10.2",
    "jade": "~1.9.2",
    "morgan": "~1.5.1",
    "react": "^0.14.6",
    "react-dom": "^0.14.2",
    "serve-favicon": "~2.2.0"
  },
  "devDependencies": {
    "babel": "^6.5.2",
    "babel-core": "^6.8.0",
    "babel-loader": "^6.1.0",
    "babel-polyfill": "^6.9.1",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-react": "^6.5.0",
    "babel-preset-stage-0": "^6.5.0",
    "babel-plugin-transform-es3-member-expression-literals": "^6.8.0",
    "babel-plugin-transform-es3-property-literals": "^6.8.0",
    "babel-register": "^6.8.0",
    "webpack": "^1.13.0"
  }
}
```

* [express-react-views](https://github.com/reactjs/express-react-views) 是react写的专门给express渲染jsx用的。
* 两个es3 transform 是为了兼容ie8。
* [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) 为了兼容es6 和 es5 
* 三个preset就不用介绍了，基本是标配
* react使用了0.14，是为了兼容ie8

### app.js
替换默认的jade引擎，改为react的jsx

```javascript
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({beautify : true}));
```

### webpack配置
因为项目是一个多页面的应用，所以我为了每个页面单独打包一个bundle（这里还可以优化分开react和jsx打包），webpack的entry单独写个函数来实现，为每个页面的jsx自动生成一个entry，来打包成bundle，并约定一个规范所有jsx页面组件放到views/pages下。

```javascript
function getEntry() {
	var files = fs.readdirSync(__dirname + '/views/pages');
	if (!fs.existsSync('./views/entry')) {
		fs.mkdirSync('./views/entry');
	}
	return files.reduce((entry, file) => {
		var name = file.replace(/\..+?$/, '');
		var Name = name.substring(0, 1).toUpperCase() + name.substr(1);
		entry[name] = './views/entry/' + name;
		var entryFile = __dirname + '/views/entry/' + file;
		fs.writeFileSync(entryFile, `
			const React = require('react');
			const ReactDOM = require('react-dom');
			const ${Name} = require('../pages/${name}.jsx');
			window.${Name}Comp = ReactDOM.render(<${Name}
				  data={window._react_data}
				  config={window._react_config}
			/>, document.getElementById('app'));
      	`);
		return entry;
	}, {});
}
```

### 数据规范的约定
为了前后端都可以使用统一套数据，我约定了一个规范，所有业务逻辑相关的数据放在props.data，页面配置放在props.config，路由渲染jsx最终的规范大概是这样：

```javascript
router.get('/', function(req, res, next) {
  res.render('layout', {
    // 服务器端: 以下的属性均可在jsx通过this.props.xxx获取
    // 浏览器端端: data和config可在jsx通过this.props.xxx获取
    data : { // 业务逻辑数据
      title: '首页',
      items :data
    },
    config : { // 配置
      mode : req.query.mode || 'server', // 渲染方式
      entry : 'index' // 页面jsx组件的名称,在pages下
    },
    req : req, // req对象
    res : res // res对象
  });
});
```

### 以下是layout.jsx的说明
所有的页面都是通过layout作为入口模板渲染，页面的jsx作为子组件在layout

```javascript
var {title, data, config, req} = this.props;
var Child = require('./pages/' + config.entry)
```

...

```js

<div id="app">
  {
    (config.mode == 'server' || config.mode == 'both') ? <Child {...this.props} /> : null
  }
</div>
```



**以下是根据不同的mode对页面部分内容决定是否返回对应的html**

* client和both需要将data和config是直接在html渲染出来

```js
{
 (config.mode == 'client' || config.mode == 'both') ?
      <script dangerouslySetInnerHTML={{__html : `
        var _react_data = ${JSON.stringify(data)};
        var _react_config = ${JSON.stringify(config)};
        `
      }}></script> : null
}
```
_react_data和_react_config会传到webpack里面生成的entry jsx：

```js
const React = require('react');
const ReactDOM = require('react-dom');
const Index = require('../pages/index.jsx');
window.IndexComp = ReactDOM.render(<Index
	  data={window._react_data}
	  config={window._react_config}
/>, document.getElementById('app'));      	
```

* server和both需要将页面jsx内容返回

```js

<div id="app">
  {
    (config.mode == 'server' || config.mode == 'both') ? <Child {...this.props} /> : null
  }
</div>
```

* client和both需要将bundle的script引用加上

```js
{
  (config.mode == 'client' || config.mode == 'both')
       ? <script src={'/build/' + config.entry + '.bundle.js'}></script> : null
 }
```

### 首页jsx 的说明
首页的jsx为了测试三种渲染的模式，我分别加了鼠标点击事件、组件生命周期的componentDidMount、state状态改变

```js
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
```
### demo使用
* `git clone https://github.com/hcnode/react-view-render-universal-demo`
* `cd express-react`
* `npm install`
* `npm start`
* 如果修改了jsx，需要运行`npm run build`重新build bundle，web服务可以不用重新restart，[express-react-views](https://github.com/reactjs/express-react-views)会判断当前环境是否是production，production会cache jsx，修改后需要重启web 服务

### 关于浏览器兼容
为了兼容低端浏览器，除了标准的es5 transform，我还加了babel的polyfill，可以支持比如Array.from，Array.prototype.find等方法，另外为了兼容ie8，加了另外两个transform在.babelrc，如果不考虑低端浏览器的兼容，可以去掉这两个。

如有任何建议或者好的想法，欢迎和我交流。
