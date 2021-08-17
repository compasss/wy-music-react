import React, { useState, Fragment } from "react";
import { Input, Table, message, Button } from 'antd';
import {SearchService} from "../../api/search";
import './search.css';
import { SearchParams, arInterface } from "../../api/types";
import ReactAplayer from 'react-aplayer';
import LayoutTop from "../../components/layout/top";

const { Search } = Input;
let aplayInstance: any = null;

export function SearchPage(props: any) {

  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0})
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState('')

  const aplayOpts = {
    fixed: true,
    mini: true,
    volume: 1,
    autoplay: false,
    audio: [
      {
        name: 'Hotel California',
        artist: 'Eagles',
        url: 'http://m7.music.126.net/20210817114236/8f2a70bf247dbae5b2fbea123d9e4fe9/ymusic/6aaa/8a6d/3f43/efef121449ef512bc6b7954b6bb95ef4.flac',
        cover: 'http://p4.music.126.net/m_HGFCoSwhJYcJjgVaiq7A==/109951165261316702.jpg?param=200y200'
      }
    ]
  };

  function onSearch(value: any) {
    let str = value.trim();
    if (str.length < 1) {
      message.error('请输入歌曲名')
      return;
    }
    setKeywords(str)
    searchData({
      keywords: str,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize
    }, {current: 1, pageSize: 10, total: 0})
  }

  function tableChange(params: any) {
    console.log('table change', params)
    setPagination({
      current: params.current,
      pageSize: params.pageSize,
      total: params.total
    })
    searchData({
      keywords: keywords,
      limit: params.pageSize,
      offset: (params.current - 1) * params.pageSize
    }, params)
  }

  function searchData(params: SearchParams, opts: any) {
    setLoading(true)
    let current: number = opts.current || 0;
    let pageSize: number = opts.pageSize || 10;
    SearchService.search(params).then(res => {
      setDataSource(res.data.result.songs);
      setPagination({current: current, pageSize: pageSize, total: res.data.result.songCount})
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  function playSong(id: number | string, data: any): void{
    console.log('play', id, data)
    SearchService.getSongInfoById({id: id}).then(res => {
      console.log('song info', res, aplayInstance)
      aplayInstance.list.add([{
        name: data.name,
        artist: getAr(data.ar),
        url: res.data.data[0].url,
        cover: data.al.picUrl + '?param=200y200'
      }]);
    })
  }

  function downloadSong(id: number | string, data: any): void{
    let name = data.name + '-' + getAr(data.ar)
    SearchService.getSongInfoById({id: id}).then(res => {
      downloadFile(res.data[0].url, name)
    })
  }

  /**
   * 下载文件
   * @param {String} path - 下载地址/下载请求地址。
   * @param {String} name - 下载文件的名字/重命名（考虑到兼容性问题，最好加上后缀名）
   */
  function downloadFile (path:string, name: string) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', path);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function () {
      if (this.status === 200 || this.status === 304) {
        // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
        if ('msSaveOrOpenBlob' in navigator) {
          navigator.msSaveOrOpenBlob(this.response, name);
          return;
        }
        // const blob = new Blob([this.response], { type: xhr.getResponseHeader('Content-Type') });
        // const url = URL.createObjectURL(blob);
        const url = URL.createObjectURL(this.response);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
      }
    };
  }

  function getAr(data: arInterface[]): string {
    return data.map((it: arInterface) => it.name).join('/')
  }

  function formatTime(num: number): string{
    if (!num) return '';
    num = Math.ceil(num / 1000)
    let m: number | string = Math.floor(num / 60);
    m = m > 9 ? m : `0${m}`;
    let s: number | string = num % 60;
    s = s > 9 ? s : `0${s}`;
    return `${m}:${s}`
  }

  function aplayOnInit(ap: any) {
    aplayInstance = ap;
    console.log('ap', aplayInstance)
  }

  function aplayOnPlay() {

  }

  function aplayOnPause() {

  }

  function toLogin() {
    props.history.push('/login')
  }

  const columns = [
    {
      title: '歌曲名',
      dataIndex: 'name',
      sorter: false,
      render: (name:string) => name,
      width: '20%',
    },
    {
      title: '歌手',
      dataIndex: 'ar',
      sorter: false,
      render: (ar:arInterface[]) => getAr(ar),
      width: '20%',
    },
    {
      title: '专辑',
      dataIndex: 'al',
      sorter: false,
      render: (al:any) => al.name,
      width: '20%',
    },
    {
      title: '时间',
      dataIndex: 'dt',
      sorter: false,
      render: (dt:any) => formatTime(dt),
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'id',
      sorter: false,
      render: (id: number, item: any) => (
        <div className="flex">
          <span className="icon-w play-btn" onClick={() => playSong(id, item)}></span>
          <span className="icon-w icon-download" onClick={() => downloadSong(id, item)}></span>
        </div>
      ),
      width: '20%',
    },
  ]

  return (
    <Fragment>
      <LayoutTop />
      <div className="tips-w">
        <p className="tips">如果要获得高音质音乐，请先登录网易云音乐账号。</p>
      </div>
      <div className="search-w">
        <div className="form">
          <Search
            placeholder="输入歌曲名搜索"
            maxLength={20}
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={onSearch}
          />

        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          rowKey="id"
          onChange={tableChange}
        />
        <ReactAplayer
          {...aplayOpts}
          onInit={aplayOnInit}
          onPlay={aplayOnPlay}
          onPause={aplayOnPause}
        />
      </div>
    </Fragment>
  )
}