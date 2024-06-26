import { FormGroup, Form, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from "./mime-type.validator";
import { PostService } from '../post.service';
import { Post } from "../post.model";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
    enteredTitle:String = "";
    enteredContent = "";
    post!: Post;
    isLoading = false;
    form!: FormGroup;
    imagePreview: string | ArrayBuffer | null = "";
    private mode = 'create';
    private postId: string = "";
    private authStatusSub!: Subscription;

    constructor(public postsService: PostService,
        public route: ActivatedRoute,
        private authService: AuthService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
        // this.onImagePicked($event);
        this.form = new FormGroup({
            title: new FormControl(null, { 
                validators : [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId') as string;
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(postData => {
                    this.isLoading = false;
                    this.imagePreview = postData.imagePath;
                    this.post = {
                        id : postData._id,
                        title : postData.title,
                        content : postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator
                    };
                    this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                    });
                });
            }
        });
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files![0];
        this.form.patchValue({image: file});
        this.form.get("image")!.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    OnSavePosts() {
        if(this.form.invalid){
            return;
        }
        this.isLoading = true;
        if(this.mode === 'create'){
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }else{
            this.postsService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }
        this.form.reset();
    }
    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}
