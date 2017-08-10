var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(function(req,res,next){
	res.set('Content-Type','application/json');
	next();
});

//1、获取notes
app.get('/notes',function(req,res){
	//打开现有的Notes文件
	fs.readFile(__dirname + '/data/notes.json', 'utf8', function(err, data){
		//如果我们发现一个错误，记录它并返回
		if(err){
			res.status(500).end();
			return console.log(err);
		}
		res.status(200).send(data);
	});
});

//2、修改notes
app.put('/notes/:id',function(req,res){
	//打开现有的Notes文件
	fs.readFile(__dirname + '/data/notes.json', 'utf8', function(err, data){
		//如果我们发现一个错误，记录它并返回
		if(err){
			res.status(500).end();
			return console.log(err);
		}
		//试图解析JSON或返回
		try{
			data = JSON.parse(data);
		}catch(e){
			res.status(500).end();
			return console.log(e);
		}
		//将体项添加到Notes数组中
		data.forEach(function(note,index){
			if(note.id == req.params.id){
				data[index] = req.body;
			}
		});
	});
});

//3.新建 notes
app.post('/notes', function (req, res) {
  // Open the existing notes file打开现有Notes文件
  fs.readFile(__dirname + '/data/notes.json', 'utf8', function (err, data) {

    // If we get an error, log it and return如果我们发现了一个错误，记录它并返回
    if (err) {
      res.status(500).end();
      return console.log(err);
    }

    // Try to parse the JSON or return试图解析JSON或返回
    try {
      data = JSON.parse(data);
    } catch (e) {
      res.status(500).end();
      return console.log(e);
    }

    // Add body item to notes array将体项添加到Notes数组中
    data.push(req.body);

    // Write file back to server
    fs.writeFile(__dirname + '/data/notes.json', JSON.stringify(data), function (err) {

      // If we get an error, log it and return如果我们发现了一个错误，记录它并返回
      if (err) {
        res.status(500).end();
        return console.log(err);
      }

      // No errors, everything is done so return new data没有错误，一切都完成了，所以返回新数据
      res.status(201).send(data);
    });
  });
});

//4.删除 notes
app.delete('/notes/:id', function (req, res) {
  // Open the existing notes file
  fs.readFile(__dirname + '/data/notes.json', 'utf8', function (err, data) {

    // If we get an error, log it and return
    if (err) {
      res.status(500).end();
      return console.log(err);
    }

    // Try to parse the JSON or return
    try {
      data = JSON.parse(data);
    } catch (e) {
      res.status(500).end();
      return console.log(e);
    }

    // Add body item to notes array
    var index = -1;
    data.forEach(function (note, i) {
      if (note.id == req.params.id) {
        index = i;
      }
    });

    // If we found an item by that id, remove it
    if (index >= 0) {
      data.splice(index, 1);
    }

    // Write file back to server
    fs.writeFile(__dirname + '/data/notes.json', JSON.stringify(data), function (err) {

      // If we get an error, log it and return
      if (err) {
        res.status(500).end();
        return console.log(err);
      }

      // No errors, everything is done so return
      res.status(204).end();
    });
  });
});


app.listen(3300,function(){
	console.log('Server started. Open http://localhost:3300 in your browser.');
});