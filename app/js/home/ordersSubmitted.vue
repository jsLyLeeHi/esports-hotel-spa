<template>
  <div class="order-submit">
    <div class="order-submit-top" :style="images.bgImg">
      <div class="order-submit-top-content">
        <div class="order-submit-top-content-title">
          <span
            :class="{'android-padding':$isAndroid}"
            class="order-submit-top-home"
          >{{home}}{{homeName}}</span>
          <div></div>
          <div></div>
          <span :class="{'android-padding':$isAndroid}">共{{datas.isDate}}晚</span>
        </div>
        <div class="order-submit-top-content-data">
          <span>{{datas.beginDate | dateformat('M')}}月{{datas.beginDate | dateformat('D')}}日</span>
          <span>{{datas.beginDate | dateformat('dddd')}}</span>
          <span>—</span>
          <span>{{datas.endDate | dateformat('M')}}月{{datas.endDate | dateformat('D')}}日</span>
          <span>{{datas.endDate | dateformat('dddd')}}</span>
        </div>
        <div>
          <ul>
            <li>床型：{{datas.bed_type}}</li>
            <li>
              <span v-if="datas.breakfast==0">不</span>含早
            </li>
            <li>
              <span v-if="datas.window==0">无窗</span>
              <span v-if="datas.window==1">有窗</span>
            </li>
            <li>
              <span v-if="datas.bathroom==0">无独立卫浴</span>
              <span v-if="datas.bathroom==1">有独立卫浴</span>
            </li>
            <li>
              <span>{{datas.live_num}}人间</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="order-submit-tip">
      <img :src="images.alertImg">
      <div>订单确认后不可取消/变更，如未入住，酒店将扣除</div>
      <div>全额房费；房间整晚保留，请及时入住。</div>
    </div>
    <div class="order-submit-mid-content">
      <div class="mid-content">
        <span class="mid-content-title">房间数</span>
        <div class="mid-content-right">
          <span>{{item.homeNum}}间</span>
          <div>
            <img v-if="item.homeNum>1" @click="homeNumSelect(false)" :src="images.subHomeImg">
            <img @click="homeNumSelect(true)" :src="images.addHomeImg">
          </div>
        </div>
      </div>
      <div class="mid-content">
        <span class="mid-content-title">入住人</span>
        <div class="mid-content-right">
          <input type="text" v-model="item.username">
          <div>
            <img v-if="usernameImg" @click="clearusername()" :src="images.deleteHomeImg">
            <img :src="images.peopleHomeImg" @click="usernameModal(1)">
          </div>
        </div>
      </div>
      <div class="mid-content">
        <span class="mid-content-title">联系手机</span>
        <div class="mid-content-right">
          <input type="text" v-model="item.phone">
        </div>
      </div>
      <div class="mid-content">
        <span class="mid-content-title">预计到店</span>
        <div class="mid-content-right">
          <span>{{item.check_time | dateformat('YYYY-MM-DD HH')}}点</span>
          <img @click="checkTimeShow()" :src="images.choiceCheckTime">
        </div>
      </div>
      <div class="mid-content">
        <span class="mid-content-title">外设选择</span>
        <span class="mid-content-right">
          <span>默认外设</span>
        </span>
      </div>
    </div>
    <div class="order-submit-tip-invoice" @click="invoice()">
      <img class="order-submit-tip-invoice-img" :src="images.invoiceImg">
      <div class="order-submit-tip-content">
        <div>支持预约酒店发票</div>
        <div>提前预约，退房前前台领取</div>
      </div>
      <img class="order-submit-tip-invoice-to" :src="images.choiceCheckTime">
    </div>
    <div
      class="order-submit-bot"
      :class="{'order-submit-modal-popups-active':setPopusBtn == false}"
    >
      <div class="order-submit-bot-left">
        <div class="order-submit-bot-money">
          <div class="order-submit-bot-totalMoney">
            <span>￥</span>
            <span>{{totalMoney.split('.')[0]}}</span>
            <span>.{{totalMoney.split('.')[1]}}</span>
          </div>
          <div class="order-submit-bot-memberMoney" v-if="Number(rebate)!==1">
            <span>会员可享折后</span>
            <span>{{(totalMoney*rebate).toFixed(2)}}</span>
            <span>元</span>
          </div>
        </div>
        <div class="order-submit-bot-img">
          <span>明细</span>
          <img @click="showPopus()" :src="images.upImg">
        </div>
      </div>
      <div class="order-submit-bot-sub" @click="createOrder">
        <div>提交订单</div>
      </div>
    </div>
    <modal-popups
      ref="modals"
      @closed="closePopus"
      classes="order-submit-modal-popups"
      name="modals"
    >
      <img :src="images.popusCloseBtn" @click="closePopus">
      <div class="order-submit-modal-popups-title">明细 | {{datas.name}}</div>
      <ul>
        <li>
          <span>房费</span>
          <div>
            <span>{{datas.isDate}} 晚 * {{item.homeNum}} 间*{{datas.price}}{{Number(rebate)!==1?`* ${rebate} (会员折扣)`:''}}</span>
          </div>
        </li>
        <li>
          <span>总价</span>
          <div>
            <span>￥</span>
            <span>{{(totalMoney*this.rebate).toFixed(2)}}</span>
          </div>
        </li>
      </ul>
    </modal-popups>
    <modal-popups
      @closed="closeCheckTime(0)"
      ref="timeModal"
      classes="order-checkTime-modal"
      name="timeModal"
    >
      <img :src="images.popusCloseBtn" @click="closeCheckTime(0)">
      <div class="order-checkTime-modal-title">
        <div>预计到店</div>
        <div>房间整晚保留，14:00前到店可能需要等房</div>
      </div>
      <ul>
        <li
          v-for="(i,index) in dates"
          :key="index"
          @click="checkTime(index)"
          :class="{'order-checkTime-modal-active':index===timeSelf}"
        >
          <div v-if="i<24">{{i}}:00</div>
          <div v-else-if="i<32">次日0{{i-24}}:00</div>
          <div v-else-if="i>32">次日{{i-24}}:00</div>
        </li>
      </ul>
      <div class="order-checkTime-modal-submit" @click="closeCheckTime(1)">确认</div>
    </modal-popups>
    <modal-popups
      @closed="usernameModal(0)"
      ref="peopleModal"
      classes="order-people-modal"
      name="peopleModal"
    >
      <img class="order-people-modal-img" :src="images.popusCloseBtn" @click="usernameModal(0)">
      <div v-if="peopleMsg==false" class="order-people-modal-noPeople">暂无入住人信息</div>
      <div v-else>
        <div class="order-people-modal-title">选择入住人信息</div>
        <ul>
          <li @click="usernameModalCheck(index)" v-for="(i,index) in peopleMsg" :key="index">
            <img v-if="index===peopleSelf" :src="images.choicePeople">
            <img v-else :src="images.choicenoPeople">
            <div class="order-people-modal-content">
              <div :class="{'order-people-modal-active':index===peopleSelf}">{{i.username}}</div>
              <span>手机号</span>
              <span>{{i.phone}}</span>
            </div>
          </li>
        </ul>
        <div class="order-checkTime-modal-submit" @click="usernameModal(2)">确认</div>
      </div>
    </modal-popups>
  </div>
