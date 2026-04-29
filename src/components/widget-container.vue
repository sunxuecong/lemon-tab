/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 可拖拽组件容器
 */
<template>
  <div class="widget-container" :class="{ 'edit-mode': isWidgetEdit }">
    <draggable
      v-model="widgets"
      class="widget-list"
      :animation="300"
      :disabled="!isWidgetEdit"
      :handle="isWidgetEdit ? '.widget-header' : null"
      :ghost-class="isWidgetEdit ? 'ghost-widget' : ''"
      :drag-class="isWidgetEdit ? 'drag-widget' : ''"
      @end="onDragEnd"
    >
      <transition-group
        v-if="!isWidgetEdit"
        name="widget"
        tag="div"
        class="widget-list"
      >
        <div
          v-for="widget in widgets"
          :key="widget.id"
          class="widget-item"
          :style="widgetStyle(widget)"
        >
          <component
            :is="getWidgetComponent(widget.type)"
            :widget="widget"
          />
        </div>
      </transition-group>
      <template v-else>
        <div
          v-for="widget in widgets"
          :key="widget.id"
          class="widget-item edit-widget"
          :style="widgetStyle(widget)"
        >
          <div class="widget-header">
            <div class="widget-title">{{ widget.title }}</div>
            <div class="widget-controls">
              <el-button
                size="mini"
                icon="el-icon-delete"
                circle
                @click.stop="toggleWidgetVisibility(widget)"
                :title="widget.visible ? '隐藏组件' : '显示组件'"
              >
                <i :class="widget.visible ? 'el-icon-view' : 'el-icon-hide'"></i>
              </el-button>
            </div>
          </div>
          <component
            :is="getWidgetComponent(widget.type)"
            :widget="widget"
            :preview="true"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
// 动态导入组件
const widgetComponents = {
  time: () => import("@/components/widgets/time-widget.vue"),
  search: () => import("@/components/widgets/search-widget.vue"),
  weather: () => import("@/components/widgets/weather-widget.vue"),
  quickNav: () => import("@/components/widgets/quick-nav-widget.vue"),
  todo: () => import("@/components/widgets/todo-widget.vue"),
  bookmark: () => import("@/components/widgets/bookmark-widget.vue"),
};

export default {
  name: "WidgetContainer",
  components: { draggable },
  data() {
    return {
      widgetComponents,
    };
  },
  computed: {
    widgets() {
      return this.$store.state.widgets;
    },
    isWidgetEdit() {
      return this.$store.state.isWidgetEdit;
    },
    widgetOpacity() {
      return this.$store.state.setContent.widgetOpacity || 90;
    },
  },
  watch: {},
  methods: {
    getWidgetComponent(type) {
      return widgetComponents[type] || widgetComponents.time;
    },
    widgetStyle(widget) {
      const opacity = this.widgetOpacity / 100;
      return {
        opacity: widget.visible ? 1 : 0.3,
        pointerEvents: widget.visible ? "auto" : "none",
      };
    },
    onDragEnd(event) {
      const { oldIndex, newIndex } = event;
      if (oldIndex === newIndex) return;
      const widgets = [...this.widgets];
      const [moved] = widgets.splice(oldIndex, 1);
      widgets.splice(newIndex, 0, moved);
      widgets.forEach((w, i) => {
        w.order = i + 1;
      });
      this.$store.commit("setWidgets", widgets);
    },
    toggleWidgetVisibility(widget) {
      this.$store.commit("updateWidget", {
        id: widget.id,
        updates: { visible: !widget.visible },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.widget-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  &.edit-mode {
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
  }

  .widget-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .widget-item {
    transition: all 0.3s ease;
    position: relative;

    &.edit-widget {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px 10px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
        cursor: move;

        .widget-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .widget-controls {
          display: flex;
          gap: 5px;
        }
      }
    }

    .ghost-widget {
      opacity: 0.5;
      background: #c8ebfb !important;
    }

    .drag-widget {
      opacity: 0.8;
      transform: rotate(3deg);
    }
  }

  // 组件进入/离开动画
  .widget-enter-active,
  .widget-leave-active {
    transition: all 0.5s ease;
  }

  .widget-enter {
    opacity: 0;
    transform: translateY(-20px);
  }

  .widget-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  .widget-move {
    transition: transform 0.5s ease;
  }
}
</style>
