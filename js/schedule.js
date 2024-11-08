document.getElementById("options").addEventListener("change", function() {
    const selectedOption = this.value;
    const saturdayHeader = document.getElementById("土-header");
    const saturdayCells = document.querySelectorAll("td[id^='土-']");

    // 土曜日の表示/非表示
    if (selectedOption === "saturday") {
        saturdayHeader.style.display = "table-cell";
        saturdayCells.forEach(cell => {
            cell.style.display = "table-cell";
        });
    } else {
        saturdayHeader.style.display = "none";
        saturdayCells.forEach(cell => {
            cell.style.display = "none";
        });
    }

    // 1,2限の結合
    if (selectedOption === "rowspan") {
        for (var i = 1; i <= 7; i += 2) {
            var periodCell = document.getElementById('period-' + i);
            periodCell.setAttribute('rowspan', 2);  // 1,2限を結合
            periodCell.textContent = (i) + '・' + (i + 1) + '限';  // 表示を「1・2限」に変更
            
            document.getElementById('period-' + (i + 1)).style.display = 'none';  // 2限目を非表示

            // 各曜日のセルも結合
            var days = ['月', '火', '水', '木', '金'];
            days.forEach(function(day) {
                var dayCell = document.getElementById(day + '-' + i);
                dayCell.setAttribute('rowspan', 2);  // 1,2限の時間割を結合
                document.getElementById(day + '-' + (i + 1)).style.display = 'none';  // 2限目のセルを非表示
            });
        }
    } else {
        // 通常モードに戻す (rowspanを解除)
        for (var i = 1; i <= 7; i += 2) {
            var periodCell = document.getElementById('period-' + i);
            periodCell.removeAttribute('rowspan');  // rowspanを削除
            periodCell.textContent = i + '限';  // 表示を元に戻す
            document.getElementById('period-' + (i + 1)).style.display = '';  // 2限目を再表示

            // 各曜日のセルも元に戻す
            var days = ['月', '火', '水', '木', '金'];
            days.forEach(function(day) {
                var dayCell = document.getElementById(day + '-' + i);
                dayCell.removeAttribute('rowspan');  // rowspanを削除
                document.getElementById(day + '-' + (i + 1)).style.display = '';  // 2限目のセルを再表示
            });
        }
    }
});





