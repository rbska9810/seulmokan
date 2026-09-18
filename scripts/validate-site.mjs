import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const skip=new Set(['.git','scripts','content-bot','node_modules']);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(skip.has(e.name))return[];const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]})}
const files=walk(root),htmls=files.filter(f=>f.endsWith('.html')),errors=[];
const titles=new Set(),canonicals=new Set();
for(const file of htmls){const h=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);if(file.endsWith('404.html'))continue;
  const title=h.match(/<title>(.*?)<\/title>/)?.[1],desc=h.match(/<meta name="description" content="([^"]+)/)?.[1],canonical=h.match(/<link rel="canonical" href="([^"]+)/)?.[1];
  if(!title)errors.push(`${rel}: title 없음`);else if(titles.has(title))errors.push(`${rel}: title 중복`);else titles.add(title);
  if(!desc||desc.length<30)errors.push(`${rel}: description 부족`);
  if(!canonical)errors.push(`${rel}: canonical 없음`);else if(canonicals.has(canonical))errors.push(`${rel}: canonical 중복`);else canonicals.add(canonical);
  if(!/<h1[ >]/.test(h))errors.push(`${rel}: h1 없음`);
  if(!/assets\/favicon\.svg/.test(h))errors.push(`${rel}: favicon 없음`);
  if(!/<meta property="og:image" content="https:\/\/www\.seulmokan\.com\/assets\/og-image\.png">/.test(h))errors.push(`${rel}: OG 이미지 없음`);
  for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(m[1])}catch{errors.push(`${rel}: JSON-LD 오류`)}}
  for(const m of h.matchAll(/href="([^"]+)"/g)){const href=m[1];if(/^(https?:|mailto:|#)/.test(href)||href.includes('{'))continue;const clean=href.split('#')[0].split('?')[0];if(!clean)continue;const target=path.resolve(path.dirname(file),clean),candidate=clean.endsWith('/')?path.join(target,'index.html'):target;if(!fs.existsSync(candidate))errors.push(`${rel}: 깨진 링크 ${href}`)}
}
const toolPages=htmls.filter(f=>f.includes(`${path.sep}tools${path.sep}`));const engine=['tools.js','advanced-tools.js','game-tools.js','expansion-tools.js','social-tools.js','fortune-tools.js','mini-game-tools.js'].map(name=>fs.readFileSync(path.join(root,'assets',name),'utf8')).join('\n');
const guideCautions=new Set();
for(const file of toolPages){const h=fs.readFileSync(file,'utf8'),slug=h.match(/data-slug="([^"]+)/)?.[1],rel=path.relative(root,file);if(!slug||!engine.includes(`H['${slug}']`))errors.push(`${rel}: 기능 핸들러 없음`);if(!h.includes('assets/tool-ui.css'))errors.push(`${rel}: 도구 UI CSS 없음`);if(!h.includes('data-guide="complete"'))errors.push(`${rel}: 상세 사용안내 없음`);const caution=h.match(/<h2>사용 전 확인사항<\/h2><p>(.*?)<\/p>/)?.[1];if(!caution)errors.push(`${rel}: 고유 주의사항 없음`);else guideCautions.add(caution);if(h.replace(/<[^>]+>/g,'').length<900)errors.push(`${rel}: 본문 정보량 부족`)}
if(guideCautions.size!==toolPages.length)errors.push(`고유 주의사항 ${guideCautions.size}개 (도구 페이지 ${toolPages.length}개와 불일치)`);
const toolCss=fs.readFileSync(path.join(root,'assets','tool-ui.css'),'utf8');if(toolCss.includes('eyeball'))errors.push('assets/tool-ui.css: 잘못된 CSS 값 발견');
if(!fs.existsSync(path.join(root,'assets','favicon.svg')))errors.push('favicon 파일 없음');
const og=path.join(root,'assets','og-image.png');if(!fs.existsSync(og)||fs.statSync(og).size<5000)errors.push('OG 이미지 파일 없음 또는 비정상');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const expectedUrls=htmls.filter(file=>!file.endsWith('404.html')).length;
if(sitemapUrls.length!==expectedUrls)errors.push(`sitemap URL ${sitemapUrls.length}개 (공개 HTML ${expectedUrls}개와 불일치)`);
for(const canonical of canonicals)if(!sitemapUrls.includes(canonical))errors.push(`sitemap 누락 ${canonical}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(JSON.stringify({htmlPages:htmls.length,toolPages:toolPages.length,uniqueTitles:titles.size,uniqueCanonicals:canonicals.size,sitemapUrls:sitemapUrls.length,brokenInternalLinks:0,missingHandlers:0,jsonLd:'valid'}));
