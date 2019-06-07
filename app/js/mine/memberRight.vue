<template>
  <div class="member-right">
    <div class="grade">
      <div class="title">
        <div>我的级别是</div>
        <div class="line"></div>
      </div>
      <div class="img">
        <div class="content">
          <div class="my-grade">
            <div class="img-title">
              <div class="grade-name">{{myGrade.name}}会员</div>
              <img :src="gradeInfo[Number(myGrade.grade)-1].img" alt="">
            </div>
            <div class="member-number">会员号：{{myGrade.mid}}</div>
          </div>
          <div class="integral">
            <div class="year">
              <div class="number">{{myGrade.yearIntegral}}</div>
              <div class="label">今年累计积分</div>
            </div>
            <div class="history">
              <div class="number">{{myGrade.historyIntegral}}</div>
              <div class="label">历史累计积分</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="next-grade" v-if="nextGrade">
      <div class="title">
        <div>升级到{{nextNeed.name}}还需要</div>
        <div class="line"></div>
      </div>
      <div class="chart-area">
        <div class="chart-item">
          <div class="canvas-area">
            <canvas class="integral-canvas"></canvas>
          </div>
          <div class="chart-div">
            <div class="chart flex-center">{{nextNeed.integral}}分</div>
            <div class="label">累计积分</div>
          </div>
        </div>
        <div class="or">或</div>

        <div class="chart-item">
          <div class="canvas-area">
            <canvas class="accommodation-canvas"></canvas>
          </div>
          <div class="chart-div">
            <div class="chart flex-center">{{nextNeed.second}}次</div>
            <div class="label">入住次数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="grade-rights">
      <div class="title">
        <div>会员权益</div>
        <div class="line"></div>
      </div>
      <div class="right-content">
        <div class="right-item" :key="item.id" v-for="(item,index) in allMemberRight" @click="rightModal(index)">
          <div v-if="item.grade<=myGrade.grade" class="icon flex-center">
            <img :src="item.icon" alt="">
          </div>
          <div v-else class="icon icon-lock flex-center">
            <img src="../../images/notavailable@2x.png" alt="">
          </div>
          <div class="label">{{item.name}}</div>
        </div>
      </div>
    </div>

    <right-modal ref="rightModal" name="rightModal" v-on:closed="closeRightModal" classes="right-modal">
      <div class="right-modal">
        <div class="head">
          <ul @touchstart="rightTouchStart" @touchmove="rightTouchMove" @touchend="rightTouchEnd">
            <li :class="{active:activeModalRight===index}" :key="item.id" v-for="(item,index) in allMemberRight">
              <div class="modal-icon flex-center"><img :src="item.icon" alt=""></div>
              <div class="modal-label">{{item.name}}</div>
            </li>
          </ul>
        </div>
        <div class="content">
          <div class="triangle"></div>
          <div class="right-info">
            <div class="title">权益说明</div>
            <div class="info">{{allMemberRight[activeModalRight].explain}}</div>
          </div>
          <div class="right-range">
            <div class="title">权益对象</div>
            <div class="range-content">
              <ul>
                <li :key="item.id" v-for="item in gradeInfo.filter(aaa=>aaa.id>=allMemberRight[activeModalRight].grade)">
                  <img :src="item.img" alt="">
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="close-img" @click="closeRightModal">
          <img src="../../images/close222@2x.png" alt="">
        </div>
      </div>
    </right-modal>

  </div>
</template>
<script>
import Modal from '_components_/modal';

