/*
 * @Author: sunxc
 * @Date: 2020-10-13 07:59:11
 * @LastEditors: sunxc
 * @LastEditTime: 2020-10-27 15:21:58
 * @Description: file content
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // element官方教程
    [
      "component",
      { libraryName: "element-ui", styleLibraryName: "theme-chalk", style: true }
    ]
  ]
}
