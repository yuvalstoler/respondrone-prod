import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../../services/login/login.service';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor(public loginService: LoginService) { }

  ngOnInit() {
  }

}
