/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 书签组件 - 可拖拽组件
 */
<template>
  <div class="bookmark-widget" :class="{ 'preview-mode': preview }">
    <div class="bookmark-container">
      <div class="bookmark-header" v-if="!preview">
        <span class="bookmark-title">书签</span>
        <el-button
          size="mini"
          type="text"
          @click="showAddDialog = true"
          class="add-btn"
        >
          <d-icon v-size="16" icon="icon-add"></d-icon>
          添加
        </el-button>
      </div>

      <div class="bookmark-tabs" v-if="bookmarks.length > 0">
        <span
          v-for="(group, index) in bookmarkGroups"
          :key="group"
          class="tab-item"
          :class="{ active: currentGroup === group }"
          @click="currentGroup = group"
        >
          {{ group || '默认' }}
        </span>
      </div>

      <div class="bookmark-grid">
        <transition-group name="bookmark-list" tag="div" class="grid-content">
          <div
            v-for="item in currentBookmarks"
            :key="item.id"
            class="bookmark-item"
            @click="openBookmark(item)"
            @contextmenu.prevent="showBookmarkMenu(item, $event)"
          >
            <div class="bookmark-icon" :style="{ background: item.bgColor || '#409eff' }">
              <template v-if="item.icon">
                <img v-if="item.iconType === 'image'" :src="item.icon" alt="" />
                <span v-else class="icon-text">{{ item.icon }}</span>
              </template>
              <d-icon v-else v-size="50%" icon="icon-link"></d-icon>
            </div>
            <div class="bookmark-info">
              <p class="bookmark-name">{{ item.name }}</p>
              <p class="bookmark-url">{{ formatUrl(item.url) }}</p>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="bookmark-empty" v-if="currentBookmarks.length === 0">
        <d-icon v-size="48" icon="icon-bookmark"></d-icon>
        <p>{{ currentGroup ? '暂无书签' : '暂无书签，点击添加按钮创建' }}</p>
      </div>
    </div>

    <el-dialog
      title="添加书签"
      :visible.sync="showAddDialog"
      width="450px"
      center
    >
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="书签名称">
          <el-input v-model="addForm.name" placeholder="请输入书签名称"></el-input>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="addForm.url" placeholder="请输入网址，如：https://www.example.com"></el-input>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="addForm.group" placeholder="选择分组" allow-create clearable>
            <el-option
              v-for="group in bookmarkGroups.filter(g => g)"
              :key="group"
              :label="group"
              :value="group"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标类型">
          <el-radio-group v-model="addForm.iconType">
            <el-radio label="default">默认图标</el-radio>
            <el-radio label="text">文字图标</el-radio>
            <el-radio label="image">自定义图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标内容" v-if="addForm.iconType === 'text'">
          <el-input v-model="addForm.icon" placeholder="输入1-2个字符" maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" v-else-if="addForm.iconType === 'image'">
          <el-input v-model="addForm.icon" placeholder="请输入图片URL"></el-input>
        </el-form-item>
        <el-form-item label="图标颜色">
          <el-color-picker v-model="addForm.bgColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddBookmark">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑书签"
      :visible.sync="showEditDialog"
      width="450px"
      center
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="书签名称">
          <el-input v-model="editForm.name" placeholder="请输入书签名称"></el-input>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="editForm.url" placeholder="请输入网址"></el-input>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="editForm.group" placeholder="选择分组" allow-create clearable>
            <el-option
              v-for="group in bookmarkGroups.filter(g => g)"
              :key="group"
              :label="group"
              :value="group"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标颜色">
          <el-color-picker v-model="editForm.bgColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditBookmark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "BookmarkWidget",
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
      showAddDialog: false,
      showEditDialog: false,
      currentEditItem: null,
      currentGroup: "",
      addForm: {
        name: "",
        url: "",
        group: "",
        iconType: "default",
        icon: "",
        bgColor: "#409eff",
      },
      editForm: {
        name: "",
        url: "",
        group: "",
        bgColor: "",
      },
    };
  },
  computed: {
    bookmarks() {
      return this.$store.state.bookmarks || [];
    },
    bookmarkGroups() {
      const groups = new Set();
      groups.add("");
      this.bookmarks.forEach((item) => {
        if (item.group) {
          groups.add(item.group);
        }
      });
      return Array.from(groups);
    },
    currentBookmarks() {
      return this.bookmarks.filter(
        (item) => item.group === this.currentGroup || (!item.group && !this.currentGroup)
      );
    },
  },
  created() {
    if (this.preview) {
      this.$store.commit("setBookmarks", [
        {
          id: 1,
          name: "百度",
          url: "https://www.baidu.com",
          group: "",
          bgColor: "#2378F3",
        },
        {
          id: 2,
          name: "GitHub",
          url: "https://github.com",
          group: "开发",
          bgColor: "#24292E",
        },
        {
          id: 3,
          name: "Stack Overflow",
          url: "https://stackoverflow.com",
          group: "开发",
          bgColor: "#F48024",
        },
      ]);
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    formatUrl(url) {
      try {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
        return urlObj.hostname;
      } catch {
        return url.substring(0, 30);
      }
    },
    openBookmark(item) {
      const url = item.url.startsWith("http") ? item.url : `https://${item.url}`;
      window.open(url, "_blank");
    },
    showBookmarkMenu(item, event) {
      this.$confirm("是否编辑或删除此书签？", "提示", {
        confirmButtonText: "编辑",
        cancelButtonText: "删除",
        type: "warning",
      })
        .then(() => {
          this.currentEditItem = item;
          this.editForm = {
            name: item.name,
            url: item.url,
            group: item.group || "",
            bgColor: item.bgColor || "#409eff",
          };
          this.showEditDialog = true;
        })
        .catch(() => {
          this.$store.commit("deleteBookmark", item.id);
          this.$message.success("删除成功");
        });
    },
    handleAddBookmark() {
      if (!this.addForm.name || !this.addForm.url) {
        this.$message.warning("请填写完整信息");
        return;
      }
      const newBookmark = {
        id: dayjs().valueOf(),
        name: this.addForm.name,
        url: this.addForm.url.startsWith("http")
          ? this.addForm.url
          : `https://${this.addForm.url}`,
        group: this.addForm.group || "",
        iconType: this.addForm.iconType,
        icon: this.addForm.icon || "",
        bgColor: this.addForm.bgColor,
        created: dayjs().valueOf(),
      };
      this.$store.commit("addBookmark", newBookmark);
      this.showAddDialog = false;
      this.addForm = {
        name: "",
        url: "",
        group: "",
        iconType: "default",
        icon: "",
        bgColor: "#409eff",
      };
      this.$message.success("添加成功");
    },
    handleEditBookmark() {
      this.$store.commit("updateBookmark", {
        id: this.currentEditItem.id,
        updates: {
          ...this.editForm,
          url: this.editForm.url.startsWith("http")
            ? this.editForm.url
            : `https://${this.editForm.url}`,
        },
      });
      this.showEditDialog = false;
      this.$message.success("修改成功");
    },
  },
};
</script>

<style lang="less" scoped>
.bookmark-widget {
  width: 100%;

  &.preview-mode {
    transform: scale(0.8);
    transform-origin: top center;
  }

  .bookmark-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    max-height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .bookmark-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .bookmark-title {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
      }

      .add-btn {
        color: rgba(255, 255, 255, 0.8);
        padding: 5px 10px;
        transition: all 0.2s ease;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .bookmark-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .tab-item {
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.1);
        }

        &.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .bookmark-grid {
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

      .grid-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
    }

    .bookmark-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .bookmark-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        flex-shrink: 0;
        color: #fff;

        img {
          width: 24px;
          height: 24px;
          object-fit: cover;
        }

        .icon-text {
          font-size: 16px;
          font-weight: 600;
        }
      }

      .bookmark-info {
        flex: 1;
        min-width: 0;

        .bookmark-name {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 3px;
        }

        .bookmark-url {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .bookmark-empty {
      text-align: center;
      padding: 40px 0;
      color: rgba(255, 255, 255, 0.4);

      p {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}

// 动画
.bookmark-list-enter-active,
.bookmark-list-leave-active {
  transition: all 0.3s ease;
}

.bookmark-list-enter,
.bookmark-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
