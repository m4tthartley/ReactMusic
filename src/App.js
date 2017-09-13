import React, { Component } from 'react';
// import logo from './logo.svg';
import './app.css';

// https://accounts.spotify.com/en/authorize?client_id=cb8213ab5246444d905488cddfcd8972&response_type=token&redirect_uri=http:%2F%2Fmattsblog.net

export default class App extends Component {
  token = null
  searchIndex = 0

  constructor() {
    super()

    this.state = {
      // artists: [],
      // albums: [],
      // playlists: [],
      // tracks: [],
      search: '',
      results: [],
      type: 'track'
    }

    const hash = window.location.hash.split('&').reduce(function(res, item) {
      const a = item.split('=')
      res[a[0].replace('#', '')] = a[1]
      return res
    }, {})
    if (hash.access_token) this.authSet(hash.access_token)

    this.auth()

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).then((res) => res.json()).then((res) => {
      console.log(res)
    })
  }

  reAuth = () => {
    window.location = `https://accounts.spotify.com/en/authorize?client_id=cb8213ab5246444d905488cddfcd8972&response_type=token&redirect_uri=${encodeURIComponent('http://giantjelly.net/reactmusic')}`
  }
  auth = () => {
    if (!this.token) {
      console.log('no token')
      if (!(this.token = localStorage.getItem('token'))) {
        console.log('no local storage token')
        this.reAuth()
      }
    }
  }
  authSet = (t) => {
    localStorage.setItem('token', t)
  }

  handleChange = (event) => {
    this.setState({[event.target.name]:event.target.value})
  }

  search = (search, type) => {
    if (search.length) {
      const index = ++this.searchIndex
      // album,artist,playlist,track
      fetch(`https://api.spotify.com/v1/search?q=${encodeURI(search)}&type=${type}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }).then((res) => res.json()).then((res) => {
        if (res.error && res.error.status == 401) {
          this.reAuth()
        }
        if (this.searchIndex == index) {
          console.log(res)
          // this.setState({
          //   artists: res.artists.items,
          //   albums: res.albums.items,
          //   playlists: res.playlists.items,
          //   tracks: res.tracks.items
          // })
          this.setState({results:res[this.state.type+'s'].items})
        }
      })
    } else {
      this.setState({results:[]})
    }
  }
  searchChange = (event) => {
    this.handleChange(event)
    this.search(event.target.value, this.state.type)
  }

  typeChange = (event) => {
    console.log(event.target.dataset.value)
    this.setState({type:event.target.dataset.value, results:[]})
    this.search(this.state.search, event.target.dataset.value)
    event.preventDefault()
  }

  render() {
    return (
      <main>
        <h1>React Music</h1>
        {/*<p>Search</p>*/}
        <div className="flex-sides">
          <input className="form__input" type="text" onChange={this.searchChange} name="search" value={this.state.search} placeholder="Search" autoFocus />
          <div className="type-selector">
            <a onClick={this.typeChange} href="#" data-value="track" className={'button '+ (this.state.type=='track' && 'button--active')}>Tracks</a>
            <a onClick={this.typeChange} href="#" data-value="artist" className={'button '+ (this.state.type=='artist' && 'button--active')}>Artists</a>
            <a onClick={this.typeChange} href="#" data-value="album" className={'button '+ (this.state.type=='album' && 'button--active')}>Albums</a>
            <a onClick={this.typeChange} href="#" data-value="playlist" className={'button '+ (this.state.type=='playlist' && 'button--active')}>Playlists</a>
          </div>
        </div>
        {/*<button type="submit">Search</button>*/}

        {this.state.results.length>0 &&
          <div>
            <h2>{this.state.type.charAt(0).toUpperCase()+this.state.type.slice(1)}s</h2>
            {this.state.type == 'track' ?
              <div>
                <p className="track">
                  <span className="track__name track__key">Song</span>
                  <span className="track__artist track__key">Artist</span>
                </p>
                {this.state.results.map((v,i) =>
                  <p className="track" key={i}>
                    <a className="track__name track__link" href={v.external_urls.spotify} target="_blank">{v.name}</a>
                    <span className="track__artist">{v.artists[0].name}</span>
                  </p>
                )}
              </div>
            :
              <div>
                <section className="results">
                  {this.state.results.map((v,i) =>
                    <div key={i} className="result">
                      {v.images[0] && <img className="result__image" height="50" src={v.images[0].url} />}
                      <p className="result__name">{v.name}</p>
                    </div>
                  )}
                </section>
              </div>
            }
          </div>
        }
      </main>
    );
  }
}