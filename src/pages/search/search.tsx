import React, { useState, useEffect } from "react";
import { Input, Table, message } from 'antd';
import {SearchService} from "../../api/search";
import './search.css';
import { SearchParams, arInterface } from "../../api/types";
import ReactAplayer from 'react-aplayer';
const { Search } = Input;
let aplayInstance: any = null;

export function SearchPage() {

  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0})
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState('')

  const aplayOpts = {
    theme: '#F57F17',
    fixed: true,
    volume: 1,
    listFolded: true
  };

  function onSearch(value: any) {
    if (value.length < 1) {
      message.error('请输入歌曲名')
      return;
    }
    setKeywords(value)
    searchData({
      keywords: value,
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

  // function downloadSong(id: number | string, data: any): void{
  //   let name = data.name + '-' + this.getAr(data.ar)
  //   this.searchService.getSongInfoById(id).subscribe(
  //     (res: any) => {
  //       this.downloadFile(res.data[0].url, name)
  //     }
  //   )
  // }

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
          {/*<span className="icon-w icon-download" onClick={downloadSong(id)}></span>*/}
        </div>
      ),
      width: '20%',
    },
  ]

  return (
    <div className="search-w">
      <div className="form">
        <Search
          placeholder="请输入歌曲名"
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
      ></Table>
      <ReactAplayer
        {...aplayOpts}
        onInit={aplayOnInit}
        onPlay={aplayOnPlay}
        onPause={aplayOnPause}
      />
    </div>
  )
}