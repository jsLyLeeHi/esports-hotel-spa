<template>
  <div>
    <div class="home-banner-list">
      <van-swipe :autoplay="5000">
        <van-swipe-item v-for="(item, index) in bannerList" :key="index">
          <img :src="item">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="home-address">
      <dl>
        <dt>魔王电竞酒店</dt>
        <dd>陕西省西安市雁塔区长安路2号</dd>
        <dd>
          电话：
          <a href="tel:029123456789">029-123456789</a>
        </dd>
      </dl>
      <div class="home-address-map" @click="jumpMap()">
        <img src="../../images/location@2x.png">
        <span>地图</span>
      </div>
    </div>
    <div class="home-select-date">
      <div class="home-select-data-list">
        <div class="home-select-data-item">
          <div class="home-select-data-title">
            <span>入住时间</span>
            <span/>
          </div>
          <div class="home-select-data-change" @click="changeTime(1)">
            <span>{{changeBeginDate | dateformat('M')}}月{{changeBeginDate | dateformat('D')}}日</span>
            <span>{{changeBeginDate | dateformat('dddd')}}</span>
          </div>
        </div>
        <div class="home-select-data-item">
          <div class="home-select-data-title">
            <span>离店日期</span>
            <span/>
          </div>
          <div class="home-select-data-change" @click="changeTime(2)">
            <span>{{changeEndDate | dateformat('M')}}月{{changeEndDate | dateformat('D')}}日</span>
            <span>{{changeEndDate | dateformat('dddd')}}</span>
          </div>
        </div>
      </div>
      <div class="home-select-data-total">
        <span>共{{isDate}}晚</span>
      </div>
    </div>
    <div class="home-select-room">
      <div class="home-select-room-tips">
        <span>预定</span>
        <span>预定成功后100%有房</span>
      </div>
      <div class="home-select-room-list">
        <div
          class="home-select-room-item"
          v-for="(item,index) in roomList"
          :key="index"
          @click="check(item)"
        >
          <div class="home-select-room-item-content">
            <div class="home-select-room-item-image">
              <img :src="item.image">
            </div>
            <div class="home-select-room-item-box">
              <div class="home-select-room-item-left">
                <p class="home-select-room-item-title">{{item.name}}</p>
                <div class="home-select-room-item-sale">
                  <div v-show="userInfo.grade_right.rebate != '1.00'">
                    <span>会员可享折后</span>
                    <span>{{(userInfo.grade_right.rebate * item.price).toFixed(2)}}</span>
                    <span>元</span>
                  </div>
                </div>
                <div class="home-select-room-item-price">
                  <span>￥</span>
                  <span>{{((String(item.price)).split('.')[0])}}</span>
                  <span>{{'.'+(String(item.price)).split('.')[1]}}</span>
                </div>
              </div>
              <div class="home-select-room-item-right">
                <div class="home-select-room-item-btn" @click.stop="jumpOrderPay(item)">
                  <span>预定</span>
                </div>
                <div class="home-select-room-item-number">
                  剩余
                  <span>{{item.over_num}}</span>间
                </div>
              </div>
            </div>
          </div>
          <div class="home-select-room-item-tips">
            <span v-if="item.window == 1">有窗</span>
            <span v-if="item.breakfast == 1">含早</span>
            <span>
              <span v-if="item.cancel == 0">不</span>可取消
            </span>
            <span>{{item.food}}</span>
            <span>{{item.wifi}}</span>
          </div>
        </div>
      </div>
    </div>
    <TabBar active="0"/>
    <Modal name="beginModal" ref="beginModal" classes="home-date-modal">
      <van-datetime-picker
        v-model="beginDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="changeDate(1)"
        @cancel="close(1)"
      />
    </Modal>
    <Modal name="endModal" ref="endModal" classes="home-date-modal">
      <van-datetime-picker
        v-model="endDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="changeDate(2)"
        @cancel="close(2)"
      />
    </Modal>
    <BottomModal
      name="checkModal"
      ref="checkModal"
      @closed="closeSelect()"
      classes="home-check-modal"
    >
      <CheckRoom @closeSelect="closeSelect()"/>
    </BottomModal>
  </div>
