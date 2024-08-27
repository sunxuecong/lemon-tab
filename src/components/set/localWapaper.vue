<template>
  <div class="container">
    <div class="tittle">1.使用在线图片链接</div>
    <input class="input" v-model="value" placeholder="请输入图片地址"  type="text"/>
    <div>
    <el-button class="button" :disabled="!value" type="primary" @click="handleClick">确定</el-button>
    </div>
    <div class="tittle local-tittle">2.上传本地图片</div>
    <div @click="btnClick" class="updata-image">点击上传图片</div>
    <input type="file" class="updata" accept="image/*" @change="change($event)" ref="updata">
    <div class="tittle local-tittle">3.重置壁纸</div>
    <el-button class="button gray" type="primary" @click="reset">重置</el-button>

    
    <!-- <el-image
      :src="imageUrl"
      fit="fit"></el-image> -->
 </div>
</template>

<script>
import local from '@/utils/localStrong';
let input 
export default {
  name: '',
  data() { 
    return {
      value:'',
      imageUrl:"data:image/jpeg;base64,/9j/4wZtVW5pc0luc2lnaHQAAgAAAAUAAAAGVXsiYXR0ck1zayI6IDMsICJmbGxSZXN1bHQiOiB7IllQUiI6IFstMC4xMzU0OTgsIC0wLjAyNDE2OTksIDBdLCAiY2xhcml0eSI6IDM0LjM1MDYsICJleWVEaXN0YW5jZSI6IDEzLjAzODQsICJsYW5kTWFyayI6IFt7IngiOiAyMiwgInkiOiA0MH0sIHsieCI6IDIyLCAieSI6IDQ0fSwgeyJ4IjogMjMsICJ5IjogNDl9LCB7IngiOiAyNCwgInkiOiA1M30sIHsieCI6IDI2LCAieSI6IDU3fSwgeyJ4IjogMjksICJ5IjogNjB9LCB7IngiOiAzMywgInkiOiA2Mn0sIHsieCI6IDM3LCAieSI6IDY0fSwgeyJ4IjogNDEsICJ5IjogNjV9LCB7IngiOiA0NCwgInkiOiA2M30sIHsieCI6IDQ2LCAieSI6IDYxfSwgeyJ4IjogNDksICJ5IjogNTh9LCB7IngiOiA1MCwgInkiOiA1NX0sIHsieCI6IDUxLCAieSI6IDUxfSwgeyJ4IjogNTIsICJ5IjogNDd9LCB7IngiOiA1MywgInkiOiA0NH0sIHsieCI6IDUyLCAieSI6IDQwfSwgeyJ4IjogMjksICJ5IjogNDB9LCB7IngiOiAzMCwgInkiOiAzOX0sIHsieCI6IDMzLCAieSI6IDM5fSwgeyJ4IjogMzYsICJ5IjogMzl9LCB7IngiOiAzOCwgInkiOiA0MH0sIHsieCI6IDQzLCAieSI6IDQwfSwgeyJ4IjogNDUsICJ5IjogMzl9LCB7IngiOiA0NywgInkiOiAzOH0sIHsieCI6IDQ5LCAieSI6IDM4fSwgeyJ4IjogNTAsICJ5IjogMzl9LCB7IngiOiA0MSwgInkiOiA0M30sIHsieCI6IDQxLCAieSI6IDQ1fSwgeyJ4IjogNDEsICJ5IjogNDh9LCB7IngiOiA0MiwgInkiOiA1MH0sIHsieCI6IDM4LCAieSI6IDUyfSwgeyJ4IjogNDAsICJ5IjogNTN9LCB7IngiOiA0MSwgInkiOiA1M30sIHsieCI6IDQzLCAieSI6IDUyfSwgeyJ4IjogNDQsICJ5IjogNTJ9LCB7IngiOiAzMSwgInkiOiA0NH0sIHsieCI6IDMzLCAieSI6IDQzfSwgeyJ4IjogMzUsICJ5IjogNDN9LCB7IngiOiAzNiwgInkiOiA0M30sIHsieCI6IDM1LCAieSI6IDQ0fSwgeyJ4IjogMzMsICJ5IjogNDR9LCB7IngiOiA0NCwgInkiOiA0M30sIHsieCI6IDQ2LCAieSI6IDQyfSwgeyJ4IjogNDgsICJ5IjogNDJ9LCB7IngiOiA0OSwgInkiOiA0Mn0sIHsieCI6IDQ4LCAieSI6IDQzfSwgeyJ4IjogNDYsICJ5IjogNDN9LCB7IngiOiAzNiwgInkiOiA1N30sIHsieCI6IDM4LCAieSI6IDU2fSwgeyJ4IjogNDAsICJ5IjogNTZ9LCB7IngiOiA0MSwgInkiOiA1Nn0sIHsieCI6IDQzLCAieSI6IDU1fSwgeyJ4IjogNDQsICJ5IjogNTZ9LCB7IngiOiA0NSwgInkiOiA1N30sIHsieCI6IDQ0LCAieSI6IDU5fSwgeyJ4IjogNDMsICJ5IjogNjB9LCB7IngiOiA0MSwgInkiOiA2MH0sIHsieCI6IDQwLCAieSI6IDYwfSwgeyJ4IjogMzgsICJ5IjogNTl9LCB7IngiOiAzNywgInkiOiA1N30sIHsieCI6IDQwLCAieSI6IDU3fSwgeyJ4IjogNDEsICJ5IjogNTd9LCB7IngiOiA0MywgInkiOiA1N30sIHsieCI6IDQ0LCAieSI6IDU3fSwgeyJ4IjogNDMsICJ5IjogNTh9LCB7IngiOiA0MSwgInkiOiA1OH0sIHsieCI6IDQwLCAieSI6IDU4fV0sICJyZWN0IjogeyJoZ3QiOiA0MCwgIndkdCI6IDQyLCAieCI6IDE4LCAieSI6IDI0fX0sICJvYmpSZWN0IjogeyJyZWN0IjogeyJoZ3QiOiAxMDAsICJ3ZHQiOiA3NCwgIngiOiAwLCAieSI6IDB9fSwgIm9ialR5cGUiOiAzLCAic2NvcmUiOiA1OX3/4AAQSkZJRgABAQAAAQABAAD/2wDFAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFAIDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAZABMAwEiAAIRAQMRAv/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6AQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/dAAQAAP/aAAwDAQACEQMRAD8A+XftJNPFwGFUM01pwhwa9AyNHzVpTKp681mfal9aPtS+uKANTzdqlQcA9R61BPb28+DIiOR3IrNl1SCAkvJwF3FgpKj6kcA+3WpIbpLq3E9rItxCeHdTkKaWgjSs5ptNcNZXU9ow5HkSFP5V1em/GDxdpduLc3cGpW4/5Z30QbP/AAIYb8ya4VLgDocj1qUT570WGei/8La0jVIxbeJvB8VzC3JntMHn6Hn9aJNM+D1+3nLquoaXu620U80YU/Qg/pXnDzbgaaPLbkgZ96VhFqaxI6VTmtyG+Ze1XpHcDhuPSoGnkPBOR9KzuzXlKqW6BdxGdpAIHU5rMn1KKC6NtJbSMyvsYoMgN6VQ8Sa9cWepC0iDRtECzMB1Pb8qPCD6rd3TJZ6fNex2qmaVlU7S7cAFjxu9BWU5cqNIw5mT3kFpf2VxI6tGkJ+W3bje/rj19+tZAgu9GVGspfswnOWjK5U+5H9a7DVobTR9ch03VZFMrbZLhV5aBmBO0+9XPAPwZ8SfGPxt/wAI/wCFVZXgX/Sru6BKxIyuU4H8TYACjk4PSuf2tlzSehoqMm7JGTbXAvNPjvI+QWMUiDqsg7fiORUgmx34ru/jX8Eo/gZ4W8N6rZJdSLdN/Z+vm6k3Kt4AWWVR1GQHXpgbR615sWPviuyjUVWPNF3M69GVGVpIvG4ApPtIrP3mjea3Oc6iRuKYpwwJHQ55pA+40rKWVgoy5B2j1NZNFJnGePC8etpdSxSwR3kYKTuhETunDBGPXtwM179+z94O8US+BGuLPTYHivbhpoGuDtjlKrtUluwz61J8LZYPGfwX1DS9Rt4LnSp9QutGvluQsh0+5MYNvPCOq7mI54ziu2/Zt8Oxp4Bu9FsvEFzY65pR8ltMvWMsUkgyC6Dqozzhc9q+azDEcqag9T6LBYbnimz5++IfwD8XeDdYWbXpY9T8Z68WubLw3oKvfXkobjzZNoHlgY6Y5r9D/wBjv9nvVPhR4Jh1DxJbT2OrGFruPTmffdT3UiBWuJ9v3HVSVjjJ+QZJOa8Kn/Z0+KfijW7nVU8JnRtbmyy+NbHX1hkMQ+8wwxIwOikfhXc+Ivg947134C+AbeDxTqIe41G7GoXN3fyI9wrMUtkmaM5ZTyNx46E187jcfOtQVJH0eFwcaNRyauaP7V3gWH4i/DvxP4dS906bVZoft9mwuAWiliIYB3UkAkHHJxyelfn40DRSTQybTNDK8MhjOV3LgHB7jOea+6dO/Z+8UfDzwp4o1PxRYeHNO+zaZ9otbfQld1iSIBiZ+0hYjoK+EdPmaezErjBmZpv++mLH+de3kEuWDhe6Pn88fNUi7DHjweKaIzipyADz0pGfngfpX2J8wbiDFSxnac9+1afir4f3fgnwV4Z1/XPFVjYahr9kNStNJuLSSKBYGfEYe5I278YYjjAYVtaR8MLlGiF3rukagbgBY5NOmLokjY29RyoPBP1rx55phIXUplKLOX8O/EGT4ReJb6+nsftvhjxDbfZ9QtUB3RSoD5V0nPDoTn3GRXtOlAytp/jbQ0NtJfj7DfIr4aC+iQZUjp+8jKyKe+favAPEgd/7S8M6zZtaaxbMbeS2uAV2TdChHUBgcqehyPSvrv8A4J4Xvhf4i+BfGfg/xfp0tx4is4rNNTQttNxaw744LiHuJI1YKzDBIRfSvNx1GFai6lJ3ue9hMS6bSPY08UeJPFfwnFpo+oix1meGJ8SRqEuNpXdakqpK+YCwLDBGeCK1dH1j4r+KPD8Gga/8G7DwhoUtwksuqHxEJ/JjCj5oY1XdkNjhsCuK+Ivwj8QeCNJuNGkm1HVPDcuX0jXdHuPIuCp5CsRnbIuMZxg4ryrwx8O7mfULQ6NrHxnvNXkcRw2Gv6mbaFpHyVj2n74yM7jgY9q+G9jNp3PvKNanVXNFnrv7V3xEufAnww8WJo11eW01vpuJpPOGx3ldYI0OOCGLZ7Gvzv02xWPTrXa2QqKjA/wkDnNfVv7dOl/8Ki+DXgz4YyXsetfEbxNqa6/4gkB+T7LAHWOM91RWZVXH3ijt1r5l8E+E9d+JnjKDwn4RsVv9c1DT5L23tWkCB/JUu4z6lRwO9fd5RhlhaHtJaXPgc2xEa9W0HdIqCFTkMMdxVaWA7htOOKztP1hr+V7eRTBewSNDPbvw8bgkFSD0IIxWmSe/Br6FTUtVseCfp5H8U/hLqWhaJefEnQzocttci/h0rX7EXEMEqRhBLsh3ADAOA4wOeO9dH4ptvh38YvhhqUnhu3sfFVnNbzHTL3TYlWVAuP8AU4VS0eQQVTJGOlfLnwS+Dn/DS/j+7PiCWc+FdLcy+II0dlMkwc+TYq4P8YG5yP4Bt719e/Gj4H+HfjZ8NLLwbNcy+DrPSr62vNOn0KNY5bPyvl2Q4wUypIyCOgPbFfyHmkZYPERg67vJ3t2V+p9F7KEl7qPk/wASfBzV/wBoP4C6pd2+jpqHxf8AhrdJYyTrHsk1zTTGGSJmPJkEZ4Jyd0fH3q+WPhP481v4efEnTvEvh3URY+IbYeRCt2v+j30WdslvOuM5yMEdQee9foH+yv4ftPhF+0b8R/h9a69rHiFLnTLS9tNQ1mcPJdXFu7LKcnktiZe54TNM+Pv7Afw/+Kmt6n4i0u/1D4e+M9RLT4tiP7PmvRyJZYiMqXPDFcZ64zX2WScUU8urTwmOn+7lblkZzpW2IPhb+2No/ijz9I1K2g0HV5juk8Ha7MIY5ps/N9huyNjeoVtvXHWug+KPx98N/Cq7CeFtIvr34ta2oW00nWXZ4tJDceZJjcoXnhUOW7YGa+HPi54Y8X/AO70LTvil8PF1HTNQQiOe0v0ljkkj4fypcY34AcK3PNe0fBDx78K7nUNB8N/DpdR1Lxn4js5bi51DWI9raDAi5dTnIeTPAxng5yARX30K9KVN1oS5l0aPTwtGWInHDxdrnl37ZtrLe/FHw5d3+oy614uuNECaxKwU7QWO1Af4QQTgdRWv/wAE1PDWoar+07d+I7WyeXTPDeh3NvPcOMLFPMyrEg7lyM8eleCfEvxTZ698TPE7ws8UC6s+nNrd4XaOCJH8tp3AyWAwWwOtfor8M/AXi79mnwLcaD8IdMtPHljrd5ZT2niLXriG3hmv54Q0l0joQZ7fbjCDlWVlyc5p8QZvHA5NKEvjmrR9WYY7C08Pi5wpr3VoN/a6/Yx8EfF7xZa6r4b1qDwb8WdWieeGxSPdbawIhlmkRRlOOPO5BJH3q/OPxVovi/4ba5c6B4w8K32k67anEsHl71I/hZWHDKR0Ir9a/hH8I774X2utarr3iW88VeO/EJSTWNeuflZiudsMKjiOFcnCjjnNdH4j+Gvgvx5fJqfiDREvtSESwtP5rKWVemR681+S5Nx1iMkh7DFy9oraeR5lXDRdnEi+H/gnR/hZoMmgaIbi5hlu5NRur68Km4uriX78jlQB0AAAAwOK3xIUKvwxXnB781h6Xdyy+LbnTJGUuujpfKgHJxMyOffoD+NbUT84J745r8sxWKq4us61V3bPUVoo+a/2g/2cvE3xQ1+71jw5DKLpJVntbq1vzbXMD46xEEMp4xwR2rk/CXxB/am+FtpFa634H1D4p6FZuyy2mrWoXUI0PQJdx53YGcM4JPrX2cH3KMcN13Ac1NDI8bM5kdpD/EXOR9Oa9hZhTnSVKtT5kjOV3sfInjf9ojwT42+F9z4L+KfwS+JuieGbokyapqGnfaE02bJKXCzLtKmPIIb0GDkZFeH/AAB+H918LPjF4g1iXU7TxDoGm+F7i50LxBYnda6lEzfLISPuOFBDocENX6bx6tcKMM7SKQVZXO4HjuDwa+UP2tPge3gT4S/EDxn8K4YPD8kljLca9oURKWd7Fj57mCPlYZ0+8dmFcE5Ga+ryDPaeFksHC6jLRX6HoZdXhg8VDEz15T4r/Zt/Z58Q/ta+Or+xsjLovgXT3MeteImiBG1uWt4QRtaVic99o5PUZ/TrwV8A/B/w10qy8J6LZSt4c0W9i1bRknuZJDbXAXDjJOSN2WweMseKf+zv4e0P4c/svfDiz0YQW2lNoFtql3PFj99LLEsk0zMOpLEkk9Bgdq76VVFpbzwypPBPGs0U0TbkdGGQVPcEVHEvEU83qvDUo2hT0v6HHKUp1Z1Ju/M2yjdqQWG7vnNIsqqMbN2O9R3UpLniqTz7WxX55KnfSRFkc9qcp0/4p+A54lHm3tlqdhKT3iTY6ge+VH610M7mN028fvQP1rm/EP8AyUr4af8AcW/9AWuiuvvx/wDXYfzrO2ppI042IfHarAPy/Wqqffq0PuikzMeeBmm6nbRan4f1vT7mNZrS6025jliYZDKYmyKcen4mnyf8eWo/9eFx/wCimq4NqtBruhHl37GNhDffsrfCKxnXzbS50Q2k0T8h4mMilTnnoTVP9kjUrjVP2Z/BxupGma0FzZRuxyfLjuJFQE+wAH4Vq/sT/wDJsvwZ/wCwZ/7NJWD+xx/ybP4b/wCvq+/9KpK9rF6VKqXciO56fqrmNcjrWBcXUiysM8A+lbusf6v8RXO3P+vf6mvNWxof/9k="
    }
  },
  props: {

  },
  components:{
  },
  mounted() {
  },
  methods:{
    btnClick(){
      document.querySelector('.updata').click()
    },
    change(e) {
      console.log(e.target.files[0].name);
      // 判断是不是规定格式
      // let name  =  e.target.files[0].name

      // 获取到第一张图片
      let file = e.target.files[0]
      console.log('33',e.target.files);

      // 创建文件读取对象
      var reader = new FileReader()
      var that = this 

      //  将文件读取为DataURL
      reader.readAsDataURL(file)

      // 读取成功调用方法
      reader.onload = e => {
        console.log('读取成功');

        // e.target.result 获取 读取成功后的  文件DataURL
        that.imageUrl = e.target.result
        console.log('e.target.result',e);
        this.$store.commit("setWallpaper", {src:that.imageUrl});
        // 如果要将图片上传服务器，就在这里调用后台方法
      }

     },
    handleClick(){
      this.$store.commit("setWallpaper", {src:this.value});
      this.value = ''
    },
    reset(){
      this.$store.commit("setWallpaper", {src:''});
      // local.remove('wallpaper')
    }

  },
 }
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .tittle {
  font-size: 15px;
  margin-bottom: 18px;
}
.input {
  height: 34px;
  width: 80%;
  background-color: #f0f1f4;
  border-radius: 8px;
  color: #333;
  padding-left: 20px;
  margin-bottom: 18px;
  &:hover{
    // background-color: red;
    border: none;
  }
}
.button {
  border: none;
  padding: 6px 14px;
  font-size: 14px;
  border-radius: 4px;
  // background-color:#3f8df5;
  // color: #fff;
}
.gray {
  background-color: #333;
}
.updata {
  display: none;
}
 .local-tittle{
  margin-top: 30px;
 }
 .updata-image{
  width: 250px;
  height: 100px;
  background-color: #f0f1f4;
  border: 1px dashed #dadada;
  border-radius: 8px;
  text-align: center;
  color: #666;
  line-height: 100px;
  font-size: 14px;
 }
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #666;
}
}

</style>