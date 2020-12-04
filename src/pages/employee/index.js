/*
 * @Author: wangxudong
 * @Email: wangxudong@foxgoing.com
 * @Date: 2020-11-13 15:03:20
 * @LastEditors: wangxudong
 * @LastEditTime: 2020-12-02 17:40:37
 * @Description: 员工查询页面
 */

import React from 'react'
import {Button,Modal,Form,Input,Message} from 'antd'
import './index.less'
import axios from '../../axios/index'
import Qs from 'qs';

const FormItem = Form.Item;

export default class Employee extends React.Component{

    state = {
      userName: null,
      remainDays: null,
      passDays: null,
      pasVisible: false,
      layout: {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      },
      tailLayout: {
        wrapperCol: {
          offset: 8,
          span: 16,
        },
      }
    }

    componentDidMount () {
      // 组件渲染结束
      console.log('componentDidMount')
      this.setState({
        userName: localStorage.getItem('userName'),
        remainDays: localStorage.getItem('remainDays'),
        passDays: localStorage.getItem('passDays')
    })
    }

    exit=()=>{
      // 清除localStorage
      localStorage.clear();

      // 普通员工跳转页面
      window.location.href = '/#/login';
    }

    modifyPas = ()=>{
      this.setState({
        pasVisible: true
      })
    }

    handleOk = (params) => {
      let data = new FormData();
      data.append("ypwd", params.nowPassword)
      data.append("npwd", params.twoNewPassword)
      /* axios.post('/sysUser/repass', qs.stringify({
        ypwd: params.nowPassword,
        npwd: params.twoNewPassword
      }))
      .then((res) => {
        if (res.code == 200) {
          // 关闭修改密码框
          this.setState({
            pasVisible: false
          })
          Message.success("修改密码成功！");
        } else {
          Message.error(res.msg);
        }
      })
      .catch((res) => {
        Message.error(res.msg);
      })
    } */
      axios.ajax({
        url: '/sysUser/repass',
        method: 'post',
        /* withCredentials: true,
        transformRequest: [function (data) {
          // 对 data 进行任意转换处理
          return Qs.stringify(data)
        }], */
        data: data
      }).then((res) => {
          if (res.code == 200) {
            // 关闭修改密码框
            this.setState({
              pasVisible: false
            })
            window.location.href = '/#/login';
            Message.success("修改密码成功！");
          } else {
            Message.error(res.msg);
          }
      }).catch((res) => {
        Message.error(res.msg);
      })
    };

    handleCancel = ()=>{
      this.setState({
        pasVisible: false
      })
    }

    /* loginSubmit = (e)=> {
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
  }; */

    render(){
        return <div className="content">
          <div className="winlogoemplyee"></div>
          <div className="contentTitle">
            <Button onClick={this.exit} className="exitButton">安全退出</Button>
            <Button onClick={this.modifyPas} className="modifyPas">修改密码</Button>
          </div>
          <div className="todoList">
          <div className="cover-img">
            <h3>annual leave</h3>
          </div>
            <div className="fenge"></div>
            <div className="showDetail">姓名： {this.state.userName}</div>
            <div className="showDetail">本年度剩余年假： {this.state.remainDays}</div>
            <div className="showDetail">本年度已用年假： {this.state.passDays}</div>
          </div>
            <Modal
              title="修改密码"
              visible={this.state.pasVisible}
              onCancel={this.handleCancel}
             /*  onOk={this.handleOk}
              cancelText="取消"
              okText="确认" */
              footer={null}
            >
              <PasForm ref="login" loginSubmit={this.handleOk}/> 
            </Modal>
        </div>
    }
}


class PasForm extends React.Component {
  state = {};

  loginSubmit = (e)=> {
      e && e.preventDefault();
      const _this = this;
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              var formValue = _this.props.form.getFieldsValue();
              _this.props.loginSubmit({
                nowPassword: formValue.nowPassword,
                newPassword: formValue.newPassword,
                twoNewPassword: formValue.twoNewPassword
              });
          }
      });
  };

  checkuserName = (rule, value, callback) => {
    if (!value) {
        callback('请输入现用密码!');
    } else {
        callback();
    }
  };

  checkPassword = (rule, value, callback) => {
      if (!value) {
          callback('请输入新密码!');
      } else {
          callback();
      }
  };

  checkTwoPassword = (rule, value, callback) => {
    if (!value) {
        callback('请输入新密码!');
    } else {
      if ( this.props.form.getFieldValue('newPassword') === value) {
        callback();
      } else {
        callback('两次输入新密码不一致!');
      }
      
    }
};

  render() {
      const { getFieldDecorator } = this.props.form;
      return (
          <Form className="login-form">
              <FormItem
              label="现用密码："
              >
                  {getFieldDecorator('nowPassword', {
                      rules: [{validator: this.checkuserName}]
                  })(
                      <Input type="password" placeholder="请输入现用密码"/>
                  )}
              </FormItem>
              <FormItem
              label="新密码："
              name="newPassword"
              >
                  {getFieldDecorator('newPassword', {
                      rules: [{validator: this.checkPassword}]
                  })(
                      <Input type="password" placeholder="请输入新密码" />
                  )}
              </FormItem>
              <FormItem
              label="确认新密码："
              >
                  {getFieldDecorator('twoNewPassword', {
                      rules: [{validator: this.checkTwoPassword}]
                  })(
                      <Input type="password" placeholder="确认新密码" />
                  )}
              </FormItem>
              <FormItem>
                  <Button type="primary" onClick={this.loginSubmit} className="login-form-button floatRight">
                      确认
                  </Button>
              </FormItem>
          </Form>
      )
  }
}
PasForm = Form.create({})(PasForm);