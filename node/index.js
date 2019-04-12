const express = require('express');
let app = express();

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', 'true')
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
    // res.header('Access-Control-Allow-Methods', '*');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/search', function (req, res) {
    console.log(req.query.name);
    res.send({
        name: '平凡之路',
        singer: '朴树',
        album: '猎户星座',
        time: '04:02',
        src: '/static/music/aaa.flac'
    });
})

app.listen(3000);