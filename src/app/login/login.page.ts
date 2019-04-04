import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { user } from "../shared/user_class";
import { UserserviceService } from "../providers/userDB/userservice.service";
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})

export class LoginPage implements OnInit, OnDestroy {
  email:string;
  password1:string;
  loginform: FormGroup;
  id:any;
  constructor(private menuCtrl: MenuController,
    private router: Router,
    private userservice: UserserviceService,
    private md5:Md5)
     {
         this.loginform = new FormGroup({
             password1: new FormControl('', [Validators.required, Validators.minLength(6)]),
            email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+"), Validators.email]),

              });
     }

  ngOnInit() {
  this.menuCtrl.enable(false);
  }

  onlogin() {
    // console.log(this.password1);
    // console.log(this.email);
    // const ls=md5.appendStr("hellohellohello").end();
    const md5=new Md5();
    var hashedPassword=md5.appendStr(this.password1).end();
    
    this.userservice.userlogin(new user(null,'', hashedPassword.toString(), this.email,'')).subscribe(
      (data:user[]) => {
      
      console.log(data);
        if (data.length > 0) {
          
          this.id=data[0].user_id;
          localStorage.setItem('id',this.id);
          localStorage.setItem('name',data[0].user_name);
          console.log(this.id);
          this.router.navigate(['/home']);
        }
       
      },
      function (error) {
        console.log(error);
      },
      function () {
        console.log("done");
        
      }
    );
    }

    ngOnDestroy() {
      this.menuCtrl.enable(true);
    }
  }
