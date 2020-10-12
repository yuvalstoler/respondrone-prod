import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FILE_FS_DATA, MEDIA_TYPE} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.scss']
})



export class ViewMediaComponent implements OnInit {

  MEDIA_TYPE = MEDIA_TYPE;

  constructor(
    public dialogRef: MatDialogRef<ViewMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FILE_FS_DATA) {}

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
