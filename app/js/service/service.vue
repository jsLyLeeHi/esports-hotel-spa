<template>
  <div>

    <!-- 选择位置信息 -->
    <div class="service-location-modal flex-center" v-if="locationInfo.site===''">
      <div class="modal-content">
        <location-option v-on:confirm="locationConfirm"></location-option>
      </div>
    </div>

    <div v-else>
      <div class="service-head">
        <img class="head-img" :src="serverType[serverActive].image" alt="">
        <div class="head-title" :class="[contentFixed?'head-fixed':'service-abs']">
          <div class="type-container">
            <div class="type-content">
              <div class="type-item" :key="index" v-for="(item,index) in serverTypeBar" @click="toggleServerType(index)">
                <div class="service-type-text">
                  <span>{{item.name}}</span>
                  <transition name="under-line">
                    <div v-if="serverActive===index" class="under-line"></div>
                  </transition>

                </div>
              </div>
              <div class="head-label" v-if="serverTypeBar.length===1">食材新鲜 营养丰富</div>
            </div>
          </div>
        </div>
      </div>

      <div class="service-no" v-if="service==='none'">
        <div class="no-img">
          <img src="../../images/noservice@2x.png" alt="">
        </div>
        <p>您还没有相关服务，敬请期待！</p>

      </div>

      <div v-else>

        <div class="service-content" :class="{'service-content-fixed':contentFixed}" v-if="proInfo.length>0">
          <div class="left" @touchstart="leftTouchStart($event)" @touchmove="leftTouchMove($event)">
            <ul>
              <li :class="{active:proActive===index}" :key="index" v-for="(item,index) in proInfo" @click="toggleProType(index)">{{item.goods_type}}</li>
            </ul>
          </div>
          <div class="right">
            <div :key="index" v-for="(item,index) in proInfo">
              <div class="tab-title" :class="'title'+index">{{item.goods_type}}</div>
              <div class="tab-item flex-flex" :key="indexPro" v-for="(itemPro,indexPro) in item.goods">
                <div class="item-img">
                  <img :src="itemPro.image" alt="">
                </div>

                <div class="item-info flex-all">
                  <div class="item-name">{{itemPro.goods_name}}</div>
                  <div class="vip-price" v-if="rebate!==1&&Number(itemPro.money)!==0">会员可享折后<span class="em-color">{{(Math.round(rebate*Number(itemPro.money) * 100) / 100).toFixed(2)}}</span>元</div>
                  <div class="vip-price item-price-info" v-else>{{itemPro.order_info}}</div>
                  <div class="item-price flex-between">
                    <div>￥<span>{{itemPro.money}}</span></div>
                    <div class="flex-center">
                      <transition name="calculate">
                        <div class="flex-center" v-show="itemPro.num">
                          <div class="calculate flex-center" @click="calculate('minus',index,indexPro)"><img src="../../images/minus@2x.png" alt=""></div>
                          <div class="item-num flex-center">{{itemPro.num}}</div>
                        </div>
                      </transition>
                      <div class="calculate flex-center" @click="calculate('add',index,indexPro)">
                        <img src="../../images/add@2x.png" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-btn btn-fixed flex-between" @click="submitOrder">
              <div>
                <div class="order-price"><span>￥</span>{{orderPrice.integer}}<span>{{orderPrice.decimals}}</span></div>
                <div class="delete-price" v-if="rebate!==1 && (Math.round(orderTotalPrice*100)/100)!==0 ">折扣前 <span>￥{{(Math.round(orderTotalPrice*100)/100).toFixed(2)}}</span></div>
              </div>

              <div class="line"></div>
              <div :class="{'android-padding':$isAndroid}">提交订单</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <TabBar active='1' />

  </div>
