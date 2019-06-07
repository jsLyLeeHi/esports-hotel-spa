<template>
  <div class="select-room">
    <div class="select-room-top">
      <div class="select-room-top-msg">
        <img
          @click="close()"
          class="select-room-top-arrow"
          :src="arrowIcon"
        >
        <h1 class="select-room-top-title">{{listData.name}}</h1>
        <div class="select-room-banner-list">
          <van-swipe :autoplay="5000">
            <van-swipe-item
              v-for="(item, index) in listData.banner"
              :key="index"
            >
              <img :src="item">
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
    <div class="select-tab-bar">
      <div
        class="select-tab-item"
        v-for="(item,index) in titleList"
        :key="index"
        @click="jumpTab(index)"
        :class="{'select-tab-item-actie':num == index}"
      >
        <span>{{item}}</span>
      </div>
    </div>
    <ul
      class="select-room-rule-list"
      v-if="num == 0"
    >
      <li class="select-room-rule-item">
        <div class="select-room-rule-title">
          <div class="select-room-rule-title-icon" />
          <h1 class="select-room-rule-title-text">房间配置</h1>
        </div>
        <div class="select-room-rule-main">
          <ul>
            <li class="select-room-rule-line">
              <label>面积</label>
              <span>
                {{listData.area}}m
                <sup>2</sup>
              </span>
            </li>
            <li
              v-if="listData.breakfast == 1"
              class="select-room-rule-line"
            >
              <label>早餐</label>
              <span>含早餐</span>
            </li>
            <li
              class="select-room-rule-line"
              v-else
            >
              <label>早餐</label>
              <span>不含早餐</span>
            </li>
            <li class="select-room-rule-line">
              <label>可住</label>
              <span>{{listData.live_num}}人</span>
            </li>
            <li
              class="select-room-rule-line"
              v-if="listData.window == 1"
            >
              <label>窗户</label>
              <span>有窗</span>
            </li>
            <li
              class="select-room-rule-line"
              v-else
            >
              <label>窗户</label>
              <span>无窗</span>
            </li>
            <li
              class="select-room-rule-line"
              v-if="listData.bathroom == 1"
            >
              <label>卫浴</label>
              <span>独立卫浴</span>
            </li>
            <li
              class="select-room-rule-line"
              v-else
            >
              <label>卫浴</label>
              <span>无独立卫浴</span>
            </li>
            <li
              class="select-room-rule-line"
              v-if="listData.ac == 1"
            >
              <label>空调</label>
              <span>有空调</span>
            </li>
            <li
              class="select-room-rule-line"
              v-else
            >
              <label>空调</label>
              <span>无</span>
            </li>
            <li>
              <label>床型</label>
              <span>{{listData.bed_type}}</span>
            </li>
            <li>
              <label>宽带</label>
              <span>全部房间WIFI</span>
            </li>
            <li>
              <label>浴室配套</label>
              <span>{{listData.bath_config}}</span>
            </li>
            <li>
              <label>食品饮食</label>
              <span>{{listData.food}}</span>
            </li>
          </ul>
        </div>
      </li>
      <li class="select-room-rule-item">
        <div class="select-room-rule-title">
          <div class="select-room-rule-title-icon" />
          <h1 class="select-room-rule-title-text">外设详情</h1>
        </div>
        <div class="select-room-rule-main">
          <ul>
            <li
              v-for="(item,index) in deviceList"
              :key="index"
            >
              <label v-if="item.device_type_id == 1">鼠标</label>
              <label v-else-if="item.device_type_id == 2">键盘</label>
              <label v-else-if="item.device_type_id == 3">耳机</label>
              <span>{{item.device_model}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <ul
      class="select-room-rule-list"
      v-else-if="num == 1"
    >
      <li
        class="select-room-rule-item"
        v-for="(item,index) in ruleList"
        :key="index"
      >
        <div class="select-room-rule-title">
          <div class="select-room-rule-title-icon" />
          <h1 class="select-room-rule-title-text">{{item.title}}</h1>
        </div>
        <p class="select-room-rule-main">{{item.text}}</p>
      </li>
    </ul>
    <div class="select-room-bar-placeholder" />
    <div class="select-room-bar">
      <div class="select-room-bar-msg">
        <div class="select-room-bar-price">
          <div class="select-room-bar-price-top">
            <span>￥</span>
            <span>{{(listData.price).split('.')[0]}}</span>
            <span>{{'.'+(listData.price).split('.')[1].substr(0, 2)}}</span>
          </div>
          <div class="select-room-bar-price-bottom">
            <div v-if="listData.gradeRight !== '1.00'">
              <span>会员可享折后</span>
              <span>{{listData.rebatePrice}}</span>
              <span>元</span>
            </div>
          </div>
        </div>
        <div class="select-room-bar-number">
          <span>剩余</span>
          <span>{{listData.over_num}}</span>
          <span>间</span>
        </div>
      </div>
      <div
        class="select-room-bar-btn"
        @click="jumpOrderPay()"
      >
        <span>预 订</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            num: 0,
            titleList: ['房间详情', '使用规则'],
            listData: this.$store.state.homePage.homeData,
            arrowIcon: require('../../images/popup@2x.png'),
            ruleList: [
                {
                    title: '取消规则',
                    text: '订单确认后不可取消/变更，如未入住，酒店将扣除全额房款。'
                },
                {
                    title: '使用规则',
                    text:
                        '请在15:00之后入住并于次日14:00之前退房；如需提前入住或延时退房，请咨询商家；入住需要押金，金额以前台为准。'
                },
                {
                    title: '预定说明',
                    text:
                        '如需发票，请向酒店前台索取，如需发票，请向酒店前台索取。如需发票，请向酒店前台索取，如需发票，请向酒店前台索取。如需发票，请向酒店前台索取。'
                }
            ],
            deviceList: []
        };
    },
    mounted() {
        console.log(this.listData);
        this.getDefaultDev();
    },
    methods: {
        jumpTab(index) {
            this.num = index;
        },
        close() {
            this.$emit('closeSelect', 'close');
        },
        jumpOrderPay() {
            this.$emit('closeSelect', 'close');
            this.$router.push({
                path: 'ordersSubmitted',
                query: {
                    listData: JSON.stringify(this.$store.state.homePage.homeData)
                }
            });
        },
        async getDefaultDev() {
            let url = '/index/Hotel/getDefaultDev',
                param = {
                    type: 1
                },
                res = await this.$request.fetch(url, param, 'get');
            res = res.data;
            if (res.code == 0) {
                this.deviceList = res.data;
                console.log(res);
            }
        }
    }
};
</script>