import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const port=Number(process.argv[2]||8766);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};

http.createServer((request,response)=>{
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    let target=path.resolve(root,'.'+pathname);
    if(!target.startsWith(root+path.sep)&&target!==root)throw Error('Forbidden');
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target)){response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});response.end('404');return}
    response.writeHead(200,{'Content-Type':types[path.extname(target).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(target).pipe(response);
  }catch(error){response.writeHead(400,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});response.end(error.message)}
}).listen(port,'127.0.0.1',()=>console.log(`쓸모칸 미리보기: http://127.0.0.1:${port}`));

