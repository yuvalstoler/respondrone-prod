import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {ConnectionService} from '../../../../services/connectionService/connection.service';
import {retry} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ViewMediaComponent} from '../../view-media/view-media.component';
import {MEDIA_DATA} from '../../../../../../../../classes/typings/all.typings';


export type PROGRESS_INFO = {
  percent: number;
  observer: any;
};

@Component({
  selector: 'app-report-media',
  templateUrl: './report-media.component.html',
  styleUrls: ['./report-media.component.scss']
})
export class ReportMediaComponent implements OnInit {

  @Input() media: MEDIA_DATA[] = [];

  formats = ['.jpg', '.png', '.mp4'];
  progressInfos: PROGRESS_INFO[] = [];
  file;

  itemsInPage = 3;
  currentPage = 0;

  constructor(private http: HttpClient,
              public dialog: MatDialog,
              private connectionService: ConnectionService) { }

  ngOnInit(): void {

  }
  // ------------------
  selectFile = (event) => {
    const files: FileList = event.target.files;
    if (files.length >= 1) {
      this.file = files[0];
      this.uploadFile(this.file);
    }
  };
  // ------------------
  uploadFile = (file) => {
    if (file) {
      const headers = new HttpHeaders();
      // .append('x-access-token', (this.sessionStorage.getItem('token') || ''));

      const formData: FormData = new FormData();
      formData.append('import', file, file.name);

      const options = {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      };

      const index = this.progressInfos.length;
      this.progressInfos.push({percent: 0, observer: undefined});

      this.progressInfos[index].observer = this.connectionService.postTMP('/api/uploadFile', formData, options)
        .pipe(retry(3))
        .subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressInfos[index].percent = Math.round((event.loaded / event.total) * 99);
            } else if (event.type === HttpEventType.Response) {
              this.progressInfos[index].percent = 100;
              const mediaData: MEDIA_DATA = event.body.data;
              // TODO save mediaData in report
              // this.progressInfos.splice(index, 1);
            }
          },
          (err) => {
            console.log('error uploading file', err);
            // this.progressInfos.splice(index, 1);
          });
    }
  };
  // ------------------
  cancelUpload = (index: number) => {
    this.progressInfos[index].observer.unsubscribe();
    // this.progressInfos.splice(index, 1);
  };
  // ------------------
  deleteFile = (data: MEDIA_DATA) => {
    this.connectionService.postTMP('/api/removeFile', {data: data})
      .subscribe((res: any) => {
         if (!res.success) {
           console.log('error deleting file', res.data);
         }
        },
        (err) => {
          console.log('error deleting file', err);
        });
  };
  // -------------------
  onImage = (data: MEDIA_DATA) => {
    const dialogRef = this.dialog.open(ViewMediaComponent, {
      width: '50%',
      data: data
    });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  };
  // ---------------------
  next = () => {
    this.currentPage++;
  };
  // ---------------------
  prev = () => {
    this.currentPage--;
  };
  // ----------------------
  isShowImage = (indexInMedia: number) => {
    const index = indexInMedia + this.progressInfos.length;
    return (index >= this.itemsInPage * this.currentPage && index < this.itemsInPage * this.currentPage + this.itemsInPage);
  };
  // ----------------------
  isShowProgress = (index: number) => {
    return (index >= this.itemsInPage * this.currentPage && index < this.itemsInPage * this.currentPage + this.itemsInPage);
  };
  // -----------------------
  isAllowNext = (): boolean => {
    let res: boolean;
    if (Array.isArray(this.media) && this.media.length > 0) {
      res = (this.currentPage < Math.ceil((this.media.length + this.progressInfos.length) / this.itemsInPage) - 1);
    }
    return res;
  }
}
