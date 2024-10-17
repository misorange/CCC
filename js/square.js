document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('postList');
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];

    // 保存された投稿を表示
    savedPosts.forEach(function(post) {
        const timestamp = post.timestamp || '不明'; // タイムスタンプがない場合は '不明' を使う
        const newPost = createPostElement(post.content, post.replies, timestamp);
        postList.appendChild(newPost);
    });


    // ドロップダウンのクリックイベントを設定
    postList.addEventListener('click', function(event) {
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
    try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const timestamp = new Date().toLocaleString();  // 現在の日時を追加
        posts.push({ content: content, replies: replies, timestamp: timestamp });
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        console.error('Error saving post:', e);
    }
}


// 返信を保存
function saveReply(postIndex, replyContent) {
    try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const timestamp = new Date().toLocaleString();  // 返信日時を追加
        posts[postIndex].replies.push({ content: replyContent, timestamp: timestamp });
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        console.error('Error saving reply:', e);
    }
}


// 投稿を削除
function removePost(postIndex) {
    try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.splice(postIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        console.error('Error removing post:', e);
    }
}

// 返信を削除
function removeReply(postIndex, replyIndex) {
    try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts[postIndex].replies.splice(replyIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        console.error('Error removing reply:', e);
    }
}

// 投稿を送信
function submitPost() {
    const postContent = document.getElementById('postContent').value.replace(/\n/g,"<br>");

    if (postContent.trim() !== '') {
        const postList = document.getElementById('postList');
        const timestamp = new Date().toLocaleString();  // タイムスタンプを追加
        const newPost = createPostElement(postContent, [], timestamp);

        savePost(postContent, []);
        postList.prepend(newPost);

        document.getElementById('postContent').value = '';
    } else {
        //alert('投稿内容を入力してください。');
    }
}

// 投稿要素を作成
function createPostElement(postContent, replies, timestamp) {
    // タイムスタンプがない場合は "不明" と表示
    const displayTimestamp = timestamp || '不明';

    const newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.innerHTML = `
        <p>${postContent}</p>
        <p class="timestamp">投稿時間: ${displayTimestamp}</p>  <!-- 修正: 投稿時間を表示 -->
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
    if (Array.isArray(replies)) {
        replies.forEach(function(reply) {
            const newReply = createReplyElement(reply.content, reply.timestamp);
            replyList.appendChild(newReply);
        });
    }

    return newPost;
}



// 返信要素を作成
function createReplyElement(replyContent, timestamp) {
    // タイムスタンプがない場合は "不明" と表示
    const displayTimestamp = timestamp || '不明';

    const newReply = document.createElement('div');
    newReply.className = 'reply';
    newReply.innerHTML = `
        <div class="reply-content">${replyContent}</div> 
        <p class="timestamp">返信時間: ${displayTimestamp}</p> <!-- 返信時間を表示 -->
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
    const replyContent = button.previousElementSibling.value.replace(/\n/g,"<br>");

    if (replyContent.trim() !== '') {
        const replyList = button.parentElement.nextElementSibling;
        const timestamp = new Date().toLocaleString();  // タイムスタンプを追加
        const newReply = createReplyElement(replyContent, timestamp);

        replyList.appendChild(newReply);
        button.previousElementSibling.value = '';

        const postElement = button.closest('.post');
        const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
        saveReply(postIndex, replyContent);
    } else {
        //alert('返信内容を入力してください。');
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

    if (postContent.querySelector('textarea')) {
        return;
    }

    const currentContent = postContent.innerHTML;
    postContent.innerHTML = `<textarea rows="3" cols="40">${currentContent.replace(/<br>/g, '\n')}</textarea>`;

    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.onclick = function() {
        const newContent = postContent.querySelector('textarea').value.replace(/\n/g, "<br>");
        postContent.innerHTML = newContent;

        updatePostInStorage(post, newContent);
        saveButton.remove();
    };
    postContent.appendChild(saveButton);
}

// 返信を編集
function editReply(button) {
    const replyElement = button.closest('.reply');
    const replyContentElement = replyElement.querySelector('.reply-content');

    // 既に編集モードの場合は何もしない
    if (replyContentElement.nodeName === 'TEXTAREA') {
        return;
    }

    // 元の内容を取得し、<br>タグを改行に置き換える
    const currentContent = replyContentElement.innerHTML.trim().replace(/<br>/g, '\n');

    // テキストエリアに変換
    const textarea = document.createElement('textarea');
    textarea.rows = 2;
    textarea.cols = 40;
    textarea.value = currentContent;  // 修正: 不要な<br>が付かないようにする

    // 元の内容をテキストエリアに置き換え
    replyElement.replaceChild(textarea, replyContentElement);

    // 保存ボタンを作成
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.onclick = function() {
        const newContent = textarea.value.trim().replace(/\n/g, '<br>');  // 改行を<br>に変換

        // テキストエリアを元のテキストノードに戻す
        const newReplyContent = document.createElement('div');
        newReplyContent.className = 'reply-content'; // 新しいクラスを追加
        newReplyContent.innerHTML = newContent;  // 修正: innerHTMLを使って改行の扱いを整える
        replyElement.replaceChild(newReplyContent, textarea);

        // ローカルストレージを更新
        const postElement = button.closest('.post');
        const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
        const replyList = replyElement.closest('.replyList');
        const replyIndex = Array.from(replyList.children).indexOf(replyElement);
        updateReplyInStorage(postIndex, replyIndex, newContent);

        // 保存ボタンを削除
        saveButton.remove();
    };

    // テキストエリアの後に保存ボタンを追加
    replyElement.appendChild(saveButton);
}




// ローカルストレージの投稿を更新
function updatePostInStorage(postElement, newContent) {
    const postIndex = Array.from(postElement.parentNode.children).indexOf(postElement);
    try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts[postIndex].content = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        console.error('Error updating post:', e);
    }
}

// ローカルストレージの返信を更新
function updateReplyInStorage(postIndex, replyIndex, newContent) {
    try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts[postIndex].replies[replyIndex] = newContent;
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        console.error('Error updating reply:', e);
    }
}