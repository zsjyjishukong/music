<template>
<div class="search-page">
  <div class="search-container">
    <div class="search-bar">
      <div class="search-input-father">
        <input type="text" id="search-text" style="width: 90%" placeholder="歌手名/专辑名">
      </div>
      <div class="search-button">
        <i class="fas fa-search"></i>
      </div>
    </div>
    <div class="search-result">
      <div class="search-result-header">
        <div :class="headerSelected === 'song'? 'search-result-header-son selected' : 'search-result-header-son'" @click="changeHeaderSelected('song')">
          单曲
        </div>
        <div :class="headerSelected  === 'singer'? 'search-result-header-son selected' : 'search-result-header-son'" @click="changeHeaderSelected('singer')">
          歌手
        </div>
        <div :class="headerSelected  === 'album'? 'search-result-header-son selected' : 'search-result-header-son'" @click="changeHeaderSelected('album')">
          专辑
        </div>
      </div>
      <div class="search-result-body container">
        <div class="a-search row" v-for="(item,key) in searchResult" v-bind:key="key">
          <div class="col-md-4">
            <i class="far fa-play-circle" style="font-size: 16px; color: #ccc;"></i> <span @click="changeMusic(item.src)">{{item.name}}</span>
          </div>
          <div class="col-md-2">
              <div class="row">
                <div class="col-md-4 handle">
                  <i class="fas fa-plus" title="添加到播放列表"></i>
                </div>
                <div class="col-md-4 handle">
                  <i class="fas fa-plus-square" title="收藏"></i>
                </div>
                <div class="col-md-4 handle">
                  <i class="fas fa-download" title="下载"></i>
                </div>
              </div>
          </div>
          <div class="col-md-2">
            {{item.singer}}
          </div>
          <div class="col-md-2">
            《{{item.album}}》
          </div>
          <div class="col-md-2">
            {{item.time}}
          </div>
        </div>
      </div>
    </div>
  </div>
  <audio :src="src" id="audio1"></audio>
</div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      headerSelected: 'song',
      src: '',
      searchResult: [
      //   {
      //   name: '平凡之路',
      //   singer: '朴树',
      //   album: '猎户星座',
      //   time: '04:02',
      //   src: '/static/music/aaa.flac'
      // }
      ]
    }
  },
  methods: {
    changeHeaderSelected: function (str) {
      this.headerSelected = str
    },
    changeMusic: function (src) {
      let audio = document.getElementById('audio1')
      if (this.src === src) {
        if (audio.paused) {
          audio.play()
        } else {
          audio.pause()
        }
      } else {
        this.src = src
        audio.oncanplaythrough = function() {
          audio.play()
        }
      }
    }
  },
  mounted: function () {
    let self = this
    this.$http.get('http://localhost:3000/search?name=平凡之路')
      .then(function (res) {
        self.searchResult = []
        self.searchResult.push(res.data)
      })
      .catch(function (err) {
        console.log('网络错误：'+ err);
      })
  }
}
</script>

<style scoped>
  .search-page{
    background: #d3d3d3;
  }
  .search-container{
    width: 900px;
    margin: auto;
    background: #fff;
    padding: 40px;
    min-height: calc(100vh - 115px);
  }
  .search-bar{
    text-align: center;
    width: 420px;
    height: 40px;
    margin: auto;
  }
  .search-input-father{
    width: 300px;
    height: 37.5px;
    border: 1px solid #ccc;
    box-shadow: 2px 0 2px 2px #eee inset;
    padding: 5px 2px;
    border-radius: 5px 0 0 5px;
    display: inline-block;
    position: relative;
    top: -5px;
  }
  #search-text{
    border: none;
    outline: none;
    font-size: 14px;
    color: #555;
  }
  #search-text::-webkit-input-placeholder{
    color: #ccc;
  }
  .search-button{
    height: 38px;
    width: 50px;
    background: #efefef;
    color: #bbb;
    display: inline-block;
    vertical-align: center;
    line-height: 40px;
    position: relative;
    left: -5px;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 0 5px 5px 0;
    font-size: 20px;
  }
  .search-button:hover{
    background: #fff;
    cursor: pointer;
  }
  .search-result{
    margin-top: 30px;
  }
  .search-result-header{
    background: #ddd;
    border: 1px solid #ccc;
    border-top: 2px solid #ccc;
    border-bottom: none;
    text-align: justify;
    cursor: pointer;
  }
  .search-result-header-son{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 32.9%;
    text-align: center;
    color: #333;
    border-bottom: 1px solid #ccc;
  }
  .selected{
    border-top: 2px solid #C20C0C;
    border-right: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #fff;
    background: #fff;
  }
  .search-result-body{
    margin-top: 30px;
    width: 820px;
    font-size: 12px;
  }
  .a-search{
    padding: 10px 0;
    color: #444;
  }
  .a-search:hover{
    background: #eee;
  }
  .handle{
    cursor: pointer;
    font-size: 14px;
  }
</style>
