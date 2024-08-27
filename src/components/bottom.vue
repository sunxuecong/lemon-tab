<template>
  <div class="bottom">
    <div class="icon-container">
          <d-icon
        icon="icon-setting"
        title="设置"
        v-size="26"
        @click="$store.commit('setShowSet',true)"
      ></d-icon>
    </div>

      
 </div>
</template>

<script>
export default {
  name: '',
  data() { 
    return {

    }
  },
  props: {

  },
  components:{
  },
  mounted() {

  },
  methods:{

  },

 }
</script>

<style lang='less' scoped>
//@import url();
.bottom{
  padding: 0 0 20px 24px;
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
.icon-container {
  width: 34px;
  height: 34px;
  display: flex;
 align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover {
    background-color: rgba(0,0,0,0.2);
    color: rgba(255,255,255,0.8);
  }
  }
</style>
