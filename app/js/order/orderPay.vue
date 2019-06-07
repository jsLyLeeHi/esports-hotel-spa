<template>
  <div>
    <div class="order-pay-header">
      <div class="header-content" v-if="orderInfo.type!==0">
        <div class="header-title flex-between" @click="showOrderDetailModal">
          <div>
            {{orderInfo.title}}
            <span
              class="accommodation"
              v-if="orderInfo.type===2"
            >共 {{orderInfo.accomDetail.re_day}} 晚</span>
          </div>
          <div :class="[orderModal?'triangle-top':'triangle-bottom']"></div>
        </div>
        <div class="header-price flex-between">
          <div>
            <div class="rebate-price">
              <span>￥</span>
              {{orderPrice.integer}}
              <span>{{orderPrice.decimals}}</span>
            </div>
            <div
              v-if="Number(orderInfo.originalPrice) !==Number(orderInfo.rebatePrice)"
              class="original-price"
            >{{orderInfo.originalPrice}}</div>
          </div>

          <div class="time-countdown">订单剩余时间 {{countDownTime.m}}:{{countDownTime.s}}</div>
        </div>
      </div>
    </div>
    <div class="order-pay-method">
      <div
        class="pay-item flex-center"
        :key="index"
        v-for="(item,index) in payMethod"
        @click="choosePay(index)"
      >
        <div class="icon">
          <img :src="item.bgImg">
        </div>
        <div class="item flex-between">
          <span class="pay-name">{{item.name}}</span>
          <div class="option-img" :class="{'option-active':payActive===index}"></div>
        </div>
      </div>
    </div>

    <div class="order-pay-btn">
      <div v-if="isExpired" class="btn expired-btn flex-center">
        <span :class="{'android-padding':$isAndroid}">订单已失效</span>
      </div>

      <div v-else class="btn pay-btn flex-center" @click="confirmPay">
        <span :class="{'android-padding':$isAndroid}">确认支付</span>
      </div>
    </div>

    <BottomModal ref="orderDetailModal" name="orderDetailModal" v-on:closed="closeOrderDetailModal">
      <div class="bottom-madal order-pay-ordermodal">
        <div class="close flex-center" @click="closeOrderDetailModal">
          <img src="../../images/popup@2x.png" alt>
        </div>

        <div class="content">
          <div v-if="orderInfo.type===2">
            <div class="title">预定信息</div>
            <div class="section">
              <div class="room-info">
                <div class="item-title room-title">
                  {{orderInfo.accomDetail.re_name}}
                  <div class="line"></div>
                </div>
                <div class="item-content room-content">
                  <div>{{Number(orderInfo.accomDetail.re_check_time)*1000 | dateformat('YYYY-MM-DD') }} 入住 | {{Number(orderInfo.accomDetail.re_leave_time)*1000 | dateformat('YYYY-MM-DD')}} 离店</div>
                  <div>{{orderInfo.accomDetail.re_day}} 晚 * {{orderInfo.accomDetail.re_num}} 间</div>
                </div>
              </div>

              <div class="person-info">
                <div class="item-title person-title">入住人信息
                  <div class="line"></div>
                </div>
                <div class="item-content person-content">
                  <div>入住人：{{orderInfo.accomDetail.username}} | {{orderInfo.accomDetail.phone}}</div>
                </div>
              </div>

              <div class="price-info">
                <div class="item-title price-title">金额详情
                  <div class="line"></div>
                </div>
                <div class="item-content price-content">
                  <div>{{orderInfo.accomDetail.re_day}} 晚 * {{orderInfo.accomDetail.re_num}} 间 * {{orderInfo.accomDetail.perPrice}} {{Number(orderInfo.rebate)!==1?`* ${orderInfo.rebate} （会员折扣）`:''}}</div>
                  <div>总价：{{orderInfo.rebatePrice}}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="orderInfo.type===3">
            <div class="title">服务详情
              <div class="line"></div>
            </div>
            <div class="section">
              <div
                class="item flex-flex"
                :key="index"
                v-for="(item,index) in orderInfo.orderContent"
              >
                <span class="flex-all">{{item.goods_name}}</span>
                <span>x{{item.goods_num}}</span>
                <div class="item-price flex-between">
                  <div class="pro-price">￥{{item.rebatePrice}}</div>
                  <div
                    class="pro-deleteprice"
                    v-if="Number(orderInfo.rebate)!==1&&Number(item.goods_unit_price)!==0"
                  >￥{{item.goods_unit_price}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-btn flex-center" @click="closeOrderDetailModal">
          <span :class="{'android-padding':$isAndroid}">返回支付</span>
        </div>
      </div>
    </BottomModal>
  </div>
</template>
<script>
import BottomModal from '../components/bottomModal.vue';
import Http from '_utils_/request';
import Common from '_utils_/common.js';

export default {
    components: { BottomModal },
    data() {
        return {
            orderInfo: {
                type: 0,
                title: '',
                rebate: '',
                originalPrice: 0,
                rebatePrice: 0,
                createTime: 0,
                orderContent: [],
                accomDetail: ''
            },
            orderModal: false,
            isExpired: false,
            countDownTime: {
                m: 0,
                s: 0
            },
            payActive: 0,
            payMethod: [
                { bgImg: require('_images_/wechatpay@2x.png'), name: '微信支付' },
                { bgImg: require('_images_/vippay@2x.png'), name: '会员支付' }
            ]
        };
    },
    computed: {
        orderPrice() {
            let integer = parseInt(this.orderInfo.rebatePrice);
            let decimals = this.orderInfo.rebatePrice.substring(this.orderInfo.rebatePrice.indexOf('.'));
            return {
                integer,
                decimals
            };
        }
    },
    created() {
        this.clearInterval();
        this.getOrderInfo();
    },
    beforeRouteLeave(to, from, next) {
        this.clearInterval();
        this.$toast.clear();
        next();
    },
    methods: {
        clearInterval() {
            if (this.countDownTimer) {
                clearInterval(this.countDownTimer);
            }
        },
        async getOrderInfo() {
            this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });

            let url = '/index/order/getOrderById',
                param = { id: this.$route.query.id },
                res = await Http.fetch(url, param, 'post');
            res = res.data;
            this.$toast.clear();
            if (res.code === 0) {
                let data = res.data;
                console.log(data);
                if (data.type === 2) {
                    // 酒店预订
                    this.orderInfo.title = data.detail.re_name;
                    this.orderInfo.accomDetail = data.detail;
                    this.orderInfo.accomDetail.perPrice = (
                        Math.round(
                            (Number(data.money) / Number(data.detail.re_day) / Number(data.detail.re_num)) * 100
                        ) / 100
                    ).toFixed(2);
                } else if (data.type === 3) {
                    // 服务
                    this.orderInfo.title = '服务';
                    this.orderInfo.orderContent = JSON.parse(data.detail.order_content);
                    this.orderInfo.orderContent.forEach(item => {
                        item.rebatePrice = (
                            Math.round(Number(item.goods_unit_price) * Number(data.rebate) * 100) / 100
                        ).toFixed(2);
                    });
                }
                this.orderInfo.type = data.type;
                this.orderInfo.rebate = data.rebate;
                this.orderInfo.originalPrice = data.money;
                this.orderInfo.rebatePrice = data.pay_money;
                this.orderInfo.createTime = Number(data.create_at) * 1000;

                // 获取倒计时的时间
                this.getCountDownTime();
            } else {
                this.$toast({
                    mask: true,
                    message: '网络异常',
                    duration: 3000
                });
            }
        },

        doubleDigitNum(num) {
            return num >= 0 && num < 10 ? '0' + num : num;
        },
        getCountDownTime() {
            let presentTime = new Date().getTime();
            let expiredTime = this.orderInfo.createTime + 15 * 60 * 1000;
            let deltTime = Math.round((expiredTime - presentTime) / 1000);
            let m = Math.floor(deltTime / 60);
            let s = deltTime - m * 60;
            if (deltTime <= 0) {
                // 已过期
                this.countDownTime = {
                    m: this.doubleDigitNum(0),
                    s: this.doubleDigitNum(0)
                };
                this.changeToExpired();
            } else {
                this.countDownTime = { m: this.doubleDigitNum(m), s: this.doubleDigitNum(s) };
                this.countDown();
            }
        },
        countDown(type = 'countdown') {
            if (type === 'clear') {
                clearInterval(this.countDownTimer);
                return;
            }
            let id = this.$route.query.id;

            this.countDownTimer = setInterval(() => {
                if (Number(this.countDownTime.s) === 0 && Number(this.countDownTime.m) === 0) {
                    this.changeToExpired(id);
                    clearInterval(this.countDownTimer);
                    return;
                }
                this.countDownTime.s--;
                this.countDownTime.s = this.doubleDigitNum(Number(this.countDownTime.s));
                if (Number(this.countDownTime.s) < 0) {
                    this.countDownTime.s = 59;
                    this.countDownTime.m--;
                    this.countDownTime.m = this.doubleDigitNum(Number(this.countDownTime.m));
                }
            }, 1000);
        },
        async changeToExpired(id = this.$route.query.id) {
            let url = '/index/order/updateOrderStatus',
                param = { id: id },
                res = await Http.fetch(url, param, 'post');
            res = res.data;
            if (res.code === 0) {
                this.isExpired = true;
            } else if (res.code === 30005) {
                this.isExpired = true;
            } else {
                this.$toast({
                    mask: true,
                    message: '订单异常',
                    duration: 3000
                });
            }
        },
        showOrderDetailModal() {
            this.orderModal = true;
            this.$refs.orderDetailModal.show();
        },
        closeOrderDetailModal() {
            this.orderModal = false;
            this.$refs.orderDetailModal.hide();
        },
        choosePay(idx) {
            this.payActive = idx;
        },

        confirmPay: Common.throttle(async function() {
            if (this.payActive === 0) {
                // 微信支付
                let url = '/index/pay/distPayWay',
                    param = { order: this.$route.query.id, type: '1' },
                    res = await Http.fetch(url, param, 'post');
                res = res.data;
                if (res.code === 0) {
                    this.$toast.loading({
                        mask: true,
                        message: '加载中...',
                        duration: 0
                    });
                    let data = { order: this.$route.query.id };
                    window.location.href =
                        GlobalUrl + 'index/pay/wxPay?data=' + encodeURIComponent(JSON.stringify(data));
                } else {
                    this.$toast({
                        mask: true,
                        message: res.msg,
                        duration: 1000
                    });
                }
            } else if (this.payActive === 1) {
                // 会员支付
                if (!JSON.parse(sessionStorage.getItem('userInfo')).mid) {
                    this.$toast({
                        mask: true,
                        message: '未登录不可使用会员支付，请使用微信支付',
                        duration: 2000
                    });
                    return;
                }
                let url = '/index/pay/distPayWay',
                    param = { order: this.$route.query.id, type: '2' },
                    res = await Http.fetch(url, param, 'post');
                res = res.data;
                // console.log(res);
                if (res.code === 0) {
                    this.countDown('clear');
                    let payData = {
                        orderNo: res.data.order_no,
                        originPrice: res.data.money,
                        payMethod: '余额支付',
                        payPrice: res.data.pay_money,
                        createTime: res.data.create_at * 1000,
                        payTime: res.data.pay_time * 1000,
                        type: res.data.type
                    };
                    this.$router.replace({
                        path: 'payDetail',
                        query: {
                            payData: JSON.stringify(payData)
                        }
                    });
                } else {
                    this.$toast({
                        mask: true,
                        message: res.msg,
                        duration: 1000
                    });
                }
            }
        })
    }
};
</script>
