//глобальна змінна імені файлу
let fileName = '';

//ф-я яка відпрвляє файл на сервер, де сервер зберігає його в буфер та видаляє минулі файли
function uploadFile(event) {
    let target = event.target || event.currentTarget;
    let file = target.files[0];
    fileName = file.name;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploads/' + file.name, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.onreadystatechange = function () {
        event = null;
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.querySelector('#image').style.backgroundImage = 'url(../image_Buffer/' + fileName + ')';
            } else {
                console.log('error');
            }
        }
    }
    xhr.send(file);
    event.target.value = 'uuuu'; // незнаю!!
    //робимо кнопку завантаження активною щоб можна було завантажити файл
    document.querySelector('#subId').disabled = false;
}

//ф-я відправляє через url назву файла який находиться в буфері(щоб по назві його перемістити в папку завантажень)
function saveFile(){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/save/'+fileName, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            } else {
                console.log('error');
            }
        }
    }
    xhr.send();
    //робимо кнопку не активною щоб повторно не завантажити файл
    document.querySelector('#subId').disabled = true;
}

document.querySelector('#f').addEventListener('change', uploadFile);
document.querySelector('#subId').addEventListener('click', saveFile);
