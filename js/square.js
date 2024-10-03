document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('postList');
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // 保存された投稿を表示
    savedPosts.forEach(function(post) {
        const newPost = createPostElement(post.content, post.replies);
        postList.appendChild(newPost);
    });

    // 投稿要素の作成を個別に行う関数を分けておく
    function createPostElement(postContent, replies) {
        const newPost = document.createElement('div');
        newPost.className = 'post';
        newPost.innerHTML = `
            <p>${postContent}</p>
            <div class="dropdown">
                <button class="dropbtn">⋮</button>
                <div class="dropdown-content">
                    <a href="#" onclick="editPost(this)">編集</a>
                    <a href="#" onclick="deletePost(this)">削除</a>
                </div>
            </div>
            <details>
                <summary>コメントを表示</summary>
                <div class="replyForm">
                    <textarea rows="2" cols="40" placeholder="返信を入力してください..."></textarea>
                    <button onclick="submitReply(this)">返信する</button>
                </div>
                <div class="replyList"></div>
            </details>
        `;

        const replyList = newPost.querySelector('.replyList');
        // repliesが必ず配列であることを確認
        if (Array.isArray(replies)) {
            replies.forEach(function(replyContent) {
                const newReply = createReplyElement(replyContent);
                replyList.appendChild(newReply);
            });
        }

        return newPost;
    }

    // ドロップダウンのクリックイベントを設定
    postList.addEventListener('click', function(event) {
        // ドロップダウンボタンがクリックされた場合
        if (event.target.classList.contains('dropbtn')) {
            const dropdownContent = event.target.nextElementSibling;

            // 他のメニューを閉じる
            document.querySelectorAll('.dropdown-content').forEach(function(content) {
                if (content !== dropdownContent) {
                    content.style.display = 'none';
                }
            });

            // ドロップダウンメニューの表示/非表示をトグル
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation(); // イベントの伝搬を停止
        } else {
            // 他の部分がクリックされた場合、すべてのドロップダウンを閉じる
            document.querySelectorAll('.dropdown-content').forEach(function(content) {
                content.style.display = 'none';
            });
        }
    });
});

// 投稿を保存
function savePost(content, replies) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ content: content, replies: replies });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 返信を保存
function saveReply(postIndex, replyContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].replies.push(replyContent);
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 投稿を削除
function removePost(postIndex) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(postIndex, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 返信を削除
function removeReply(postIndex, replyIndex) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].replies.splice(replyIndex, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 投稿を送信
function submitPost() {
    const postContent = document.getElementById('postContent').value;
    if (postContent.trim() !== '') {
        const postList = document.getElementById('postList');
        const newPost = createPostElement(postContent, []);

        savePost(postContent, []);
        postList.prepend(newPost);

        document.getElementById('postContent').value = '';
    } else {
        alert('投稿内容を入力してください。');
    }
}

// 投稿要素を作成
function createPostElement(postContent, replies) {
    const newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.innerHTML = `
        <p>${postContent}</p>
        <div class="dropdown">
        <button class="dropbtn">⋮</button>
        <div class="dropdown-content">
        <a href="#" onclick="editPost(this)">編集</a>
        <a href="#" onclick="deletePost(this)">削除</a>
        </div>
        </div>
        <details><summary>コメントを表示</summary><div class="replyForm">
            <textarea rows="2" cols="40" placeholder="返信を入力してください..."></textarea>
            <button onclick="submitReply(this)">返信する</button>
        </div>
        <div class="replyList"></div></details>
    `;

    const replyList = newPost.querySelector('.replyList');
    replies.forEach(function(replyContent) {
        const newReply = createReplyElement(replyContent);
        replyList.appendChild(newReply);
    });

    return newPost;
}

// 返信要素を作成
function createReplyElement(replyContent) {
    const newReply = document.createElement('div');
    newReply.className = 'reply';
    newReply.innerHTML = `
        ${replyContent}
        <div class="dropdown">
        <button class="dropbtn">⋮</button>
        <div class="dropdown-content">
        <a href="#" onclick="editReply(this)">編集</a>
        <a href="#" onclick="deleteReply(this)">削除</a>
        </div>
        </div>
    `;
    return newReply;
}

// 返信を送信
function submitReply(button) {
    const replyContent = button.previousElementSibling.value;

    if (replyContent.trim() !== '') {
        const replyList = button.parentElement.nextElementSibling;
        const newReply = createReplyElement(replyContent);

        replyList.appendChild(newReply);
        button.previousElementSibling.value = '';

        const postElement = button.closest('.post');
        const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
        saveReply(postIndex, replyContent);
    } else {
        alert('返信内容を入力してください。');
    }
}

// 投稿を削除
function deletePost(button) {
    const postElement = button.closest('.post');
    const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);

    postElement.remove();
    removePost(postIndex);
}

// 返信を削除
function deleteReply(button) {
    const replyElement = button.closest('.reply');
    const postElement = button.closest('.post');
    const replyList = button.closest('.replyList');
    const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
    const replyIndex = Array.from(replyList.children).indexOf(replyElement);

    replyElement.remove();
    removeReply(postIndex, replyIndex);
}

// 投稿を編集
function editPost(button) {
    const post = button.closest('.post');
    const postContent = post.querySelector('p');
    const newContent = prompt('新しい内容を入力してください:', postContent.textContent);
    if (newContent) {
        postContent.textContent = newContent;
        updatePostInStorage(post, newContent);
    }
}

// 返信を編集
function editReply(button) {
    const replyElement = button.closest('.reply');
    const replyContentElement = replyElement.childNodes[0];
    const newContent = prompt('新しい返信内容を入力してください:', replyContentElement.textContent);

    if (newContent) {
        replyContentElement.textContent = newContent;
        const postElement = button.closest('.post');
        const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
        const replyList = replyElement.closest('.replyList');
        const replyIndex = Array.from(replyList.children).indexOf(replyElement);
        updateReplyInStorage(postIndex, replyIndex, newContent);
    }
}

// ローカルストレージの投稿を更新
function updatePostInStorage(postElement, newContent) {
    const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].content = newContent;
    localStorage.setItem('posts', JSON.stringify(posts));
}

// ローカルストレージの返信を更新
function updateReplyInStorage(postIndex, replyIndex, newContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].replies[replyIndex] = newContent;
    localStorage.setItem('posts', JSON.stringify(posts));
}
