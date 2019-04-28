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
    <el-button @click="addAlbum">增加专辑</el-button>
    <!--添加专辑对话框 -->
    <el-dialog title="专辑信息" :visible.sync="dialogFormVisible">
      <el-form :model="newAlbum">
        <el-form-item label="专辑名称" :label-width="formLabelWidth">
          <el-input v-model="newAlbum.albumName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="歌手名称" :label-width="formLabelWidth">
          <el-input v-model="newAlbum.singer" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发行时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="newAlbum.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发行公司" :label-width="formLabelWidth">
          <el-input v-model="newAlbum.company" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专辑简介" :label-width="formLabelWidth">
          <el-input v-model="newAlbum.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专辑封面" :label-width="formLabelWidth">
          <el-upload
            v-show="uploadShow"
            :action="host + 'addAlbum'"
            ref="upload"
            :data="newAlbum"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitAddAlbum">确 定</el-button>
      </div>
    </el-dialog>
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
      albumData: [],
      newAlbum: {
        albumName: '',
        singer: '',
        time: '',
        company: '',
        description: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '100px',
      dialogImageUrl: '',
      dialogVisible: false,
      uploadShow: true
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
    },
    addAlbum: function () {
      this.dialogFormVisible = true
    },
    submitAddAlbum: function () {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      this.dialogImageUrl = ''
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      this.uploadShow = false
    },
    handleExceed: function (file, fileList) {
      this.$message.warning('只允许上传一个')
    },
    handleSuccess: function (res) {
      if (res.status === 0) {
        this.$message.success('添加成功')
        this.closeDialog()
      } else {
        console.log(res.msg);
        this.$message.error(res.msg)
      }
    },
    closeDialog: function () {
      this.$refs.upload.clearFiles()
      this.dialogFormVisible = false
      this.newAlbum = {}
    }
  },
  mounted: function () {
    this.selectAlbum()
  }
}
</script>

<style scoped>
</style>
