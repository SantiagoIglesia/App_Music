import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  url_server = "https://music.fly.dev"
  
  constructor() { }

  getTracks() {

    return fetch(`${this.url_server}/tracks`).then(
      response => response.json()
    )
  }

  getAlbums() {

    return fetch(`${this.url_server}/albums`).then(
      response => response.json()
    )
  }
}
