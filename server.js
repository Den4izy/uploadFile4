const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

let oldPathG;
let newPathG;

//створюємо сервер
http.createServer((req, res)=>{
    //роутинг
    if(req.url === '/'){
        sendRes('index.html', 'text/html', res);
    }
    else if(/\/uploads\/[^\/]+$/.test(req.url) && req.method === 'POST') {
        fileSave(req.url, getContentFile(req.url), res, req);

    }
    else if(/\/save\/[^\/]+$/.test(req.url) && req.method === 'POST') {
        save();
        res.end();
    }
    else{
        sendRes(req.url, getContentFile(req.url),res)
    }
}).listen(3000, ()=>{
    //код при запуску сервера
    console.log('Server work on: ' + 'http://localhost:3000/');
});

//ф-я при стартовій сторінці просто считуємо файли коду та відправляєм результат на сторінку
function sendRes(url, contentType, res){
    let file = path.join(__dirname + '/static', url);
    fs.readFile(file,(err, data)=>{
        if(err){
            res.end();
        }
        else{
            res.writeHead(200, {'content-type': contentType});
            res.end(data);
        }
    });
}
// ф-я збереження файлу в буфер
function fileSave(url, contentType, res, req) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if(err){
            console.log('не вдалося розпарсить прийом запиту');
            res.end();
        }
        else{
            //присвоюємо шлях файлу який ще не завантажений на сервер(поточний шлях)
            //перемінна files це асоціативний масив з данними файлу
            let oldpath = files['file']['filepath'];
            //парсим url щоб витягти назву файлу
            let ar = url.split('/');
            //вказуємо новий шлях куди хочемо зберегти файл
            let newpath = path.join(__dirname + '/static/image_Buffer/', ar[2]);
            //вказуємо шляхи в глобальні перемінні, щоб передати в іншу ф-ю
            oldPathG = newpath;
            newPathG = path.join(__dirname + '/uploads', ar[2]);
            //переміщаємо наш файл на сервер в папку яку вказали
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        }
    });
    //видаляємо минулі файли( поточний файл який був завантажений щойно не видалиться, так як
    //ф-я працює асинхронно, ф-я delet спрацює до того як завантажиться файл
    delet();
}

//ф-я зберігає файл в папку завантажень з буфера
function save(){
    fs.rename(oldPathG, newPathG, function (err) {
        if (err) throw err;
    });
}

//ф-я чистить папку буфера
function delet(){
    let directory = __dirname + '/static/image_Buffer';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

//ф-я визначає тип переданого файлу
function getContentFile(url) {
    switch (path.extname(url)) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.json':
            return 'application/json';
        case '.ico':
            return 'application/ico';
        default:
            return 'application/octet-stream';
    }
}
