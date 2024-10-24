document.addEventListener('DOMContentLoaded', function() {
    const postList = document.getElementById('postList');
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    
    for (let i = 0; i < savedPosts.length; i++) {
        const post = savedPosts[i];
        const newPost = createElement(i, post.content, post.replies, post.time, post.category);
        postList.prepend(newPost);
    }

    postList.addEventListener('click', function(event) {
        if (event.target.classList.contains('dropbtn')) {
            const dropdownContent = event.target.nextElementSibling;
            document.querySelectorAll('.dropdown-content').forEach(function(content) {
                content.style.display = 'none';
            });
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation();
        } else {
            document.querySelectorAll('.dropdown-content').forEach(function(content) {
                content.style.display = 'none';
            });
        }
    });
});

function saveItem(type, index, content, category) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const currentTime = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/');

    if (type === 'post') {
        posts.push({ content: content, replies: [], time: currentTime, category: category || '未設定' });
    } else if (type === 'reply' && index !== null) {
        posts[index].replies.push({ content: content, time: currentTime });
    }
    localStorage.setItem('posts', JSON.stringify(posts));
}

function removeItem(type, postIndex, replyIndex) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (type === 'post') {
        posts.splice(postIndex, 1);
    } else if (type === 'reply') {
        posts[postIndex].replies.splice(replyIndex, 1);
    }
    localStorage.setItem('posts', JSON.stringify(posts));
}

function updateItem(type, postIndex, replyIndex, newContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    if (type === 'post') {
        posts[postIndex].content = newContent;
    } else if (type === 'reply') {
        posts[postIndex].replies[replyIndex].content = newContent; // 修正：contentの更新
    }
    localStorage.setItem('posts', JSON.stringify(posts));
}

function createElement(id, content, replies, time, category) {
    const newElement = document.createElement('div');
    newElement.className = 'post';
    const safeContent = content ? escapeHtml(content) : '';
    const safeTime = time ? time : 'N/A';
    const safeCategory = category ? escapeHtml(category) : '未設定';
    newElement.innerHTML = `
        <p>${safeContent}</p>
        <span class="time">${safeTime}</span>
        <span class="category">${safeCategory}</span>
        <div class="dropdown">
            <button class="dropbtn">⋮</button>
            <div class="dropdown-content">
                <a href="#" onclick="editItem(this, 'post')">編集</a>
                <a href="#" onclick="deleteItem(this, 'post')">削除</a>
            </div>
        </div>
        <details>
            <summary>コメントを表示</summary>
            <div class="replyForm">
                <textarea rows="2" placeholder="返信を入力してください..."></textarea>
                <button class="button" onclick="submitReply(this)">返信する</button>
            </div>
            <div class="replyList"></div>
        </details>
    `;
    newElement.setAttribute('data-id', id);
    
    const replyList = newElement.querySelector('.replyList');
    replies.forEach(function(reply) {
        const replyElement = createReplyElement(reply.content, reply.time);
        replyList.appendChild(replyElement);
    });
    
    return newElement;
}

function createReplyElement(replyContent, replyTime) {
    const newReply = document.createElement('div');
    newReply.className = 'reply';
    const safeReplyContent = replyContent ? escapeHtml(replyContent) : '';
    const safeReplyTime = replyTime ? replyTime : 'N/A';
    newReply.innerHTML = `
        <div class="reply-content">${safeReplyContent}</div>
        <span class="time">${safeReplyTime}</span>
        <div class="dropdown">
            <button class="dropbtn">⋮</button>
            <div class="dropdown-content">
                <a href="#" onclick="editItem(this, 'reply')">編集</a>
                <a href="#" onclick="deleteItem(this, 'reply')">削除</a>
            </div>
        </div>
    `;
    return newReply;
}

function submitPost() {
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('categorySelect').value;

    if (content) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const currentTime = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/');
        posts.push({ content, replies: [], time: currentTime, category: category || '未設定' });
        localStorage.setItem('posts', JSON.stringify(posts));
        document.getElementById('postContent').value = ''; // 入力フィールドをクリア
        document.getElementById('categorySelect').value = ''; // カテゴリ選択をリセット
        displayPosts(); // 投稿を再表示
    }
}

function submitReply(button) {
    const replyContent = button.previousElementSibling.value.trim();
    if (replyContent !== '') {
        const postElement = button.closest('.post');
        const replyList = postElement.querySelector('.replyList');
        const currentTime = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/');
        const newReply = createReplyElement(replyContent, currentTime);
        replyList.appendChild(newReply);
        button.previousElementSibling.value = '';
        const index = parseInt(postElement.getAttribute('data-id'), 10);
        saveItem('reply', index, replyContent); 
    }
}

function deleteItem(button, type) {
    const element = button.closest(type === 'post' ? '.post' : '.reply');
    const postElement = button.closest('.post');
    const postIndex = postElement.getAttribute('data-id');

    if (type === 'post') {
        element.remove();
        removeItem(type, postIndex);
    } else {
        const replyList = button.closest('.replyList');
        const replyIndex = Array.from(replyList.children).indexOf(element);
        element.remove();
        removeItem(type, postIndex, replyIndex);
    }
}

function editItem(button, type) {
    const element = button.closest(type === 'post' ? '.post' : '.reply');
    const contentElement = type === 'post' ? element.querySelector('p') : element.querySelector('.reply-content');
    const currentContent = contentElement.innerText;

    const textarea = document.createElement('textarea');
    textarea.value = currentContent;
    textarea.className = 'edit-textarea';

    const completeButton = document.createElement('button');
    completeButton.innerText = '完了';
    completeButton.className = 'button';
    completeButton.onclick = function() {
        const newContent = textarea.value;
        contentElement.innerHTML = escapeHtml(newContent);
        const postElement = button.closest('.post');
        const postIndex = postElement.getAttribute('data-id');
        const replyIndex = type === 'reply' ? Array.from(element.parentNode.children).indexOf(element) : null;
        updateItem(type, postIndex, replyIndex, newContent);
    };

    contentElement.innerHTML = '';
    contentElement.appendChild(textarea);
    contentElement.appendChild(completeButton);
    textarea.focus();
}

function filterPosts(category) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postList = document.getElementById('postList');
    postList.innerHTML = '';
    posts.forEach(function(post, index) {
        if (category === '全て' || post.category === category) {
            const newPost = createElement(index, post.content, post.replies, post.time, post.category);
            postList.prepend(newPost);
        }
    });
}

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;")
                 .replace(/\n/g, "<br>");
}

function clearLocalStorage() {
    localStorage.clear();
    const postList = document.getElementById('postList');
    postList.innerHTML = '';
}

document.getElementById('categoryFilter').addEventListener('change', function() {
    const selectedCategory = this.value;
    filterPosts(selectedCategory);
});

function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postList = document.getElementById('postList');
    postList.innerHTML = '';
    
    posts.forEach(function(post, index) {
        const newPost = createElement(index, post.content, post.replies, post.time, post.category);
        postList.prepend(newPost);
    });
}
