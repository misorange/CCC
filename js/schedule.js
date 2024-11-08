// 土曜日の表示/非表示や1,2限の結合設定のためのイベントリスナー
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
        for (let i = 1; i <= 7; i += 2) {
            const periodCell = document.getElementById('period-' + i);
            periodCell.setAttribute('rowspan', 2);  // 1,2限を結合
            periodCell.textContent = `${i}・${i + 1}限`;  // 表示を「1・2限」に変更

            document.getElementById('period-' + (i + 1)).style.display = 'none';  // 2限目を非表示

            // 各曜日のセルも結合
            ['月', '火', '水', '木', '金'].forEach(day => {
                const dayCell = document.getElementById(day + '-' + i);
                dayCell.setAttribute('rowspan', 2);  // 1,2限の時間割を結合
                document.getElementById(day + '-' + (i + 1)).style.display = 'none';  // 2限目のセルを非表示
            });
        }
    } else {
        // 通常モードに戻す (rowspanを解除)
        for (let i = 1; i <= 7; i += 2) {
            const periodCell = document.getElementById('period-' + i);
            periodCell.removeAttribute('rowspan');  // rowspanを削除
            periodCell.textContent = `${i}限`;  // 表示を元に戻す
            document.getElementById('period-' + (i + 1)).style.display = '';  // 2限目を再表示

            // 各曜日のセルも元に戻す
            ['月', '火', '水', '木', '金'].forEach(day => {
                const dayCell = document.getElementById(day + '-' + i);
                dayCell.removeAttribute('rowspan');  // rowspanを削除
                document.getElementById(day + '-' + (i + 1)).style.display = '';  // 2限目のセルを再表示
            });
        }
    }
});

// ローカルストレージに時間割を保存する関数
function saveTimetableToLocalStorage() {
    const timetable = {};
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
    localStorage.setItem('timetable', JSON.stringify(timetable));
    localStorage.setItem('option', selectedOption);

    alert("時間割が保存されました！");
}

// 保存ボタンのイベントリスナー
document.getElementById('submit-button').addEventListener('click', saveTimetableToLocalStorage);

// ローカルストレージから時間割を読み込む関数
function loadTimetableFromLocalStorage() {
    const timetableData = localStorage.getItem('timetable');
    const optionData = localStorage.getItem('option');
    const saturdayHeader = document.getElementById("土-header");
    const saturdayCells = document.querySelectorAll("td[id^='土-']");

    if (timetableData) {
        const timetable = JSON.parse(timetableData);
        for (let period = 1; period <= 8; period++) {
            ['月', '火', '水', '木', '金', '土'].forEach(day => {
                const cell = document.getElementById(`${day}-${period}`);
                if (cell && timetable[`period-${period}`] && timetable[`period-${period}`][day]) {
                    cell.innerText = timetable[`period-${period}`][day];
                }
            });
        }
    }

    if (optionData) {
        document.getElementById("options").value = optionData;

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

        if (optionData === "rowspan") {
            for (let i = 1; i <= 7; i += 2) {
                const periodCell = document.getElementById('period-' + i);
                periodCell.setAttribute('rowspan', 2);
                periodCell.textContent = `${i}・${i + 1}限`;
                
                document.getElementById('period-' + (i + 1)).style.display = 'none';

                ['月', '火', '水', '木', '金'].forEach(day => {
                    const dayCell = document.getElementById(day + '-' + i);
                    dayCell.setAttribute('rowspan', 2);
                    document.getElementById(day + '-' + (i + 1)).style.display = 'none';
                });
            }
        }
    }
}

// リセットボタンの機能
document.getElementById('reset-button').addEventListener('click', function() {
    localStorage.removeItem('timetable');
    localStorage.removeItem('option');
    alert("時間割がリセットされました！");
    location.reload();  // ページをリロードして初期状態に戻す
});

// ページ読み込み時に時間割を復元
window.onload = loadTimetableFromLocalStorage;
