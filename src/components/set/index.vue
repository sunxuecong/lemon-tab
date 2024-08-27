<template>
  <div class="app-set">
    <!-- 遮罩层 -->
    <transition name="el-fade-in">
      <div
        class="app-set-cover"
        @click="$store.commit('setShowSet', false)"
        v-show="showSidebar"
      ></div>
    </transition>
    <!-- 内容区 -->
    <div class="app-set-content" :class="{ active: showSidebar }">
      <div class="set-left">
        <div class="tabs-container">
          <div class="tab" v-for="(item,index) in tabs" :key="index" :class="{current:index == currentIndex}" @click="currentIndex = index">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="set-right">
        <div class="set-right-tittle">
          {{tabs[currentIndex].title}}
        </div>
        <div class="set-right-content">
          <!-- <Wallpaper></Wallpaper> -->
          <!-- <LocalWapaper ></LocalWapaper> -->
            <!-- <component :is="component"
             v-if="component" /> -->
             <component v-bind:is="tabs[currentIndex].component"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Wallpaper from '@/components/set/wallpaper'
import LocalWapaper from '@/components/set/localWapaper'
import SearchBox from '@/components/set/searchBox'
export default {
  name: "",
  props: {},
  components:{
    Wallpaper,
    LocalWapaper,
    SearchBox
  },
  data() {
    //这里存放数据
    return {
      currentIndex:0,
      tabs:[
        {
          name:'壁纸',
          component:'LocalWapaper',
          title:'壁纸'
        },
        {
          name:'搜索框',
          component:'SearchBox',
          title:'搜索框'
        },
        {
          name:'在线壁纸',
          component:'SearchBox',
          title:'在线壁纸'
        },
        {
          name:'关于我们',
          component:'SearchBox',
          title:'关于我们'
        },
      ]
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  computed: {
    showSidebar() {
      return this.$store.state.isShowSide || false;
    },
  },
  watch: {},
  //方法集合
  methods: {},

  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroyed() {},
};
</script>
<style lang='less' scoped>
//@import url();
.app-set {
  background-color: red;
  position: absolute;
  bottom: 0;
  left: 0;
  .app-set-cover {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    z-index: 99;
  }
  .app-set-content {
    background-color: #fff;
    position: fixed;
    transition: all 0.2s;
    z-index: 200;
    left: 44px;
    bottom: 44px;
    width: 0;
    height: 0;
    opacity: 0;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    &.active {
      opacity: 1;
      width: 723px;
      height: 574px;
    }
    .set-left {
      background-color: #f6f6f7;
      height: 100%;
      width: 180px;
      .tabs-container {
        // background-color: #fff;
        width: 148px;
        margin: 117px 0 0 16px;
        height: 300px;
        .tab{
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          padding-left: 20px;
          border-radius: 4px;
          font-weight: 600;
          margin: 10px 0 ;
          // background-color: red;
          &.current{
            background-color: #fff;
          }
        }
      }
    }
    .set-right {
      background-color: #fff;
      height: 100%;
      width: 500px;
      .set-right-tittle {
        height: 64px;
        line-height: 64px;
        font-weight: bold;
        font-size: 16px;
        padding-left: 24px;
      }
      .set-right-content{
        width: 543px;
        box-sizing: border-box;
        padding: 0 20px;
        height: 100%;
      }
    }
  }
}
</style>

