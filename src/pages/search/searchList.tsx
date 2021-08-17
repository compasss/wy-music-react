import React, { useState, Fragment } from "react";
import {Avatar, Input, List, message, Skeleton, Spin} from 'antd';
import {SearchService} from "../../api/search";
import './search.css';
import { SearchParams, arInterface } from "../../api/types";
import ReactAplayer from 'react-aplayer';
import LayoutTop from "../../components/layout/top";

const { Search } = Input;
let aplayInstance: any = null;

export default function SearchListPage(props: any) {

  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0})
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState('')
  const [spinLoading, setSpinLoading] = useState(false)
  const [loadMore, setLoadMore] = useState(false)

  const aplayOpts = {
    fixed: false,
    mini: false,
    volume: 1,
    autoplay: false,
    audio: [
      {
        name: 'Hotel California',
        artist: 'Eagles',
        url: '//q.265265.xyz/audio/Hotel-California-Eagles.flac',
        cover: '//p4.music.126.net/m_HGFCoSwhJYcJjgVaiq7A==/109951165261316702.jpg?param=200y200'
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
        url: replaceUrl(res.data.data[0].url),
        cover: replaceUrl(data.al.picUrl) + '?param=200y200'
      }]);
    })
  }

  function replaceUrl(str: string | undefined) : string {
    if (!str) return ''
    return str.replace(/^.*:/, '')
  }

  function downloadSong(id: number | string, data: any): void{
    setSpinLoading(true)
    let name = data.name + '-' + getAr(data.ar)
    SearchService.getSongInfoById({id: id}).then(res => {
      downloadFile(replaceUrl(res.data.data[0].url), `${name}.${res.data.data[0].type}`)
    }).catch(() => {
      setSpinLoading(false)
    });
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
      setSpinLoading(false)
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
  }

  function aplayOnPlay() {

  }

  function aplayOnPause() {

  }

  return (
    <Fragment>
      <LayoutTop />
      <Spin spinning={spinLoading} tip={'下载中...'}>
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
          <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={dataSource}
            renderItem={(item:any) => (
              <List.Item
                actions={[<div className="flex">
                  <span className="icon-w play-btn" onClick={() => playSong(item.id, item)}></span>
                  <span className="icon-w icon-download" onClick={() => downloadSong(item.id, item)}></span>
                </div>]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.al.picUrl} />
                    }
                    title={<span>{item.name}</span>}
                    description={<div><span className="m-r-10">{getAr(item.ar)}</span><span>{item.al.name}</span></div>}
                  />
                  <div>{formatTime(item.dt)}</div>
                </Skeleton>
              </List.Item>
            )}
          />
          <div className="aplay-w">
            <ReactAplayer
              {...aplayOpts}
              onInit={aplayOnInit}
              onPlay={aplayOnPlay}
              onPause={aplayOnPause}
            />
          </div>
        </div>
      </Spin>
    </Fragment>
  )
}