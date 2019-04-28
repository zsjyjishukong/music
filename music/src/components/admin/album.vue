<template>
  <div id="album-page">
    <el-table
      :data="albumData"
      border
      style="width: 100%">
      <el-table-column
        prop="albumName"
        label="专辑名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="singer"
        label="歌手名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="time"
        label="发行时间">
      </el-table-column>
      <el-table-column
        prop="company"
        label="发行公司">
      </el-table-column>
      <el-table-column
        prop="description"
        label="专辑简介">
      </el-table-column>
      <el-table-column
        prop="img"
        label="专辑封面">
      </el-table-column>
    </el-table>
    <el-button @click="selectAlbum">adklfja</el-button>
  </div>
</template>

<script>
export default {
  name: 'album',
  props: {
    host: {
      type: String
    }
  },
  data () {
    return {
      albumData: []
    }
  },
  methods: {
    selectAlbum: function () {
      let self = this
      this.$http.get(self.host + 'selectAlbum')
        .then((res) => {
          if (res.data.status === 0) {
            self.albumData = []
            self.albumData = res.data.data
          }
        })
    }
  },
  mounted: function () {
    this.selectAlbum()
  }
}
</script>

<style scoped>

</style>
