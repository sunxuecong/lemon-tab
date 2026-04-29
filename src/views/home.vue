/*
 * @Author: sunxc
 * @Date: 2020-10-10 18:08:41
 * @LastEditors: sunxc
 * @LastEditTime: 2024-04-29
 * @Description: file content - 升级为可拖拽组件系统
*/
<template>
  <div class="app-container">
    <!-- 编辑模式工具栏 -->
    <transition name="fade">
      <div class="edit-toolbar" v-if="isWidgetEdit">
        <div class="edit-toolbar-content">
          <span class="edit-hint">
            <d-icon v-size="18" icon="icon-edit"></d-icon>
            组件编辑模式 - 拖拽调整顺序，点击图标切换显示
          </span>
          <el-button
            type="primary"
            size="small"
            @click="toggleEditMode"
            class="save-btn"
          >
            完成编辑
          </el-button>
        </div>
      </div>
    </transition>

    <!-- 主内容区 -->
    <div class="app-content" :class="{ 'edit-mode': isWidgetEdit }">
      <!-- 可拖拽组件容器 -->
      <widget-container />
    </div>

    <!-- 便笺贴 -->
    <pinned />
    <!-- 设置 -->
    <Set></Set>
    <bottom></bottom>

    <login />
  </div>
</template>

<script>
import Set from "@/components/set";
import bottom from "@/components/bottom";
import login from "@/components/login";
import pinned from "@/components/pinned";
import widgetContainer from "@/components/widget-container";

export default {
  name: "",
  props: {},
  components: {
    bottom,
    Set,
    pinned,
    login,
    widgetContainer,
  },
  data() {
    return {};
  },
  computed: {
    isWidgetEdit() {
      return this.$store.state.isWidgetEdit;
    },
  },
  created() {},
  mounted() {},
  methods: {
    toggleEditMode() {
      this.$store.commit("setWidgetEdit", !this.isWidgetEdit);
    },
  },
};
</script>
<style lang='less' scoped>
.app-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.app-content {
  height: 100%;
  display: flex;
  flex-flow: column;
  padding-top: 0;
  transition: padding-top 0.3s ease;

  &.edit-mode {
    padding-top: 60px;
  }
}

// 编辑模式工具栏
.edit-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);

  .edit-toolbar-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .edit-hint {
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .save-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
