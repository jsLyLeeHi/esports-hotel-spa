<template>
  <div>
    <div v-if="list===false" class="orderRecord-no">暂无消费记录信息</div>
    <ul v-else class="orderRecord">
      <li class="orderRecord-li" @click="addPopus(index)" v-for="(item,index) in list" :key="index">
        <div class="orderRecord-title">
          <img :src="circleImage">
          <span v-if="item.type == '1'">网吧点餐</span>
          <span v-else-if="item.type == '2'">酒店预订</span>
          <span v-else-if="item.type=='3'">酒店服务</span>
          <span v-else-if="item.type=='4'">余额充值</span>
          <span v-else>其他</span>
          <div class="orderRecord-title-wait" v-if="item.status == 1">待支付</div>
          <div class="orderRecord-title-overdue" v-else-if="item.status == 2">已过期</div>
          <div class="orderRecord-title-paid" v-else-if="item.status == 3">已支付</div>
          <div class="orderRecord-title-overdue" v-else-if="item.status == 4">支付失败</div>
          <div class="orderRecord-title-paid" v-else-if="item.status == 5">已完成</div>
          <div class="orderRecord-title-overdue" v-else-if="item.status == 6">已退款</div>
        </div>
        <div class="orderRecord-content">
          <div class="orderRecord-content-orderNumber">
            <span>订单编号：{{item.order_no}}</span>
          </div>
          <div class="orderRecord-content-time">
            <span>{{(item.create_at*1000) | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            <span>消费金额:{{item.pay_money}}</span>
          </div>
        </div>
      </li>
    </ul>
    <!-- <modal-popups ref="modals" classes="modal-popups" @closed="close()" name="modals">
      <div class="orderRecord-popups">
        <div class="orderRecord-popups-top" :style="bgImageStyle">
          <img :src="closeImgBtn" @click="close()">
          <div class="orderRecord-popups-top-mesg">
            <div>订单信息</div>
            <div>
              <span>订单号 ：{{popups.order_no}}</span>
              <span>111</span>
            </div>
          </div>
        </div>
        <div class="orderRecord-popups-content">
          <img v-if="popups.status==2" :src="overdueImg">
          <div v-if="popups.status == 1">付款时间 : 待支付</div>
          <div v-if="popups.status == 2">付款时间 : 已过期</div>
          <div
            v-if="popups.status == 3"
          >付款时间 : {{(popups.pay_time*1000) | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
          <div v-if="popups.status == 4">付款时间 : 支付失败</div>
          <div v-if="popups.status == 5">付款时间 : 已完成</div>
          <div v-if="popups.status == 6">付款时间 : 已退款</div>
          <div>下单时间 : {{(popups.create_at*1000) | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
          <div v-if="popups.pay_type=='1'">支付方式 : 微信</div>
          <div v-else-if="popups.pay_type=='2'">支付方式 : 会员</div>
          <div v-else-if="popups.pay_type=='3'">支付方式 : 现金</div>
          <div>总价 : {{popups.money}}</div>
          <div>
            实付 :
            <span v-if="popups.status==3||popups.status==5">{{popups.pay_money}}</span>
            <span v-else class="orderRecord-popups-content-overdue">---</span>
          </div>
          <div
            v-if="popups.status == 1"
            @click="goPay()"
            class="orderRecord-popups-content-gopay flex-center"
          >去支付</div>
        </div>
      </div>
    </modal-popups>-->
  </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            closeImgBtn: require('_images_/close@2x.png'),
            circleImage: require('_images_/circle@2x.png'),
            overdueImg: require('_images_/overdue.png')
        };
    },
    methods: {
        addPopus(index) {
            this.$router.push({
                path: 'orderDetail',
                query: { detail: this.list[index].id }
            });
        },
        async getOrderList() {
            let url = '/index/order/getOrderList',
                param = {},
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(res);
            if (res.code == '0') {
                this.getCountDownTime(res.data);
            } else if (res.code == '30001') {
                this.list = false;
            }
        },
        getCountDownTime(param) {
            let presentTime = new Date().getTime(),
                expiredTime,
                deltTime,
                orderId = [];
            for (let index = 0; index < param.length; index++) {
                if (param[index].status == 1) {
                    expiredTime = (param[index].create_at + 15 * 60) * 1000;
                    deltTime = Math.round((expiredTime - presentTime) / 1000);
                    if (deltTime <= 0) {
                        orderId.push(param[index].id);
                    }
                }
            }
            if (JSON.stringify(orderId) === '[]') {
                return (this.list = param);
            } else {
                this.batchPast(orderId);
            }
        },
        async batchPast(orderId) {
            let url = '/index/order/batchPast',
                param = { ids: orderId },
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(param);
            console.log(res);
            if (res.code === 0) {
                // console.log(res);
                this.getOrderList();
            }
        }
    },
    mounted() {
        this.getOrderList();
        // console.log(dateformat(1546950455, 'YYYY-MM-DD HH:mm:ss'));
    }
};
</script>

