<template>
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
</template>

<script>
    export default {
        name: "footer"
    }
</script>

<style scoped>
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
