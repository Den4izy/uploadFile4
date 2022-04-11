let fileName;
let fileSt;

function uploadFile(event) {
    let target = event.target || event.currentTarget;
    let file = target.files[0];
    fileSt = file;
    console.log(file);
    fileName = file.name;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploads/' + file.name, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.onreadystatechange = function () {
        event = null;
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.querySelector('#image').style.backgroundImage = 'url(../image/' + fileName + ')';
            } else {
                console.log('error');
            }
        }
    }
    xhr.send(file);
    event.target.value = 'uuuu';
    document.querySelector('#subId').disabled = false;
}

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
    document.querySelector('#subId').disabled = true;

}

document.querySelector('#f').addEventListener('change', uploadFile);
document.querySelector('#subId').addEventListener('click', saveFile);
