import urllib.request, concurrent.futures, hashlib, json
from pathlib import Path
src=Path(__file__).resolve().parents[4]
dest=Path('qa/audit-20261020/production')
files=['experience/index.html','experience/game.js','experience/game.css','experience/story.html','experience/app.js','experience/style.css']+['experience/assets/'+p for p in ['cormorant-regular.woff','cormorant-italic.woff','manrope.woff','heart.svg','IMG_5794.jpeg','IMG_5796.jpeg','IMG_5797.jpeg','IMG_5798.jpeg','IMG_5799.jpeg','IMG_5800.jpeg','adventure-cover.webp','world-roller.webp','world-sweet.webp','world-winter.webp']]
base='https://ryaax93.github.io/Mariam/'
def get(rel):
 url=base+rel
 if rel=='experience/index.html':url=base+'experience/?v=adventure-20261020'
 elif rel in ['experience/game.js','experience/game.css']:url+='?v=adventure-1'
 with urllib.request.urlopen(url,timeout=45) as r:data=r.read();status=r.status
 target=dest/rel;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
 return {'path':rel,'status':status,'bytes':len(data),'match':hashlib.sha256(data).digest()==hashlib.sha256((src/rel).read_bytes()).digest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:results=list(ex.map(get,files))
with urllib.request.urlopen(base+'?v=preserved-adventure-20261020',timeout=45) as r:root=r.read()
root_match=root==(src/'index.html').read_bytes()
(dest/'index.html').write_bytes(root)
report={'url':base+'experience/?v=adventure-20261020','files':results,'original_root_identical':root_match}
Path('qa/audit-20261020/production-hashes.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
assert root_match and all(x['status']==200 and x['match'] for x in results)
