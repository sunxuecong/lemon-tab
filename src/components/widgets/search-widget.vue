/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 搜索组件 - 可拖拽组件，支持多引擎搜索和历史记忆
 */
<template>
  <div class="search-widget" :class="{ 'preview-mode': preview }">
    <div class="d-flex-hor">
      <div class="app-serach-box">
        <div class="se-input-box" :class="{ active: value, 'search-focus': isFocused }">
          <div class="se-select" @click.stop="isShowSelect = !isShowSelect" title="选择搜索引擎">
            <d-icon v-size="20" :icon="`icon-${currSearch.icon}`"></d-icon>
          </div>
          <input
            v-focus="true"
            v-model.trim="value"
            class="se-input"
            @input="keyWordList"
            @keyup.13="searchHandle(value)"
            @keydown="keydown"
            @focus="isFocused = true"
            @blur="isFocused = false"
            placeholder="输入并搜索"
            type="text"
          />
          <div class="se-close" v-show="value" @click="clearSearch">
            <d-icon v-size="20" icon="icon-clost" class="select-icon"></d-icon>
          </div>
          <div class="se-select" @click="searchHandle(value)">
            <d-icon v-size="20" icon="icon-search" class="select-icon"></d-icon>
          </div>
        </div>
        <div class="se-list-keyword">
          <transition name="fade">
            <ul class="se-all" :class="{ action: isShowSelect }" v-show="isShowSelect">
              <li
                class="se-item"
                v-for="(item, index) of searchList"
                :key="item.key"
                :title="item.title"
              >
                <span
                  @click.stop="clickSelect(item)"
                  class="se-item-icon"
                  :style="{ transition: `${0.2 * (index + 1)}s` }"
                  :class="{ action: item.key == currSearch.key }"
                >
                  <d-icon v-size="18" :icon="`icon-${item.icon}`"></d-icon>
                </span>
              </li>
            </ul>
          </transition>
          <transition name="fade">
            <ul
              class="se-keyword al"
              v-if="showKeyWord"
              :style="{ height: keyListHeight }"
            >
              <li
                v-if="keyList.length === 0 && searchHistoryItems.length > 0"
                class="se-keyword-header d-flex-between"
              >
                <span class="f12" v-color="'rgba(255,255,255,0.6)'">搜索历史</span>
                <span class="f12" v-color="'var(--primary-color)'" @click.stop="clearHistory" style="cursor: pointer;">清空</span>
              </li>
              <li
                v-if="keyList.length === 0 && searchHistoryItems.length > 0"
                class="se-keyword-item d-elip"
                v-for="(item, index) of searchHistoryItems.slice(0, 5)"
                :key="item.timestamp"
                @click.stop="searchFromHistory(item)"
                :class="{ focus: keyIndex == index + 1 }"
              >
                <d-icon icon="icon-clock" class="select-icon" v-size="15"></d-icon>
                <span>{{ item.keyword }}</span>
                <span class="search-engine-tag f10">{{ item.searchEngine }}</span>
              </li>
              <li
                v-else-if="keyList.length > 0"
                class="se-keyword-header"
              >
                <span class="f12" v-color="'rgba(255,255,255,0.6)'">搜索建议</span>
              </li>
              <li
                v-else-if="keyList.length > 0"
                @click.stop="searchHandle(value)"
                class="se-keyword-item d-elip"
                @keydown="keydown"
                :class="{ focus: keyIndex === 0 }"
              >
                <d-icon icon="icon-search" class="select-icon"></d-icon>
                <span>{{ tranText }}</span>
              </li>
              <li
                v-else-if="keyList.length > 0"
                @click.stop="searchHandle(item)"
                class="se-keyword-item d-elip"
                v-for="(item, index) of keyList"
                :class="{ focus: keyIndex == index + 1 }"
                :key="item"
                :data-index="index + 1"
              >
                <d-icon icon="icon-search" v-size="15" class="select-icon"></d-icon>
                <span>{{ item }}</span>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsonp } from "vue-jsonp";
