<template>
  <div class="check-facility">
    <div class="check-facility-top">
      <div class="check-facility-top-msg">
        <img
          @click="close()"
          class="check-facility-top-arrow"
          :src="arrowIcon"
        />
        <h1 class="check-facility-top-title">罗技502炫光自适应游戏鼠标</h1>
        <div class="check-facility-banner-list">
          <van-swipe :autoplay="5000">
            <van-swipe-item
              v-for="(item, index) in bannerLIst"
              :key="index"
            >
              <img
                v-lazy="item"
                loading="lazyImg"
              >
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
    <ul class="check-facility-msg-list">
      <li class="check-facility-msg-item">
        <span>特点: </span>
        <span>{{listData.point}}</span>
      </li>
      <li class="check-facility-msg-item">
        <span>品牌:</span>
        <span>{{listData.brand}}</span>
      </li>
      <li class="check-facility-msg-item">
        <span>颜色:</span>
        <span>{{listData.color}}</span>
      </li>
      <li class="check-facility-msg-item">
        <span>类型:</span>
        <span>{{listData.type}}</span>
      </li>
    </ul>
    <div
      class="check-facility-btn"
      @click="close()"
    >
      <span>确 定</span>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            listData: this.$store.state.homePage.facilityData,
            arrowIcon: require('../../images/popup@2x.png'),
            bannerLIst: []
        };
    },
    mounted() {
        this.bannerLIst = JSON.parse(this.listData.image);
    },
    methods: {
        close() {
            this.$emit('closeSelect', 'close');
        }
    }
};
</script>