/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 时间组件 - 可拖拽组件
 */
<template>
  <div class="time-widget" :class="{ 'preview-mode': preview }">
    <div class="app-date-box ac">
      <div class="app-time" :class="{ 'animate-pulse': smoothAnimation }">
        <div>{{ time.hour }}</div>
        <div class="separator" :class="{ 'animate-blink': smoothAnimation }">:</div>
        <div>{{ time.minute }}</div>
      </div>
      <p class="app-date">{{ date }} 星期{{ week }} {{ dataCn }}</p>
    </div>
  </div>
</template>

<script>
import { solar2lunar } from "solarlunar";
import dayjs from "dayjs";

export default {
  name: "TimeWidget",
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
      dataCn: null,
      time: {
        hour: null,
        minute: null,
      },
      date: "",
      week: "",
      timer: null,
    };
  },
  computed: {
    smoothAnimation() {
      return this.$store.state.setContent.smoothAnimation;
    },
  },
  created() {
    if (!this.preview) {
      this.getTimeing();
    } else {
      this.getTime();
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  methods: {
    getTimeing() {
      this.getTime();
      this.timer = setInterval(() => {
        this.getTime();
      }, 3000);
    },
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
};
</script>

<style lang="less" scoped>
.time-widget {
  width: 100%;
  text-align: center;

  &.preview-mode {
    transform: scale(0.8);
    transform-origin: top center;
  }

  .app-date-box {
    color: #fff;
    margin-bottom: 20px;

    .app-time {
      justify-content: center;
      display: flex;
      color: #fff;
      line-height: 50px;
      font-size: 78px;
      font-weight: 300;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

      .separator {
        margin: 0 5px;
      }

      &.animate-pulse {
        animation: pulse 2s ease-in-out infinite;
      }
    }

    .app-date {
      margin-top: 13px;
      font-size: 15px;
      line-height: 26px;
      color: rgba(255, 255, 255, 0.8);
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    }
  }
}

// 动画定义
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.5;
  }
}

.animate-blink {
  animation: blink 1s ease-in-out infinite;
}
</style>
