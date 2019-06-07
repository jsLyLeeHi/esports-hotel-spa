<template>
  <div class="aboutUs-contain">
    <div class="aboutUs-img" :style="aboutUsImageStyle"></div>
    <div class="aboutUs-title">
      <span>魔王</span>
      <span>电竞酒店</span>
      <div>西安市雁塔区雁塔西路88号|029-00000000</div>
    </div>
    <div class="aboutUs-content">
      <div v-html="aboutUsContent"></div>
    </div>
  </div>
</template>

<script>
import aboutUsImage from '_images_/aboutus_pix@2x.png';
export default {
    data() {
        return {
            aboutUsContent:
                '<div>本酒店位于西安市中心商业区，交通便利入住便捷。本酒店为电竞主题酒店，电脑均采用发烧友级别的游戏电脑配置，专业电竞房采用全新的英伟达2080与因特尔i7组合，全场配置机械键盘游戏鼠标7.2电竞耳机，专业电竞房更是配置了迪瑞克斯电竞椅，房间灯光装修精致考究，布草全部采用兔小二共享布草每客一换，安全卫生有保障酒店。</div><div>为您提供专业私密的电竞体验。</div>',
            aboutUsImageStyle: {
                backgroundImage: 'url(' + aboutUsImage + ')'
            }
        };
    }
};
</script>