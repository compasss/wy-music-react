import React from "react";
import { Form, Input, Button } from 'antd';

import './login.css'
import loginIcon from './login-icon.png'
import {LoginService} from "../../api/login";

export default function LoginPage(props: { history: string[]; cb:string }) {
  const onFinish = (values: any) => {
    LoginService.login(values).then(res => {
      localStorage.setItem('wy-auth-info', JSON.stringify(res.data))
      localStorage.setItem('wy-auth-cookie', res.data.cookie)
      props.cb ? props.history.push(props.cb) : props.history.push('/')
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-w">
      <img src={loginIcon} alt="login icon" className="top"/>
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="email"
          rules={[
            {
              required: true,
              message: '轻输入邮箱/手机号',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

