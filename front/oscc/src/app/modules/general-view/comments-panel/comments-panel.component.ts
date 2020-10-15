import {Component, Input, OnInit} from '@angular/core';
import {COMMENT} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {

  @Input() comments: COMMENT[];
  comment = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      this.comments.push({source: '', time: Date.now(), text: this.comment});
      this.comment = '';
    }
  };

}
