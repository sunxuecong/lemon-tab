/*
 * @Author: lemon-tab
 * @Date: 2024-04-29
 * @Description: 天气组件 - 可拖拽组件
 */
<template>
  <div class="weather-widget" :class="{ 'preview-mode': preview }">
    <div
      class="side-weather ac"
      :style="{
        backgroundImage: `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`,
      }"
    >
      <div class="weather-main">
        <div class="weather-location">
          <d-icon v-size="18" icon="icon-location" class="mr5"></d-icon>
          <span>{{ weatherData.location || '加载中...' }}</span>
        </div>
        <div class="weather-condition">
          <d-icon
            v-size="60"
            :icon="`icon-${$weatherIcon[weatherData.now.cond_code]}`"
            class="weather-icon"
          />
          <div class="weather-temp-box">
            <div class="weather-temp">{{ weatherData.now.tmp || '--' }}°</div>
            <div class="weather-text">{{ weatherData.now.cond_txt || '加载中' }}</div>
          </div>
        </div>
        <div class="weather-extra" v-if="weatherData.daily_forecast && weatherData.daily_forecast[0]">
          <div class="extra-item">
            <d-icon v-size="20" icon="icon-gaowen"></d-icon>
            <span>最高 {{ weatherData.daily_forecast[0].tmp_max || '--' }}°</span>
          </div>
          <div class="extra-item">
            <d-icon v-size="20" icon="icon-diwen"></d-icon>
            <span>最低 {{ weatherData.daily_forecast[0].tmp_min || '--' }}°</span>
          </div>
        </div>
      </div>

      <div class="weather-details" v-if="Object.keys(weatherData.now).length > 0">
        <div class="detail-item">
          <d-icon v-size="24" icon="icon-fengxiang" />
          <div class="detail-text">
            <p class="detail-label">风向</p>
            <p class="detail-value">{{ weatherData.now.wind_dir }} {{ weatherData.now.wind_sc }}级</p>
          </div>
        </div>
        <div class="detail-item">
          <d-icon v-size="24" icon="icon-air" />
          <div class="detail-text">
            <p class="detail-label">空气质量</p>
            <p class="detail-value">{{ weatherData.air_now_city.qlty || '-' }}/{{ weatherData.air_now_city.aqi || '-' }}</p>
          </div>
        </div>
        <div class="detail-item">
          <d-icon v-size="24" icon="icon-shidu" />
          <div class="detail-text">
            <p class="detail-label">湿度</p>
            <p class="detail-value">{{ weatherData.now.hum || '--' }}%</p>
          </div>
        </div>
      </div>

      <div class="weather-sun" v-if="weatherData.sun && weatherData.sun.rise">
        <div class="sun-item">
          <d-icon v-size="20" icon="icon-sunrise" />
          <span>日出: {{ weatherData.sun.rise }}</span>
        </div>
        <div class="sun-item">
          <d-icon v-size="20" icon="icon-sunset" />
          <span>日落: {{ weatherData.sun.set }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "WeatherWidget",
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
      dayjs: dayjs,
    };
  },
  computed: {
    weatherData() {
      return this.$store.state.weather || {};
    },
    moment() {
      return this.$store.state.moment;
    },
    gradientColors() {
      const code = this.weatherData.now.cond_code;
      const defaultColors = { start: '#667eea', end: '#764ba2' };
      
      if (!code) return defaultColors;
      
      const weatherGradients = {
        '100': { start: '#FFB347', end: '#FFCC33' },
        '101': { start: '#87CEEB', end: '#4682B4' },
        '102': { start: '#B0C4DE', end: '#778899' },
        '103': { start: '#C9D6DF', end: '#708090' },
        '104': { start: '#696969', end: '#2F4F4F' },
        '300': { start: '#4A90E2', end: '#5C6BC0' },
        '301': { start: '#3B5998', end: '#192F6A' },
        '302': { start: '#6A1B9A', end: '#4A148C' },
        '400': { start: '#E8EAF6', end: '#C5CAE9' },
        '401': { start: '#B0BEC5', end: '#78909C' },
        '500': { start: '#9E9E9E', end: '#616161' },
        '501': { start: '#757575', end: '#424242' },
        '502': { start: '#FF9800', end: '#F57C00' },
        '503': { start: '#D4A574', end: '#8B6914' },
      };
      
      return weatherGradients[code] || defaultColors;
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.weather-widget {
  width: 100%;

  &.preview-mode {
    transform: scale(0.8);
    transform-origin: top center;
  }

  .side-weather {
    overflow: hidden;
    background-color: #11132a;
    background-size: cover;
    color: #fff;
    height: 100%;
    width: 100%;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);

    .weather-main {
      text-align: center;
      margin-bottom: 20px;

      .weather-location {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .weather-condition {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin: 15px 0;

        .weather-icon {
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }

        .weather-temp-box {
          text-align: left;

          .weather-temp {
            font-size: 56px;
            font-weight: 300;
            line-height: 1;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }

          .weather-text {
            font-size: 16px;
            opacity: 0.9;
            margin-top: 5px;
          }
        }
      }

      .weather-extra {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 15px;

        .extra-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          opacity: 0.85;
        }
      }
    }

    .weather-details {
      display: flex;
      justify-content: space-around;
      padding: 15px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin: 15px 0;

      .detail-item {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        .detail-text {
          .detail-label {
            font-size: 12px;
            opacity: 0.6;
            margin-bottom: 2px;
          }

          .detail-value {
            font-size: 13px;
            font-weight: 500;
          }
        }
      }
    }

    .weather-sun {
      display: flex;
      justify-content: space-around;
      padding-top: 10px;

      .sun-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        opacity: 0.85;
      }
    }
  }
}
</style>
