import fs from 'node:fs';import path from 'node:path';
import {coreSlugs,insights} from './content-quality.mjs';
const root=path.resolve(import.meta.dirname,'..');
const skip=new Set(['.git','scripts','content-bot','node_modules']);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(skip.has(e.name))return[];const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]})}
const files=walk(root),htmls=files.filter(f=>f.endsWith('.html')),errors=[];
const titles=new Set(),canonicals=new Set(),indexableCanonicals=new Set();
for(const file of htmls){const h=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);if(file.endsWith('404.html'))continue;
  const title=h.match(/<title>(.*?)<\/title>/)?.[1],desc=h.match(/<meta name="description" content="([^"]+)/)?.[1],canonical=h.match(/<link rel="canonical" href="([^"]+)/)?.[1],robots=h.match(/<meta name="robots" content="([^"]+)/)?.[1]||'';
  if(!title)errors.push(`${rel}: title 없음`);else if(titles.has(title))errors.push(`${rel}: title 중복`);else titles.add(title);
  if(!desc||desc.length<30||desc.length>160)errors.push(`${rel}: description 길이 ${desc?.length||0}`);
  if(!canonical)errors.push(`${rel}: canonical 없음`);else if(canonicals.has(canonical))errors.push(`${rel}: canonical 중복`);else{canonicals.add(canonical);if(!robots.includes('noindex'))indexableCanonicals.add(canonical)}
  if(!/<h1[ >]/.test(h))errors.push(`${rel}: h1 없음`);
  if(!/assets\/favicon\.svg/.test(h))errors.push(`${rel}: favicon 없음`);
  if(!/<meta property="og:image" content="https:\/\/www\.seulmokan\.com\/assets\/og-image\.png">/.test(h))errors.push(`${rel}: OG 이미지 없음`);
  if(/pagead2\.googlesyndication\.com|ADVERTISEMENT|쿠팡 파트너스|coupa\.ng|link\.coupang\.com/i.test(h))errors.push(`${rel}: 심사 보완 중 광고·제휴 흔적`);
  if(/<meta name="keywords"/i.test(h))errors.push(`${rel}: 불필요한 keywords 메타`);
  for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(m[1])}catch{errors.push(`${rel}: JSON-LD 오류`)}}
  for(const m of h.matchAll(/href="([^"]+)"/g)){const href=m[1];if(/^(https?:|mailto:|#)/.test(href)||href.includes('{'))continue;const clean=href.split('#')[0].split('?')[0];if(!clean)continue;const target=path.resolve(path.dirname(file),clean),candidate=clean.endsWith('/')?path.join(target,'index.html'):target;if(!fs.existsSync(candidate))errors.push(`${rel}: 깨진 링크 ${href}`)}
}
const toolPages=htmls.filter(f=>f.includes(`${path.sep}tools${path.sep}`));
const engine=['tools.js','advanced-tools.js','game-tools.js','expansion-tools.js','social-tools.js','fortune-tools.js','mini-game-tools.js'].map(name=>fs.readFileSync(path.join(root,'assets',name),'utf8')).join('\n');
const paragraphUse=new Map();
for(const file of toolPages){const h=fs.readFileSync(file,'utf8'),slug=h.match(/data-slug="([^"]+)/)?.[1],rel=path.relative(root,file),isCore=coreSlugs.has(slug);if(!slug||!engine.includes(`H['${slug}']`))errors.push(`${rel}: 기능 핸들러 없음`);if(!h.includes('assets/tool-ui.css'))errors.push(`${rel}: 도구 UI CSS 없음`);
  if(isCore){if(!h.includes('data-guide="quality"'))errors.push(`${rel}: 핵심 고유 안내 없음`);if(/noindex/.test(h))errors.push(`${rel}: 핵심 도구 noindex 오류`);if(h.replace(/<[^>]+>/g,'').length<1200)errors.push(`${rel}: 핵심 본문 정보량 부족`);for(const m of h.matchAll(/<p>([^<]{80,})<\/p>/g)){const text=m[1].trim();paragraphUse.set(text,(paragraphUse.get(text)||0)+1)}}
  else{if(!h.includes('data-guide="lab"'))errors.push(`${rel}: 실험실 표기 없음`);if(!/noindex,follow/.test(h))errors.push(`${rel}: 실험실 noindex 없음`)}
}
for(const [text,count] of paragraphUse)if(count>=10&&!text.startsWith('별도 안내가 없는 계산'))errors.push(`핵심 도구 중복 문단 ${count}회: ${text.slice(0,45)}…`);
if(toolPages.length!==65)errors.push(`도구 페이지 수 오류 ${toolPages.length}`);
if(!fs.existsSync(path.join(root,'assets','favicon.svg')))errors.push('favicon 파일 없음');
const og=path.join(root,'assets','og-image.png');if(!fs.existsSync(og)||fs.statSync(og).size<5000)errors.push('OG 이미지 파일 없음 또는 비정상');
if(!fs.existsSync(path.join(root,'lab','index.html')))errors.push('실험실 인덱스 없음');
for(const slug of Object.keys(insights))if(!fs.existsSync(path.join(root,'insights',slug,'index.html')))errors.push(`가이드 누락 ${slug}`);
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(sitemapUrls.length!==indexableCanonicals.size)errors.push(`sitemap URL ${sitemapUrls.length}개 (색인 가능 canonical ${indexableCanonicals.size}개와 불일치)`);
for(const canonical of indexableCanonicals)if(!sitemapUrls.includes(canonical))errors.push(`sitemap 누락 ${canonical}`);
for(const url of sitemapUrls)if(!indexableCanonicals.has(url))errors.push(`sitemap에 noindex/비정상 URL 포함 ${url}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(JSON.stringify({htmlPages:htmls.length,toolPages:toolPages.length,coreTools:coreSlugs.size,labTools:toolPages.length-coreSlugs.size,guides:Object.keys(insights).length,uniqueTitles:titles.size,sitemapUrls:sitemapUrls.length,brokenInternalLinks:0,adOrAffiliateTraces:0,duplicateCoreParagraphs:0,jsonLd:'valid'}));
