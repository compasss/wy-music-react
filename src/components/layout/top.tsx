import React, { Component } from "react";
import {withRouter} from 'react-router-dom'
import TopIcon from "./top-icon.png";
import {Button, message} from "antd";
import './layout.css'

class LayoutTop extends Component<any, any>{
  constructor(props: any) {
    super(props)
    this.state = {
      userInfo: {},
      userName: ''
    }
  }

  componentDidMount() {
    let authInfo = JSON.parse(localStorage.getItem('wy-auth-info') || '{}')
    if (authInfo.token) {
      this.setState({
        userInfo: authInfo,
        userName: authInfo.profile?.nickname
      })
    }
  }

  toLogin(): void {
    if (this.state.userName) {
      localStorage.removeItem('wy-auth-cookie')
      localStorage.removeItem('wy-auth-info')
      message.info('退出成功')
      this.setState({
        userInfo: {},
        userName: ''
      })
    } else {
      this.props.history.push('/login')
    }
  }

  render() {
    return (
      <div className="layout-top">
        <img src={TopIcon} alt="top icon" className="top-icon"/>
        <span className="txt">网易云音乐试听下载</span>
        <div>
          <span className="txt m-r-10">{this.state.userName || ''}</span>
          <Button type={'primary'} onClick={() => this.toLogin()}>{this.state.userName ? '退出' : '登录'}</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(LayoutTop)
