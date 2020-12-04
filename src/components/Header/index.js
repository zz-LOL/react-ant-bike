/*
 * @Author: wangxudong
 * @Email: wangxudong@foxgoing.com
 * @Date: 2020-11-10 16:39:30
 * @LastEditors: wangxudong
 * @LastEditTime: 2020-12-03 14:01:45
 * @Description: 
 */
import React from 'react'
import { Row,Col, Modal, Form, Message, Input  } from "antd"
import './index.less'
import Util from '../../utils/utils'
import axios from '../../axios'
import { connect } from 'react-redux'
const FormItem = Form.Item;
class Header extends React.Component{
    state={}
    componentWillMount(){
        this.setState({
            userName: window.localStorage.userName
        })
        setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)
        this.getWeatherAPIData();
        if (localStorage.getItem('isManager') != 1) {
          window.location.href = '/#/login';
        }
    }

    getWeatherAPIData(){
        let city = '北京';
        axios.jsonp({
            url:'http://api.map.baidu.com/telematics/v3/weather?location='+encodeURIComponent(city)+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        }).then((res)=>{
            if(res.status == 'success'){
                let data = res.results[0].weather_data[0];
                this.setState({
                    dayPictureUrl:data.dayPictureUrl,
                    weather:data.weather
                })
            }
        })
    }
    goLogin() {
      // 清除localStorage
      localStorage.clear();

      // 普通员工跳转页面
      window.location.href = '/#/login';
    }
    changePaws = (e) => {
      this.setState({
        isPwdVisible: true
      })
    }

    changePwdValue = (e) => {
      this.setState({
        pwdInfo : e.target.value
      })
    }

    // 修改密码
    handlePwdSubmit = () => {
      let data = new FormData();
      data.append("npwd", this.state.pwdInfo)
      data.append("uid", window.localStorage.userInfoId)
      if (this.state.pwdInfo) {
        axios.ajax({
          url:'sysUser/repass_admin',
          method: 'post',
          data: data
        }).then((res)=>{
            if(res.code == 200){
                this.setState({
                  isPwdVisible:false
                })
                Message.success("修改密码成功！");
            } else {
              Message.error("修改密码失败！");
            }
        })
      } else {
        Message.error("修改新密码不能为空！");
      }
    }

    render(){
        const { menuName, menuType } = this.props;
        return (
            <div className="header">
                <Row className="header-top">
                    {
                        menuType?
                            <Col span="6" className="logo">
                                <img src="/assets/logo-ant.svg" alt=""/>
                                <span>IMooc 通用管理系统</span>
                            </Col>:''
                    }
                    <Col span={menuType?18:24}>
                        <span>欢迎，{this.state.userName}</span>
                        <a onClick={this.changePaws}>修改密码</a>
                        <a className="dangerColor" onClick={this.goLogin}>退出</a>
                    </Col>
                </Row>
                {
                    menuType?'':
                        <Row className="breadcrumb">
                            <Col span="4" className="breadcrumb-title">
                                {menuName || '年假管理'}
                            </Col>
                            <Col span="20" className="weather">
                                <span className="date">{this.state.sysTime}</span>
                                <span className="weather-img">
                                    <img src={this.state.dayPictureUrl} alt="" />
                                </span>
                                <span className="weather-detail">
                                    {this.state.weather}
                                </span>
                            </Col>
                        </Row>
                }

                  <Modal
                    title="修改密码"
                    visible={this.state.isPwdVisible}
                    onOk={this.handlePwdSubmit}
                    width={800}
                    cancelText="取消"
                    okText="确认"
                    onCancel={()=>{
                        this.setState({
                          isPwdVisible:false,
                          pwdInfo:''
                        })
                    }}
                  >
                    <FormItem label="修改密码" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                      <Input type="text" placeholder="请输入新密码" onChange={(e) => {this.changePwdValue(e)}} />
                    </FormItem>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        menuName: state.menuName
    }
};
export default connect(mapStateToProps)(Header)