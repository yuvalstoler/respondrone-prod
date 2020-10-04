import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MEDIA_DATA} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.scss']
})



export class ViewMediaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MEDIA_DATA) {}

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
