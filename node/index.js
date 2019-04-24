const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const tencentyoutuyun = require('tencentyoutuyun');
const conf  = tencentyoutuyun.conf;
const youtu = tencentyoutuyun.youtu;

let appid = '10175295';
let secretId = 'AKIDEQRIwLxFTUF5vZIlMTM53qOiuuhIM8LL';
let secretKey = 'yWknsOn7qQuFiqAIjCZoqhTDpPtBE5sV';
let userid = '1361882279';
conf.setAppInfo(appid, secretId, secretKey, userid, 0)

let mysql_user = 'music';
let mysql_pass = '8Us182KR';

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cookieParser('aaa'));
let pool = mysql.createPool({
    user: mysql_user,
    password: mysql_pass
});

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://music.hbjg1950.com');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/search', function (req, res) {
    let queryString = req.query.name;
    let searchAlbum = '';
    let searchSinger = '';
    let searchSong = '';
    let process = 0;

    let sqlAlbum = 'SELECT * FROM music.song WHERE album=?';
    pool.query(sqlAlbum, [queryString], (err, ress, filed) => {
        if (err) throw err;
        searchAlbum = ress;
        returnResult(++process);
    })

    let sqlSinger = 'SELECT * FROM music.song WHERE singer=?';
    pool.query(sqlSinger, [queryString], (err, ress, filed) => {
        if (err) throw err;
        searchSinger = ress;
        returnResult(++process);
    })

    let sqlSong = `SELECT * FROM music.song WHERE song_name LIKE "%${queryString}%"`;
    pool.query(sqlSong, (err, ress, field) => {
        if (err) throw err;
        searchSong = ress;
        returnResult(++process);
    });
    function returnResult(a){
        if (a===3){
            console.log('singer'+searchSinger);
            console.log('album'+searchAlbum);
            console.log('song'+searchSong);
            if (searchAlbum.length > 0) {
                res.send({
                    status: 0,
                    data: searchAlbum,
                    type: 'album'
                })
            } else if (searchSinger.length > 0) {
                res.send({
                    status: 0,
                    data: searchSinger,
                    type: 'singer'
                })
            } else {
                res.send({
                    status:0,
                    data: searchSong,
                    type: 'song'
                })
            }
        }
    }

})
app.get('/verifyUname',function (req, res) {
    let queryString = req.query.uname
    let sql = 'SELECT * FROM music.user WHERE uname=?';
    pool.query(sql, [queryString], (err, ress, filed) => {
        if (err) throw err;
        if (ress.length > 0) {
            res.send({
                status: 1,
                msg: '用户名已存在'
            })
        } else {
            res.send({
                status: 0,
                msg: '用户名可以使用'
            })
        }
    })
})
app.post('/reg', multer({
    //设置文件存储路径
    dest: '../music/static/upload'   //upload文件如果不存在则会自己创建一个。
}).single('file'),
    function (req, res, next) {
    let uname = req.body.uname;
    let upwd = req.body.upwd;
    let sql = 'SELECT * FROM music.user WHERE uname=?';
    pool.query(sql, [uname], (err, ress, filed) => {
        if (err) throw err;
        if (ress.length > 0) {
            res.send({
                status: 1,
                msg: '用户名已存在'
            })
        } else {
            saveAndVerify(req,res)
        }
    })
});

app.post('/faceLogin', (req, res) => {
    let uname = req.body.uname;
    let standardImg = ''
    let bitmap1 = Buffer.from(req.body.url, 'base64');//解码图片
    fs.writeFileSync('tmp/verify.jpg',bitmap1);
    let selectSql = 'SELECT reg_time FROM music.user WHERE uname=?'
    pool.query(selectSql, [uname], (err, ress, filed) => {
        if (err) throw err;
        if (ress.length > 0) {
           standardImg = ress[0].reg_time;
           let imgA = '../music/static/upload/' + standardImg + '.jpeg';
           let imgB = 'tmp/verify.jpg';
           loginCompareFace(imgA, imgB, res, uname);
        } else {
            res.send({
                status: 1,
                msg: '核验出错，请核对用户名以及密码'
            })
        }
    })
})

app.post('/passLogin',(req,res) => {
    let uname = req.body.uname;
    let pass = req.body.password;
    let verifySql = 'SELECT * FROM music.user WHERE uname=? AND upwd=?';
    pool.query(verifySql,[uname, pass], (err, ress, filed)=>{
        if (err) throw err;
        if (ress.length === 1) {
            res.cookie('user',uname,{maxAge:600000,signed:true});  //signed 表示对cookie加密
            res.cookie('img',ress[0].reg_time,{maxAge:600000,signed:false});  //signed 表示对cookie加密
            res.send({
                status: 0,
                msg: '登录成功',
                img: ress[0].reg_time
            })
        } else {
            res.send({
                status: 1,
                msg: '登录失败，请检查用户名密码'
            })
        }
    })
})

function saveAndVerify(req,res){
    console.log('获取图片中');
    let uname = req.body.uname;
    let upwd = req.body.upwd;
    let file = req.file;
    let fileInfo = {};
    let beauty = 0;
    let timeStamp = new Date().getTime();
    let newName =  '../music/static/upload/' + timeStamp +  '.' +  file.originalname.split('.')[1]
    fs.renameSync('../music/static/upload/' + file.filename, newName);//这里修改文件名字，比较随意。
    // 获取文件信息
    fileInfo.mimetype = file.mimetype;
    fileInfo.originalname = file.originalname;
    fileInfo.size = file.size;
    fileInfo.path = file.path;
    console.log('执行人脸检测中');
    youtu.detectface(newName, 1, (data)=>{
        if (data.data.errorcode === -1101 && data.httpcode === 200) {
            res.send({
                status: 1,
                msg: '未识别到人脸，请更换图片'
            })
        } else if (data.data.errorcode === 0) {
            beauty = data.data.face[0].beauty;
            insertIntoUser(uname, upwd, beauty, timeStamp, res);
        } else if (data.httpcode !== 200) {
            return {
                status: 1,
                msg: '第三方错误，请重试'
            }
        }
    })
}

function insertIntoUser(uname, upwd, beauty,timeStamp, res){
    let sql = 'INSERT INTO music.user VALUES (NULL,?,?,?)';
    pool.query(sql, [uname, upwd,timeStamp], (err, ress, filed) => {
        if (err) throw err;
        if (ress.affectedRows > 0) {
            res.send({
                status: 0,
                msg: beauty
            })
        } else {
            res.send({
                status: 1,
                msg: '数据库写入失败'
            })
        }
    })
}

function loginCompareFace(imgA, imgB, res, uname) {
    youtu.facecompare(imgA, imgB, (data) => {
        if (data.httpcode === 200) {
            if(data.data.errorcode === -1101){
                res.send({
                    status: 1,
                    msg: '未发现人脸'
                })
            } else if (data.data.errorcode !== 0) {
                res.send({
                    status: 1,
                    msg: '未知错误，错误码：' + data.data.errorcode
                })
            }else if (data.data.similarity > 90) {
               let time = (imgA.split('/')[4]).split('.')[0];
               res.cookie('user',uname,{maxAge:600000,signed:true,httpOnly: true});  //signed 表示对cookie加密
               res.cookie('img',time,{maxAge:600000,signed:false,httpOnly: false});  //signed 表示对cookie加密
               res.send({
                   status: 0,
                   msg: '验证通过',
                   img: time
               })
            } else {
               res.send({
                   status: 1,
                   msg: '验证未通过'
               })
            }
        } else {
            res.send({
                status: 1,
                msg: '第三方出错，请重试'
            })
        }
    })
}

app.listen(3000);