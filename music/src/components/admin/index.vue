<template>
    <div id="index-page">
      <el-row class="tac">
        <el-col :span="4">
          <el-menu
            default-active="1"
            active-text-color="#C20C0C"
            class="el-menu-vertical-demo">
            <el-menu-item index="1" @click="turnTo('system')">
              <i class="el-icon-location"></i>
              <span slot="title">系统管理</span>
            </el-menu-item>
            <el-menu-item index="2" @click="turnTo('album')">
              <i class="el-icon-menu"></i>
              <span slot="title">专辑管理</span>
            </el-menu-item>
            <el-menu-item index="3" @click="turnTo('song')">
              <i class="el-icon-document"></i>
              <span slot="title">歌曲管理</span>
            </el-menu-item>
            <el-menu-item index="4" @click="turnTo('user')">
              <i class="el-icon-setting"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="5" @click="turnTo('admin')">
              <i class="el-icon-setting"></i>
              <span slot="title">管理员管理</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="20">
          <system v-if="selected === 'system'"></system>
          <album v-if="selected === 'album'" :host="host"></album>
          <song v-if="selected === 'song'"></song>
          <user v-if="selected === 'user'"></user>
          <admin v-if="selected === 'admin'"></admin>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import system from '../../components/admin/system'
  import album from '../../components/admin/album'
  import song from '../../components/admin/song'
  import user from '../../components/admin/user'
  import admin from '../../components/admin/admin'
export default {
  name: 'index',
  props: {
    host: {
      type: String
    }
  },
  components: {
    system, song, album, user, admin
  },
  data () {
    return {
      selected: 'system'
    }
  },
  methods: {
    turnTo: function (tar) {
      this.selected = tar
    }
  }
}
</script>

<style scoped>
  .el-menu-item:hover{
    background: rgba(194,12,12,0.3);
    color: #e42e2e;
  }
  #index-page{
    min-height: 400px;
    height: 100%;
  }
  .el-row{
    min-height: 400px;
    height: 100%;
  }
  .el-col{
    height: 100%;
    min-height: 400px;
  }
  .el-menu{
    height: 100%;
    min-height: 400px;
  }
</style>
