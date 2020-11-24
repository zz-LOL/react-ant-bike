/*
 * @Author: wangxudong
 * @Email: wangxudong@foxgoing.com
 * @Date: 2020-11-10 16:39:30
 * @LastEditors: wangxudong
 * @LastEditTime: 2020-11-23 15:50:03
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
                if (response.status == 'success') {
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
        let baseApi = 'http://192.168.71.74:8080';
        // let baseApi =  'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api';
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