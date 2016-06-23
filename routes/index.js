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
    data : {
      title: '首页',
      items :data
    },
    config : {
      mode : req.query.mode || 'server',
      entry : 'index'
    },
    req : req,
    res : res
  });
});


module.exports = router;
