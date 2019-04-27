<template>
  <div id="mine-page">
    我的
  </div>
</template>

<script>
export default {
  name: 'mine',
  mounted: function () {
    if (sessionStorage.getItem('uname')) {

    } else {
      this.$emit('changeHeader', 'login')
    }
  }
}
</script>

<style scoped>
#mine-page{
  width: 900px;
  margin: auto;
  padding: 5px;
}
</style>
