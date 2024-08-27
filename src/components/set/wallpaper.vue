<template>
  <div class="wallpaper">
    <div class="image-contaienr">
      <el-image class="main-image" :src="wallpaper" fit="fit"></el-image>
      <div class="hot-btn">热门壁纸</div>
    </div>
  </div>
</template>

<script>
let imgSrc = require("../../assets/bgc.jpeg");
export default {
  name: "",
  data() {
    return {
      imgSrc: imgSrc,
    };
  },
  props: {},
  components: {},
  mounted() {},
  methods: {},
  computed: {
    wallpaper() {
      return this.$store.state.wallpaper.src || this.imgSrc;
    },
  },
};
</script>

<style scoped lang="less">
.wallpaper {
  padding-top: 20px;
  .image-contaienr {
    width: 444px;
    height: 186px;
    position: relative;
    .main-image {
      width: 100%;
      height: 100%;
      border-radius: 13px;
    }
    .hot-btn{
      background-color: #fff;
      padding: 12px 16px;
      font-size: 14px;
      text-align: center;
      border-radius: 5px;
      backdrop-filter: blur(2px);
      background-color: rgba(var(--main-color), 0.8);
      color: var(--logo-hover);
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>