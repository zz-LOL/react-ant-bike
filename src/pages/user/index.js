import React from 'react'
import { Card, Button, Table, Form, Input, Checkbox,Select,Radio, Icon, Message, Modal, DatePicker, Row, Col, InputNumber } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import ETable from '../../components/ETable/index'
import BaseForm from '../../components/BaseForm'
import Qs from 'qs';
import 'moment/locale/zh-cn';
import Moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
export default class User extends React.Component{

    state = {
        list:[],
        pwdInfo: ''
    }

    params = {
      PageIndex:1,
      pageSize: 10,
      userName: '',
      phone: ''
    }

    formList = [
      {
          type:'INPUT',
          label:'姓名',
          field:'userName',
          initialValue:'',
          width:80,
          placeholder: '请输入姓名'
      },
      {
        type:'INPUT',
        label:'手机号',
        field:'phone',
        initialValue:'',
        width:80,
        placeholder: '请输入手机号'
    }
    ]

    requestList = ()=>{
        axios.ajax({
            url:'/sysUser/list',
            method: 'post',
            transformRequest: [function (data) {
              // 对 data 进行任意转换处理
              return Qs.stringify(data)
            }],
            data: {
                PageIndex: this.params.PageIndex,
                pageSize: this.params.pageSize,
                userName: this.params.userName,
                phone: this.params.phone
            }
        }).then((res)=>{
            let _this = this;
            this.setState({
                list:res.records.map((item,index)=>{
                    item.key=index
                    return item;
                }),
                pagination:Utils.pagination(res,(current)=>{
                    _this.params.PageIndex = current.page;
                    _this.requestList();
                })
            })
        })
    }

    componentDidMount(){
      if (localStorage.getItem('isManager') != 1) {
        Message.error('此账号没有管理员权限！');
        window.location.href = '/#/login';
      }
        this.requestList();
    }

