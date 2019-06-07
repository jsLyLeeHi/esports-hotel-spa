import Vue from 'vue';
import Router from 'vue-router';

let toRemove = document.querySelector('.spinner-wrap');
if (toRemove.parentNode != null) {
    toRemove.parentNode.removeChild(toRemove);
}

document.setTitle = title => {
    document.title = title;
    let i = document.createElement('iframe');
    i.style.display = 'none';
    i.onload = () => {
        setTimeout(() => {
            i.remove();
        }, 0);
    };
    document.body.appendChild(i);
};

Vue.use(Router);
export const constantRouterMap = [
    { path: '/', name: '根目录', redirect: '/homePage' },
    {
        path: '/homePage',
        name: '房型选择',
        component: r => require.ensure([], () => r(require('./home/homePage.vue')), 'homePage'),
        meta: { title: '房型选择' }
    },
    {
        path: '/ordersSubmitted',
        name: '订单提交',
        component: r => require.ensure([], () => r(require('./home/ordersSubmitted.vue')), 'ordersSubmitted'),
        meta: { title: '订单提交', keepAlive: true, requireAuth: true }
    },
    {
        path: '/mine',
        name: '我的',
        component: r => require.ensure([], () => r(require('./mine/mine.vue')), 'mine'),
        meta: { title: '我的' }
    },
    {
        path: '/register',
        name: '注册',
        component: r => require.ensure([], () => r(require('./mine/register.vue')), 'register'),
        meta: { title: '注册' }
    },
    {
        path: '/orderRecord',
        name: '订单记录',
        component: r => require.ensure([], () => r(require('./mine/orderRecord.vue')), 'orderRecord'),
        meta: { title: '订单记录', requireAuth: true }
    },
    {
        path: '/orderDetail',
        name: '订单明细',
        component: r => require.ensure([], () => r(require('./mine/orderDetail.vue')), 'orderDetail'),
        meta: { title: '订单明细', requireAuth: true }
    },
    {
        path: '/aboutUs',
        name: '关于我们',
        component: r => require.ensure([], () => r(require('./mine/aboutUs.vue')), 'aboutUs'),
        meta: { title: '关于我们', requireAuth: true }
    },
    {
        path: '/activityCenter',
        name: '活动中心',
        component: r => require.ensure([], () => r(require('./mine/activityCenter.vue')), 'activityCenter'),
        meta: { title: '活动中心', requireAuth: true }
    },
    {
        path: '/balance',
        name: '余额',
        component: r => require.ensure([], () => r(require('./mine/balance.vue')), 'balance'),
        meta: { title: '我的余额', requireAuth: true }
    },
    {
        path: '/topUp',
        name: '充值',
        component: r => require.ensure([], () => r(require('./mine/topUp.vue')), 'topUp'),
        meta: { title: '充值中心', requireAuth: true }
    },
    {
        path: '/invoice',
        name: '发票',
        component: r => require.ensure([], () => r(require('./mine/invoice.vue')), 'invoice'),
        meta: { title: '发票管理', requireAuth: true }
    },
    {
        path: '/invoiceEdmit',
        name: '编辑抬头',
        component: r => require.ensure([], () => r(require('./mine/invoiceEdmit.vue')), 'invoiceEdmit'),
        meta: { title: '编辑抬头', requireAuth: true }
    },
    {
        path: '/invoiceAdd',
        name: '添加抬头',
        component: r => require.ensure([], () => r(require('./mine/invoiceAdd.vue')), 'invoiceAdd'),
        meta: { title: '添加抬头', requireAuth: true }
    },
    {
        path: '/invoiceApplyFor',
        name: '申请发票',
        component: r => require.ensure([], () => r(require('./mine/invoiceApplyFor.vue')), 'invoiceApplyFor'),
        meta: { title: '申请发票', requireAuth: true, keepAlive: true }
    },
    {
        path: '/service',
        name: 'service',
        component: r => require.ensure([], () => r(require('./service/service.vue')), 'service'),
        meta: { title: '服务' }
    },
    {
        path: '/serviceOrder',
        name: 'serviceOrder',
        component: r => require.ensure([], () => r(require('./service/serviceOrder.vue')), 'serviceOrder'),
        meta: { title: '订单详情' }
    },
    {
        path: '/orderPay',
        name: 'orderPay',
        component: r => require.ensure([], () => r(require('./order/orderPay.vue')), 'orderPay'),
        meta: { title: '订单支付' }
    },
    {
        path: '/facilitySelect',
        name: 'facilitySelect',
        component: r => require.ensure([], () => r(require('./home/facilitySelect.vue')), 'facilitySelect'),
        meta: { title: '选择外设', requireAuth: true }
    },
    {
        path: '/payDetail',
        name: 'payDetail',
        component: r => require.ensure([], () => r(require('./order/payDetail.vue')), 'payDetail'),
        meta: { title: '支付详情' }
    },
    {
        path: '/memberRight',
        name: 'memberRight',
        component: r => require.ensure([], () => r(require('./mine/memberRight.vue')), 'memberRight'),
        meta: { title: '积分权益', requireAuth: true }
    }
];
const vueRouter = new Router({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;
            }
            return { x: 0, y: to.meta.savedPosition || 0 };
        }
    },
    routes: constantRouterMap
});
vueRouter.beforeEach((to, from, next) => {
    document.body.classList.remove('modal-helper-open');
    document.setTitle(to.meta.title);
    if (to.meta.requireAuth) {
        if (JSON.parse(sessionStorage.userInfo).mid == '') {
            next({ path: '/register' });
        } else {
            next();
        }
    } else {
        next();
    }
});
export default vueRouter;
