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
        <template slot-scope="scope1">
          <img :src="scope1.row.img" alt="" width="100%">
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope2">
          <el-button @click="editAlbum(scope2.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="confirmDeleteAlbum(scope2.row)">删除</el-button>
        </template>
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
            :action="host + path"
            with-credentials
            accept="image/jpg,image/jpeg"
            ref="upload"
            :data="newAlbum"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-success="handleSuccess">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('upload')">取 消</el-button>
        <el-button type="primary" @click="submitAddAlbum">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑专辑-->
    <el-dialog title="专辑信息" :visible.sync="dialogEditAlbumVisible">
      <el-form :model="editAlbumData">
        <el-form-item label="专辑名称" :label-width="formLabelWidth">
          <el-input v-model="editAlbumData.albumName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="歌手名称" :label-width="formLabelWidth">
          <el-input v-model="editAlbumData.singer" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发行时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editAlbumData.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发行公司" :label-width="formLabelWidth">
          <el-input v-model="editAlbumData.company" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专辑简介" :label-width="formLabelWidth">
          <el-input v-model="editAlbumData.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专辑封面" :label-width="formLabelWidth">
          <img width="30%" :src="editAlbumData.img" alt="">
          <el-button type="primary" @click="changeImgShow = true">更改图片</el-button>
        </el-form-item>
        <el-dialog :visible.sync="changeImgShow" append-to-body>
          <el-upload
            :action="host + editPath"
            ref="changeUpload"
            with-credentials
            accept="image/jpg,image/jpeg"
            :data="editAlbumData"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-change="handleChangePreview"
            :on-success="handleEditSuccess">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
          </el-upload>
        </el-dialog>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('edit')">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteConfirmShow"
      width="30%">
      <span>确定删除<span class="waring"> {{deleteSinger}} </span>的<span class="waring"> {{deleteAlbum}} </span>吗？<span class="danger">注意：本操作无法恢复</span></span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeConfirmDeleteAlbum">取 消</el-button>
    <el-button type="primary" @click="deleteAlbumFunc">确 定</el-button>
  </span>
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
      editAlbumData: {},
      dialogFormVisible: false,
      formLabelWidth: '100px',
      dialogVisible: false,
      uploadShow: true,
      path: 'addAlbum',
      editPath: 'editAlbum',
      dialogEditAlbumVisible: false,
      changeImgShow: false,
      editImgPreview: '',
      deleteConfirmShow: false,
      deleteSinger: '',
      deleteAlbum: '',
      deleteID: '',
      deleteImg: ''
    }
  },
  methods: {
    selectAlbum: function () {
      let self = this
      function successPromise(self, res) {
        if (res.data.status === 0) {
          self.albumData = []
          for (let obj of res.data.data) {
            obj.img = '/static/album/' + obj.img + '.jpg'
            obj.fileChange = false
          }
          self.albumData = res.data.data
        } else {
          self.$message.error(res.data.msg)
          if (res.data.status === 2) {
            setTimeout(() => {
              self.logout()
            }, 1000)
          }
        }
      }
      this.ajaxGet(self.host + 'selectAlbum', successPromise, self.errPromise)
    },
    addAlbum: function () {
      this.dialogFormVisible = true
    },
    submitAddAlbum: function () {
      this.$refs.upload.submit()
    },
    handleExceed: function (file, fileList) {
      this.$message.warning('只允许上传一个')
    },
    handleSuccess: function (res) {
      if (res.status === 0) {
        this.$message.success('添加成功')
        this.closeDialog('upload')
        this.selectAlbum()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleEditSuccess: function (res) {
      if (res.status === 0) {
        this.$message.success('更改成功')
        this.closeDialog('edit')
        this.selectAlbum()
      } else  {
        this.$message.error(res.msg)
        if (res.status === 2) {
          let self = this
          setTimeout(()=>{self.logout()})
        }
      }
    },
    handleChangePreview: function(file) {
      this.editAlbumData.fileChange = true
      this.editAlbumData.img = file.url
      this.changeImgShow = false
    },
    closeDialog: function (dia) {
      if (dia === 'upload') {
        if (this.$refs.upload)
          this.$refs.upload.clearFiles()
        this.dialogFormVisible = false
        this.newAlbum = {}
      } else if (dia === 'edit') {
        if (this.$refs.changeUpload)
          this.$refs.changeUpload.clearFiles()
        this.dialogEditAlbumVisible = false
        this.editAlbumData = {}
      }
    },
    editAlbum: function (obj) {
      this.dialogEditAlbumVisible = true
      this.editAlbumData = JSON.parse(JSON.stringify(obj))
      this.editAlbumData.oldImg = this.editAlbumData.img
    },
    submitEdit: function () {
      if (this.editAlbumData.fileChange === true) {
        this.$refs.changeUpload.submit()
      } else {
        let self = this
        function successPromise(self, res) {
          self.$message.success('更改成功')
          this.closeDialog('edit')
          this.selectAlbum()
        }
        this.ajaxPost(self.host + 'editAlbum', self.editAlbumData, successPromise, this.errPromise)
      }
    },
    logout: function () {
      sessionStorage.clear()
      location.reload()
    },
    confirmDeleteAlbum: function (obj) {
      this.deleteConfirmShow = true
      this.deleteSinger = obj.singer
      this.deleteAlbum = obj.albumName
      this.deleteID = obj.ID
      this.deleteImg = obj.img
    },
    closeConfirmDeleteAlbum: function () {
      this.deleteAlbum = ''
      this.deleteConfirmShow = false
      this.deleteSinger = ''
      this.deleteID = ''
    },
    deleteAlbumFunc: function () {
      function success(self, res) {
        self.$message.success('删除成功')
        self.deleteConfirmShow = false
        self.selectAlbum()
      }
      let self = this
      this.ajaxPost(this.host+ 'deleteAlbum', {id: this.deleteID, img: this.deleteImg}, success, self.errPromise)
    },
    ajaxPost: function (url, data, successPromise, errPromise) {
      let self = this
      this.$http.post(url, data)
        .then((res) => {
          if (res.data.status === 0) {
            successPromise(self, res)
          } else {
            errPromise(self, res)
          }
        })
        .catch((err) => {
          self.$message.error('网络错误')
          console.log('网络错误：' + err);
        })
    },
    errPromise: function (self, res) {
      self.$message.error(res.data.msg)
      if (res.data.status === 2) {
        setTimeout(()=> {
          self.logout()
        }, 500)
      }
    },
    ajaxGet: function (url, successPromise, errPromise) {
      let self = this
      this.$http.get(url)
        .then((res) => {
          if (res.data.status === 0) {
            successPromise(self, res)
          } else {
            errPromise(self, res)
          }
        })
        .catch((err) => {
          self.$message.error('网络错误')
          console.log('网络错误：' + err);
        })
    }
  },
  mounted: function () {
    this.selectAlbum()
  }
}
</script>

<style scoped>
  .waring{
    color: #E6A23C;
  }
  .danger{
    color: #F56C6C;
  }
</style>
