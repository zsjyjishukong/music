<template>
<div id="index-page">
  <header>
    <div id="header-container">
      <img src="@/assets/logo.png" height="50px;" id="logo">
      <ul id="music-type">
        <li :class="{'header-selected': headerSelected === 'find'}" @click="changeMusicType('find')">发现音乐</li>
        <li :class="{'header-selected': headerSelected === 'my'}" @click="changeMusicType('my')">我的音乐</li>
      </ul>
      <div class="search">
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input type="text" name="song-name" id="header-search-input">
        </div>
      </div>
      <div class="user">
        <div class="login" v-if="!isLogin">
          <span class="login-span" @click="login">登录</span>
          <span class="reg-span" @click="reg">注册</span>
        </div>
        <div class="head" v-if="isLogin">
          <img id="header-head-img" src="@/assets/head.jpg" title="退出登录" height="40px" @click="logout">
        </div>
      </div>
    </div>
  </header>
  <search v-if="headerSelected === 'find'"></search>
  <mine v-if="headerSelected === 'find'"></mine>

  <footer>
    <div id="footer-container">
      <ul>
        <li>关于往忆</li>
        <span class="line">|</span>
        <li>客户服务</li>
        <span class="line">|</span>
        <li>服务条款</li>
        <span class="line">|</span>
        <li>网站导航</li>
        <span class="line">|</span>
        <li>意见反馈</li>
      </ul>
      <div>
        <span class="copyright">往忆公司版权所有&copy;1997-2019</span>
        <span class="copyright">航舟勒毒科技有限公司运营：这网文[0000]0000-000号</span>
      </div>
      <div>
        <span class="copyright">违法和不良信息举报电话：0000-0000</span>
        <span class="copyright">举报邮箱：0000@000.com</span>
      </div>
    </div>
  </footer>
</div>
</template>

<script>
import search from '@/components/search'
import mine from '@/components/mine'
import Search from "../../components/search";
export default {
  name: 'index',
  components: {Search},
  data() {
    return {
      isLogin: false,
      headerSelected: 'find'
    }
  },
  methods: {
    login: function () {
      this.isLogin = true
    },
    reg:function () {

    },
    logout: function () {
      this.isLogin = false
    },
    changeMusicType: function (name) {
      this.headerSelected = name
    }
  }
}
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  header{
    background: #242424;
    height: 70px;
    line-height: 70px;
    color: #333;
    vertical-align: center;
    user-select: none;
    border-bottom: 5px solid #C20C0C ;
  }
  ul{
    margin: 0;
    padding: 0;
    vertical-align: center;
  }
  ul>li{
    list-style: none;
    display: inline-block;
    margin: auto;
    baseline-shift: initial;
    vertical-align: center;
  }
  #header-container{
    width: 1200px;
    margin: auto;
    height: 70px;
    text-align: center;
  }
  #logo{
    margin-top: 10px;
  }
  #music-type{
    color: #ccc;
    height: 50px;
    display: inline-block;
    margin-left: 10px;
  }
  #music-type>li{
    position: relative;
    top: -19px;
    padding:0 20px;
    line-height: 70px;
  }
  #music-type>li:hover{
    cursor: pointer;
    background: #000;
    color: #fff;
  }
  .search{
    margin-left: 5%;
    display: inline-block;
    width: 158px;
    height: 30px;
    line-height: 30px;
    background: #fff;
    position: relative;
    top: -20px;
    padding-left: 5px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    text-align: left;
  }
  .search-container{
    width: 210px;
  }
  #header-search-input{
    width: 130px;
    height: 23px;
    border-radius: 0 15px 15px 0;
    outline: none;
    border: none;
    color: #333;
  }
  .user{
    display: inline-block;
    line-height: 30px;
    margin-left: 20px;
    color: #ccc;
    position: relative;
    top: -19px;
  }
  .login-span:hover{
    color: #fff;
    cursor: pointer;
  }
  .reg-span:hover{
    color: #fff;
    cursor: pointer;
  }
  #header-head-img{
    border-radius: 20px;
    position: relative;
    top: 10px;
  }
  .header-selected{
    background: #000;
    color: #fff;
  }
  footer{
    color: #666;
    background: #f2f2f2;
    height: 90px;
    font-size: 10px;
  }
  #footer-container{
    width: 900px;
    margin: auto;
    text-align: left;
    font-size: 12px;
    line-height: 25px;
    user-select: none;
  }
  #footer-container li{
    display: inline-block;
    color: #999;
    margin: 0 5px;
    font-size: 12px;
  }
  #footer-container li:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  .line{
    color: #c2c2c2;
    font-size: 12px;
  }
  .copyright{
    display: inline-block;
    margin: 0 20px 0 5px;
    font-size: 12px;
  }
</style>
