import {AfterContentInit, Component} from '@angular/core';
import {ASYNC_RESPONSE, CREDENTIALS, LOGIN_RESPONSE} from '../../../../../../classes/typings/all.typings';
import {LoginService} from '../../services/login/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  isChecked: boolean = false;
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
      .then((result: ASYNC_RESPONSE<LOGIN_RESPONSE>) => {

        if (!result.success || !result.data.token) {
          this.isChecked = true;
          this.loginService.logout();
        } else if (result && result.data.token) {
          this.isChecked = false;
        }
      })
      .catch(err => {
        this.isChecked = false;
        this.loginService.logout();
      });
  };
}
