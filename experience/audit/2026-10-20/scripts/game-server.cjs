const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
module.exports=async function(root=path.resolve(__dirname,'../../../..')){
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff':'font/woff','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
 const server=http.createServer((req,res)=>{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p.endsWith('/'))p+='index.html';const file=path.join(root,p);if(!file.startsWith(root)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));return {url:'http://127.0.0.1:'+server.address().port+'/experience/',close:()=>new Promise(r=>server.close(r))};
};
