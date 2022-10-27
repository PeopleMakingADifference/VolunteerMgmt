import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';


// Represents a user of the app, and contains all the info needed to fetch from
// the server for this user
export class User {
  name: string;
  code: string;
  constructor(public id: number) {}
  setName(name: string): void { this.name = name; }
  setCode(code: string): void { this.code = code; }
  getCode(): string { return this.code; }
  hasCode(): boolean { return this.code && this.code.length > 0; }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;
  debug: boolean;

  constructor(public storage: Storage,
  public platform: Platform){}

  // set the current user to:
  setUser(newUser: User): void {
    this.user = newUser;
  }

  getUser(): User {
    return this.user;
  }

  saveUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.create()
      .then(() => {
        this.storage.set('saved_user', JSON.stringify(this.getUser()))
        .then(saveResult => {
          console.log('saved user', saveResult);
          resolve(saveResult);
        });
      });
    });
  }

  loadUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.create()
      .then(() => {
        this.storage.get('saved_user')
        .then(savedUser => {
          // not truthy - this definitely works for localstorage, but the other
          // persistent storage drivers might return something else.
          // documentation is unclear.
          if(!savedUser){
            resolve(false);
            return;
          }

          // storage is <string, string> so rehydrate the string as an anonymous object
          savedUser = JSON.parse(savedUser);

          // use the parameters of the anonymous object to create a new typed object
          const ressurected = new User(savedUser.id);
          ressurected.setName(savedUser.name);

          this.user = ressurected;
          resolve(this.user);
        });
      });
    });
  }

  deleteUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.create()
      .then(() => {
        this.storage.remove('saved_user')
        .then(deletedUser => {
          console.log('deleted user', deletedUser);
          resolve(deletedUser);
        });
      });
    });
  }

  setDebug(mode: boolean): void {
    this.debug = mode;
  }

  getDebug(): boolean {
    return this.debug;
  }
}
