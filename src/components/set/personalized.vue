/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 个性化设置组件
 */
<template>
  <div class="personalized-set">
    <section class="set-section">
      <h3>组件布局</h3>
      <ul>
        <li class="d-flex-between">
          <div>
            组件编辑模式
            <p class="f12" v-color="'#999'">开启后可以拖拽调整组件顺序，隐藏/显示组件</p>
          </div>
          <el-switch
            v-model="isWidgetEdit"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </li>
        <li class="d-flex-between">
          <div>
            组件透明度
            <p class="f12" v-color="'#999'">调整所有组件的背景透明度</p>
          </div>
          <div class="slider-box">
            <el-slider
              v-model="widgetOpacity"
              :min="50"
              :max="100"
              :step="5"
              show-input
              :show-input-controls="false"
              input-size="small"
            ></el-slider>
            <span class="slider-value">{{ widgetOpacity }}%</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="set-section">
      <h3>自动壁纸</h3>
      <ul>
        <li class="d-flex-between">
          <div>
            开启自动壁纸
            <p class="f12" v-color="'#999'">自动切换必应每日壁纸</p>
          </div>
          <el-switch
            v-model="autoWallpaper"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </li>
        <li class="d-flex-between" v-if="autoWallpaper">
          <div>
            切换间隔
            <p class="f12" v-color="'#999'">设置壁纸自动切换的时间间隔</p>
          </div>
          <el-select v-model="wallpaperInterval" size="small" style="width: 120px">
            <el-option label="每小时" :value="1"></el-option>
            <el-option label="每6小时" :value="6"></el-option>
            <el-option label="每天" :value="24"></el-option>
            <el-option label="每周" :value="168"></el-option>
          </el-select>
        </li>
        <li class="d-flex-between">
          <div>
            背景模糊程度
            <p class="f12" v-color="'#999'">调整壁纸背景的模糊效果</p>
          </div>
          <div class="slider-box">
            <el-slider
              v-model="bgBlur"
              :min="0"
              :max="50"
              :step="2"
              show-input
              :show-input-controls="false"
              input-size="small"
            ></el-slider>
            <span class="slider-value">{{ bgBlur }}px</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="set-section">
      <h3>搜索设置</h3>
      <ul>
        <li class="d-flex-between">
          <div>
            记录搜索历史
            <p class="f12" v-color="'#999'">开启后将记录您的搜索关键词</p>
          </div>
          <el-switch
            v-model="searchHistoryEnabled"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </li>
        <li class="d-flex-between" v-if="searchHistoryEnabled">
          <div>
            历史记录数量
            <p class="f12" v-color="'#999'">最多保存的搜索历史数量</p>
          </div>
          <el-select v-model="searchHistoryMax" size="small" style="width: 120px">
            <el-option label="20条" :value="20"></el-option>
            <el-option label="50条" :value="50"></el-option>
            <el-option label="100条" :value="100"></el-option>
            <el-option label="200条" :value="200"></el-option>
          </el-select>
        </li>
        <li class="d-flex-between">
          <div>
            默认搜索引擎
            <p class="f12" v-color="'#999'">选择您喜欢的默认搜索引擎</p>
          </div>
          <el-select v-model="defaultSearch" size="small" style="width: 120px">
            <el-option label="百度" value="baidu"></el-option>
            <el-option label="必应" value="bing"></el-option>
            <el-option label="Google" value="google"></el-option>
            <el-option label="搜狗" value="sogou"></el-option>
            <el-option label="360" value="360"></el-option>
          </el-select>
        </li>
      </ul>
    </section>

    <section class="set-section">
      <h3>动画效果</h3>
      <ul>
        <li class="d-flex-between">
          <div>
            流畅动画
            <p class="f12" v-color="'#999'">开启后将显示更丰富的交互动画</p>
          </div>
          <el-switch
            v-model="smoothAnimation"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </li>
      </ul>
    </section>

    <section class="set-section">
      <h3>自定义主题</h3>
      <div class="theme-colors">
        <div class="color-item">
          <span class="color-label">主题色</span>
          <el-color-picker v-model="customTheme.primary" size="small"></el-color-picker>
        </div>
        <div class="color-item">
          <span class="color-label">辅助色</span>
          <el-color-picker v-model="customTheme.secondary" size="small"></el-color-picker>
        </div>
        <div class="color-item">
          <span class="color-label">强调色</span>
          <el-color-picker v-model="customTheme.accent" size="small"></el-color-picker>
        </div>
      </div>
      <div class="theme-presets">
        <span class="preset-label">主题预设</span>
        <div class="preset-list">
          <div
            v-for="(theme, index) in themePresets"
            :key="index"
            class="preset-item"
            @click="applyThemePreset(theme)"
            :style="{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "PersonalizedSet",
  props: {},
  components: {},
  data() {
    return {
      themePresets: [
        { primary: '#409eff', secondary: '#67c23a', accent: '#e6a23c' },
        { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
        { primary: '#f093fb', secondary: '#f5576c', accent: '#4facfe' },
        { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b' },
        { primary: '#fa709a', secondary: '#fee140', accent: '#30cfd0' },
        { primary: '#30cfd0', secondary: '#330867', accent: '#a8edea' },
      ],
    };
  },
  computed: {
    isWidgetEdit: {
      get() {
        return this.$store.state.isWidgetEdit;
      },
      set(val) {
        this.$store.commit("setWidgetEdit", val);
      },
    },
    widgetOpacity: {
      get() {
        return this.$store.state.setContent.widgetOpacity || 90;
      },
      set(val) {
        this.updateSetContent({ widgetOpacity: val });
      },
    },
    autoWallpaper: {
      get() {
        return this.$store.state.setContent.autoWallpaper || false;
      },
      set(val) {
        this.updateSetContent({ autoWallpaper: val });
      },
    },
    wallpaperInterval: {
      get() {
        return this.$store.state.setContent.wallpaperInterval || 24;
      },
      set(val) {
        this.updateSetContent({ wallpaperInterval: val });
      },
    },
    bgBlur: {
      get() {
        return this.$store.state.setContent.bgBlur || 0;
      },
      set(val) {
        this.updateSetContent({ bgBlur: val });
      },
    },
    searchHistoryEnabled: {
      get() {
        return this.$store.state.searchHistory.enabled !== false;
      },
      set(val) {
        this.$store.commit("setSearchHistory", {
          ...this.$store.state.searchHistory,
          enabled: val,
        });
      },
    },
    searchHistoryMax: {
      get() {
        return this.$store.state.searchHistory.maxItems || 50;
      },
      set(val) {
        this.$store.commit("setSearchHistory", {
          ...this.$store.state.searchHistory,
          maxItems: val,
        });
      },
    },
    defaultSearch: {
      get() {
        return this.$store.state.setContent.search || "baidu";
      },
      set(val) {
        this.updateSetContent({ search: val });
      },
    },
    smoothAnimation: {
      get() {
        return this.$store.state.setContent.smoothAnimation !== false;
      },
      set(val) {
        this.updateSetContent({ smoothAnimation: val });
      },
    },
    customTheme: {
      get() {
        return this.$store.state.setContent.customTheme || {
          primary: '#409eff',
          secondary: '#67c23a',
          accent: '#e6a23c',
        };
      },
      set(val) {
        this.updateSetContent({ customTheme: val });
      },
    },
  },
  watch: {
    customTheme: {
      handler(newVal) {
        this.applyCustomTheme(newVal);
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    updateSetContent(updates) {
      const setContent = {
        ...this.$store.state.setContent,
        ...updates,
      };
      this.$store.commit("setSetContent", setContent);
    },
    applyThemePreset(theme) {
      this.customTheme = { ...this.customTheme, ...theme };
      this.$message.success("主题已应用");
    },
    applyCustomTheme(theme) {
      const root = document.documentElement;
      if (theme.primary) {
        root.style.setProperty('--primary-color', theme.primary);
      }
      if (theme.secondary) {
        root.style.setProperty('--secondary-color', theme.secondary);
      }
      if (theme.accent) {
        root.style.setProperty('--accent-color', theme.accent);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.personalized-set {
  padding-right: 20px;

  .set-section {
    margin-bottom: 20px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    ul {
      li {
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .slider-box {
          display: flex;
          align-items: center;
          width: 200px;

          .el-slider {
            flex: 1;
            margin-right: 15px;
          }

          .slider-value {
            font-size: 12px;
            color: #666;
            min-width: 40px;
            text-align: right;
          }
        }
      }
    }
  }

  .theme-colors {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .color-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .color-label {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .theme-presets {
    .preset-label {
      font-size: 12px;
      color: #666;
      display: block;
      margin-bottom: 10px;
    }

    .preset-list {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      .preset-item {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
}
</style>
