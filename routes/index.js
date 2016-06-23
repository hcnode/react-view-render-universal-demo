var express = require('express');
var router = express.Router();

var data = [
  {
    id : '1',
    image:'http://yanxuan.nosdn.127.net/5365bed3b153604014fc4a163db01a21.jpg?imageView&quality=95&thumbnail=265x265',
    name : '秋葵脆 70克'
  },
  {
    id : '2',
    image:'http://yanxuan.nosdn.127.net/f0bdc95782aa3113ac4d251a111d6c78.jpg?imageView&quality=95&thumbnail=265x265',
    name : '羊脂玉白紫金线茶具套装'
  },
  {
    id : '3',
    image:'http://yanxuan.nosdn.127.net/f55de145b66bb99b80090efc99f622c2.jpg?imageView&quality=95&thumbnail=265x265',
    name : '简欧新骨瓷咖啡杯'
  }
];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', {
    // 服务器端: 以下的属性均可在jsx通过this.props.xxx获取
    // 浏览器端端: data和config均可在jsx通过this.props.xxx获取
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


module.exports = router;
