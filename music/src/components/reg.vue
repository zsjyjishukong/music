<template>
  <div class="reg-page">
    <div style="width: 600px; margin: 50px auto; text-align: center">
      <div class="header">
        用户注册
      </div>
      <div class="container">
        <div class="user row">
          <div class="col-md-2"></div>
          <div class="col-md-2 label">
            用户名
          </div>
          <div class="col-md-6">
            <input type="text" id="username" autocomplete="off" width="100%" v-model="uname" @change="checkUname">
          </div>
          <div class="col-md-2"></div>
        </div>
        <div class="user-check row tips">
          <div class="col-md-2"></div>
          <div class="col-md-10">
            <span style="color: #F56C6C" v-show="uname&&(unameResult === false)">此用户名已被注册</span>
            <span v-if="uname&&unameResult"><i class="fas fa-check-circle" style="color: #82c91e;"></i></span>
          </div>
        </div>

        <div class="pass row">
          <div class="col-md-2"></div>
          <div class="col-md-2 label">密码</div>
          <div class="col-md-6">
            <input type="password" id="password" autocomplete="off" v-model="upwd" @change="checkUpwd">
          </div>
          <div class="col-md-2"></div>
        </div>
        <div class="row tips">
          <div class="col-md-2"></div>
          <div class="col-md-10">
            <span style="color: #F56C6C" v-show="upwdResult === false">密码格式不符合要求</span>
            <span v-show="upwdResult === true"><i class="fas fa-check-circle" style="color: #82c91e;"></i></span>
          </div>
        </div>
        <div class="pass row">
          <div class="col-md-2"></div>
          <div class="col-md-2 label">确认密码</div>
          <div class="col-md-6">
            <input type="password" id="passwordConfirm" autocomplete="off" v-model="verifyUpwd" @change="checkVerifyUpwd">
          </div>
          <div class="col-md-2"></div>
        </div>
        <div class="row tips">
          <div class="col-md-2"></div>
          <div class="col-md-10">
            <span style="color: #F56C6C" v-show="verifyUpwdResult === false && verifyUpwd">两次键入密码不一致</span>
            <span v-show="verifyUpwdResult === true &&verifyUpwd"><i class="fas fa-check-circle" style="color: #82c91e;"></i></span>
          </div>
        </div>

        <div class="img row">
          <div class="col-md-2"></div>
          <div class="col-md-2 label" style="line-height: 80px;">头像</div>
          <div class="col-md-6">
            <span @click="upload" style="font-size: 100px; cursor: pointer;" title="上传文件">
              <span v-if="imgSrc === ''"><i class="fas fa-plus-square"></i></span>
              <img :src="imgSrc" v-if="imgSrc !== ''" width="200px">
            </span>
          </div>
          <input type="file" id="file" style="display: none;" ref="file" @change="fileChange" accept="image/png, image/jpeg, image/gif, image/jpg">
        </div>

        <div class="button row">
          <div class="col-md-12">
            <button @click="submitIt" id="submit-button">确认注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'reg',
  props: {
    host:{
      type: String
    }
  },
  data () {
    return {
      uname: '',
      upwd: '',
      verifyUpwd: '',
      file: '',
      unameResult: '',
      upwdResult: '',
      verifyUpwdResult: '',
      imgResult: '',
      imgSrc: '',
      height: 600,
      width: 600,
      pageLoading: false,
      loadingText: '人脸识别登录中，如果长时间无响应请刷新页面……'
    }
  },
  methods: {
    upload: function () {
      document.getElementById('file').click()
    },
    checkUname: function () {
      let self = this
      this.$http.get(self.host + 'verifyUname?uname=' + self.uname)
        .then(function (res) {
          if (res.data.status === 0) {
            self.unameResult = true
          } else {
            self.unameResult = false
          }
        })
    },
    checkUpwd: function () {
      let upwd = this.upwd
      let upwdResult = upwd.search(/\w{6,}/)
      if (upwdResult === -1){
        this.upwdResult = false
      } else {
        this.upwdResult = true
      }
    },
    checkVerifyUpwd: function () {
      let upwd = this.upwd
      let verifyUpwd = this.verifyUpwd
      if (upwd === verifyUpwd) {
        this.verifyUpwdResult = true
      } else {
        this.verifyUpwdResult = false
      }
    },
    submitIt: function () {
      if (this.unameResult&& this.upwdResult && this.verifyUpwdResult && this.$refs.file.value) {
        this.pageLoading = true
        let formData = new FormData();
        formData.append('uname', this.uname)
        formData.append('upwd', this.upwd)
        formData.append('file', this.dataURLtoFile(this.imgSrc))
        let self = this
        this.$http({
          method: 'post',
          url: self.host + 'reg',
          data: formData
        })
          .then((res) => {
            let data = res.data
            if (data.status === 0) {
              localStorage.setItem('uname', self.uname)
              self.$message.success('注册成功，魅力值：' + data.msg)
              self.$emit('changeHeader','login')
            } else if (data.status === 1) {
              self.$message.error(data.msg)
            }
          })
          .catch(() => {
            self.$message.error('注册失败')
          })
        this.pageLoading = false
      } else {
        this.$message.error('请改正表单错误后再提交')
      }

    },
    fileChange: function () {
      let inputDOM = this.$refs.file;
      let self = this
      let file = inputDOM.files[0];
      // 压缩图片需要的一些元素和对象
      let reader = new FileReader(), img = new Image();
      // 缩放图片需要的canvas
      let canvas = document.createElement('canvas');
      canvas.style.display = 'none'
      let context = canvas.getContext('2d');
      // base64地址图片加载完毕后
      img.onload = function () {
        // 图片原始尺寸
        let originWidth = this.width;
        let originHeight = this.height;
        // 最大尺寸限制
        let maxWidth = self.width,
          maxHeight = self.height;
        // 目标尺寸
        let targetWidth = originWidth, targetHeight = originHeight;
        // 图片尺寸超过600x600的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        let newUrl = canvas.toDataURL('image/jpeg', 0.92);
        console.log(self.getImgSize(newUrl))
        if (self.getImgSize(newUrl) > 1024) {
          this.$message.error('图片太大，请更改图片')
          inputDOM.value = ''
          return
        } else {
          self.imgSrc = newUrl
        }
      }
      // 文件base64化，以便获知图片原始尺寸
      reader.onload = function(e) {
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    dataURLtoFile: function(dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {type: mime})
    },
    getImgSize :function(str) {
      //获取base64图片大小，返回KB数字
      let strLength = str.length;
      let fileLength = parseInt(strLength - (strLength / 8) * 2);
      // 由字节转换为KB
      let size = "";
      size = (fileLength / 1024).toFixed(2);
      return parseInt(size);
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped>
  .container{
    width: 100%;
    border: 3px solid #C20C0C;
    padding: 40px;
    border-radius: 10px;
  }
  .header{
    font-size: 20px;
    margin-bottom: 50px;
  }
  .row{
    margin: 10px 0;
  }
  .row>col-md-3:first-child{
    text-align: right;
  }
  .row>col-md-4:nth-child(2){
    width: 100%;
  }
  .row>col-md-5:last-child{
    text-align: left;
  }
  .label{
    font-size: 13px;
    color: #000;
  }
  .tips{
    margin-top: 0;
    margin-bottom: 0;
    font-size: 12px;
    height: 17px;
    line-height: 17px;
  }
  #submit-button{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
  #submit-button:hover{
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  #submit-button:focus{
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
</style>
