const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

let oldPathG;
let newPathG;

http.createServer((req, res)=>{

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
    console.log('Server work on: ' + 'http://localhost:3000/');
});

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

function fileSave(url, contentType, res, req) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if(err){
            console.log('не вдалося розпарсить прийом запиту');
            res.end();
        }
        else{
            let oldpath = files['file']['filepath'];
            let ar = url.split('/');
            let newpath = path.join(__dirname + '/static/image/', ar[2]);
            oldPathG = newpath;
            newPathG = path.join(__dirname + '/uploads', ar[2]);
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        }
    });
}

function save(){
    fs.rename(oldPathG, newPathG, function (err) {
        if (err) throw err;
    });
}

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
