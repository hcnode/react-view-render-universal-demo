var React = require('react');
var Mode = require('./components/mode')

var Layout = React.createClass({
  render: function() {

    var {title, data, config, req} = this.props;
    var Child = require('./pages/' + config.entry)
    // mode:'server' || 'client' || 'both'
    config.mode = config.mode || 'server';
    return <html>
      <head>
        <title>{this.props.data.title}</title>
        <script dangerouslySetInnerHTML={{__html : `
          function load(event){
            var value = (event.target || event.srcElement).value;
            var url = location.href;
            url = url.replace(/mode=.+/, 'mode=' + value);
            if(url.indexOf('mode=') == -1){
              url += (url.indexOf('?') == -1 ? '?' : '&') + 'mode=' + value;
            }
            location.href = url;
          }
          window.onload = function(){
            Array.from(document.getElementsByName('mode')).forEach(function(radio){
              if(radio.addEventListener){
                radio.addEventListener('change', load);
              }else{
                radio.attachEvent('onclick', load);
              }
            })
          }
          `
        }}></script>
        {
          (config.mode == 'client' || config.mode == 'both') ?
              <script dangerouslySetInnerHTML={{__html : `
                var _react_data = ${JSON.stringify(data)};
                var _react_config = ${JSON.stringify(config)};
                `
              }}></script> : null
        }
      </head>

      <body>
      <h2>React组件渲染方式对比&nbsp;&nbsp;<a href="https://git.hz.netease.com/zlchen/express-react" target="_blank">git repo</a></h2>
      <Mode {...this.props} />

      <h3>
        {
            config.mode == 'server' ?
              <span>
                当前mode:
                <ul>
                  <li>不支持浏览器端事件</li>
                  <li>不支持生命周期</li>
                  <li>不支持state状态改变</li>
                </ul>
                缺点:
                <ul>
                  <li>上面三条</li>
                </ul>
                优点:
                <ul>
                  <li>浏览器不需要加载bundle</li>
                  <li>stateless组件,性能更好</li>
                  <li>兼容所有低级浏览器,比如ie6,7,8</li>
                </ul>
              </span> :

            config.mode == 'client' ?
              <span>
                当前mode:
                <ul>
                  <li>支持浏览器端事件</li>
                  <li>支持生命周期</li>
                  <li>支持state状态改变</li>
                </ul>
                优点:
                <ul>
                  <li>上面三条</li>
                  <li>服务器端性能更好不需要渲染组件成html</li>
                </ul>
                缺点:
                <ul>
                  <li>用户体验稍差点,需要加载bundle后才能渲染ui</li>
                  <li>引用polyfill后,也只能兼容最低ie8</li>
                </ul>
              </span> :

              <span>
                当前mode:
                <ul>
                  <li>支持浏览器端事件</li>
                  <li>支持生命周期</li>
                  <li>支持state状态改变</li>
                </ul>
                优点:
                <ul>
                  <li>上面三条</li>
                  <li>服务器端渲染,浏览器端加载bundle后不会重新渲染</li>
                  <li>用户体验更好</li>
                </ul>
                缺点:
                <ul>
                  <li>代码冗余,bundle里面有已经渲染过的代码</li>
                  <li>引用polyfill后,也只能兼容最低ie8</li>
                </ul>
              </span>
        }
      </h3>
      <hr />
      <div id="app">
        {
          (config.mode == 'server' || config.mode == 'both') ? <Child {...this.props} /> : null
        }
      </div>
      </body>
      {
        (req.headers['user-agent'].indexOf("MSIE") > 0)
            ? <script src="/javascripts/polyfill.min.js"></script> : null
      }

      {
        (config.mode == 'client' || config.mode == 'both')
            ? <script src={'/build/' + config.entry + '.bundle.js'}></script> : null
      }
    </html>;
  }
});

module.exports = Layout;