    // 操作员工
    handleOperator = (type)=>{
        let item = this.state.selectedItem;
        if(type =='create'){
            this.setState({
                title:'创建员工',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择一个用户'
                })
                return;
            }
            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                userInfo:item,
                type
            })
        }else if(type=="delete"){
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择一个用户'
                })
                return;
            }
            this.state.deletevisible = true
            Modal.confirm({
              content:'确定要删除此用户吗？',
              cancelText: '取消',
              okType: 'danger',
              visible:this.state.deletevisible,
              onCancel: () => {
                this.setState({
                  deletevisible:false
                })
              },
              onOk:()=>{
                let data = new FormData();
                data.append("id", item.id)
                  axios.ajax({
                      url:'/sysUser/delete',
                      method: 'post',
                      data: data
                  }).then((res)=>{
                      if(res.code == 200){
                          this.setState({
                            deletevisible:false
                          })

                          this.requestList();
                      } else {
                        Message.error(res.msg);
                      }
                  })
              }
            })
        }
    }

    handleSubmit = ()=>{
        let type = this.state.type;
        if (type == 'detail') {
          this.setState({
            isVisible:false
          })

          return false
        }

        let data = this.userForm.props.form.getFieldsValue();
        let dateString = Moment(data.regTime).format('YYYY-MM-DD')
        data.regTime = dateString
        if (type != 'create') {
          if (data.passDate) {
            let passDateStr = Moment(data.passDate).format('YYYY-MM-DD')
            data.passDate = passDateStr
          }
          data.id = this.state.userInfo.id
        }
        
        this.userForm.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            axios.ajax({
              url:type == 'create'?'/sysUser/add':'/sysUser/update',
              method: 'post',
              transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                return Qs.stringify(data)
              }],
              data:{
                  ...data
              }
            }).then((res)=>{
                if(res.code == 200){
                    this.setState({
                        isVisible:false
                    })
                    if (type == 'create') {
                      Message.success("创建员工成功！");
                    } else {
                      Message.success("编辑员工成功！");
                    }
                    this.requestList();
                } else {
                  if (type == 'create') {
                    Message.error("创建员工失败！");
                  } else {
                    Message.error("编辑员工失败！");
                  }
                }
            })
          }
        });
    }

    // 修改密码
    handlePwdSubmit = () => {
      let data = new FormData();
      data.append("npwd", this.state.pwdInfo)
      data.append("uid", this.state.userInfo.id)
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
                this.requestList();
            } else {
              Message.error("修改密码失败！");
            }
        })
      } else {
        Message.error("修改新密码不能为空！");
      }
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
      this.params = filterParams;
      this.requestList();
    };

    showPwd = () => {
      this.userForm.props.form.resetFields();
      this.setState({
        isVisible:false
      })
      this.setState({
        isPwdVisible:true
      })
    }

    changePwdValue = (e) => {
      this.setState({
        pwdInfo : e.target.value
      })
    }

    render(){
        const columns = [{
            title: 'id',
            dataIndex: 'id'
          }, {
            title: '姓名',
            dataIndex: 'userName'
          }, {
            title: '手机号',
            dataIndex: 'phone'
          }, {
            title: '入职时间',
            dataIndex: 'regTime'
          },{
            title: '本年度剩余年假',
            dataIndex: 'remainDays'
          },{
            title: '本年度已用年假',
            dataIndex: 'passDays'
          },{
            title: '年假基数',
            dataIndex: 'baseDays'
          },{
            title: '年假到期时间',
            dataIndex: 'passDate'
          }
        ];
        return (
            <div>
                <Card>
                  <BaseForm formList={this.formList} filterSubmit={this.handleFilterSubmit}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <Button type="primary" icon="plus" onClick={()=>this.handleOperator('create')}>创建员工</Button>
                    <Button icon="edit" onClick={()=>this.handleOperator('edit')}>编辑员工</Button>
                    <Button onClick={()=>this.handleOperator('detail')}>员工详情</Button>
                    <Button type="danger" icon="delete" onClick={()=>this.handleOperator('delete')}>删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    width={800}
                    cancelText="取消"
                    okText="确认"
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <UserForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst } showPwd={() => { this.showPwd()}}/>
                </Modal>

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
class UserForm extends React.Component{
    constructor (props) {
      super(props)
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        const userInfo = this.props.userInfo || {};
        const type = this.props.type;
        const dateFormat = 'YYYY-MM-DD';

        let disabledDate = (current) => {
          // Can not select days before today and today
          // return current && current < Moment().endOf('day'); // 当天之前的不可选，包括当天
          return current > Moment().subtract(0, 'day') // 当天之前的不可选，不包括当天
          }

        return (
            <Form layout="horizontal">
                <FormItem label="姓名" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.userName:
                        getFieldDecorator('userName',{
                            initialValue:userInfo.userName,
                            rules:[
                              {
                                  required:true,
                                  message:'姓名不能为空'
                              },]
                        })(
                            <Input type="text" placeholder="请输入姓名" disabled={type=='edit'} />
                        )
                    }
                </FormItem>
                <FormItem label="手机号" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.phone:
                        getFieldDecorator('phone',{
                            initialValue:userInfo.phone,
                            rules:[
                              {
                                  required:true,
                                  message:'手机号不能为空'
                              },
                              {
                                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号'
                              }
                            ]
                        })(
                          <Input type="text" placeholder="请输入手机号" disabled={type=='edit'} />
                    )}
                </FormItem>
                <FormItem label="入职时间" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.regTime:
                        getFieldDecorator('regTime',{
                            initialValue: type=='create' ? null : Moment(userInfo.regTime, dateFormat),
                            rules:[
                              {
                                  required:true,
                                  message:'入职时间不能为空'
                              },]
                        })(
                          <DatePicker locale={locale} format={dateFormat} disabledDate={disabledDate} disabled={type=='edit'} />
                    )}
                </FormItem>
                { type!='create' &&
                  <div>
                    <FormItem label="已使用年假" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.passDays:
                        getFieldDecorator('passDays',{
                            initialValue:userInfo.passDays
                        })(
                            <InputNumber min={0} placeholder="请输入" />
                        )
                    }
                  </FormItem>
                  <FormItem label="年假基数" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.baseDays:
                        getFieldDecorator('baseDays',{
                            initialValue:userInfo.baseDays
                        })(
                            <InputNumber min={0} placeholder="请输入" />
                        )
                    }
                  </FormItem>
                  <FormItem label="年假到期时间" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.passDate:
                        getFieldDecorator('passDate',{
                            initialValue: type=='create' ? null : Moment(userInfo.passDate, dateFormat)
                        })(
                          <DatePicker locale={locale} format={dateFormat} />
                    )}
                </FormItem>
                { type =='edit' &&
                  <Row>
                    <Col span={5}></Col>
                    <Button onClick={(e) => {this.props.showPwd(e)}}>修改密码</Button>
                  </Row>
                }
                </div>
                }
                
            </Form>
        );
    }
}

UserForm = Form.create({})(UserForm);