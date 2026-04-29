/*
 * @Author: sunxc
 * @Date: 2020-10-13 09:48:05
 * @LastEditors: sunxc
 * @LastEditTime: 2021-06-22 14:52:17
 * @Description: file content
 */
import Vue from 'vue';
import Vuex from 'vuex';
import local from '@/utils/localStrong';
import dayjs from 'dayjs'
import api from '@/api'
import {
  Message
} from 'element-ui'

import {
  navList
} from "@/json";
import utils from '../utils/utils';

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
Vue.use(Vuex);
// 保存
let saveConfig = (msg) => {
  let userInfo = local.get('userInfo')
  if (!userInfo) return
  // 走保存接口
  let params = local.get('setContent')
  params.note = localStorage.getItem('note')
  params.id = localStorage.getItem('configId')
  params.navlist = localStorage.getItem('navList')
  params.todo = localStorage.getItem('todo')
  params.wallpaper = localStorage.getItem('wallpaper')
  api.configInfoSave(params).then(res => {
    if (!msg) return
    Message({
      type: 'success',
      message: "手动备份成功",
      showClose: true
    })
  })
}


let debounceSaveConfig = (msg) => {

  let timer = true
  if (timer) {
    timer = false;
    saveConfig(msg)
    timer = setTimeout(() => {
      timer = true;
    }, 3000);
  } else {
    clearTimeout(timer)
  }
}

const setContent = {
  // 壁纸
  bgBlur: 0, //背景进行模糊处理
  themeMode: 'light', //主题模式
  sunrise: false, //主题样式跟随日出日落
  // 常规设置
  iconSize: 82, //图标大小
  iconRadius: 100, //图标半径
  iconOpacity: 90, //图标透明度
  iconTitle: true, //图标标题
  startAnimation: true, //启动动画
  layout: [2, 6], //图标布局
  yiyan: true, //是否显示一言
  search: 'baidu', //默认搜索
  // 新增设置
  autoWallpaper: false, //自动壁纸
  wallpaperInterval: 24, //壁纸切换间隔（小时）
  widgetOpacity: 90, //组件透明度
  smoothAnimation: true, //流畅动画
  customTheme: {
    primary: '#409eff',
    secondary: '#67c23a',
    accent: '#e6a23c',
    background: '#f5f7fa',
    text: '#303133',
  }, //自定义主题颜色
}

// 组件默认配置
const defaultWidgets = [
  {
    id: 'time',
    type: 'time',
    title: '时间',
    position: { x: 0, y: 0 },
    size: { width: 1, height: 1 },
    visible: true,
    order: 1
  },
  {
    id: 'search',
    type: 'search',
    title: '搜索',
    position: { x: 0, y: 1 },
    size: { width: 1, height: 1 },
    visible: true,
    order: 2
  },
  {
    id: 'weather',
    type: 'weather',
    title: '天气',
    position: { x: 0, y: 2 },
    size: { width: 1, height: 1 },
    visible: true,
    order: 3
  },
  {
    id: 'quickNav',
    type: 'quickNav',
    title: '快捷导航',
    position: { x: 0, y: 3 },
    size: { width: 1, height: 1 },
    visible: true,
    order: 4
  },
  {
    id: 'todo',
    type: 'todo',
    title: '待办事项',
    position: { x: 0, y: 4 },
    size: { width: 1, height: 1 },
    visible: true,
    order: 5
  },
  {
    id: 'bookmark',
    type: 'bookmark',
    title: '书签',
    position: { x: 0, y: 5 },
    size: { width: 1, height: 1 },
    visible: true,
    order: 6
  }
]