</template>
<script>
import Http from '_utils_/request';
import TabBar from '../components/tabBar.vue';
import locationOption from '../components/locationOption.vue';
export default {
    components: { TabBar, locationOption },
    data() {
        return {
            locationInfo: {
                siteType: 1,
                site: ''
            },
            service: '',
            contentFixed: false,
            proActive: 0,
            serverType: [{ image: '' }],
            serverActive: 0,
            proInfo: [],
            orderTotalPrice: 0,
            widthData: 0,
            tabScroll: false,
            tabClick: 0,
            bodyScrollLock: false
        };
    },
    computed: {
        rebate() {
            return Number(JSON.parse(sessionStorage.getItem('userInfo')).grade_right.rebate);
        },
        orderPrice() {
            let price;
            if (this.rebate === 1) {
                price = (Math.round(this.orderTotalPrice * 100) / 100).toFixed(2);
            } else {
                price = (Math.round(this.orderTotalPrice * this.rebate * 100) / 100).toFixed(2);
            }
            let integer = parseInt(price);
            let decimals = price.substring(price.indexOf('.'));

            return {
                integer,
                decimals
            };
        },
        serverTypeBar() {
            // 如果用户在网吧，只能显示 id=1 的点餐服务
            if (Number(this.locationInfo.siteType) === 2) {
                return this.serverType.filter(item => {
                    return item.id === 1;
                });
            } else {
                return this.serverType;
            }
        }
    },
    watch: {
        $route: 'addScroll'
    },

    created() {
        this.getLocation();
        this.getServerType();
        this.addScroll();
        console.log(this.$isAndroid);
    },
    methods: {
        leftTouchStart(event) {
            this.y = event.changedTouches[0].pageY;
        },
        leftTouchMove(event) {
            event.preventDefault();
            let elLeft = document.querySelector('.left');
            let direction = this.y - event.changedTouches[0].pageY;
            this.y = event.changedTouches[0].pageY;
            elLeft.scrollTop += direction;
        },
        async getLocation() {
            // 获取位置信息，首选session，其次扫码信息，最后是会员入住信息，如果都没有弹出填写信息的modal框。
            if (sessionStorage.getItem('serviceOrderLocation')) {
                this.locationInfo = JSON.parse(sessionStorage.getItem('serviceOrderLocation'));
            } else if (this.$route.query.site) {
                this.locationInfo = {
                    siteType: this.$route.query.site_type,
                    site: this.$route.query.site
                };
                this.locationSetSession();
            } else {
                let url = '/index/user/getSite',
                    param = {},
                    res = await Http.fetch(url, param, 'get');
                res = res.data;
                // console.log(res);
                if (res.code === 0) {
                    this.locationInfo = {
                        siteType: 1,
                        site: res.data.room_number
                    };
                    this.locationSetSession();
                }
            }
        },
        // 位置弹框确认按钮
        locationConfirm(siteType, site) {
            if (site === '') {
                this.$toast({
                    mask: 'true',
                    position: 'middle',
                    message: '请填写您当前的位置',
                    duration: 1000
                });
            } else {
                this.locationInfo = { siteType, site };
                this.locationSetSession();
            }
        },
        locationSetSession() {
            sessionStorage.setItem('serviceOrderLocation', JSON.stringify(this.locationInfo));
        },

        addScroll() {
            if (this.$route.name === 'service') {
                window.onscroll = this.handleScroll;
            }
        },
        handleScroll() {
            if (!document.querySelector('.service-content')) return;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let headHeight = document.querySelector('.head-title').clientHeight + 1;
            let delt = document.querySelector('.service-content').offsetTop - headHeight;
            if (scrollTop >= delt) {
                this.contentFixed = true;
            } else {
                this.contentFixed = false;
            }

            if (this.proInfo.length <= 1) return;

            for (let i = 0; i < this.proInfo.length; i++) {
                if (
                    scrollTop >= document.querySelector('.title' + i).offsetTop - headHeight &&
                    i === this.proInfo.length - 1
                ) {
                    this.proActive = i;
                } else if (
                    scrollTop >= document.querySelector('.title' + i).offsetTop - headHeight &&
                    scrollTop < document.querySelector('.title' + (i + 1)).offsetTop - headHeight
                ) {
                    let el = document.querySelector('.left');
                    // let scrollTop = el.scrollTop;
                    if (!this.tabScroll) {
                        // console.log(this.proActive);
                        // console.log(this.tabScroll);
                        // console.log(this.tabClick);
                        this.proActive = i;
                        // 6 为左侧li的最中间
                        if (i >= 6) {
                            let targetScroll = document.querySelectorAll('.left li')[i - 6].offsetTop;
                            if (this.tabClick === 1) {
                                el.scrollTop = targetScroll;
                                // this.smoothScroll(el, scrollTop, targetScroll, 'none', () => {
                                //     this.tabClick = 0;
                                // });
                            } else {
                                el.scrollTop = targetScroll;
                            }
                        } else {
                            if (this.tabClick === 1) {
                                el.scrollTop = 0;
                                // this.smoothScroll(el, scrollTop, 0, 'none', () => {
                                //     this.tabClick = 0;
                                // });
                            } else {
                                el.scrollTop = 0;
                            }
                        }
                    } else {
                        document.querySelector('.left').scrollTop = document.querySelector('.left').scrollTop;
                    }
                }
            }
        },
        calculate(type, index, indexPro) {
            if (type === 'add') {
                this.proInfo[index].goods[indexPro].num++;
                this.orderTotalPrice += Number(this.proInfo[index].goods[indexPro].money);
            } else if (type === 'minus') {
                if (this.proInfo[index].goods[indexPro].num > 0) {
                    this.proInfo[index].goods[indexPro].num--;
                    this.orderTotalPrice -= Number(this.proInfo[index].goods[indexPro].money);
                } else {
                    this.proInfo[index].goods[indexPro].num = 0;
                }
            }
        },

        toggleProType(idx) {
            this.tabScroll = true;
            this.proActive = idx;
            let total =
                document.querySelector('.title' + idx).offsetTop -
                document.querySelector('.head-title').clientHeight +
                1 +
                document.querySelector('.service-head').clientHeight;

            // 滚动高度
            let distance = document.documentElement.scrollTop || document.body.scrollTop;

            // body的高度
            let bodyHeight = document.body.clientHeight;

            // body剩余的高度
            let remainHeight = bodyHeight - distance - document.documentElement.clientHeight;

            if (total - distance > 0 && remainHeight <= 0) {
                this.tabScroll = false;
                this.tabClick = 1;
                return;
            }

            document.documentElement.scrollTop = total;
            document.body.scrollTop = total;
            this.tabScroll = false;

            // this.smoothScroll('body', distance, total, 'none', () => {
            //     this.tabScroll = false;
            //     this.tabClick = 1;
            // });
        },
        async toggleServerType(idx) {
            this.serverActive = idx;
            this.proActive = 0;
            if (!this.serverType[idx].proInfo) {
                await this.getServerInfo(this.serverType[idx].id);
            } else {
                this.proInfo = this.serverType[idx].proInfo;
            }
            this.$nextTick(() => {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            });
            this.contentFixed = false;
            if (this.proInfo.length === 0) {
                this.service = 'none';
            } else {
                this.service = '';
            }
        },
        submitOrder() {
            let order = [];
            for (let i = 0; i < this.serverType.length; i++) {
                if (this.serverType[i].proInfo) {
                    let orderPro = [];
                    for (let j = 0; j < this.serverType[i].proInfo.length; j++) {
                        if (this.serverType[i].proInfo[j].goods) {
                            let orderItem = this.serverType[i].proInfo[j].goods.filter(function(item) {
                                return item.num > 0;
                            });
                            if (orderItem.length > 0) {
                                orderItem.forEach(item => {
                                    // 添加商品类型名称
                                    item.goods_type_name = this.serverType[i].proInfo[j].goods_type;
                                    orderPro.push(item);
                                });
                            }
                        }
                    }
                    if (orderPro.length > 0) {
                        order.push({
                            serviceType: {
                                id: this.serverType[i].id,
                                name: this.serverType[i].name
                            },
                            orderPro: orderPro
                        });
                    }
                }
            }

            if (order.length === 0) {
                this.$toast({
                    mask: 'true',
                    position: 'middle',
                    message: '请选择商品',
                    duration: 1000
                });
            } else if (Math.round(Number(this.orderTotalPrice) * 100) / 100 === 0) {
                this.$toast({
                    mask: 'true',
                    position: 'middle',
                    message: '商品总价不能为 0，请加购商品',
                    duration: 1000
                });
            } else {
                let orderInfo = {
                    order: order,
                    orderPrice: this.orderPrice,
                    orderTotalPrice: this.orderTotalPrice
                };

                sessionStorage.setItem('serviceOrderInfo', JSON.stringify(orderInfo));
                // 跳转提交订单页面
                if (this.$route.query.site) {
                    this.$router.push({
                        path: 'serviceOrder',
                        query: { site_type: this.$route.query.site_type, site: this.$route.query.site }
                    });
                } else {
                    this.$router.push({
                        path: 'serviceOrder'
                    });
                }
            }
        },
        // 获取服务类型
        async getServerType() {
            let url = '/index/server/getAllServer',
                param = {},
                res = await Http.fetch(url, param, 'get');
            res = res.data;
            console.log(res);
            if (res.code === 0) {
                if (res.data.length === 0) {
                    this.service = 'none';
                } else {
                    // 如果是会员，显示会员的服务，如果是非会员，显示非会员的服务
                    if (JSON.parse(sessionStorage.getItem('userInfo')).mid) {
                        this.serverType = res.data;
                    } else {
                        this.serverType = res.data.filter(item => {
                            return item.rule === 0;
                        });
                    }

                    this.getServerInfo(this.serverType[0].id);
                }
            } else {
                this.$toast({
                    mask: true,
                    message: '请求失败',
                    duration: 3000
                });
            }
        },
        async getServerInfo(id) {
            this.$toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0
            });

            let url = '/index/server/getAllServerInfoById',
                param = { id: id },
                res = await Http.fetch(url, param, 'get');
            res = res.data;
            // console.log(res);
            this.$toast.clear();
            if (res.code === 0) {
                res = res.data.good_type;
                // console.log(res);
                for (let i = 0; i < res.length; i++) {
                    if (res[i].goods) {
                        res[i].goods.forEach(item => {
                            item.num = 0;
                            // if (sessionStorage.getItem('serviceOrderInfo')) {
                            //     let orderInfo = JSON.parse(sessionStorage.getItem('serviceOrderInfo'));
                            //     for (let j = 0; j < orderInfo.order.length; j++) {
                            //         if (orderInfo.order[j].serviceType.id === id) {
                            //             orderInfo.order[j].orderPro.forEach(orderItem => {
                            //                 if (orderItem.id === item.id) {
                            //                     item.num = orderItem.num;
                            //                 }
                            //             });
                            //         }
                            //     }
                            //     this.orderTotalPrice = Number(
                            //         orderInfo.orderPrice.integer + orderInfo.orderPrice.decimals
                            //     );
                            // }
                        });
                    }
                }

                for (let i = 0; i < this.serverType.length; i++) {
                    if (this.serverType[i].id === id) {
                        this.serverType[i].proInfo = res;

                        this.proInfo = this.serverType[i].proInfo;
                    }
                }
            } else {
                this.$toast({
                    mask: true,
                    message: '请求失败',
                    duration: 3000
                });
            }
        }
    }
};
</script>
