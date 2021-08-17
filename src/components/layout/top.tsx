import React, { Component } from "react";
import TopIcon from "./top-icon.png";
import {Button} from "antd";
import './layout.css'

export default class LayoutTop extends Component<any, any>{
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
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="layout-top">
        <img src={TopIcon} alt="top icon" className="top-icon"/>
        <span className="txt">网易云音乐试听下载</span>
        {
          this.state.userName ? <span className="txt">{this.state.userName}</span> : <Button type={'primary'} onClick={() => this.toLogin}>登录</Button>
        }
      </div>
    )
  }
}