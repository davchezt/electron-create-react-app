# Execute Bash / Command
```js
var child = require('child_process').execFile;
var executablePath = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";

child(executablePath, function(err, data) {
    if(err) {
       console.error(err);
       return;
    }
 
    console.log(data.toString());
});
```
```js
var child = require('child_process').execFile;
var executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
var parameters = ["--incognito"];

child(executablePath, parameters, function(err, data) {
     console.log(err)
     console.log(data.toString());
});
```
# File System
```js
var fs = require('fs');
```
```js
// Create / Open Write then Close
import fs from 'fs';
import path from 'path';

console.log(path.join(process.cwd(), "public"));
fs.open('public/file.txt', 'w', (err, fd) => {
    if (err) throw err;
    fs.write(fd, "Test", (err) => {
        if (err) throw err;
    });
    fs.close(fd, (err) => {
        if (err) throw err;
    });
});
```
```js
// Read File
fs.readFile('temp.txt', 'utf-8' ,function(err, buf) {
  console.log(buf.toString());
});
```
```js
// Write File
var data = "New File Contents";

fs.writeFile('temp.txt', data, function(err, data){
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
```
```js
// Create File using appendFile()
fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});
```
```js
// Create using open
fs.open('mynewfile2.txt', 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved!');
});
```
```js
// Write
fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});
```
```js
// Update File
fs.appendFile('mynewfile1.txt', ' This is my text.', function (err) {
  if (err) throw err;
  console.log('Updated!');
});
```
```js
// Replace Content of newfile3.txt
fs.writeFile('mynewfile3.txt', 'This is my text', function (err) {
  if (err) throw err;
  console.log('Replaced!');
});
```
```js
// Delete File
fs.unlink('mynewfile2.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});
```
```js
// Rename file
fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});
```
# AJAX
```js
// Post
fetch('http://192.168.1.8/v1/token', {
    method: 'POST',
    headers: new Headers({
        'Accept': 'application/json', // 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.clientToken
    }),
    body: JSON.stringify({
        'user_id': '1',
        'username': 'davchezt',
        'full_name': "Leonardo DaVchezt"
    })
})
// response.text() for debuging
.then((response) => response.json()) // response.text()
.then((responseJson) => {
    console.log(responseJson);
})
.catch((error) => {
    console.log(error);
});
```
```js
// Upload
const apiUrl = "http://192.168.1.8/v1/token";
const data = {
    uid: 1,
    message: "Testing",
    image: this.state.clientImage
}
let formData  = new FormData();
for(let name in data) {
    formData.append(name, data[name]);
}
fetch(apiUrl, {
    method: 'POST',
    headers: new Headers({
        'Accept': 'application/json', // 'application/json, text/plain, */*',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.state.clientToken
    }),
    body: formData
})
// response.text() for debuging
.then((response) => response.json())
.then((responseJson) => {
    console.log(responseJson);
})
.catch((error) => {
    console.log(error);
});
```