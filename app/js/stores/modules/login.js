import Http from '../../utils/request';
const login = {
    state: {
        userInfo: ''
    },
    mutations: {
        changeUserInfos: (state, data) => {
            state.userInfo = data;
            sessionStorage.setItem('userInfo', data);
        }
    },
    actions: {
        async getUser({ commit }) {
            let url = '/index/user/getUser',
                param = {},
                res = await Http.fetch(url, param, 'post');
            res = res.data;
            console.log(res);

            if (res.code == '0') {
                commit('changeUserInfos', JSON.stringify(res.data));
            }
        }
    }
};

export default login;
