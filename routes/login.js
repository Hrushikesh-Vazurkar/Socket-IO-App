var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/handle-login',function(req,res,next){
    const un = req.query.username
    res.render('index',{'title':un})
})
module.exports = router;