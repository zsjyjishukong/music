<template>
<div id="admin-page">
  <div id="admin-header">
    <div id="admin-header-container">
      <img src="@/assets/logo.png" height="50px;" id="logo">
      <span class="white title" style="margin-left: 50px;">后台管理系统</span>
      <span class="white little-title button" style="float: right;">登录</span>
    </div>
  </div>
  <div id="admin-body">
    <div id="admin-body-container">
      <login :host="host"></login>
    </div>
  </div>
  <foot></foot>
</div>
</template>

<script>
  import login from '../../components/admin/login'
  import foot from '../../components/footer'
  export default {
    name: 'index',
    components: {
      login, foot
    },
    data () {
      return{
        host: 'http://localhost:3000/'
      }
    }
  }
</script>

<style scoped>
#admin-header{
  width: 100%;
  background: #242424;
  height: 70px;
  line-height: 70px;
  color: #333;
  vertical-align: center;
  user-select: none;
  border-bottom: 5px solid #C20C0C ;
}
  #admin-header-container{
    width: 1000px;
    margin: auto;
    line-height: 70px;
  }
  .button:hover{
    color: #ccc;
    cursor: pointer;
  }
  #logo{
    position: relative;
    top: -10px;
  }
  .title{
    font-size: 30px;
  }
  .white{
    color: #fff;
  }
  .little-title{
    font-size: 16px;
  }
  #admin-body{
    background: #e1e1e1;
    min-height: 400px;
  }
#admin-body-container{
  width: 1000px;
  margin: auto;
  background: #fff;
  min-height: 400px;
}
</style>
