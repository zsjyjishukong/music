const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const conn = require('./conn')
const session = require('express-session')

const tencentyoutuyun = require('tencentyoutuyun');
const conf  = tencentyoutuyun.conf;
const youtu = tencentyoutuyun.youtu;

const albumPath = '../music/static/album/';
const uploadPath = '../music/static/upload/';
const youtuConfig = require('./youtuConfig');

let appid = youtuConfig.appid;
let secretId = youtuConfig.secretId;
let secretKey = youtuConfig.secretKey;
let userid = youtuConfig.userid;

conf.setAppInfo(appid, secretId, secretKey, userid, 0)

let mysql_user = conn.user;
let mysql_pass = conn.pass;
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}));
let pool = mysql.createPool({
    user: mysql_user,
    password: mysql_pass
});
app.use(session({
    secret: 'aaa', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 30}, // 过期时间（毫秒）
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: false
}));

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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
           let imgA = uploadPath + standardImg + '.jpeg';
           let imgB = 'tmp/verify.jpg';
           loginCompareFace(imgA, imgB, res, uname, req);
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
            req.session.sign = true;
            req.session.uname = uname;
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

app.post('/adminLogin',(req, res) => {
    let selectSql = 'SELECT * FROM music.admin WHERE admin_name=? AND admin_pass=?';
    let aname = req.body.aname;
    let apass = req.body.apass;
    pool.query(selectSql, [aname, apass], (err, ress, field) => {
        if (err) throw err;
        if (ress.length === 1) {
            req.session.sign = true;
            req.session.aname = aname;
            res.send({
                status: 0,
                msg: '登录成功'
            })
        } else {
            res.send({
                status: 1,
                msg: '用户名密码错误'
            })
        }
    })
})

app.get('/selectAlbum',(req,res) => {
    if (req.session.sign !== true) {
        res.send({
            status: 2,
            msg: '未登录，没有权限'
        })
        return false;
    }
    let selectSql = 'SELECT * FROM music.album'
    pool.query(selectSql, (err, ress, field) => {
        if (err) throw err;
        let data = []
        for (let i of ress) {
            let tmp = {};
            tmp.albumName = i.album_name;
            tmp.singer = i.singer;
            tmp.time = i.time;
            tmp.company = i.company;
            tmp.description = i.album_description;
            tmp.img = i.img;
            tmp.ID = i.id
            data.push(tmp);
        }
        res.send({
            status: 0,
            data: data
        })
    })
})

app.post('/addAlbum', multer({
    //设置文件存储路径
    dest: '../music/static/album'
}).single('file'),
    (req, res, next) => {
    if (req.session.sign !== true) {
        res.send({
            status: 2,
            msg: '未登录，没有权限'
        })
        return false;
    }
    let file = req.file;
    let fileInfo = {};
    let timeStamp = new Date().getTime();
    let newName =  albumPath + timeStamp +  '.' +  file.originalname.split('.')[1];
    fs.renameSync(albumPath + file.filename, newName);
    // 获取文件信息
    fileInfo.mimetype = file.mimetype;
    fileInfo.originalname = file.originalname;
    fileInfo.size = file.size;
    fileInfo.path = file.path;
    let albumName = req.body.albumName;
    let company = req.body.company;
    let description = req.body.description;
    let singer = req.body.singer;
    let time = req.body.time;
    let selectAlbumSql = 'SELECT id FROM music.album WHERE album_name=? AND singer=?';
    pool.query(selectAlbumSql, [albumName, singer], (err, ress, field) => {
        if (ress.length > 0) {
            res.send({
                status: 1,
                msg: '该专辑已经存在，请勿重复添加'
            })
        } else {
            addAlbum()
        }
    })
    function addAlbum() {
        let insertAlbumSql = 'INSERT INTO music.album(album_name,singer,time,company,album_description,img,id) VALUES (?,?,?,?,?,?,NULL)';
        pool.query(insertAlbumSql, [albumName, singer, time, company, description, timeStamp], (err, ress, field) => {
            if (err) throw err;
            if (ress.affectedRows === 1) {
                res.send({
                    status: 0,
                    msg: '添加成功'
                })
            } else {
                res.send({
                    status: 1,
                    msg: '添加失败'
                })
            }
        })
    }
})

app.post('/editAlbum', multer({
    //设置文件存储路径
    dest: '../music/static/album'
}).single('file'),
(req, res, next) => {
    if (req.session.sign !== true) {
        res.send({
            status: 2,
            msg: '未登录，没有权限'
        })
        return false;
    }
    let fileChange = req.body.fileChange;
    let timeStamp = new Date().getTime();
    if (fileChange === 'true') {
        let file = req.file;
        let fileInfo = {};
        let newName =  albumPath + timeStamp +  '.' +  file.originalname.split('.')[1];
        fs.renameSync(albumPath + file.filename, newName);
        // 获取文件信息
        fileInfo.mimetype = file.mimetype;
        fileInfo.originalname = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = file.path;
    }
    let albumName = req.body.albumName;
    let company = req.body.company;
    let description = req.body.description;
    let singer = req.body.singer;
    let time = req.body.time;
    let img = req.body.img;
    let oldImg = req.body.oldImg;
    if (fileChange) {
        fs.unlinkSync('../music' + oldImg);
        img = timeStamp;
    } else {
        img = img.split('/');
        img = img[img.length - 1];
        img = img.split('.');
        img = img[0];
    }
    let id = req.body.ID;
    let updateAlbumSql = 'UPDATE music.album SET album_name=?,singer=?,time=?,company=?,album_description=?,img=? WHERE id=?';
    pool.query(updateAlbumSql, [albumName, singer, time, company, description, img, id], (err, ress, field) => {
        if (err) throw err;
        if (ress.affectedRows === 1) {
            res.send({
                status: 0,
                msg: '修改成功'
            })
        }
    })
})

app.post('/deleteAlbum', (req, res) => {
    if (req.session.sign !== true) {
        res.send({
            status: 2,
            msg: '未登录，没有权限'
        })
        return false;
    }
    let id = req.body.id;
    let imgPath = '../music' + req.body.img;
    fs.unlinkSync(imgPath);
    let deleteSql = 'DELETE FROM music.album WHERE id=?';
    pool.query(deleteSql, [id], (err, ress, field) => {
        if (err) throw err;
        if (ress.affectedRows === 1) {
            res.send({
                status: 0,
                msg: '修改成功'
            })
        }
    })
})

function saveAndVerify(req,res){
    let uname = req.body.uname;
    let upwd = req.body.upwd;
    let file = req.file;
    let fileInfo = {};
    let beauty = 0;
    let timeStamp = new Date().getTime();
    let newName =  uploadPath + timeStamp +  '.' +  file.originalname.split('.')[1]
    fs.renameSync(uploadPath + file.filename, newName);//这里修改文件名字，比较随意。
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

function loginCompareFace(imgA, imgB, res, uname, req) {
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
               req.session.usign = true
               req.session.uname = uname
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