const http = require('http');
const fs = require('fs');
const htmlFile=fs.readFileSync("Public/todo.html","UTF-8");
const cssFile = fs.readFileSync("Public/style.css","utf-8");
const jsFile = fs.readFileSync("Public/script.js","utf-8");
const server = http.createServer((req,res)=>{
    //Routing
    if(req.method==="GET")
    {
    if(req.url=='/')
        {
        res.write(htmlFile);
        res.end();
        }
    else if(req.url=='/style.css')
        {
        res.setHeader("Content-Type","text/css");
        res.end(cssFile);
        }
    else if(req.url=='/script.js')
    {
      res.writeHead(200,{"Content-Type":"application/json"});// we are fetching data from json file
      res.end(jsFile);
    }
    else if(req.url=='/todo')
    {
       // console.log("hello");
        readTask((tasks)=>{
            //console.log(tasks);
            res.setHeader("content-type","application/json");
            res.write(JSON.stringify(tasks));
            res.end();
        });
    }
    else
    {
        //Setting up status code for error page and changing the content type
        res.writeHead(404,{"Content-Type":"text/html"});
        res.end("<h1>Error 404, Page not Found</h1>");
    }
   }
   else if(req.method==="POST")
   {
        if(req.url=='/todo')
        {
            readJSONBody(req,(data)=>{
               // console.log("callback");
                //console.log(data);
                WriteTasks(JSON.stringify(data),(err)=>{
                        console.log("No error:"+err);
                        res.end();
                });
            })
        }
    res.end();
   }
});

server.listen(8000,(err)=>{console.log('listening to port no 8000')});

function readJSONBody(request,callback)
{
    let body;
    request.on('data',(chunk)=>{
       // console.log(JSON.parse(chunk));
       body=chunk;
    });
    request.on('end',()=>{
        let data = JSON.parse(body);
            callback(data);
    });
}

function WriteTasks(data,callback)
{
    fs.writeFile("data.txt",data,(err)=>{callback(err);})
}

function readTask(callback)
{
    fs.readFile("data.txt","utf-8",(err,data)=>{
            if(err)
            {
                console.log("Error");
            }
            else
            {
                data= data && JSON.parse(data);
                callback(data || []);
            }
    })
}