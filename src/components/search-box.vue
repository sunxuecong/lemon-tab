<template>
  <div class="d-flex-hor">
    <div class="app-serach-box">
      <div class="se-input-box" :class="{ active: value }">
        <div class="se-select" @click.stop="isShowSelect = !isShowSelect">
          <d-icon v-size="20" :icon="`icon-${currSearch.icon}`"></d-icon>
        </div>
        <input
          v-focus="true"
          v-model.trim="value"
          class="se-input"
          @input="keyWordList()"
          @keyup.13="searchHandle(value)"
          @keydown="keydown($event)"
          placeholder="输入并搜索"
          type="text"
        />
        <div class="se-close" v-show="value" @click="value = ''">
          <d-icon v-size="20" icon="icon-clost" class="select-icon"></d-icon>
        </div>
        <div class="se-select" @click="searchHandle(value)">
          <d-icon v-size="20" icon="icon-search" class="select-icon"></d-icon>
        </div>
      </div>
      <div class="se-list-keyword">
        <!-- 搜索引擎列表 -->
        <ul class="se-all" :class="{ action: isShowSelect }">
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
        <ul
          class="se-keyword al"
          v-if="value && showKeyWord"
          :style="{ height: keyListHeight }"
        >
          <li
            @click.stop="searchHandle(value)"
            class="se-keyword-item d-elip"
            @keydown="keydown"
            :class="{ focus: keyIndex === 0 }"
          >
          <d-icon icon="icon-search" class="select-icon"></d-icon> 
          <span>{{ tranText }}</span>
          </li>
          <li
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
      </div>
    </div>
  </div>
</template>

<script>
import { jsonp } from 'vue-jsonp'
import axios from "axios";
export default {
  name: "",
  props: {},
  components: {},
  data() {
    //这里存放数据
    return {
      value: "", //input绑定值
      isShowSelect: false, //是否显示搜索引擎列表
      showKeyWord: false,
      //   搜索引擎列表
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
          title: "google搜索",
          icon: "google",
          href: "https://www.google.com/search?q=",
          translate:
            "https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text=",
        },
      ],

      currSearch: {}, //   当前搜索引擎信息
      keyList: [], //关键字列表
      keyListHeight: "0px",
      tranText: "", //要翻译的文本
      keyIndex: -1, //关键字下标
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  computed: {},
  watch: {},
  //方法集合
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
      if (keyCode === 40) {
        this.keyIndex++;
        if (this.keyIndex >= 11) {
          this.keyIndex = 0;
        }
      } else if (keyCode === 38) {
        el.preventDefault();
        this.keyIndex--;
        if (this.keyIndex <= 0) {
          this.keyIndex = 10;
        }
      }
      if (this.keyIndex > 0) {
        this.value = this.keyList[this.keyIndex - 1];
      }
    },
    keyWordList() {
      if (!this.value) {
        this.keyList = [];
        this.keyListHeight = "0px";
        return;
      }
      this.showKeyWord = true;
      this.tranText = this.value;
      this.keyIndex = -1;
      this.keyListHeight = 1 * 30 + 20 + "px";
        // 如果输入不为空就创建script标签
          jsonp(`https://www.baidu.com/sugrec?&prod=pc&wd=${this.value}`).then(res => {
            console.log('ww',res);
            let data = res
            this.keyList = data.g || [];
            this.keyList = this.keyList.map((item) => item.q);
            this.keyListHeight = this.keyList.length * 34 + 34 + 20+  "px";
          })
    },
    search(e){
      console.log('请求的回调函数',e);
    },
    clickSelect(row) {
      this.currSearch = row;
      this.$store.commit("setSetContent", {
        ...this.$store.state.setContent,
        search: row.key,
      });
    },
    // 开始搜索
    searchHandle(value, type) {
      if (!value) return;
      let url = `${this.currSearch.href}${value}`;
      if (this.keyIndex === 0 || type == "fanyi") {
        url = `${this.currSearch.translate}${value}`;
      }

      window.open(url, "_blank");
      this.value = "";
    },
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
};
</script>
<style lang='less' scoped>
.app-serach-box {
  margin-top: 8px;
  position: relative;
  text-align: center;
  padding: 0 20px;
  width: 600px;

  .se-input-box {
    border: var(--border);
    // box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
    backdrop-filter: blur(2px);
    background-color: var(--background);
    overflow: hidden;
    display: flex;
    height: 46px;
    align-items: center;
    border-radius: 23px;
    transition: 0.2s;
    color: var(--color);
    // 右侧搜索
    .select-icon {
      color: var(--color);
    }
    //左侧logo
    .se-select {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-width: 50px;
      max-width: 50px;
      transition: 0.2s;
      // color: red;
      &:hover {
        background-color: rgba(var(--background), 0.2);
      }
    }
    //搜索框
    .se-input {
      color: rgba(var(--main-color), 1);
      // color:red;
      background-color: transparent;
      font-size: 14px;
      width: 100%;
    }
    &:hover,
    &.active {
      border: none;
      background-color: rgba(var(--main-color), 0.8);
      color: var(--logo-hover);
      //鼠标经过搜索颜色
      .select-icon {
        color: var(--logo-hover);
      }
      .se-input{
        color: var(--hover-color)
      }
      //鼠标经过logo颜色
      .se-select {
        color: var(--logo-hover);
      }
      //鼠标经过placeholder的颜色
      ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: var(--hover-color)
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
    transition: 0.2s;
    // backdrop-filter: blur(8px);
    width: 100%;
    border-radius: 30px;
    padding: 5px 10px;
    // box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.4);

    font-size: 0;
    .se-item {
      color: #eee;
      .se-item-icon {
        color: rgba(var(--main-color), 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        line-height: 30px;
        background-color: rgba(var(--background), 0.1);
        margin: 0 auto;
        height: 30px;
        width: 80%;
        border-radius: 15px;
        backdrop-filter: blur(8px);
        transition: 0.2s;
        transform: translateY(-20px);
        &:hover {
          background-color: rgba(var(--background), 0.6);
        }
        &.action {
          background-color: rgba(var(--background), 0.6);
        }
      }

      display: inline-block;
      width: 20%;
    }
    &.action {
      padding: 10px;
      height: 50px;
      transform: scaleY(1);
      .se-item {
        .se-item-icon {
          opacity: 1;
          vertical-align: middle;
          transform: rotateX(0);
        }
      }
    }
  }

  //   关键字列表
  .se-keyword {
    backdrop-filter: blur(10px);
    transition: 0.2s;
    height: 0;
    background-color: rgba(var(--background), 0.3);
    border-radius: 16px;
    overflow: hidden;
    background-color: red;
    background-color: rgba(var(--main-color), 0.8);
    padding: 10px 0 ;
    .se-keyword-item {
      cursor: pointer;
      padding: 0 10px;
      border-radius: 10px;
      margin: 0 10px;
      color: var(--hover-color);
      height: 34px;
      line-height: 34px;
      font-size: 15px;
      transition: 0.2s;
      span {
        padding-left: 10px;
      }
      &.focus,
      &:hover {
        // text-indent: 10px;
        background-color: rgba(var(--main-color), 0.9);
        box-shadow: 0 ,2px 2px rgba(228, 228, 228, 0.9);
        color: #333;
        font-weight: 600;
      }
    }
    &.active {
      height: 30px;
    }
  }
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(var(--main-color), 1);
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(var(--main-color), 0.8);
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(var(--main-color), 0.8);
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: rgba(var(--main-color), 0.8);
}
</style>