</template>
<script>
import TabBar from '_components_/tabBar.vue';
import Modal from '_components_/modal';
import CheckRoom from '_components_/CheckRoom';
import BottomModal from '_components_/bottomModal';
export default {
    data() {
        return {
            isDate: 1,
            beginDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            changeBeginDate: new Date(),
            changeEndDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            minDate: new Date(),
            maxDate: new Date(2021, 1, 1),
            roomList: [],
            lazyImg: '',
            bannerList: [],
            userInfo: {}
        };
    },
    components: { TabBar, Modal, CheckRoom, BottomModal },
    mounted() {
        this.loading();
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.name === '房型选择') {
                vm.$store.commit('setKeepAlive', []);
                //恢复选择发票页的默认备注
                vm.$store.commit('setNote', false);
            }
        });
    },
    methods: {
        check(item) {
            this.$refs.checkModal.show();
            this.$store.commit('setHomeData', {
                beginDate: this.changeBeginDate,
                endDate: this.changeEndDate,
                isDate: this.isDate,
                gradeRight: this.userInfo.grade_right.rebate,
                rebatePrice: this.userInfo.grade_right.rebate * item.price,
                ...item
            });
        },
        async loading() {
            await this.$store.dispatch('getUser');
            this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            this.getRoomList();
        },
        jumpOrderPay(item) {
            this.$router.push({
                path: 'ordersSubmitted',
                query: {
                    listData: JSON.stringify({
                        beginDate: this.changeBeginDate,
                        endDate: this.changeEndDate,
                        isDate: this.isDate,
                        ...item
                    })
                }
            });
        },
        changeTime(index) {
            switch (index) {
                case 1:
                    this.$refs.beginModal.show();
                    break;
                case 2:
                    this.$refs.endModal.show();
                    break;
            }
        },
        close(index) {
            switch (index) {
                case 1:
                    this.$refs.beginModal.hide();
                    break;
                case 2:
                    this.$refs.endModal.hide();
                    break;
            }
        },
        closeSelect() {
            this.$refs.checkModal.hide();
        },
        changeDate(index) {
            this.changeBeginDate = this.beginDate;
            this.changeEndDate = this.endDate;
            console.log(this.changeBeginDate);
            console.log(this.changeEndDate);
            switch (index) {
                case 1:
                    this.changeEndDate = new Date(this.changeBeginDate.getTime() + 1000 * 60 * 60 * 24);
                    this.endDate = this.changeBeginDate;
                    this.$refs.beginModal.hide();
                    break;
                case 2:
                    if (this.changeBeginDate.getTime() >= this.changeEndDate.getTime()) {
                        this.changeEndDate = new Date(this.changeBeginDate.getTime() + 1000 * 60 * 60 * 24);
                        return this.$toast({
                            position: 'bottom',
                            message: '入住时间不能大于离店时间'
                        });
                    }
                    this.$refs.endModal.hide();
                    break;
            }
            let startTime = this.changeBeginDate.getTime(),
                endTime = this.changeEndDate.getTime(),
                dates = Math.abs(endTime - startTime) / (1000 * 60 * 60 * 24);
            this.isDate = Math.ceil(dates);
            this.getRoomList();
        },
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`;
            }
            return value;
        },
        async getRoomList() {
            let url = '/index/room/getRoomsByTime',
                param = {
                  check_time: this.changeBeginDate.getTime() / 1000,
                  leave_time: this.changeEndDate.getTime() / 1000
                },
                res = await this.$request.fetch(url, param, 'get', '2');
            res = res.data;
            if (res.code == 0) {
                this.roomList = res.data.room;
                console.log(res.data);
                this.bannerList = res.data.banner;
            }
            // console.log(this.roomList);
        },
        async jumpMap() {
            location.href =
                'http://3gimg.qq.com/lightmap/v1/marker/?marker=coord:34.223282,108.948348;title:魔王电竞酒店;addr:电竞酒店&referer=myapp&key=JGPBZ-IOCRF-BGBJB-NPFKA-UQJZH-6YFVWy';
        }
    }
};
</script>
