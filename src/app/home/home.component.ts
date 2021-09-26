import { Component, Inject, SecurityContext } from "@angular/core";
import { first } from "rxjs/operators";

import { User } from "@app/_models";
import { UserService } from "@app/_services";
import { DOCUMENT } from "@angular/common";
import { FilesListService } from "@app/_services/files-list.service";
import { DomSanitizer } from "@angular/platform-browser";
import { saveAs } from "file-saver";

@Component({ templateUrl: "home.component.html" })
export class HomeComponent {
  loading = false;
  users: User[];
  testeFile;
  nameFile;
  file;
  fileUrl;

  constructor(
    private userService: UserService,
    private filesListService: FilesListService,
    private sanitizer: DomSanitizer
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
  }

  teste($event) {
    this.testeFile = $event.target.files[0];
    this.nameFile = $event.target.files[0].name;
    console.log(this.nameFile);
    document.querySelector("#file-name").textContent = this.nameFile;
  }

  teste2() {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string)
        .replace("data:", "")
        .replace(/^.+,/, "");
      localStorage.setItem("file", base64String);
    };
    reader.readAsDataURL(this.testeFile);
  }

  save(data2) {
    const byteCharacters = atob(data2);
    const byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: "application/mime;base64" });
    const fileURL = URL.createObjectURL(file);
    saveAs(fileURL);
  }
}
