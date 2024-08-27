import dayjs from 'dayjs'
export default {
  /**
   * @desc 时间戳转字符串 使用的是mement.js
   * @default YYYY-MM-DD #
   */
  timeToStr(value, formatString = 'YYYY-MM-DD') {
    if (typeof value !== 'number') {
      return '';
    }
    return dayjs(value).format(formatString);
  }, //end
}