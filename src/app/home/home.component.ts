import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { AuthenticationService, UserService } from '@app/_services';
import { FilesListService } from '@app/_services/files-list.service';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
const STORE_KEY = 'lastAction';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  loading = false;
  users: User[];
  testeFile;
  nameFile;
  file;
  fileUrl;
  tmppath;
  isDisabledUpload: boolean;
  uploadFinished: boolean;
  x = [];

  constructor(
    private userService: UserService,
    private filesListService: FilesListService,
    private sanitizer: DomSanitizer,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        this.users = users;
      });

    this.filesListService.getFilesList().subscribe((data) => {
      this.file = data;
      return;
    });

    this.isDisabledUpload = false;
  }

  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  chooseFile($event) {
    if (this.tmppath !== null) {
      this.isDisabledUpload = true;
    }
    console.log($event.target.files[0].name);
    this.tmppath = $event.target.files[0].name;
    this.testeFile = $event.target.files[0];
    this.nameFile = $event.target.files[0].name;
    this.reset();
  }
  reset() {
    this.setLastAction(Date.now());
  }

  uploadFile() {
    this.tmppath = null;
    this.isDisabledUpload = false;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string)
        .replace('data:', '')
        .replace(/^.+,/, '');
      localStorage.setItem('file', base64String);
    };
    reader.readAsDataURL(this.testeFile);
    this.uploadFinished = true;
    setTimeout(() => {
      this.uploadFinished = false;
    }, 700);
  }

  downloadFile(data, name) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: 'application/mime;base64' });
    const fileURL = URL.createObjectURL(file);
    saveAs(fileURL, name);
  }
}
