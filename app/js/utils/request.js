import axios from 'axios';

// const isProd = process.env.NODE_ENV === 'production';
axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.resolve(error.response);
    }
);

export default class http {
    static fetch(url, jsonData, method, params) {
        let baseUrl;
        // let host = HOST.IP;
        baseUrl = "/";
        console.log(params);
        console.log(jsonData);
        let param = {
            baseURL: baseUrl,
            timeout: 10000,
            method: method,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };

        console.log(param);

        if (method == 'get') {
            url = url + '?data=' + encodeURIComponent(JSON.stringify(jsonData));
        } else {
            param = { data: 'data=' + encodeURIComponent(JSON.stringify(jsonData)), ...param };
        }
        return axios(url, param)
            .then(response => {
                return response;
            })
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }
}
