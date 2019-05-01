<template>
    <div id="login">
      <div class="login-all">
        <div class="login-title">
          管理员登录
        </div>
        <div class="login-body" @keydown.13="submitIt">
          <el-input  v-model="username">
            <i slot="prefix" class="fas fa-user el-input__icon"></i>
          </el-input>
          <el-input v-model="password" type="password">
            <i slot="prefix" class="fas fa-lock el-input__icon"></i>
          </el-input>
        </div>
        <div class="login-foot">
          <el-button class="submit-it" @click="submitIt">登录</el-button>
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
      username: '',
      password: ''
    }
  },
  methods: {
    submitIt: function () {
      let self = this
      this.$http.post(this.host + 'adminLogin', {aname: this.username, apass: this.password})
        .then((res) => {
          if (res.data.status === 0) {
            self.$message.success('登录成功')
            sessionStorage.setItem('aname', self.username)
            location.reload()
          } else {
            self.$message.error(res.data.msg)
          }
        })
    }
  }
}
</script>

<style scoped>
  #login{

  }
  .login-all{
    width: 70%;
    height: 300px;
    margin: auto;
    position: relative;
    top: 50px;
    background: rgba(194,12,12,0.3);
    border-radius: 15px;
  }
  .login-title{
    border-radius: 15px 15px 0 0;
    border-bottom: 1px solid #fff;
    padding: 10px 0;
    font-size: 20px;
    color: #fff;
    text-align: center;
  }
  .login-body{
    width: 40%;
    height: 150px;
    margin: auto;
    margin-top: 30px;
  }
  .el-input{
    margin-bottom: 30px;
  }
  .submit-it{
    background: #C20C0C;
    color: #fff;
  }
  .submit-it:hover{
    background: #D31D1D;
  }
  .submit-it:active{
    background: #A00A0A;
  }
  .login-foot{
    text-align: center;
  }
</style>
