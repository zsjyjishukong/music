<template>
<div id="index-page">
  <header>
    <div id="header-container">
      <img src="@/assets/logo.png" height="50px;" id="logo">
      <ul id="music-type">
        <li :class="{'header-selected': headerSelected === 'find'}" @click="changeMusicType('find')">发现音乐</li>
        <li :class="{'header-selected': headerSelected === 'mine'}" @click="changeMusicType('mine')">我的音乐</li>
      </ul>
      <div class="search">
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input type="text" name="song-name" id="header-search-input">
        </div>
      </div>
      <div class="user">
        <div class="login" v-if="!isLogin">
          <span class="login-span" @click="changeMusicType('login')">登录</span>
          <span class="reg-span" @click="changeMusicType('reg')">注册</span>
        </div>
        <div class="head" v-if="isLogin">
          <img id="header-head-img" :src="img" title="退出登录" height="40px" width="40px" @click="logout">
        </div>
      </div>
    </div>
  </header>
  <search v-if="headerSelected === 'find'" :host="host"></search>
  <mine v-if="headerSelected === 'mine'" @changeHeader="changeMusicType"></mine>
  <reg v-if="headerSelected === 'reg'" v-on:changeHeader="changeMusicType" :host="host"></reg>
  <login v-if="headerSelected === 'login'" @changeHeader="changeMusicType" :host="host"></login>
  <common-foot></common-foot>
</div>
</template>

<script>
import Search from "../../components/search";
import Mine from "../../components/mine";
import Reg from '../../components/reg'
import Login from '../../components/login'
import commonFoot from '../../components/commonFooter'

export default {
  name: 'index',
  components: {Search, Mine, Reg, Login, commonFoot},
  data() {
    return {
      isLogin: false,
      headerSelected: 'find',
      img: '',
      host: 'http://localhost:3000/'
    }
  },
  methods: {
    logout: function () {
      this.isLogin = false
      sessionStorage.clear()
    },
    changeMusicType: function (name) {
      this.headerSelected = name
      if (sessionStorage.getItem('uname')){
        this.isLogin = true
      }
    }
  },
  mounted: function () {
    if (sessionStorage.getItem('uname')){
      this.isLogin = true
      this.img = '/static/upload/' + sessionStorage.getItem('img') + '.jpeg'
    }
  },
  beforeUpdate: function () {
    if (sessionStorage.getItem('uname')){
      this.isLogin = true
      this.img = '/static/upload/' + sessionStorage.getItem('img') + '.jpeg'
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
  #music-type{
    color: #ccc;
    height: 50px;
    display: inline-block;
    margin-left: 10px;
  }
  #music-type>li{
    position: relative;
    top: -3px;
    padding:0 20px;
    line-height: 65px;
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
  .login{
    position: relative;
    top: 20px;
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
    top: 18px;
    cursor: pointer;
  }
  .header-selected{
    background: #000;
    color: #fff;
  }
</style>
