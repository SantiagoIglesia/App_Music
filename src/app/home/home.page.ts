import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { MusicService } from '../services/music.service';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePage implements OnInit {

  lightTheme = 'var(--tema-claro)';
  darkTheme = 'var(--tema-oscuro)';
  currentTheme = this.lightTheme;
  oppositeTheme = this.darkTheme;

  lightLetter = 'var(--letras-tema-claro)';
  darkLetter = 'var(--letras-tema-oscuro)';
  currentLetter = this.lightLetter;
  oppositeLetter = this.darkTheme;

  lightBorder = 'var(--borde-tema-claro)';
  darkBorder = 'var(--borde-tema-oscuro)';
  currentBorder = this.lightBorder;
  oppositeBorder = this.darkTheme;
  
  tracks: any;
  albums: any;
  localArtists: any;
  artists: any;

  song: any = {

    id: '',
    name: '',
    preview_url: '',
    playing: false
  };

  currentSong: any = {};

  newTime: any;

  favouriteTracks: any = [];

  favourite = false;

  iconFavourite = 'heart';

  userLogged: any;

  favourites: any = [];

  idFavourite: any;
  
  constructor(private storageService: StorageService, private navController: NavController, private musicService: MusicService, private modalController: ModalController, private userService: UserService) {}

  async ngOnInit() {

    const savedTheme = await this.storageService.get('theme');

    if(savedTheme === 'Light') {

      this.currentTheme = this.lightTheme;
      this.currentLetter = this.lightLetter;
      this.currentBorder = this.lightBorder;

      this.oppositeTheme = this.darkTheme;
      this.oppositeLetter = this.darkLetter;
      this.oppositeBorder = this.darkBorder;

    } else {

      this.currentTheme = this.darkTheme;
      this.currentLetter = this.darkLetter;
      this.currentBorder = this.darkBorder;

      this.oppositeTheme = this.lightTheme;
      this.oppositeLetter = this.lightLetter;
      this.oppositeBorder = this.lightBorder;
    }

    await this.storageService.set('visitedIntro', false);

    this.loadTracks();

    this.loadAlbums();

    this.loadLocalArtists();

    this.loadArtists();

    const userId = await this.storageService.get('userId');

    this.favouriteTracks = await this.userService.getUserFavouriteTracks(userId);

    if(userId) {

      this.userLogged = userId;
    }

    const favourites = await this.userService.getFavourites();

    if(favourites) {

      this.favourites = favourites;
    }
  }

  loadTracks() {

    this.musicService.getTracks().then(tracks => {
      this.tracks = tracks
    })
  }

  loadAlbums() {

    this.musicService.getAlbums().then(albums => {
      this.albums = albums
    })
  }

  loadLocalArtists() {

    this.localArtists = this.musicService.getLocalArtists();
  }

  async loadSongsAlbum(albumId: string) {

    const songs = await this.musicService.gestSongsByAlbum(albumId);

    const modal = await this.modalController.create ({

      component: SongsModalPage,
      componentProps: {
        songs: songs,
        title: 'Album'
      }
    });

    modal.onDidDismiss().then((result) => {

      if(result.data) {

        this.song = result.data;

        this.isFavourite(this.song.id);
      }
    });

    modal.present();
  }

  loadArtists() {

    this.musicService.getArtists().then(artists => {

      this.artists = artists
    })
  }
  
  async loadSongsArtist(artistId: string) {

    const songs = await this.musicService.gestSongsByArtists(artistId);

    const modal = await this.modalController.create ({

      component: SongsModalPage,
      componentProps: {
        songs: songs,
        title: 'Artista'
      }
    });

    modal.onDidDismiss().then((result) => {

      if(result.data) {

        this.song = result.data;

        this.isFavourite(this.song.id);
      }
    });

    modal.present();
  }

  playSong() {

    this.currentSong = new Audio(this.song.preview_url);

    this.currentSong.play();

    this.currentSong.addEventListener("timeupdate", () => {
      
      this.newTime = this.currentSong.currentTime / this.currentSong.duration;
    })

    this.song.playing = true;
  }

  pauseSong() {

    this.currentSong.pause();
    
    this.song.playing = false;
  }

  formatTime(seconds: number) {

    if(!seconds || isNaN(seconds)) return "0:00";

    const minutes  = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  getRemainingTime() {

    if(!this.currentSong?.duration || !this.currentSong?.currentTime) {
      return 0;
    }

    return this.currentSong.duration - this.currentSong.currentTime;
  }

  isFavourite(trackId: any) {

    const isFav = this.favouriteTracks.some((track: any) => track.id === trackId);

    if(isFav != null) {

      this.favourite = isFav;
    }

    if(this.favourite === true){

      this.iconFavourite = 'close';

    } else {

      this.iconFavourite = 'heart';
    }

    const idFav = this.favourites.find((fav: any) => fav.user_id === this.userLogged && fav.track_id === trackId);
    
    if(idFav != null) {

      this.idFavourite = idFav.id;
    }
  }

  async selectFavourite(trackId: string) {

    if(this.favourite === true){

      const response = await this.userService.deleteFavouriteTrack(this.idFavourite);

      if (response.ok) {
      
        this.favourite = false;

        this.iconFavourite = 'heart';

      } else {

        this.favourite = true;

        this.iconFavourite = 'close';

      }

    } else {

      const response = await this.userService.saveFavouriteTrack(this.userLogged, trackId);

      if (response.ok) {

        this.favourite = true;

        this.iconFavourite = 'close';

      } else {

        this.favourite = false;

        this.iconFavourite = 'heart';
      }
    }
  }
}