// 搜索历史默认配置
const defaultSearchHistory = {
  enabled: true,
  maxItems: 50,
  items: []
}
export default new Vuex.Store({
  state: {
    // 需要存储local
    setContent: setContent, //设置内容
    wallpaper: {
    }, //壁纸
    bingWallpaper: {}, //壁纸
    navList: [], //导航图标列表
    widgets: [], //可拖拽组件列表
    searchHistory: {}, //搜索历史
    bookmarks: [], //书签数据
    // 无需存储local
    editType: '', //编辑类型  add edit
    moment: '', //天气时刻  d白天 n晚上 
    note: [],

    weather: {
      now: {},
      air_now_city: {},
      sun: {}
    }, //实时天气
    isShowSide: false, //是否显示侧边栏
    sideComp: '', //侧边栏组件
    navRowData: {}, //当前操作行数据

    loginInfo: {
      visible: false, //是否显示dialog
      type: '', //是否显示dialog
    },
    userInfo: null,
    isWidgetEdit: false, //是否处于组件编辑模式
  },
  getters: {
    visibleWidgets: state => {
      return state.widgets.filter(w => w.visible).sort((a, b) => a.order - b.order)
    },
    searchHistoryItems: state => {
      return state.searchHistory.items || []
    }
  },
  mutations: {
    setSetContent(state, val) {
      state.setContent = val || setContent
      local.set("setContent", state.setContent);
      debounceSaveConfig()
    },
    setWallpaper(state, val) {
      state.wallpaper = val
      local.set("wallpaper", val);
      debounceSaveConfig()
    },
    setBingWallpaper(state, val) {
      state.bingWallpaper = val
      local.set("bingWallpaper", val);
    },
    setNavList(state, val) {
      state.navList = val
      local.set("navList", val);
      debounceSaveConfig()
    },
    setMoment(state, val) {
      state.moment = val
      local.set("moment", val);
    },
    setNote(state, val) {
      state.note = val
      local.set("note", val);
      debounceSaveConfig()
    },
    setWeather(state, val) {
      state.weather = val
    },
    setShowSide(state, obj) {
      state.isShowSide = obj.val
      if (obj.comp) {
        state.sideComp = obj.comp
      }
      if (obj.editType) {
        state.editType = obj.editType
      }
    },
    setShowSet(state,val) {
      state.isShowSide = val
    },
    setNavRowData(state, val) {
      state.navRowData = val
    },
    setLoginInfo(state, val) {
      state.loginInfo = val
    },
    setUserInfo(state, val) {
      local.set("userInfo", val);
      state.userInfo = val
    },
    // 新增mutations
    setWidgets(state, val) {
      state.widgets = val
      local.set("widgets", val);
      debounceSaveConfig()
    },
    updateWidget(state, { id, updates }) {
      const index = state.widgets.findIndex(w => w.id === id)
      if (index !== -1) {
        state.widgets[index] = { ...state.widgets[index], ...updates }
        local.set("widgets", state.widgets);
        debounceSaveConfig()
      }
    },
    setWidgetEdit(state, val) {
      state.isWidgetEdit = val
    },
    setSearchHistory(state, val) {
      state.searchHistory = val
      local.set("searchHistory", val);
    },
    addSearchHistory(state, item) {
      if (!state.searchHistory.enabled) return
      const items = [...(state.searchHistory.items || [])]
      const index = items.findIndex(i => i.keyword === item.keyword)
      if (index !== -1) {
        items.splice(index, 1)
      }
      items.unshift({
        keyword: item.keyword,
        searchEngine: item.searchEngine,
        timestamp: dayjs().valueOf()
      })
      if (items.length > state.searchHistory.maxItems) {
        items.pop()
      }
      state.searchHistory.items = items
      local.set("searchHistory", state.searchHistory);
    },
    clearSearchHistory(state) {
      state.searchHistory.items = []
      local.set("searchHistory", state.searchHistory);
    },
    setBookmarks(state, val) {
      state.bookmarks = val
      local.set("bookmarks", val);
      debounceSaveConfig()
    },
    addBookmark(state, bookmark) {
      state.bookmarks.push({
        id: dayjs().valueOf(),
        ...bookmark,
        created: dayjs().valueOf()
      })
      local.set("bookmarks", state.bookmarks);
      debounceSaveConfig()
    },
    updateBookmark(state, { id, updates }) {
      const index = state.bookmarks.findIndex(b => b.id === id)
      if (index !== -1) {
        state.bookmarks[index] = { ...state.bookmarks[index], ...updates }
        local.set("bookmarks", state.bookmarks);
        debounceSaveConfig()
      }
    },
    deleteBookmark(state, id) {
      state.bookmarks = state.bookmarks.filter(b => b.id !== id)
      local.set("bookmarks", state.bookmarks);
      debounceSaveConfig()
    },
  },
  actions: {
    // 保存配置
    async saveConfig() {
      debounceSaveConfig(true)
    },
    // 初始化
    async initSetting(context) {
      // if (IsPC()) {
      //   setContent.iconSize = 70
      //   setContent.layout = [2, 5]
      // }
      let userInfo = local.get('userInfo')
      const state = context.state
      state.wallpaper = local.get('wallpaper') || ''
      state.userInfo = userInfo || {}
      state.setContent = local.get('setContent') || setContent
      state.navList = local.get('navList') || utils.deepClone(navList)
      state.bingWallpaper = local.get('bingWallpaper')
      state.note = local.get('note') || [{
        text: "",
        created: dayjs().valueOf(),
      },]
      // 初始化新功能
      state.widgets = local.get('widgets') || utils.deepClone(defaultWidgets)
      state.searchHistory = local.get('searchHistory') || utils.deepClone(defaultSearchHistory)
      state.bookmarks = local.get('bookmarks') || []

      // 如果token过期 或者没有登陆 不走接口
      if (!userInfo) return
      let res = await api.configInfoCurInfo()
      let data = res.data || {}
      if (res.code == 200) {

        // 如果id==0此账号没有被保存过
        if (data.id == 0) {
          // 走保存接口
          let params = local.get('setContent')
          params.note = localStorage.getItem('note')
          params.navlist = localStorage.getItem('navList')
          params.todo = localStorage.getItem('todo')
          params.wallpaper = localStorage.getItem('wallpaper')
          let res = await api.configInfoSave(params)
        } else {
          //保存configID 用于更新配置
          local.set('configId', data.id)
          state.setContent = data || setContent
          state.navList = data.navlist ? JSON.parse(data.navlist) : utils.deepClone(navList)
          state.wallpaper = JSON.parse(data.wallpaper) || {}
          state.todo = JSON.parse(data.todo) || {}
          state.note = JSON.parse(data.note) || [{
            text: "",
            created: dayjs().valueOf(),
          },]

        }
      }

      Object.keys(setContent).forEach(key => {
        if (state.setContent[key] == undefined) {
          // 如果local里没有 当前项  那么设置成默认
          state.setContent[key] = setContent[key]
        }
      })
    }
  },
})