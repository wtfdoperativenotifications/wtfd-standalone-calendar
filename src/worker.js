const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store',...headers}});
export default {async fetch(req,env){
 const url=new URL(req.url),path=url.pathname;
 if(path==='/')return Response.redirect(url.origin+'/calendar',302);
 if(path==='/admin')return env.ASSETS.fetch(new Request(url.origin+'/admin.html'));
 if(path==='/calendar')return env.ASSETS.fetch(new Request(url.origin+'/calendar.html'));
 if(path==='/api/events'&&req.method==='GET'){
  const data=await env.DB.prepare('SELECT * FROM events ORDER BY date ASC,id ASC').all();return json(data.results||[]);
 }
 if(path.startsWith('/api/events')&&['POST','PUT','DELETE'].includes(req.method)){
  // Editing is intentionally public; no authentication required.
  const id=Number(path.split('/')[3]);if(req.method==='DELETE'){if(!Number.isSafeInteger(id)||id<1)return json({error:'Invalid ID'},400);await env.DB.prepare('DELETE FROM events WHERE id=?').bind(id).run();return json({ok:true});}
  const body=await req.json().catch(()=>({}));const {title,date,description='',category='General',color='#1684bb'}=body;
  if(typeof title!=='string'||!title.trim()||title.length>180||typeof date!=='string'||! /^\d{4}-\d{2}-\d{2}$/.test(date)||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date||typeof description!=='string'||description.length>5000||typeof category!=='string'||category.length>80||!/^#[0-9a-fA-F]{6}$/.test(color))return json({error:'Invalid event fields'},400);
  if(req.method==='POST'){const r=await env.DB.prepare('INSERT INTO events(title,date,description,category,color) VALUES(?,?,?,?,?)').bind(title.trim(),date,description,category,color).run();return json({ok:true,id:r.meta.last_row_id});}
  if(!Number.isSafeInteger(id)||id<1)return json({error:'Invalid ID'},400);
  await env.DB.prepare('UPDATE events SET title=?,date=?,description=?,category=?,color=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(title.trim(),date,description,category,color,id).run();return json({ok:true});
 }
 if(path.startsWith('/api/'))return json({error:'Not found'},404);
 return env.ASSETS.fetch(req);
}};
