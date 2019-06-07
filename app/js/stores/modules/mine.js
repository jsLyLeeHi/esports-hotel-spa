const mine = {
    state: {
        invoice: '',
        invoiceMsg: ''
    },
    mutations: {
        setInvoice: (state, data) => {
            data = JSON.stringify(data);
            state.invoice = data;
            sessionStorage.setItem('userInfoInvoice', data);
        },
        //发票领取信息
        invoiceMsg: (state, data) => {
            data = JSON.stringify(data);
            state.invoiceMsg = data;
            sessionStorage.setItem('userInfoInvoiceMsg', data);
        }
    },
    actions: {
        // async getAppShare({ commit }) {
        //     let url = '/shop/api/homeProductTopicList',
        //         param = {},
        //         res = await Http.fetch(url, Http.getSign(param), 'post');
        //     res = res.data;
        //     if (res.code == '0000') {
        //         commit('setAppShare', res);
        //         return res;
        //     }
        // }
    }
};

export default mine;