</template>
<script>
import bgImage from '_images_/login_me@2x.png';
import bottommodal from '_components_/bottomModal';
export default {
    components: { modalPopups: bottommodal },
    name: 'orderSubmitted',
    data() {
        return {
            images: {
                bgImg: {
                    backgroundImage: 'url(' + bgImage + ')'
                },
                alertImg: require('_images_/alert@2x.png'),
                invoiceImg: require('_images_/invoice@2x.png'),
                upImg: require('_images_/up@2x.png'),
                popusCloseBtn: require('_images_/popup@2x.png'),
                addHomeImg: require('_images_/add@.png'),
                subHomeImg: require('_images_/subtract@2x.png'),
                deleteHomeImg: require('_images_/delete@2x.png'),
                peopleHomeImg: require('_images_/choicepeople@2x.png'),
                choiceCheckTime: require('_images_/choice@.png'),
                choicePeople: require('_images_/choice@2x.png'),
                choicenoPeople: require('_images_/choiceno@2x.png')
            },
            datas: [],
            item: {
                username: '',
                homeNum: 1,
                check_time: '',
                phone: ''
            },
            setPopusBtn: true,
            home: '',
            homeName: '',
            usernameImg: false,
            dates: [],
            timeSelf: 0,
            peopleSelf: 0,
            peopleMsg: []
        };
    },

    computed: {
        rebate() {
            return JSON.parse(sessionStorage.userInfo).grade_right.rebate;
        },
        totalMoney() {
            return (this.datas.price * this.item.homeNum * this.datas.isDate).toFixed(2);
        }
    },
    watch: {
        item: {
            handler() {
                if (this.item.username !== '') {
                    this.usernameImg = true;
                } else {
                    this.usernameImg = false;
                }
            },
            deep: true
        }
    },
    methods: {
        showPopus() {
            if (this.setPopusBtn === true) {
                this.$refs.modals.show();
                this.setPopusBtn = !this.setPopusBtn;
            } else {
                this.$refs.modals.hide();
                this.setPopusBtn = !this.setPopusBtn;
            }
        },
        closePopus() {
            this.$refs.modals.hide();
            this.setPopusBtn = true;
        },
        orderSubmit(par, param) {
            // console.log(par);
            console.log(param);
            this.$router.push({
                path: 'orderPay',
                query: {
                    id: par
                }
            });
        },
        //情况入住人
        clearusername() {
            this.item.username = '';
            this.usernameImg = false;
        },
        usernameModal(num) {
            switch (num) {
                case 1:
                    this.$refs.peopleModal.show();
                    break;
                case 0:
                    this.$refs.peopleModal.hide();
                    break;
                case 2:
                    this.$refs.peopleModal.hide();
                    if (this.peopleMsg != false) {
                        this.item.username = this.peopleMsg[this.peopleSelf].username;
                        this.item.phone = this.peopleMsg[this.peopleSelf].phone;
                    }
                    break;
            }
        },
        //获取全部信息
        getDatas() {
            // console.log(2);

            this.datas = JSON.parse(this.$route.query.listData);
        },
        usernameModalCheck(num) {
            this.peopleSelf = num;
        },
        //选择房间
        checkTime(num) {
            this.timeSelf = num;
        },
        checkTimeShow() {
            this.$refs.timeModal.show();
        },
        closeCheckTime(num) {
            if (num === 0) {
                this.$refs.timeModal.hide();
            } else {
                this.item.check_time = (new Date() / 1000 + 3600 * (this.timeSelf + 1)) * 1000;
                this.$refs.timeModal.hide();
            }
        },
        //发票
        invoice() {
            this.$router.push({
                path: 'invoiceApplyFor',
                query: { beginDate: this.datas.beginDate, endDate: this.datas.endDate, isDate: this.datas.isDate }
            });
        },
        //房间数
        homeNumSelect(parm) {
            switch (parm) {
                case true:
                    if (this.item.homeNum < this.datas.over_num) {
                        this.item.homeNum++;
                    } else {
                        return this.$toast({
                            position: 'bottom',
                            message: '不能大于剩余房间数'
                        });
                    }
                    break;
                case false:
                    if (this.item.homeNum > 1) {
                        this.item.homeNum--;
                    }
                    break;
            }
        },
        async createOrder() {
            if (!this.$common.verifyPhone(this.item.phone).type) {
                return this.$toast({
                    position: 'bottom',
                    message: '请输入正确手机号'
                });
            }
            if (this.item.username == '') {
                return this.$toast({
                    position: 'bottom',
                    message: '请输入入住人'
                });
            }
            if (this.item.homeNum == '') {
                return this.$toast({
                    position: 'bottom',
                    message: '请选择房间数'
                });
            }
            // console.log(this.item);

            let url = '/index/order/createOrder',
                stay = {
                    goods_id: this.datas.id, // 房间ID
                    num: this.item.homeNum, // 数量
                    re_name: this.datas.name,
                    re_check_time: Math.round(Date.parse(this.datas.beginDate) / 1000),
                    re_leave_time: Math.round(Date.parse(this.datas.endDate) / 1000),
                    re_day: this.datas.isDate,
                    check_time: Math.round(this.item.check_time / 1000), // 预计到店时间(精确到秒的时间戳)
                    invoice_status: sessionStorage.userInfoInvoiceMsg === undefined ? 0 : 1, // 是否需要发票,0：不需要；1需要
                    invoice_id:
                        sessionStorage.userInfoInvoiceMsg === undefined
                            ? ''
                            : JSON.parse(sessionStorage.userInfoInvoiceMsg).id, // 发票id(若不需要发票可不填)
                    invoice_time:
                        sessionStorage.userInfoInvoiceMsg === undefined
                            ? ''
                            : Math.round(JSON.parse(sessionStorage.userInfoInvoiceMsg).currentDate / 1000), // 发票领取时间(若不需要发票可不填)
                    invoice_remark:
                        sessionStorage.userInfoInvoiceMsg === undefined
                            ? ''
                            : JSON.parse(sessionStorage.userInfoInvoiceMsg).note, // 发票备注(若不需要发票可不填)
                    username: this.item.username, // 入住人姓名(/index/Hotel/getUserCheckInfo接口可获取,若无则传回用户填写值)
                    phone: this.item.phone // 联系电话(/index/Hotel/getUserCheckInfo接口可获取,若无则传回用户填写值)
                },
                param = {
                    type: 2,
                    stay: stay
                },
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            // console.log(param);
            if (res.code == '0') {
                // console.log(res);
                this.orderSubmit(res.data.id, param);
            } else {
                this.$toast({
                    position: 'bottom',
                    message: res.msg
                });
            }
        },

        //入住人信息获取
        async getOrderList() {
            let url = '/index/Hotel/getUserCheckInfo',
                param = {},
                res = await this.$request.fetch(url, param, 'post');
            res = res.data;
            // console.log(res);
            if (res.code == '0') {
                this.peopleMsg = res.data;
                this.item.username = res.data[this.peopleSelf].username;
                this.item.phone = res.data[this.peopleSelf].phone;
                // this.peopleMsg = false;
            } else if (res.code == '80008') {
                this.peopleMsg = false;
            }
        }
    },

    mounted() {
        //数据处理
        this.getOrderList();
        this.getDatas();
        this.$store.commit('setKeepAlive', ['orderSubmitted']);
        // console.log(this.totalMoney);
        // console.log(this.datas.price * this.item.homeNum);

        this.home = this.datas.name.substring(0, 2);
        this.homeName = this.datas.name.substring(2);
        this.item.phone = JSON.parse(sessionStorage.userInfo).phone;
        //时间处理
        this.item.check_time = (new Date() / 1000 + 3600) * 1000;
        let date = new Date().getHours() + 1;
        for (let index = 0; index < 15; index++) {
            this.dates[index] = date + index;
        }
        // console.log(Date.parse(this.datas.endDate) / 1000);

        // new Date((curDate / 1000 + 3600) * 1000);
        // console.log(this.datas);
    }
};
</script>
