const xhr = new XMLHttpRequest();
xhr.open('GET','posts.json',true);

xhr.onload = function(){
    if(this.status === 200){
        let demoWebsite = JSON.parse(this.responseText);
        var postHtml = "";
        demoWebsite.forEach(post=> {

            postHtml += `<div class="col-sm-3">
                            <div class = "card h-100">
                                <img src="images/image${post.imageId}.jpg" class="card-img-top">
                                <div class= "card-body">
                                    <h5 class="card-title px-2">${post.title}</h5>
                                    <div class="btn-group p-2" role="group" aria-label="Basic example">
                                        <button onclick = showBigger(${post.id}) type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#biggerPost">View</button>
                                        <button onclick = editPost(${post.id}) type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editablePost">Edit</button>
                                    </div>
                                    <span class="badge bg-light text-dark position-absolute bottom-0 end-0">Post${post.id}</span>
                                </div>
                            </div>
                            </div>
            `;
        });
        document.querySelector("#post").innerHTML = postHtml;
    }
}
xhr.send();

function showBigger(id){
    const posts = new XMLHttpRequest();
    posts.open('GET','posts.json',true);

    posts.onload = function(){
        if(this.status === 200){
            let blogProject = JSON.parse(this.responseText);
            var body = `
                <div class = "row">
                    <div class = "col-sm-4">
                        <img src="images/image${blogProject[id-1].imageId}.jpg" class="img-fluid">
                    </div>
                    <div class = "col-sm-8">
                        <h4 class = "h4">${blogProject[id-1].title}</h4>
                        <p>${blogProject[id-1].body}</p>
                    </div>
                </div>
            `;
            document.querySelector("#body").innerHTML = body;
        }
    }
    posts.send();

    const comments = fetch('comments.json').then((res) => res.json());
    const users = fetch('users.json').then((res) => res.json());
    const allData = Promise.all([comments, users]);
    var commentCount = 0;
    allData.then((res) => {
        var commentsPost = "";
        res[0].forEach(comment=> {
            if(id === comment.postId){
                commentCount+=1;
                commentsPost += `
                    <div class="card p-2">
                        <div class = "d-flex flex-start">
                            <img src="images/profile/profile${comment.userId}.jpg" class="float-sm-start rounded-circle" style = "height: 2rem;"">
                            <div class = "card-header fs-6 fw-normal">${res[1][comment.userId - 1].name}</div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fs-6 fw-light">${comment.name}</h5>
                            <p class="card-text fs-6 fw-light">${comment.body}</p>
                        </div>
                    </div>
                `;
                document.querySelector("#commentsPost").innerHTML = commentsPost;
                document.querySelector("#commentCount").innerHTML = `Comments (${commentCount})`;
            }
        });
    });
}

function editPost(id){
    const editPost = new XMLHttpRequest();
    editPost.open('GET','posts.json',true);

    editPost.onload = function(){
        if(this.status === 200){
            let editIt = JSON.parse(this.responseText);
            var editBody = `
                <div class = "container-fluid">
                    <h6 class = "mt-3">Title</h6>
                    <textarea id = "titleArea" class="form-control" aria-label="With textarea">${editIt[id-1].title}</textarea>
                    <h6 class = "mt-3">Description</h6>
                    <textarea id = "descriptionArea" class="form-control" aria-label="With textarea" rows="6">${editIt[id-1].body}</textarea>
                    <div class="modal-footer">
                        <button type="button" onclick = applyChanges(id) class="btn btn-success">Apply</button>
                    </div>
                </div>
            `;
            document.querySelector("#editBody").innerHTML = editBody;
        }
    }
    editPost.send();
}

function applyChanges(){
    var titleArea = document.getElementById("titleArea").innerHTML;
    var descriptionArea = document.getElementById("descriptionArea").innerHTML;
    fetch('posts.json', {
        method: 'PUT',
        body: JSON.stringify({
            title: titleArea,
            body: descriptionArea,
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
}