<template>
  <div>
    <div class="item">
      开发中
      <span :class="{active:current == 0}">.</span>
      <span :class="{active:current == 1}">.</span>
      <span :class="{active:current == 2}">.</span>
      <span :class="{active:current == 3}">.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      current: 0,
      timer:null,
    };
  },
  props: {},
  components: {},
  mounted() {
    if(this.timer){
      this.timer = null
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (this.current == 3) {
        this.current = 0;
      }else{
        this.current++;
      }
    }, 600);
  },
  methods: {},
    beforeDestroyed() {
    this.timer = null;
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="less">
.item {
  text-align: center;
  line-height: 32px;
  color: #999;
  .active {
    color: red;
  }
}
</style>