import Http from '_utils_/request';
export default {
    components: { rightModal: Modal },
    data() {
        return {
            allMemberRight: [{ grade: 1 }],
            nextGrade: true,
            nextNeed: {
                name: '',
                integral: 0,
                second: 0
            },
            activeModalRight: 0,
            gradeInfo: [
                { id: 1, name: '普通会员', img: require('_images_/pt@2x.png') },
                { id: 2, name: '白银会员', img: require('_images_/by@2x.png') },
                { id: 3, name: '黄金会员', img: require('_images_/hj@2x.png') },
                { id: 4, name: '白金会员', img: require('_images_/bj@2x.png') }
            ]
        };
    },
    computed: {
        myGrade() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            return {
                name: userInfo.treasure.grade_name,
                grade: userInfo.treasure.grade,
                mid: userInfo.mid,
                yearIntegral: userInfo.treasure.year_add_integral,
                historyIntegral: userInfo.treasure.history_integral
            };
        }
    },
    created() {
        this.getNextGradeNeed();
        this.getAllMemberRight();
    },
    methods: {
        activeRight(idx) {
            this.activeModalRight = idx;
            this.$nextTick(function() {
                let delt =
                    document.querySelector('.head').clientWidth / 2 -
                    document.querySelectorAll('.head ul li')[idx].clientWidth / 2;
                document.querySelector('.head ul').style.left = `${delt -
                    document.querySelectorAll('.head ul li')[idx].offsetLeft}px`;
            });
        },
        rightTouchStart(event) {
            this.x = event.changedTouches[0].pageX;
        },
        rightTouchMove(event) {
            event.preventDefault();

            let ul = document.querySelector('.head ul');
            let li = document.querySelectorAll('.head ul li');
            let liWidth = document.querySelectorAll('.head ul li')[0].clientWidth;
            let direction = this.x - event.changedTouches[0].pageX;
            this.x = event.changedTouches[0].pageX;

            ul.style.left = `${parseInt(ul.style.left) - direction}px`;
            let idx = Math.floor(-(parseInt(ul.style.left) + liWidth / 2) / liWidth) + 1;
            if (idx < 0) {
                idx = 0;
            } else if (idx >= li.length) {
                idx = li.length - 1;
            }
            this.activeModalRight = idx;
        },
        rightTouchEnd(event) {
            this.activeRight(this.activeModalRight);
            event.preventDefault();
        },
        async getNextGradeNeed() {
            let url = '/index/user/getNextGradeNeed',
                param = {},
                res = await Http.fetch(url, param, 'get');
            res = res.data;
            // console.log(res);
            if (res.code === 0) {
                this.nextGrade = true;
                this.nextNeed.name = res.data.next.grade_name;
                this.nextNeed.integral = res.data.need.integral;
                this.nextNeed.second = res.data.need.second;
                this.canvas('.integral-canvas', res.data.next.integral, res.data.now.integral);
                this.canvas('.accommodation-canvas', res.data.next.second, res.data.now.second);
            } else if (res.code === 10012) {
                this.nextGrade = false;
            } else {
                this.$toast({
                    mask: true,
                    message: '请求失败',
                    duration: 3000
                });
            }
        },
        async getAllMemberRight() {
            let url = '/index/user/getAllMemberRight',
                param = {},
                res = await Http.fetch(url, param, 'get');
            res = res.data;
            // console.log(res);

            if (res.code === 0) {
                // console.log(res.data);
                this.allMemberRight = res.data;
            } else {
                this.$toast({
                    mask: true,
                    message: '请求失败',
                    duration: 3000
                });
            }
        },
        canvas(elClass, total, now) {
            let whContent = document.querySelector('.canvas-area');
            let canvas = document.querySelector(elClass);
            let ctx = canvas.getContext('2d');
            canvas.width = whContent.clientWidth * 2;
            canvas.height = whContent.clientHeight * 2;

            let oX = canvas.width / 2;
            let startAngle = -((1 / 2) * Math.PI);
            let endAngle = startAngle + (now / total) * 2 * Math.PI;

            ctx.lineWidth = 12;
            ctx.strokeStyle = '#5594fd';
            ctx.arc(oX, oX, oX - ctx.lineWidth / 2, startAngle, endAngle, false);
            ctx.stroke();
        },
        rightModal(idx) {
            this.$refs.rightModal.show();
            this.activeRight(idx);
        },
        closeRightModal() {
            this.$refs.rightModal.hide();
        }
    }
};
</script>