document.getElementById('submit-button').addEventListener('click', function() {
    const timetable = {};
    
    // 時間割の内容を取得する
    for (let period = 1; period <= 8; period++) {
        timetable[`period-${period}`] = {};
        ['月', '火', '水', '木', '金', '土'].forEach(day => {
            const cell = document.getElementById(`${day}-${period}`);
            if (cell) {
                timetable[`period-${period}`][day] = cell.innerText.trim();
            }
        });
    }

    const selectedOption = document.getElementById("options").value;
    // 取得した内容を表示
    console.log('確定された時間割:', timetable);

    fetch('http://localhost:5000/save-timetable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timetable, option: selectedOption }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('成功:', data);
        alert(data.message); // 保存成功のメッセージを表示
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
    // クエリパラメータにエンコードしてリンクを生成
    const encodedTimetable = encodeURIComponent(JSON.stringify(timetable));
    const encodedOption = encodeURIComponent(selectedOption); // オプションをエンコード
    const shareableLink = `${window.location.origin}${window.location.pathname}?timetable=${encodedTimetable}&option=${encodedOption}`; // オプションをリンクに追加
    // 共有リンクをページに表示（オプション）
    const linkElement = document.createElement('p');
    linkElement.innerHTML = `共有リンク: <a href="${shareableLink}">${shareableLink}</a>`;
    document.body.appendChild(linkElement);
});
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const timetableData = urlParams.get('timetable');
    const optionData = urlParams.get('option'); // オプションの情報を取得
    
    // 土曜日のヘッダーとセルを取得
    const saturdayHeader = document.getElementById("土-header");
    const saturdayCells = document.querySelectorAll("td[id^='土-']");

    if (timetableData) {
        const timetable = JSON.parse(decodeURIComponent(timetableData));

        // 時間割の内容を復元
        for (let period = 1; period <= 8; period++) {
            ['月', '火', '水', '木', '金', '土'].forEach(day => {
                const cell = document.getElementById(`${day}-${period}`);
                if (cell && timetable[`period-${period}`] && timetable[`period-${period}`][day]) {
                    cell.innerText = timetable[`period-${period}`][day];
                }
            });
        }
    }

    // セレクトボックスを取得
    const optionsSelect = document.getElementById("options");

    // 取得したオプションの値を利用する
    if (optionData) {
        // セレクトボックスの値を設定
        optionsSelect.value = optionData;

        // 土曜日の表示/非表示
        if (optionData === "saturday") {
            saturdayHeader.style.display = "table-cell";
            saturdayCells.forEach(cell => {
                cell.style.display = "table-cell";
            });
        } else {
            saturdayHeader.style.display = "none";
            saturdayCells.forEach(cell => {
                cell.style.display = "none";
            });
        }

        // 1,2限の結合
        if (optionData === "rowspan") {
            for (var i = 1; i <= 7; i += 2) {
                var periodCell = document.getElementById('period-' + i);
                periodCell.setAttribute('rowspan', 2);  // 1,2限を結合
                periodCell.textContent = (i) + '・' + (i + 1) + '限';  // 表示を「1・2限」に変更
                
                document.getElementById('period-' + (i + 1)).style.display = 'none';  // 2限目を非表示

                // 各曜日のセルも結合
                var days = ['月', '火', '水', '木', '金'];
                days.forEach(function(day) {
                    var dayCell = document.getElementById(day + '-' + i);
                    dayCell.setAttribute('rowspan', 2);  // 1,2限の時間割を結合
                    document.getElementById(day + '-' + (i + 1)).style.display = 'none';  // 2限目のセルを非表示
                });
            }
        } else {
            // 通常モードに戻す (rowspanを解除)
            for (var i = 1; i <= 7; i += 2) {
                var periodCell = document.getElementById('period-' + i);
                periodCell.removeAttribute('rowspan');  // rowspanを削除
                periodCell.textContent = i + '限';  // 表示を元に戻す
                document.getElementById('period-' + (i + 1)).style.display = '';  // 2限目を再表示

                // 各曜日のセルも元に戻す
                var days = ['月', '火', '水', '木', '金'];
                days.forEach(function(day) {
                    var dayCell = document.getElementById(day + '-' + i);
                    dayCell.removeAttribute('rowspan');  // rowspanを削除
                    document.getElementById(day + '-' + (i + 1)).style.display = '';  // 2限目のセルを再表示
                });
            }
        }
    }

    // セレクトボックスの変更イベント
    optionsSelect.addEventListener("change", function() {
        const selectedOption = this.value;

        // 土曜日の表示/非表示
        if (selectedOption === "saturday") {
            saturdayHeader.style.display = "table-cell";
            saturdayCells.forEach(cell => {
                cell.style.display = "table-cell";
            });
        } else {
            saturdayHeader.style.display = "none";
            saturdayCells.forEach(cell => {
                cell.style.display = "none";
            });
        }

        // 1,2限の結合
        if (selectedOption === "rowspan") {
            for (var i = 1; i <= 7; i += 2) {
                var periodCell = document.getElementById('period-' + i);
                periodCell.setAttribute('rowspan', 2);  // 1,2限を結合
                periodCell.textContent = (i) + '・' + (i + 1) + '限';  // 表示を「1・2限」に変更
                
                document.getElementById('period-' + (i + 1)).style.display = 'none';  // 2限目を非表示

                // 各曜日のセルも結合
                var days = ['月', '火', '水', '木', '金'];
                days.forEach(function(day) {
                    var dayCell = document.getElementById(day + '-' + i);
                    dayCell.setAttribute('rowspan', 2);  // 1,2限の時間割を結合
                    document.getElementById(day + '-' + (i + 1)).style.display = 'none';  // 2限目のセルを非表示
                });
            }
        } else {
            // 通常モードに戻す (rowspanを解除)
            for (var i = 1; i <= 7; i += 2) {
                var periodCell = document.getElementById('period-' + i);
                periodCell.removeAttribute('rowspan');  // rowspanを削除
                periodCell.textContent = i + '限';  // 表示を元に戻す
                document.getElementById('period-' + (i + 1)).style.display = '';  // 2限目を再表示

                // 各曜日のセルも元に戻す
                var days = ['月', '火', '水', '木', '金'];
                days.forEach(function(day) {
                    var dayCell = document.getElementById(day + '-' + i);
                    dayCell.removeAttribute('rowspan');  // rowspanを削除
                    document.getElementById(day + '-' + (i + 1)).style.display = '';  // 2限目のセルを再表示
                });
            }
        }
    });
};

