/*
 * @Author: sunxc
 * @Date: 2020-10-14 16:38:27
 * @LastEditors: sunxc
 * @LastEditTime: 2021-05-31 11:12:13
 * @Description: 时间
*/
<template>
  <div class="app-date-box ac">
    <div class="app-time">
      <div>{{ time.hour }}</div>
      <div>:</div>
      <div>{{ time.minute }}</div>
    </div>
    <p class="app-date">{{ date }} 星期{{ week }} {{ dataCn }}</p>
  </div>
</template>

<script>
import { solar2lunar } from "solarlunar";
import dayjs from "dayjs";
export default {
  name: "",
  props: {},
  components: {},
  data() {
    //这里存放数据
    return {
      dataCn: null,
      time: {
        hour: null,
        minute: null,
      },
      date: "",
      week: "",
      timer: null, //定时器
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // 初始化获取天气
    this.getTimeing();
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    // 定时获取时间
    getTimeing() {
      // 即时获取时间
      this.getTime();
      this.timer = setInterval(() => {
        this.getTime();
      }, 3000);
    },
    // 即时获取时间
    getTime() {
      let week = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日",
      };
      const now = dayjs();
      const { monthCn, dayCn } = solar2lunar(
        now.year(),
        now.month() + 1,
        now.date()
      );
      this.dataCn = monthCn + dayCn + "";
      this.date = now.format("MM月DD日");
      let time = now.format("HH:mm");
      this.time.hour = time.substring(0, 2);
      this.time.minute = time.substring(3);
      this.week = week[dayjs().day()];
    },
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroyed() {
    this.timer = null;
    clearInterval(this.timer);
  },
};
</script>
<style lang='less' scoped>
//@import url();
.app-date-box {
  margin-top: 140px;
  color: #fff;
  margin-bottom: 20px;
  .app-time {
    justify-content: center;
    display: flex;
    color: #fff;
    line-height: 50px;
    font-size: 78px;
    div:nth-child(2) {
      transform: translate(0, -7px);
    }
  }
  .app-date {
    margin-top: 13px;
    font-size: 15px;
    line-height: 26px;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
