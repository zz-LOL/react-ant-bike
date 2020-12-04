/*
 * @Author: wangxudong
 * @Email: wangxudong@foxgoing.com
 * @Date: 2020-11-10 16:39:30
 * @LastEditors: wangxudong
 * @LastEditTime: 2020-11-27 15:28:03
 * @Description: 
 */
import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
export default class Axios {
    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.code == 200) {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static ajax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        // let baseApi = 'http://192.168.71.74:8080';
        // let baseApi = 'http://39.106.209.171:9999';
        let baseApi = 'http://192.168.10.124:19999';

        var token = localStorage.getItem('token')
        if (token) {
          axios.defaults.headers.common['token'] = token;
        }
        
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method: options.method ? options.method : 'get',
                baseURL:baseApi,
                timeout:5000,
                data: options.data || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == 200){
                    resolve(response.data);
                }else{
                    reject(response.data);
                }
            })
        });
    }
}