import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMENT} from '../../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {

  @Input() comments: COMMENT[];
  @Input() isOpenDescription: boolean = false;
  @Input() isShowTitle: boolean = true;
  @Output() changeComments = new EventEmitter<COMMENT[]>();
  comment = '';
  openEmoji = false;

  constructor(public applicationService: ApplicationService) {
    console.log(this.isOpenDescription);
  }

  ngOnInit(): void {
  }

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      const newComment = {source: '', time: Date.now(), text: this.comment};
      this.changeComments.emit([...this.comments, ...[newComment]]);
      this.comment = '';
    }
  };

  addEmoji = (event) => {
    console.log(event.emoji);
    this.comment = this.comment + event.emoji.native;
  };

}
