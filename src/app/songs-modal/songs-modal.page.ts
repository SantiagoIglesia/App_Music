import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController, IonModal } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SongsModalPage implements OnInit {

  songs: any;
  title: any;

  constructor(private navParams: NavParams, private modalController: ModalController, private storageService: StorageService) { }

  ngOnInit() {

    this.songs = this.navParams.data['songs'];
    this.title = this.navParams.data['title'];
  }

  async selectSong(song: any) {
    
    await this.modalController.dismiss(song);
  }

  closeModal() {
    
    this.modalController.dismiss(null, 'cancel');
  }
}
