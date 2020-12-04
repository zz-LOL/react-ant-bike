import React from 'react'
import {Form, Input, Button} from 'antd'
import axios from '../../axios/index'
import Footer from '../../components/Footer'
import Utils from '../../utils/utils'
import './index.less'
import { Message } from 'antd'

const FormItem = Form.Item;

export default class Login extends React.Component {
    state = {};

    componentDidMount() {//每次进入登录页清除之前的登录信息
        
    }

    loginReq = (params) => {
      let data = new FormData();
      data.append("username", params.userName)
      data.append("password", params.password)

      axios.ajax({
        url: '/login',
        method: 'post',
        data: data
      }).then((res) => {
          if (res.code == 200) {
            window.localStorage.token = res.token;
            // 存数据到localStorage
            window.localStorage.userName = res.data.userName;
            window.localStorage.remainDays = res.data.remainDays;
            window.localStorage.passDays = res.data.passDays;
            window.localStorage.isManager = res.data.isManager;
            window.localStorage.userInfoId = res.data.id;

              if (res.data.isManager == 1) {
                // 管理员跳转页面
                window.location.href = '/#/sys/user';
              } else {
                // 普通员工跳转页面
                window.location.href = '/#/employee';
              }
          } else {
            Message.error(res.msg);
          }
      }).catch((res) => {
        Message.error(res.msg);
      })
        // window.location.href = '/#/';
    };

    render() {
        return (
            <div className="login-page">
                {/* <div className="login-header">
                    <div className="logo">
                        <img src="/assets/logo-ant.svg" alt="慕课后台管理系统"/>
                        React全家桶+AntD 共享经济热门项目后台管理系统
                    </div>
                </div> */}
                <div className="login-content-wrap">
                    <div className="login-content">
                        <div className="login-box">
                          <div className="winlogo"></div>
                          <div className="title">员工年假自助查询</div>
                          <LoginForm ref="login" loginSubmit={this.loginReq}/>
                        </div>
                    </div>
                </div>
                {/* <Footer/> */}
                <div className="copyrightRe">
                  <div className="copyright">Copyright © 2020-2040 Someone. All rights reserved.</div>
                </div>
            </div>
        )
    }
}

class LoginForm extends React.Component {
    state = {};

    loginSubmit = (e)=> {
        e && e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var formValue = _this.props.form.getFieldsValue();
                _this.props.loginSubmit({
                    userName: formValue.userName,
                    password: formValue.password
                });
            }
        });
    };

    checkuserName = (rule, value, callback) => {
        if (!value) {
            callback('请输入用户名!');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form">
                <FormItem
                label="用户名："
                >
                    {getFieldDecorator('userName', {
                        initialValue:'',
                        rules: [{validator: this.checkuserName}]
                    })(
                        <Input placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem
                label="密码："
                >
                    {getFieldDecorator('password', {
                        initialValue:'',
                        rules: [{validator: this.checkPassword}]
                    })(
                        <Input type="password" placeholder="密码" wrappedcomponentref={(inst) => this.pwd = inst } />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.loginSubmit} className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
LoginForm = Form.create({})(LoginForm);
