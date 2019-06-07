<template>
  <div>
    <div class="pay-detail orderDetail">
      <div class="pay-person">
        <div>订单信息</div>
        <div class="order-number">订单号：{{detail.order_no}}</div>
      </div>
      <div class="pay-cotent orderRecord-detail">
        <div class="orderRecord-detail-content">
          <img v-if="detail.status==2" :src="overdueImage">
          <div v-if="detail.status == 1">订单状态 : 待支付</div>
          <div v-if="detail.status == 2">订单状态 : 已过期</div>
          <div v-if="detail.status == 3">订单状态 : 已支付</div>
          <div v-if="detail.status == 4">订单状态 : 支付失败</div>
          <div v-if="detail.status == 5">订单状态 : 已完成</div>
          <div v-if="detail.status == 6">订单状态 : 已退款</div>

          <div v-if="detail.status == 1">付款时间 : 待支付</div>
          <div v-if="detail.status == 2">付款时间 : 已过期</div>
          <div
            v-if="detail.status == 3 ||detail.status == 5"
          >付款时间 : {{(detail.pay_time*1000) | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
          <div v-if="detail.status == 4">付款时间 : 支付失败</div>
          <div v-if="detail.status == 6">付款时间 : 已退款</div>

          <div>下单时间 : {{(detail.create_at*1000) | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
          <div v-if="detail.type==2">手机号 : {{detail.detail.phone}}</div>
          <div v-else-if="phone!=''">手机号 : {{phone}}</div>
          <div v-else>手机号 : ---</div>
          <div v-if="detail.pay_type=='1'">支付方式 : 微信</div>
          <div v-else-if="detail.pay_type=='2'">支付方式 : 会员</div>
          <div v-else-if="detail.pay_type=='3'">支付方式 : 现金</div>
          <div>总价 : {{detail.money}}</div>
          <div>
            实付 :
            <span v-if="detail.status==3||detail.status==5">{{detail.pay_money}}</span>
            <span v-else class="orderRecord-detail-content-overdue">---</span>
          </div>
        </div>
      </div>
      <div v-if="detail.status == 1" class="orderDetail-evaluation-btn" @click="goPay()">去支付</div>
      <div v-if="detail.status==5 &&detail.mark==null" class="orderDetail-evaluation">
        <div class="orderDetail-evaluation-p">请您对本次服务进行评价</div>
        <div class="orderDetail-evaluation-content">
          <span>服务态度</span>
          <div class="orderDetail-evaluation-img">
            <div
              v-for="(i,index) in evaluationImage"
              :key="index"
              @click="Changeevaluation(index+1)"
            >
              <img v-if="index<mark" :src="i.evaluation">
              <img v-if="index>=mark" :src="i.noevaluation">
            </div>
          </div>
          <div class="orderDetail-evaluation-content-text">
            <span v-for="(i,index) in fonts " :key="i">
              <span v-if="index==mark">{{i}}</span>
            </span>
          </div>
        </div>
        <textarea v-model="appraise" placeholder="本次服务您还满意吗？说说它的优点和美中不足的地方吧"></textarea>
        <div class="orderDetail-evaluation-btn" @click="subEvaluation">提交评价</div>
      </div>
      <div v-if="detail.status==5 &&detail.mark!=null" class="orderDetail-evaluation">
        <div class="orderDetail-evaluation-p">
          <div>感谢您对本次服务进行评价</div>
          <div>{{detail.app_time*1000 |dateformat('YYYY-MM-DD')}}</div>
        </div>

        <div class="orderDetail-evaluation-content">
          <span>服务态度</span>
          <div class="orderDetail-evaluation-img">
            <div v-for="(i,index) in evaluationImage" :key="index">
              <img v-if="index<detail.mark" :src="i.evaluation">
              <img v-if="index>=detail.mark" :src="i.noevaluation">
            </div>
          </div>
          <div class="orderDetail-evaluation-content-text">
            <span v-for="(i,index) in fonts " :key="i">
              <span v-if="index==detail.mark">{{i}}</span>
            </span>
          </div>
        </div>
        <div class="orderDetail-evaluation-success-text">{{detail.appraise}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import noevaluation from '_images_/noevaluation@2x.png';
import evaluation from '_images_/evaluation@2x.png';
import Common from '_utils_/common.js';
export default {
    data() {
        return {
            detail: [],
            overdueImage: require('_images_/overdue.png'),
            evaluationImage: [
                { noevaluation, evaluation },
                { noevaluation, evaluation },
                { noevaluation, evaluation },
                { noevaluation, evaluation },
                { noevaluation, evaluation }
            ],
            fonts: ['', '非常差', '差', '一般', '好', '非常好'],
            mark: 0,
            appraise: ''
        };
    },
    computed: {
        phone() {
            return JSON.parse(sessionStorage.userInfo).phone;
        }
    },
    mounted() {
        this.getDetail();
        console.log();
    },
    methods: {
        //去支付
        goPay() {
            this.$router.push({
                path: 'orderPay',
                query: {
                    id: this.detail.id
                }
            });
        },
        Changeevaluation(index) {
            this.mark = index;
        },
        async getDetail() {
            let url = '/index/order/getOrderById',
                param = {
                    id: this.$route.query.detail
                },
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            console.log(res);
            if (res.code == '0') {
                this.detail = res.data;
            } else if (res.code == '30001') {
                this.list = false;
            }
        },
        //提交评价
        subEvaluation: Common.throttle(async function() {
            if (this.mark == 0) {
                return this.$toast({
                    position: 'middle',
                    message: '请进行评分'
                });
            }
            let url = '/index/order/orderMark',
                param = {
                    id: this.detail.id,
                    mark: this.mark,
                    appraise: this.appraise
                },
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            if (res.code == '0') {
                this.$toast.success('评价成功');
                this.$router.go(-1);
            } else {
                this.$toast.fail('评价失败');
            }
        }, 3000)
    }
};
</script>
