import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

import { Post } from "./post.model";
import { environment } from "../../environments/environment";

const BACK_URL = environment.apiUrls + "posts/";

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string, posts: any , maxPosts: number }>(BACK_URL+queryParams)
            .pipe(map(postData => {
                return { posts: postData.posts.map((post: 
                    { _id: any; title: any; content: any; imagePath: any; creator: any; }) => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath: post.imagePath,
                        creator: post.creator
                    };
                }), maxPosts: postData.maxPosts };
            }))
            .subscribe(transformedPostsData => {
                this.posts = transformedPostsData.posts;
                this.postsUpdated.next({
                    posts: [...this.posts],
                    postCount: transformedPostsData.maxPosts
                });
            });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{
            _id: string; title:string;
            content: string;
            imagePath: string; creator: string;
        }>(BACK_URL + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        console.log(postData);
        this.http
            .post<{ message: string, post: Post }>(BACK_URL, postData)
            .subscribe(responseData => {
                // const post: Post = {
                //     id: responseData.post.id,
                //     title: title,
                //     content: content,
                //     imagePath: responseData.post.imagePath
                // };
                // this.posts.push(post);
                // this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        }else{
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: ""
            };
        }
        this.http
            .put<{ message: string, post: Post }>
            (BACK_URL+ id, postData)
            .subscribe(response => {
                // const updatedPosts = [...this.posts];
                // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                // const post: Post = {
                //     id: id,
                //     title: title,
                //     content: content,
                //     imagePath: response.post.imagePath
                // };
                // updatedPosts[oldPostIndex] = post;
                // this.posts = updatedPosts;
                // this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }

    deletePost(postId: string) {
        return this.http.delete(BACK_URL + postId)
        // .subscribe(() => {
        //     this.posts = this.posts.filter(post => post.id !== postId);
        //     this.postsUpdated.next([...this.posts]);
        // })
        ;
    }
}
