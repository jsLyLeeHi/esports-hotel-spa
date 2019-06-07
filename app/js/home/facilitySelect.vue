<template>
  <div class="facility">
    <div class="facility-banner">
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
    <div class="facility-list">
      <div
        class="facility-item"
        v-for="(item,index) in facilityList"
        :key=index
        @click="checkSpec(item)"
      >
        <h1 class="facility-item-title">{{item.device_model}}</h1>
        <div class="facility-item-box">
          <ul class="facility-item-spec">
            <li>游戏性能：{{item.performance}}</li>
            <li>特点：{{item.point}}</li>
          </ul>
          <div
            class="facility-item-amount"
            @click.stop=""
          >
            <div
              class="facility-item-amount-btn"
              @click="amount(2,index)"
            >
              <img :src="minusIcon" />
            </div>
            <div class="facility-item-amount-number">
              <span>{{item.num}}</span>
            </div>
            <div
              class="facility-item-amount-btn"
              @click="amount(1,index)"
            >
              <img :src="plusIcon" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="facility-btn-placeholder" />
    <div class="facility-btn">
      <span>确 定</span>
    </div>
    <BottomModal
      name="checkModal"
      ref="checkModal"
      classes="facility-modal"
    >
      <CheckFacility @closeSelect="closeSelect()" />
    </bottomModal>
  </div>
</template>
<script>
import BottomModal from '_components_/bottomModal';
import CheckFacility from '_components_/CheckFacility';
export default {
    components: {
        BottomModal,
        CheckFacility
    },
    data() {
        return {
            bannerLIst: [],
            facilityList: [],
            plusIcon: require('_images_/add@2x.png'),
            minusIcon: require('_images_/minus@2x.png')
        };
    },
    mounted() {
        this.getAllDevice();
        this.getDeviceType();
    },
    methods: {
        closeSelect() {
            this.$refs.checkModal.hide();
        },
        checkSpec(item) {
            console.log(item);
            this.$store.commit('setFacilityData', item);
            this.$refs.checkModal.show();
        },
        amount(type, index) {
            if (type == 1) {
                this.facilityList[index].num += 1;
            } else {
                if (this.facilityList[index].num == 1) {
                    return this.$toast.fail('数量最少为1');
                }
                this.facilityList[index].num -= 1;
            }
            this.$forceUpdate();
        },
        async getAllDevice() {
            let url = '/index/Hotel/getAllDevice',
                param = {},
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;
            if (res.code == 0) {
                this.facilityList = res.data.device;
                this.bannerLIst = res.data.banner;
                this.facilityList.map(item => {
                    item.num = 1;
                });
            }
        },
        async getDeviceType() {
            let url = '/index/Hotel/getDeviceType',
                param = {},
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;
            // if (res.code == 0) {
            // }
            console.log(res);
        }
    }
};
</script>
