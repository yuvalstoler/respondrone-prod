import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {EventManager} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  private resizeSubject: Subject<Window>;

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new Subject();
    this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
  }

  private onResize(event: UIEvent) {
    this.resizeSubject.next(<Window>event.target);
  }

}
