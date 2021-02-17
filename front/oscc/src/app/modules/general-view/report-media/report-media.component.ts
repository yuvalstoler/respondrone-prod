import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {FILE_FS_DATA} from '../../../../../../../classes/typings/all.typings';
import {ConnectionService} from '../../../services/connectionService/connection.service';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {MediaService} from '../../../services/mediaService/media.service';
import {API_GENERAL, WS_API} from '../../../../../../../classes/dataClasses/api/api_enums';


export type PROGRESS_INFO = {
  id: number;
  percent: number;
  observer: any;
};

@Component({
  selector: 'app-report-media',
  templateUrl: './report-media.component.html',
  styleUrls: ['./report-media.component.scss']
})
export class ReportMediaComponent implements OnInit, OnDestroy {

  @Input() media: FILE_FS_DATA[] = [];
  @Output() onAddMedia = new EventEmitter<FILE_FS_DATA>();
  @Output() onDeleteMedia = new EventEmitter<FILE_FS_DATA>();

  formats = 'image/*,video/*'; // ['.jpg', '.png', '.mp4'];
  progressInfos: PROGRESS_INFO[] = [];
  file;

  itemsInPage = 1;
  currentPage = 0;

  constructor(private http: HttpClient,
              public applicationService: ApplicationService,
              // public dialog: MatDialog,
              private connectionService: ConnectionService,
              private mediaService: MediaService) { }

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
      const headers = {'x-access-token': localStorage.getItem('respondroneToken') || ''}; // new HttpHeaders();
      // .append('x-access-token', (this.sessionStorage.getItem('token') || ''));

      const formData: FormData = new FormData();
      formData.append('import', file, file.name);

      const options = {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      };

      const data: PROGRESS_INFO = {id: Date.now(), percent: 0, observer: undefined};
      data.observer = this.connectionService.postObservable(`/${API_GENERAL.general}${WS_API.uploadFile}`, formData, options)
        .subscribe(
          (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                data.percent = Math.round((event.loaded / event.total) * 99);
              } else if (event.type === HttpEventType.Response) {
                data.percent = 100;
                if (event.body.success) {
                  const mediaData: FILE_FS_DATA = event.body.data;
                  this.onAddMedia.emit(mediaData);
                }
                this.removeProgressInfo(data.id);
              }
            },
          (err) => {
              console.log('error uploading file', err);
              this.removeProgressInfo(data.id);
          });
      this.progressInfos.unshift(data);
    }
  };
  // ------------------
  cancelUpload = (data: PROGRESS_INFO) => {
    data.observer.unsubscribe();
    this.removeProgressInfo(data.id);
  };
  // ------------------
  deleteFile = (data: FILE_FS_DATA) => {
    this.mediaService.deleteFile(data)
      .then((res: any) => {
         if (res.success) {
           this.onDeleteMedia.emit(data);
         } else {
           console.log('error deleting file', res.data);
         }
      })
      .catch((err) => {
        console.log('error deleting file', err);
      });
  };
  // -----------------
  removeProgressInfo = (id: number) => {
    const index = this.progressInfos.findIndex((data: PROGRESS_INFO) => data.id === id);
    if (index !== -1) {
      this.progressInfos.splice(index, 1);
    }
  };
  // -------------------
  onImage = (data: FILE_FS_DATA) => {
    this.applicationService.screen.showViewMedia = true;
    this.applicationService.selectedViewMedia = data;
    // const dialogRef = this.dialog.open(ViewMediaComponent, {
    //   width: '50%',
    //   data: data
    // });

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
  };
  // -----------------------
  ngOnDestroy(): void {
    // TODO fix media is still saved
    this.progressInfos.forEach((data: PROGRESS_INFO) => {
      data.observer.unsubscribe();
    });
  }
}
