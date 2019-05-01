<template>
    <div class="login-page">
      <div class="login-page-page">
        <div class="login">
          <div style="background: rgba(194,12,12,0.3); margin-top: 30px;"
               v-loading="pageLoading"
               :element-loading-text="loadingText"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
            <div class="login-father" @keydown.13="login">
              <div class="username inputs">
                <i class="fas fa-user"></i>
                <span class="line">|</span>
                <input type="text" class="input-text" placeholder="用户名" v-model="username">
              </div>
              <div class="password inputs">
                <i class="fas fa-unlock-alt"></i>
                <span class="line">|</span>
                <input type="password" class="input-text" placeholder="密码" v-model="password">
              </div>
              <div class="inputs" style="background: none;">
                <button class="submit-it" @click="login">登录</button>
              </div>
            </div>
            <video  id="video" autoplay style="width: 75%;opacity: 0.4"></video>
          </div>
          <div class="canvas">
            <canvas id="canvas" width="480" height="320"></canvas>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  props: {
    host: {
      type: String
    }
  },
  data () {
    return {
      stream: '',
      allowLogin: false,
      username: localStorage.getItem('uname'),
      password: '',
      allowMedia: '',
      video: '',
      timer: '',
      pageLoading: false,
      loadingText: ''
    }
  },
  methods: {
    drawVideo: function () {
      if (navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia) {
        this.allowMedia = true
        this.getUserMediaToPhoto({video: {width: 480, height: 320}}, this.success, this.error)
      } else {
        this.allowMedia = false
        alert('你的浏览器不支持访问用户媒体设备')
      }
    },
    getUserMediaToPhoto: function (constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        // 最新标准API
        navigator.mediaDevices.getUserMedia(constraints)
          .then(success)
          .catch(error)
      } else if (navigator.webkitGetUserMedia) {
        // webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
      } else if (navigator.mozGetUserMedia) {
        // firefox浏览器
        navigator.mozGetUserMedia(constraints, success, error)
      } else if (navigator.getUserMedia) {
        // 旧版API
        navigator.getUserMedia(constraints, success, error)
      }
    },
    success: function (stream) {
      // 兼容webkit核心浏览器
      // eslint-disable-next-line
      let CompatibleURL = window.URL || window.webkitURL
      // 将视频流转化为video的源
      let video = document.getElementById('video')
      video.srcObject = stream
      this.video = video
      this.stream = stream
      // 播放视频
      video.play()
      // 将视频绘制到canvas上
      if (this.allowLogin && this.allowLogin) {
        if (this.password === '') {
          this.postFace(video)
        } else {
          this.passLogin()
        }
      }
    },
    error: function (error) {
      console.log('访问用户媒体失败：', error.name, error.message)
    },
    postFace: function (video) {
      let canvas = document.getElementById('canvas')
      let context = canvas.getContext('2d')
      let timer = setInterval(this.faceLoginFunc(context, canvas), 10000)
      this.timer = timer
    },
    passLogin: function () {
      let self = this
      this.$http.post(self.host + 'passLogin', {uname: self.username, password: self.password})
        .then((res) => {
          if (res.data.status === 0) {
            self.$message.success('登录成功')
            localStorage.setItem('uname', self.username)
            sessionStorage.setItem('uname', self.username)
            sessionStorage.setItem('img', res.data.img)
            clearInterval(this.timer)
            self.toMine()
          } else {
            self.$message.error('用户名密码错误')
          }
          self.pageLoading = false
        })
        .catch((err) => {
          self.$message.error('网络错误')
          console.log('网络错误' + err)
          self.pageLoading = false
        })
    },
    login: function () {
      if (this.username.trim() !== '') {
        if (this.password.trim() !== '') {
          this.pageLoading = true
          this.loadingText = '用户名密码登录中……'
          this.passLogin()
        } else {
          if (this.allowMedia) {
            this.allowLogin = true
            this.pageLoading = true
            this.loadingText = '人脸识别登录中，如果长时间无响应请刷新页面……'
            this.postFace(this.video)
          } else {
            this.$message.error('请输入密码')
            return false
          }
        }
      } else {
        this.$message.error('请输入用户名')
        return false
      }
    },
    faceLoginFunc: function (context, canvas) {
      let self = this
      let video = document.getElementById('video')
      this.pageLoading = true
      context.drawImage(video, 0, 0, 480, 320)
      let img = canvas.toDataURL('image/jpg')
      // {#获取完整的base64编码#}
      img = img.split(',')[1]
      // 将照片以base64用ajax传到后台
      self.$http.post(self.host + 'faceLogin', {url: img, uname: self.username})
        .then((res) => {
          if (res.data.status === 0) {
            self.$message.success('登录成功')
            localStorage.setItem('uname', self.username)
            sessionStorage.setItem('uname', self.username)
            sessionStorage.setItem('img', res.data.img)
            clearInterval(self.timer)
            setTimeout(function () {
              self.toMine()
            }, 500)
          } else if (res.data.status === 1) {
            self.$message.error(res.data.msg)
          }
          self.pageLoading = false
        })
        .catch((err) => {
          self.$message.error('网络错误')
          console.log('网络错误：' + err)
          self.pageLoading = false
        })
    },
    toMine: function (img) {
      this.$emit('changeHeader', 'mine', img)
    }
  },
  mounted: function () {
    this.drawVideo()
  },
  beforeDestroy: function () {
    this.stream.getTracks()[0].stop()
  }
}
</script>

<style scoped>
  .login-page{
    min-height: 75vh;
  }
  .login-page-page{
    width: 1000px;
    margin: auto;
  }
  #video{
    display: block;
  }
  .canvas{
    display: none;
  }
  .login-father{
    float:left;
    overflow: hidden;
    clear: both;
  }
  .input-text{
    width: 80%;
  }
  .inputs{
    background: #fff;
    padding: 5px;
    text-align: center;
    margin: 5px 0;
    border-radius: 8px;
  }
  .line{
    margin: 0 5px;
    color: #ccc;
  }
  .inputs>input{
    border: none;
    outline: none;
  }
  .login-father{
    width: 25%;
    padding: 1%;
    height: 150px;
    position: relative;
    top: 150px;
  }
  .submit-it{
    width: 50%;
    height: 40px;
    border-radius: 10px;
    background: #C20C0C;
    color: #fff;
    outline: none;
    border: 1px solid #fff;
  }
  .submit-it:hover{
    background: #D31D1D;
  }
  .submit-it:active{
      background: #A00A0A;
    }
</style>
