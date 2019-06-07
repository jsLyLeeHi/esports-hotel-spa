<template>
  <div>
    <div class="serorder-location flex-center">
      <div class="head" @click="showLocModal()">
        <div class="location flex-flex">
          <div class="label" :class="{'android-label':$isAndroid}">位置</div>
          <div class="room flex-all">
            <div v-if="modal.site === ''">
              <span>请点击填写您的位置信息</span>
              <div class="line"></div>
            </div>
            <span v-else class="room-text">请核对您的位置信息</span>
          </div>
        </div>
        <div class="contact flex-between">
          <span v-if="modal.site === ''">以方便您及时用餐</span>
          <span v-else class="contact-text">{{location.position}}</span>
          <div :class="[locationModal?'serorder-arrow-top':'serorder-arrow']"></div>
        </div>
      </div>
    </div>

    <div class="serorder-container">
      <div class="serorder-content" :key="index" v-for="(item,index) in order">
        <div class="title">{{item.serviceType.name}}</div>
        <div class="section">
          <div class="item" :key="indexOrder" v-for="(itemOrder,indexOrder) in item.orderPro">
            <img :src="itemOrder.image" alt>
            <span class="item-name">{{itemOrder.goods_name}}</span>
            <span class="item-num">x{{itemOrder.num}}</span>
            <div class="item-price flex-between">
              <span class="rebate-price">￥{{(Math.round(rebate*Number(itemOrder.money) * 100) / 100).toFixed(2)}}</span>
              <span class="origin-price" v-if="rebate!==1&&Number(itemOrder.money)!==0">￥{{itemOrder.money}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="serorder-remark">
        <div class="remark flex-between" @click="remark">
          <div class="tip">备注</div>
          <div class="flex-center">
            <span>口味偏好等要求</span>
            <div :class="[remarkShow?'serorder-arrow-top':'serorder-arrow']"></div>
          </div>
        </div>

        <transition name="remark">
          <div v-show="remarkShow" class="remark-text">
            <textarea placeholder="请填写您需要备注的信息" v-model="remarkText"></textarea>
          </div>
        </transition>
      </div>

      <div class="serorder-note flex-center">订单确认后不可取消/变更，如餐送到人不在，酒店将扣除全额餐费；饭菜保留，请及时就餐。</div>

      <div class="serorder-btn flex-flex">
        <div class="total-price flex-all">
          <div class="btn-price">
            <span>￥</span>
            {{orderPrice.integer}}
            <span>{{orderPrice.decimals}}</span>
          </div>
          <div class="delete-price" v-if="rebate!==1 &&originPrice!==0 ">折扣前
            <span>￥{{originPrice}}</span>
          </div>
        </div>
        <div class="btn-order flex-center" @click="submitOrder"><span :class="{'android-padding':$isAndroid}">提交订单</span></div>
      </div>
    </div>

    <BottomModal ref="locationModal" name="locationModal" v-on:closed="closeLocModal">
      <div class="bottom-madal serorder-locmodal">
        <div class="close flex-center" @click="closeLocModal">
          <img src="../../images/popup@2x.png" alt>
        </div>
        <div class="content">
          <div class="title">编辑位置信息</div>
          <div class="form">
            <div class="form-item">
              <span>请选择</span>
              <div class="item-input location-option">
                <div class="option-item flex-center" @click="locationOption('1')">
                  <div class="option-img" :class="{'option-active':modal.siteType===1}"></div>
                  <div>房间号</div>
                </div>
                <div class="option-item flex-center" @click="locationOption('2')">
                  <div class="option-img" :class="{'option-active':modal.siteType===2}"></div>
                  <div>座位号</div>
                </div>
              </div>
            </div>

            <div class="form-item room">
              <span>{{modal.siteType===1?'房间号':'座位号'}}</span>
              <div class="item-input">
                <input type="text" v-model.lazy.trim="modal.site" placeholder="请输入您的位置信息，大写字母 + 数字">
              </div>

            </div>
          </div>
        </div>

        <div class="modal-btn flex-center" @click="locationConfirm">确认信息</div>
      </div>
    </BottomModal>
  </div>
</template>
<script>
import BottomModal from '../components/bottomModal.vue';
import Common from '_utils_/common';
import Http from '_utils_/request';

export default {
    components: { BottomModal },
    data() {
        return {
            remarkShow: false,
            locationModal: false,
            remarkText: '',
            order: [],
            orderPrice: {
                integer: '0',
                decimals: '.00'
            },
            modal: {
                siteType: 1, // 1:房间号,2:座位号
                site: ''
            }
        };
    },
    computed: {
        rebate() {
            return Number(JSON.parse(sessionStorage.getItem('userInfo')).grade_right.rebate);
        },
        originPrice() {
            let totalPrice = JSON.parse(sessionStorage.getItem('serviceOrderInfo')).orderTotalPrice;
            return (Math.round(Number(totalPrice) * 100) / 100).toFixed(2);
        },
        location() {
            let position = '';
            if (this.modal.site !== '') {
                if (this.modal.siteType === 1) {
                    position = `${this.modal.site}号房间`;
                } else if (this.modal.siteType === 2) {
                    position = `${this.modal.site}号座位`;
                }
            }
            return {
                position: position
            };
        }
    },

    created() {
        this.getOrderInfo();
        this.getInitSite();
    },

    watch: {
        $route: 'getOrderInfo'
    },
    methods: {
        toast(message, position = 'bottom') {
            this.$toast({
                mask: 'true',
                position: position,
                message: message,
                duration: 1000
            });
        },
        getOrderInfo() {
            let orderInfo = JSON.parse(sessionStorage.getItem('serviceOrderInfo'));
            this.order = orderInfo.order;
            this.orderPrice = orderInfo.orderPrice;
            if (orderInfo.remark) {
                this.remarkText = orderInfo.remark;
                this.remarkShow = true;
            }
        },
        remark() {
            this.remarkShow = !this.remarkShow;
        },
        showLocModal() {
            this.locationModal = true;
            this.$refs.locationModal.show();
        },
        closeLocModal() {
            this.locationModal = false;
            this.$refs.locationModal.hide();
            if (sessionStorage.getItem('serviceOrderLocation')) {
                this.modal = JSON.parse(sessionStorage.getItem('serviceOrderLocation'));
            } else {
                this.modal.site = '';
            }
        },
        locationOption(type) {
            if (this.modal.siteType !== Number(type)) {
                if ((Number(type) === 2 && this.order.length > 1) || this.order[0].serviceType.id !== 1) {
                    this.toast('订单中包含非网吧服务，不可选择座位号');
                } else {
                    this.modal.siteType = Number(type);
                    this.modal.site = '';
                }
            }
        },
        locationConfirm() {
            if (this.modal.site === '') {
                this.toast('请填写您当前的位置');
            } else {
                this.$refs.locationModal.hide();
                this.locationSetSession();
            }
        },
        locationSetSession() {
            sessionStorage.setItem('serviceOrderLocation', JSON.stringify(this.modal));
        },
        async getInitSite() {
            // 初始化位置信息，首选sessionStorage，其次选择扫码信息，最后是会员入住信息
            if (sessionStorage.getItem('serviceOrderLocation')) {
                this.modal = JSON.parse(sessionStorage.getItem('serviceOrderLocation'));
                this.modal.siteType = Number(this.modal.siteType);
            } else if (this.$route.query.site) {
                this.modal.siteType = Number(this.$route.query.site_type);
                this.modal.site = this.$route.query.site;
                this.locationSetSession();
            } else {
                let url = '/index/user/getSite',
                    param = {},
                    res = await Http.fetch(url, param, 'get');
                res = res.data;
                // console.log(res);
                if (res.code === 0) {
                    this.modal.site = res.data.room_number;
                    this.locationSetSession();
                }
            }
        },
        submitOrder: Common.throttle(async function() {
            // 将备注内容添加进sessionStorage
            let orderInfo = JSON.parse(sessionStorage.getItem('serviceOrderInfo'));
            orderInfo.remark = this.remarkText;
            sessionStorage.setItem('serviceOrderInfo', JSON.stringify(orderInfo));

            if (this.modal.site === '') {
                this.toast('请填写您的位置信息', 'middle');
            } else {
                let goods = [];
                this.order.forEach(item => {
                    item.orderPro.forEach(proItem => {
                        goods.push({
                            goods_id: proItem.id,
                            num: proItem.num,
                            server_id: item.serviceType.id,
                            server_name: item.serviceType.name,
                            goods_type_name: proItem.goods_type_name
                        });
                    });
                });
                let paramData = {
                    site_type: this.modal.siteType,
                    site: this.modal.site,
                    remark: this.remarkText,
                    order_content: goods
                };

                let url = '/index/order/createOrder',
                    param = { type: '3', serve: paramData },
                    res = await Http.fetch(url, param, 'post');
                // console.log(param);
                res = res.data;
                // console.log(res);
                if (res.code === 0) {
                    this.$router.push({
                        path: 'orderPay',
                        query: { id: res.data.id }
                    });
                } else {
                    this.$toast({
                        mask: true,
                        message: '请求失败',
                        duration: 3000
                    });
                }
            }
        })
    }
};
</script>
