const Post = require('../models/post');

exports.CreatePost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    // console.log(req.userData);
    // return res.send(200).json({});
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Creaing a post failed!'
        });
    });
}

exports.UpdatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
        console.log("Image inserted, url:"+imagePath);
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    // console.log("Title: "+ post.title);
    // console.log("Content: "+ post.content);
    Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
        if(result.n > 0) {
            res.status(200).json({
                message: "Update successful!",
                post
            });
        }else{
            res.status(401).json({
                message: "You are an unauthorised user!",
                post
            });
        }
    }).catch(error => {
        res.json(500).json({
            message: "Couldn't update the post!"
        });
    });
    console.log("Post with id:"+ post.id + "is updated");
}

exports.GetAllPost = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage){
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.countDocuments();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error => {
        res.json(500).json({
            message: "Fetching posts failed!"
        });
    });
}

exports.GetOnePost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post not Found'});
        }
    }).catch(error => {
        res.json(500).json({
            message: "Fetching post failed!"
        });
    });
}

exports.DeletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
        // console.log(result);
        if(result.n > 0) {
            res.status(200).json({
                message: "Post deleted successfully!",
                post
            });
        }else{
            res.status(401).json({
                message: "Unauthorised user!",
                post
            });
        }
    }).catch(error => {
        res.json(500).json({
            message: "Deleting post failed!"
        });
    });
}

