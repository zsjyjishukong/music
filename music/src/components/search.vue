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
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      headerSelected: 'song'
    }
  },
  methods: {
    changeHeaderSelected: function (str) {
      this.headerSelected = str
    }
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
    min-height: calc(82vh - 115px);
  }
  .search-bar{
    text-align: center;
    width: 420px;
    height: 40px;
    margin: auto;
  }
  .search-input-father{
    width: 300px;
    height: 28px;
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
</style>
