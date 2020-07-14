import { NgModule } from "@angular/core";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
]

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class AuthRoutingModule {}
