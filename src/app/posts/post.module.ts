import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from "./post-create/post-create.component";

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        AngularMaterialModule
    ]
})

export class PostModule {}