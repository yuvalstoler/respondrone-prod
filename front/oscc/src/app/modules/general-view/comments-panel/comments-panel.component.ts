import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMENT} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {

  @Input() comments: COMMENT[];
  @Input() isOpenDescription: boolean;
  @Output() changeComments = new EventEmitter<COMMENT[]>();
  comment = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      const newComment = {source: '', time: Date.now(), text: this.comment};
      this.changeComments.emit([...this.comments, ...[newComment]]);
      this.comment = '';
    }
  };

}