import {AfterContentInit, Component} from '@angular/core';
import {ASYNC_RESPONSE, CREDENTIALS, USER_DATA_UI} from '../../../../../../classes/typings/all.typings';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterContentInit {


  isIncorrect: boolean = false;
  // token: string;
  credentials: CREDENTIALS;

  constructor(private loginService: LoginService,
              private router: Router) {
  }

  ngAfterContentInit(): void {
    this.credentials = {name: 'ResponDrone', password: 'simplex'};
  }

  validate = (credentials: CREDENTIALS, headers?) => {
    this.loginService.login(credentials, headers)
      .then((result: ASYNC_RESPONSE<USER_DATA_UI>) => {

        if (!result.success || !result.data.token) {
          this.isIncorrect = true;
          this.loginService.logout();
        } else if (result && result.data.token) {
          this.isIncorrect = false;
        }
      })
      .catch(err => {
        this.isIncorrect = false;
        this.loginService.logout();
      });
  };
}
