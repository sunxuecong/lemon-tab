/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 待办事项组件 - 可拖拽组件
 */
<template>
  <div class="todo-widget" :class="{ 'preview-mode': preview }">
    <div class="todo-container">
      <div class="todo-header" v-if="!preview">
        <span class="todo-title">待办事项</span>
        <el-badge :value="unfinishCount" :hidden="unfinishCount === 0" class="item">
          <span class="todo-count">{{ unfinishCount }} 项待办</span>
        </el-badge>
      </div>

      <div class="todo-input-box" v-if="!preview">
        <el-input
          v-model.trim="newTodo"
          placeholder="添加新任务，按回车确认"
          @keyup.enter.native="addTodo"
          size="small"
          clearable
        >
          <el-button slot="append" icon="el-icon-plus" @click="addTodo"></el-button>
        </el-input>
      </div>

      <div class="todo-list-box">
        <transition-group name="todo-list" tag="ul" class="todo-list">
          <li
            v-for="(item, index) in unfinishList"
            :key="item.created"
            class="todo-item"
          >
            <div class="todo-item-left">
              <el-checkbox
                v-model="item.checked"
                @change="toggleTodo(item, index, 'unfinish')"
              ></el-checkbox>
              <span class="todo-text">{{ item.text }}</span>
            </div>
            <div class="todo-item-right">
              <span class="todo-time">{{ formatTime(item.created) }}</span>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-close"
                @click="deleteTodo('unfinish', index)"
                class="delete-btn"
              ></el-button>
            </div>
          </li>
        </transition-group>

        <div class="todo-empty" v-if="unfinishList.length === 0 && finishList.length === 0">
          <d-icon v-size="48" icon="icon-check-circle"></d-icon>
          <p>暂无待办事项</p>
        </div>

        <div class="finish-section" v-if="finishList.length > 0">
          <div class="finish-header" @click="showFinish = !showFinish">
            <el-icon :class="{ 'rotate': showFinish }">
              <el-icon-arrow-right />
            </el-icon>
            <span>已完成 ({{ finishList.length }})</span>
          </div>
          <transition name="el-zoom-in-top">
            <ul class="todo-list finish-list" v-show="showFinish">
              <li
                v-for="(item, index) in finishList"
                :key="item.created"
                class="todo-item finish-item"
              >
                <div class="todo-item-left">
                  <el-checkbox
                    v-model="item.checked"
                    @change="toggleTodo(item, index, 'finish')"
                  ></el-checkbox>
                  <span class="todo-text">{{ item.text }}</span>
                </div>
                <div class="todo-item-right">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-close"
                    @click="deleteTodo('finish', index)"
                    class="delete-btn"
                  ></el-button>
                </div>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "TodoWidget",
  props: {
    widget: {
      type: Object,
      default: () => ({}),
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      newTodo: "",
      showFinish: false,
      unfinishList: [],
      finishList: [],
    };
  },
  computed: {
    unfinishCount() {
      return this.unfinishList.length;
    },
  },
  created() {
    this.initTodo();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    initTodo() {
      const todo = this.$local.get("todo") || {};
      this.unfinishList = todo.unfinish || [];
      this.finishList = todo.finish || [];
    },
    formatTime(timestamp) {
      const now = dayjs();
      const time = dayjs(timestamp);
      const diffDays = now.diff(time, "day");

      if (diffDays === 0) {
        return "今天";
      } else if (diffDays === 1) {
        return "昨天";
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return time.format("MM-DD");
      }
    },
    saveTodo() {
      this.$local.set("todo", {
        unfinish: this.unfinishList,
        finish: this.finishList,
      });
      this.$store.dispatch("saveConfig");
    },
    addTodo() {
      if (!this.newTodo.trim()) {
        return;
      }
      const newItem = {
        text: this.newTodo.trim(),
        created: dayjs().valueOf(),
        checked: false,
      };
      this.unfinishList.unshift(newItem);
      this.newTodo = "";
      this.saveTodo();
    },
    toggleTodo(item, index, type) {
      const list = type === "unfinish" ? this.unfinishList : this.finishList;
      const targetList = type === "unfinish" ? this.finishList : this.unfinishList;

      list.splice(index, 1);
      item.checked = type === "unfinish";
      if (type === "unfinish") {
        targetList.unshift(item);
      } else {
        targetList.unshift(item);
      }
      this.saveTodo();
    },
    deleteTodo(type, index) {
      const list = type === "unfinish" ? this.unfinishList : this.finishList;
      list.splice(index, 1);
      this.saveTodo();
    },
  },
};
</script>

<style lang="less" scoped>
.todo-widget {
  width: 100%;

  &.preview-mode {
    transform: scale(0.8);
    transform-origin: top center;
  }

  .todo-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    max-height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .todo-title {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }

      .todo-count {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
    }

    .todo-input-box {
      margin-bottom: 15px;

      ::v-deep .el-input__inner {
        background: rgba(255, 255, 255, 0.15);
        border: none;
        color: #fff;

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          background: rgba(255, 255, 255, 0.25);
        }
      }

      ::v-deep .el-input-group__append {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        padding: 0 15px;

        .el-button {
          background: transparent;
          border: none;
          color: #fff;

          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }

    .todo-list-box {
      flex: 1;
      overflow-y: auto;
      margin-right: -20px;
      padding-right: 20px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
      }
    }

    .todo-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        margin: 0 -10px;
        padding: 10px;
        border-radius: 8px;

        .delete-btn {
          opacity: 1;
        }
      }

      .todo-item-left {
        display: flex;
        align-items: flex-start;
        flex: 1;
        min-width: 0;

        .todo-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          line-height: 1.5;
          margin-left: 10px;
          word-break: break-all;
        }
      }

      .todo-item-right {
        display: flex;
        align-items: center;
        margin-left: 10px;

        .todo-time {
          color: rgba(255, 255, 255, 0.4);
          font-size: 12px;
          margin-right: 5px;
        }

        .delete-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
          color: rgba(255, 255, 255, 0.4);
          padding: 0;

          &:hover {
            color: #f56c6c;
          }
        }
      }
    }

    .todo-item.finish-item {
      .todo-text {
        text-decoration: line-through;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .todo-empty {
      text-align: center;
      padding: 30px 0;
      color: rgba(255, 255, 255, 0.4);

      p {
        margin-top: 10px;
        font-size: 14px;
      }
    }

    .finish-section {
      margin-top: 10px;

      .finish-header {
        display: flex;
        align-items: center;
        padding: 10px 0;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
        font-size: 13px;
        transition: all 0.2s ease;

        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .el-icon {
          margin-right: 5px;
          transition: transform 0.3s ease;

          &.rotate {
            transform: rotate(90deg);
          }
        }
      }

      .finish-list {
        padding-left: 10px;

        .todo-item {
          padding: 8px 0;
          border-bottom: none;
        }
      }
    }
  }
}

// 动画
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter,
.todo-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
