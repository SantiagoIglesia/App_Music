import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  urlServer = "https://music.fly.dev"

  constructor(private http: HttpClient) { }

  async getUser(userId: string) {

    return fetch(`${this.urlServer}/current_user/${userId}`).then(
      response => response.json()
    );
  }

  async getUserFavouriteTracks(userId: string) {

    return fetch(`${this.urlServer}/user_favorites/${userId}`).then(
      response => response.json()
    );
  }

  async saveFavouriteTrack(userId: string, trackId: string): Promise<any> {

    const url = `${this.urlServer}/favorite_tracks`;
    
    const body = {

      "favorite_track": {
        "user_id": userId,
        "track_id": trackId
      }
    };

    const headers = new HttpHeaders({

      'Content-Type': 'application/json'
    });

    try {

      const response = await firstValueFrom(this.http.post(url, body, {
        headers,
        observe: 'response'
      }));

      return {

        ok: true,
        status: response.status,
        body: response.body
      };
    
    } catch(error: any) {

      return {

        ok: false,
        status: error.status,
        message: error?.error?.message || 'Error en la solicitud'
      }
    }
  }

  async getFavourites() {

    return fetch(`${this.urlServer}/favorite_tracks`).then(
      response => response.json()
    );
  }

  async deleteFavouriteTrack(favouriteId: string): Promise<any> {

    const url = `${this.urlServer}/favorite_tracks/${favouriteId}`;

    const headers = new HttpHeaders({

      'Content-Type': 'application/json'
    });

    try {

      const response = await firstValueFrom(this.http.delete(url, {
        headers,
        observe: 'response'
      }));

      return {

        ok: true,
        status: response.status,
        body: response.body
      };
    
    } catch(error: any) {

      return {

        ok: false,
        status: error.status,
        message: error?.error?.message || 'Error en la solicitud'
      }
    }
  }
}
