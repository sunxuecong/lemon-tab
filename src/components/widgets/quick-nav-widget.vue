/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 快捷导航组件 - 可拖拽组件
 */
<template>
  <div class="quick-nav-widget" :class="{ 'preview-mode': preview }">
    <div class="nav-container">
      <div class="nav-header" v-if="!preview">
        <span class="nav-title">快捷导航</span>
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
      <draggable
        v-model="navList"
        class="nav-grid"
        :animation="200"
        :disabled="!preview"
        :sort="false"
        @end="onNavDragEnd"
      >
        <div
          v-for="item in displayNavList"
          :key="item.id"
          class="nav-item"
          @click="handleNavClick(item)"
          @contextmenu.prevent="showNavMenu(item, $event)"
          :class="{ 'nav-weather': item.key === 'weather' }"
        >
          <div
            class="nav-icon"
            :style="[
              {
                backgroundColor: item.bgColor
                  ? item.bgColor
                  : `rgba(255, 255, 255, ${iconOpacity})`,
                borderRadius: `${iconRadius / 2}%`,
              },
            ]"
          >
            <template v-if="item.key === 'weather' && weatherData.now.cond_code">
              <d-icon
                v-size="'40%'"
                :icon="`icon-${$weatherIcon[weatherData.now.cond_code]}`"
              ></d-icon>
              <p class="weather-info">
                {{ weatherData.location }} {{ weatherData.now.cond_txt }}
                {{ weatherData.now.tmp }}°
              </p>
            </template>
            <template v-else-if="item.type === 2 && item.iconType === 'text'">
              <span
                :style="{ color: item.bgColor ? '#fff' : '' }"
                class="icon-text"
              >
                {{ item.icon }}
              </span>
            </template>
            <template v-else-if="item.type === 2 && item.icon">
              <img
                v-size="item.source ? '100%' : '38%'"
                :src="item.icon"
                alt=""
              />
            </template>
            <template v-else>
              <d-icon
                v-size="'42%'"
                v-color="item.color"
                :icon="`icon-${item.key}`"
              ></d-icon>
            </template>
          </div>
          <p class="nav-title" v-if="showTitle">
            <span>{{ item.title }}</span>
          </p>
        </div>
      </draggable>
    </div>

    <el-dialog
      title="添加导航"
      :visible.sync="showAddDialog"
      width="400px"
      center
    >
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="网站名称">
          <el-input v-model="addForm.title" placeholder="请输入网站名称"></el-input>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="addForm.url" placeholder="请输入网址，如：https://www.example.com"></el-input>
        </el-form-item>
        <el-form-item label="图标类型">
          <el-radio-group v-model="addForm.iconType">
            <el-radio label="text">文字图标</el-radio>
            <el-radio label="image">图片图标</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标内容" v-if="addForm.iconType === 'text'">
          <el-input v-model="addForm.icon" placeholder="输入1-2个字符作为图标" maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="图标地址" v-else>
          <el-input v-model="addForm.icon" placeholder="请输入图片URL"></el-input>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="addForm.bgColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddNav">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑导航"
      :visible.sync="showEditDialog"
      width="400px"
      center
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="网站名称">
          <el-input v-model="editForm.title" placeholder="请输入网站名称"></el-input>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="editForm.url" placeholder="请输入网址"></el-input>
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="editForm.bgColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditNav">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "QuickNavWidget",
  components: { draggable },
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
  data() {
    return {
      showAddDialog: false,
      showEditDialog: false,
      currentEditItem: null,
      addForm: {
        title: "",
        url: "",
        iconType: "text",
        icon: "",
        bgColor: "#409eff",
      },
      editForm: {
        title: "",
        url: "",
        bgColor: "",
      },
    };
  },
  computed: {
    navList() {
      return this.$store.state.navList;
    },
    displayNavList() {
      return this.navList.filter(item => item.key !== 'add');
    },
    iconSize() {
      return this.$store.state.setContent.iconSize || 82;
    },
    iconRadius() {
      return this.$store.state.setContent.iconRadius || 100;
    },
    iconOpacity() {
      return (this.$store.state.setContent.iconOpacity || 90) / 100;
    },
    showTitle() {
      return this.$store.state.setContent.iconTitle;
    },
    weatherData() {
      return this.$store.state.weather || {};
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleNavClick(item) {
      if (item.type === 0 || item.type === 2) {
        if (item.url) {
          window.open(item.url, "_blank");
        }
      } else if (item.type === 1) {
        if (item.key === "add") {
          this.showAddDialog = true;
        } else {
          this.$store.commit("setShowSide", {
            val: true,
            comp: item.key,
          });
        }
      }
    },
    showNavMenu(item, event) {
      if (item.type === 2) {
        this.$confirm("是否编辑或删除此导航？", "提示", {
          confirmButtonText: "编辑",
          cancelButtonText: "删除",
          type: "warning",
        })
          .then(() => {
            this.currentEditItem = item;
            this.editForm = {
              title: item.title,
              url: item.url,
              bgColor: item.bgColor || "",
            };
            this.showEditDialog = true;
          })
          .catch(() => {
            this.$store.commit("setNavList", this.navList.filter(n => n.id !== item.id));
          });
      }
    },
    handleAddNav() {
      if (!this.addForm.title || !this.addForm.url) {
        this.$message.warning("请填写完整信息");
        return;
      }
      const newItem = {
        id: Date.now(),
        type: 2,
        title: this.addForm.title,
        url: this.addForm.url.startsWith("http")
          ? this.addForm.url
          : `https://${this.addForm.url}`,
        iconType: this.addForm.iconType,
        icon: this.addForm.icon || this.addForm.title.substring(0, 2),
        bgColor: this.addForm.bgColor,
        key: "custom",
      };
      const addIndex = this.navList.findIndex((item) => item.key === "add");
      if (addIndex !== -1) {
        this.navList.splice(addIndex, 0, newItem);
      } else {
        this.navList.push(newItem);
      }
      this.$store.commit("setNavList", [...this.navList]);
      this.showAddDialog = false;
      this.addForm = {
        title: "",
        url: "",
        iconType: "text",
        icon: "",
        bgColor: "#409eff",
      };
      this.$message.success("添加成功");
    },
    handleEditNav() {
      const index = this.navList.findIndex(n => n.id === this.currentEditItem.id);
      if (index !== -1) {
        this.navList[index] = {
          ...this.navList[index],
          ...this.editForm,
        };
        this.$store.commit("setNavList", [...this.navList]);
        this.showEditDialog = false;
        this.$message.success("修改成功");
      }
    },
    onNavDragEnd(event) {
      const { oldIndex, newIndex } = event;
      if (oldIndex === newIndex) return;
      this.$store.commit("setNavList", [...this.navList]);
    },
  },
};
</script>

<style lang="less" scoped>
.quick-nav-widget {
  width: 100%;

  &.preview-mode {
    transform: scale(0.8);
    transform-origin: top center;
  }

  .nav-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;

    .nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .nav-title {
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

    .nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 15px;
    }

    .nav-item {
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);

        .nav-icon {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
      }

      &.nav-weather {
        .nav-icon {
          flex-direction: column;
          padding: 10px;
        }
      }

      .nav-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        .icon-text {
          font-size: 24px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .weather-info {
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 5px;
        }

        img {
          object-fit: cover;
          border-radius: inherit;
        }
      }

      .nav-title {
        margin-top: 8px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          display: block;
        }
      }
    }
  }
}
</style>
