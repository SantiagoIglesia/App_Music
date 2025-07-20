import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { MusicService } from '../services/music.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePage implements OnInit {

  //Definimos variables de temas
  tema_claro = 'var(--tema-claro)';
  tema_oscuro = 'var(--tema-oscuro)';
  tema_actual = this.tema_claro;

  //Definimos variables de letras
  letra_tema_claro = 'var(--letras-tema-claro)';
  letra_tema_oscuro = 'var(--letras-tema-oscuro)';
  letra_tema_actual = this.letra_tema_claro;

  //Definimos variables de bordes
  borde_tema_claro = 'var(--borde-tema-claro)';
  borde_tema_oscuro = 'var(--borde-tema-oscuro)';
  borde_tema_actual = this.borde_tema_claro;

  //Definimos la pag. actual
  pagAct = 'Home'
  pagAnt = ''

  tema = ''
  letra = ''
  borde = ''

  datos_cargados = false;
  
  //Definimos el array de los generos a mostrar en el swiper
  genres = [
    {
      title: "Rap",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTyVFrLgFSVfYMtWKxaaT1EVjxIH1pdDKmg&s",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat potenti pellentesque scelerisque praesent convallis, phasellus facilisi feugiat nullam pulvinar ligula gravida dignissim diam porta mollis lectus. Nullam vulputate malesuada convallis netus platea iaculis nisl aliquam, leo tristique vitae euismod egestas proin conubia eros maecenas, porta integer sociis felis a penatibus laoreet. Nunc nisi lacus in lectus semper parturient dis libero, hac velit ornare suscipit vivamus at est ligula, eget per curae laoreet massa posuere enim."
    },
    {
      title: "EDM",
      image: "https://cdn-images.dzcdn.net/images/cover/b9814933faca489edd40f5303550d29e/500x500.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat potenti pellentesque scelerisque praesent convallis, phasellus facilisi feugiat nullam pulvinar ligula gravida dignissim diam porta mollis lectus. Nullam vulputate malesuada convallis netus platea iaculis nisl aliquam, leo tristique vitae euismod egestas proin conubia eros maecenas, porta integer sociis felis a penatibus laoreet. Nunc nisi lacus in lectus semper parturient dis libero, hac velit ornare suscipit vivamus at est ligula, eget per curae laoreet massa posuere enim."
    },
    {
      title: "Reggaeton",
      image: "https://cdn-images.dzcdn.net/images/cover/d39c2560f43519d574029357478c98a5/0x1900-000000-80-0-0.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat potenti pellentesque scelerisque praesent convallis, phasellus facilisi feugiat nullam pulvinar ligula gravida dignissim diam porta mollis lectus. Nullam vulputate malesuada convallis netus platea iaculis nisl aliquam, leo tristique vitae euismod egestas proin conubia eros maecenas, porta integer sociis felis a penatibus laoreet. Nunc nisi lacus in lectus semper parturient dis libero, hac velit ornare suscipit vivamus at est ligula, eget per curae laoreet massa posuere enim."
    }
  ]

  tracks: any
  albums: any
  
  //Instanciamos el constructor
  constructor(private storageService: StorageService, private router: Router, private navCtrl: NavController, private musicService: MusicService) {}

  //Inicializamos la vista
  async ngOnInit() {

    await this.loadStorageData()

    this.simularCargaDatos()

    await this.storageService.set('visitoIntro', false)

    this.datos_cargados = true;

    this.loadTracks()

    this.loadAlbums()
  }

  loadTracks() {
    this.musicService.getTracks().then(tracks => {
      this.tracks = tracks
      console.log(this.tracks, " las canciones")
    })
  }

  loadAlbums() {
    this.musicService.getAlbums().then(albums => {
      this.albums = albums
      console.log(this.albums, " los albumes")
    })
  }

  async cambiarColor(){

    this.tema_actual = this.tema_actual === this.tema_claro ? this.tema_oscuro : this.tema_claro
    this.letra_tema_actual = this.letra_tema_actual === this.letra_tema_claro ? this.letra_tema_oscuro : this.letra_tema_claro
    this.borde_tema_actual = this.borde_tema_actual === this.borde_tema_claro ? this.borde_tema_oscuro : this.borde_tema_claro
  }

  async guardarColor(){

    this.cambiarColor();

    if(this.tema_actual === this.tema_claro){

      this.tema = 'Claro'

    } else {

      this.tema = 'Oscuro'
    }

    if(this.letra_tema_actual === this.letra_tema_claro){

      this.letra = 'Clara'

    } else {

      this.letra = 'Oscura'
    }

    if(this.borde_tema_actual === this.borde_tema_claro){

      this.borde = 'Claro'

    } else {

      this.borde = 'Oscuro'
    }

    await this.storageService.set('theme', this.tema)
    await this.storageService.set('letter', this.letra)
    await this.storageService.set('border', this.borde)

    console.log('Tema Guardado: ', this.tema)
    console.log('Letra Guardada: ', this.letra)
    console.log('Borde Guardado: ', this.borde)
  }

  async loadStorageData() {

    const savedTheme = await this.storageService.get('theme')
    const savedLetter = await this.storageService.get('letter')
    const savedBorder = await this.storageService.get('border')
    const savedPage = await this.storageService.get('navigation')
    
    if(savedTheme === 'Claro') {

      this.tema_actual = this.tema_claro;

    } else {

      this.tema_actual = this.tema_oscuro;
    }

    if(savedLetter === 'Clara') {

      this.letra_tema_actual = this.letra_tema_claro;

    } else {

      this.letra_tema_actual = this.letra_tema_oscuro;
    }

    if(savedBorder === 'Claro') {

      this.borde_tema_actual = this.borde_tema_claro;

    } else {

      this.borde_tema_actual = this.borde_tema_oscuro;
    }

    if(savedPage) {

      this.pagAnt = savedPage;
    }
  }

  async verIntro() {

    await this.storageService.set('navigation', this.pagAct)
    const savedPage = await this.storageService.get('navigation')

    if(savedPage) {

      this.pagAnt = savedPage;
    }

    console.log("Ir al Intro")
    this.navCtrl.navigateForward('/intro')
  }

  async simularCargaDatos() {
    const data = await this.obtenerDatosSimulados()
    console.log('Datos SImulados: ', data)
  }

  obtenerDatosSimulados() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(['Rock', 'Pop', 'Jazz'])
        //reject("Hubo error al obtener los datos")
      }, 6000)
    })
  }
}