import axios from "axios";

export default {
  name: "SearchWidget",
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
      value: "",
      isShowSelect: false,
      showKeyWord: false,
      isFocused: false,
      searchList: [
        {
          key: "baidu",
          title: "百度搜索",
          icon: "baidu",
          href: "http://www.baidu.com/s?wd=",
          translate: "https://fanyi.baidu.com/translate?#zh/en/",
        },
        {
          key: "bing",
          title: "必应搜索",
          icon: "bing",
          href: "https://cn.bing.com/search?q=",
          translate: "https://fanyi.baidu.com/translate?#zh/en/",
        },
        {
          key: "google",
          title: "Google搜索",
          icon: "google",
          href: "https://www.google.com/search?q=",
          translate:
            "https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text=",
        },
        {
          key: "sogou",
          title: "搜狗搜索",
          icon: "sogou",
          href: "https://www.sogou.com/web?query=",
          translate: "https://fanyi.baidu.com/translate?#zh/en/",
        },
        {
          key: "360",
          title: "360搜索",
          icon: "360",
          href: "https://www.so.com/s?q=",
          translate: "https://fanyi.baidu.com/translate?#zh/en/",
        },
      ],
      currSearch: {},
      keyList: [],
      keyListHeight: "0px",
      tranText: "",
      keyIndex: -1,
    };
  },
  computed: {
    searchHistoryItems() {
      return this.$store.getters.searchHistoryItems;
    },
    searchHistoryEnabled() {
      return this.$store.state.searchHistory.enabled;
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      let search = this.$store.state.setContent.search || "baidu";
      this.currSearch = this.searchList.find((v) => v.key == search);
      document.addEventListener(
        "click",
        () => {
          this.showKeyWord = false;
          this.isShowSelect = false;
        },
        false
      );
    },
    keydown(el) {
      let keyCode = el.keyCode;
      const maxIndex = Math.max(
        this.keyList.length,
        this.searchHistoryItems.length
      );
      if (keyCode === 40) {
        this.keyIndex++;
        if (this.keyIndex >= maxIndex + 1) {
          this.keyIndex = 0;
        }
      } else if (keyCode === 38) {
        el.preventDefault();
        this.keyIndex--;
        if (this.keyIndex < 0) {
          this.keyIndex = maxIndex;
        }
      }
      if (this.keyIndex > 0) {
        if (this.keyList.length > 0) {
          this.value = this.keyList[this.keyIndex - 1];
        } else if (this.searchHistoryItems.length > 0) {
          this.value = this.searchHistoryItems[this.keyIndex - 1].keyword;
        }
      }
    },
    keyWordList() {
      if (!this.value) {
        this.keyList = [];
        if (this.searchHistoryEnabled && this.searchHistoryItems.length > 0) {
          this.showKeyWord = true;
          this.keyListHeight = this.searchHistoryItems.slice(0, 5).length * 34 + 34 + "px";
        } else {
          this.showKeyWord = false;
          this.keyListHeight = "0px";
        }
        return;
      }
      this.showKeyWord = true;
      this.tranText = this.value;
      this.keyIndex = -1;
      jsonp(`https://www.baidu.com/sugrec?&prod=pc&wd=${this.value}`).then(
        (res) => {
          let data = res;
          this.keyList = data.g || [];
          this.keyList = this.keyList.map((item) => item.q);
          this.keyListHeight = this.keyList.length * 34 + 34 + 20 + "px";
        }
      );
    },
    clickSelect(row) {
      this.currSearch = row;
      this.$store.commit("setSetContent", {
        ...this.$store.state.setContent,
        search: row.key,
      });
    },
    searchHandle(value, type) {
      if (!value) return;
      let url = `${this.currSearch.href}${value}`;
      if (this.keyIndex === 0 || type == "fanyi") {
        url = `${this.currSearch.translate}${value}`;
      }
      if (this.searchHistoryEnabled) {
        this.$store.commit("addSearchHistory", {
          keyword: value,
          searchEngine: this.currSearch.title,
        });
      }
      window.open(url, "_blank");
      this.value = "";
    },
    searchFromHistory(item) {
      this.value = item.keyword;
      const engine = this.searchList.find(e => e.title === item.searchEngine);
      if (engine) {
        this.currSearch = engine;
      }
      this.searchHandle(this.value);
    },
    clearSearch() {
      this.value = "";
      this.keyList = [];
      this.showKeyWord = false;
    },
    clearHistory() {
      this.$confirm("确定要清空搜索历史吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.commit("clearSearchHistory");
          this.$message({
            type: "success",
            message: "搜索历史已清空",
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.search-widget {
  width: 100%;
  text-align: center;

  &.preview-mode {
    transform: scale(0.8);
    transform-origin: top center;
  }

  .app-serach-box {
    margin-top: 8px;
    position: relative;
    text-align: center;
    padding: 0 20px;
    width: 600px;
    margin: 0 auto;

    .se-input-box {
      border: var(--border);
      position: relative;
      z-index: 1;
      backdrop-filter: blur(8px);
      background-color: rgba(255, 255, 255, 0.15);
      overflow: hidden;
      display: flex;
      height: 52px;
      align-items: center;
      border-radius: 26px;
      transition: all 0.3s ease;
      color: var(--color);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      &.search-focus {
        background-color: rgba(255, 255, 255, 0.25);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .select-icon {
        color: var(--color);
      }

      .se-select {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-width: 56px;
        max-width: 56px;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .se-input {
        color: rgba(255, 255, 255, 0.95);
        background-color: transparent;
        font-size: 16px;
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
      }

      .se-close {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-width: 40px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      &:hover,
      &.active {
        border: none;
        background-color: rgba(255, 255, 255, 0.3);

        .select-icon {
          color: #333;
        }

        .se-input {
          color: #333;
        }

        .se-select {
          color: #333;
        }

        ::-webkit-input-placeholder {
          color: rgba(51, 51, 51, 0.5);
        }
      }
    }

    .se-list-keyword {
      position: absolute;
      padding: 0 20px;
      left: 0;
      right: 0;
      z-index: 10;
    }

    .se-all {
      height: 0;
      transform: scaleY(0);
      transform-origin: top;
      z-index: 0;
      transition: all 0.3s ease;
      width: 100%;
      border-radius: 20px;
      padding: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      margin-top: 10px;
      overflow: hidden;

      .se-item {
        display: inline-block;
        width: 20%;
        padding: 10px 0;

        .se-item-icon {
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          line-height: 36px;
          background-color: rgba(0, 0, 0, 0.05);
          margin: 0 auto;
          height: 36px;
          width: 70%;
          border-radius: 18px;
          transition: all 0.3s ease;
          transform: translateY(-20px);
          cursor: pointer;

          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            transform: scale(1.05);
          }

          &.action {
            background-color: var(--primary-color);
            color: #fff;
          }
        }
      }

      &.action {
        padding: 15px 10px;
        height: auto;
        transform: scaleY(1);

        .se-item {
          .se-item-icon {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
    }

    .se-keyword {
      backdrop-filter: blur(20px);
      transition: all 0.3s ease;
      height: 0;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      overflow: hidden;
      padding: 0;
      margin-top: 10px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

      .se-keyword-header {
        padding: 10px 20px 5px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }

      .se-keyword-item {
        cursor: pointer;
        padding: 0 20px;
        border-radius: 0;
        margin: 0;
        color: #333;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;

        span {
          padding-left: 10px;
        }

        .search-engine-tag {
          margin-left: auto;
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          color: #999;
        }

        &.focus,
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
          font-weight: 500;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
:-moz-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
::-moz-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
