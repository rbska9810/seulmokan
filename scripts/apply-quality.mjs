import fs from 'node:fs';
import path from 'node:path';
import {coreSlugs,qualityArticle,insights} from './content-quality.mjs';

const cleanHead=html=>html
  .replace(/<meta name="keywords"[^>]*>/gi,'')
  .replace(/<script[^>]+pagead2\.googlesyndication\.com[\s\S]*?<\/script>/gi,'')
  .replace(/<aside class="ad"[^>]*>[\s\S]*?<\/aside>/gi,'')
  .replace(/<div class="ad"[^>]*>[\s\S]*?<\/div>/gi,'')
  .replace(/<aside class="side">\s*<\/aside>/gi,'')
  .replace(/<div class="layout">/g,'<div class="layout quality-layout">');

const doc=(title,description,url,depth,body,schemaType='Article')=>{
  const prefix='../'.repeat(depth);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 쓸모칸</title><meta name="description" content="${description}"><meta name="google-adsense-account" content="ca-pub-9462573435168414"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="article"><meta property="og:site_name" content="쓸모칸"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://www.seulmokan.com/assets/og-image.png"><link rel="stylesheet" href="${prefix}assets/site.css?v=20260920-1"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':schemaType,headline:title,description,url,author:{'@type':'Organization',name:'쓸모칸'},publisher:{'@type':'Organization',name:'쓸모칸',url:'https://www.seulmokan.com/'},datePublished:'2026-09-20',dateModified:'2026-09-20',inLanguage:'ko-KR'})}</script></head><body><header><nav class="nav"><a class="brand" href="${prefix}"><span class="mark">ㅆ</span>쓸모칸</a><div class="navlinks"><a href="${prefix}#tools">핵심 도구</a><a href="${prefix}insights/">활용 가이드</a><a href="${prefix}about/">소개</a></div><button class="theme" data-theme aria-label="다크 모드">☾</button></nav></header>${body}<footer><div class="foot"><b>쓸모 있는 도구를 한 칸에</b><span><a href="${prefix}guide/">사용가이드</a><a href="${prefix}about/">소개</a><a href="${prefix}privacy/">개인정보처리방침</a><a href="${prefix}terms/">이용약관</a><a href="${prefix}contact/">문의</a></span><span>© <i data-year></i> SEULMOKAN</span></div></footer><script src="${prefix}assets/common.js?v=20260920-1"></script></body></html>`;
};

export function applyQuality({root,base,tools,infoPages,notes,guideDetails,esc}){
  const bySlug=new Map(tools.map(tool=>[tool[0],tool]));
  for(const [slug,title,category,description] of tools){
    const file=path.join(root,'tools',slug,'index.html');
    let html=cleanHead(fs.readFileSync(file,'utf8'));
    const isCore=coreSlugs.has(slug);
    html=html.replace(/<meta name="robots" content="[^"]*">/,`<meta name="robots" content="${isCore?'index,follow,max-image-preview:large':'noindex,follow'}">`);
    const metaDescription=description.length<30?`${description} 입력값과 결과를 한 화면에서 확인합니다.`:description;
    html=html.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(metaDescription)}">`);
    const guide=guideDetails[slug];
    const article=isCore
      ? `<article class="content-card tool-guide quality-article" data-guide="quality"><div class="editorial"><b>쓸모칸 편집팀 검토</b><span>최종 확인 2026-09-20</span></div><h2>${esc(title)} 사용 순서</h2><ol><li><b>준비:</b> ${esc(guide[0])}</li><li><b>실행:</b> 입력 형식과 선택 옵션을 확인한 뒤 실행 버튼을 누릅니다. 오류가 있으면 해당 항목 옆 안내부터 수정합니다.</li><li><b>확인:</b> ${esc(guide[1])}</li></ol>${qualityArticle(slug)}${notes[slug]||''}<h2>개인정보와 한계</h2><p>별도 안내가 없는 계산·파일 도구는 현재 브라우저에서 처리하며 입력 내용을 쓸모칸 서버에 저장하지 않습니다. 결과가 계약, 세금, 급여 또는 법률 판단에 영향을 준다면 최신 공식 자료와 담당 기관의 결과를 함께 확인하세요.</p></article>`
      : `<article class="content-card tool-guide lab-article" data-guide="lab"><div class="lab-notice"><b>실험실 기능</b><p>이 페이지는 기능을 유지하되 검색 색인과 광고 대상에서 제외했습니다. 사용 의견을 반영해 설명과 검증 기준을 보강한 뒤 핵심 도구로 전환합니다.</p></div><h2>${esc(title)} 사용 방법</h2><ol><li>${esc(guide[0])}</li><li>${esc(guide[1])}</li></ol><h2>사용 전 확인</h2><p>${esc(guide[2])}</p>${notes[slug]||''}</article>`;
    html=html.replace(/<article class="content-card tool-guide"[\s\S]*?<\/article>/,article);
    const related=tools.filter(t=>t[0]!==slug&&coreSlugs.has(t[0])&&(t[2]===category||isCore)).slice(0,3);
    html=html.replace(/<div class="related">[\s\S]*?<\/div>/,`<div class="related">${related.map(t=>`<a href="../${t[0]}/">${esc(t[1])} →</a>`).join('')}</div>`);
    fs.writeFileSync(file,html);
  }

  const guideLinks={
    'severance-pay-basics':'severance-pay-calculator','salary-net-pay-checklist':'salary-calculator',
    'image-format-guide':'image-compressor','background-removal-tips':'background-remover',
    'spreadsheet-import-guide':'list-to-excel','vat-supply-price-guide':'vat-calculator',
    'document-draft-safety':'employment-contract-maker','browser-processing-privacy':'image-cropper'
  };
  const insightCards=Object.entries(insights).map(([slug,item])=>`<a class="quality-card" href="./${slug}/"><span>활용 가이드</span><h2>${item.title}</h2><p>${item.description}</p><b>읽어보기 →</b></a>`).join('');
  const insightIndex=doc('쓸모칸 활용 가이드','계산·이미지·문서 도구를 정확하고 안전하게 쓰기 위한 쓸모칸의 원문 가이드입니다.',base+'insights/',1,`<main class="wrap"><div class="crumb"><a href="../">홈</a> / 활용 가이드</div><section class="hero"><div class="eyebrow">ORIGINAL GUIDES</div><h1>도구를 제대로 쓰는 방법</h1><p class="lead">버튼 사용법을 넘어 결과가 달라지는 이유, 입력 자료 준비법과 완료 전 확인사항을 직접 정리했습니다.</p></section><section class="quality-grid">${insightCards}</section></main>`,'CollectionPage');
  fs.mkdirSync(path.join(root,'insights'),{recursive:true});
  fs.writeFileSync(path.join(root,'insights','index.html'),insightIndex);
  for(const [slug,item] of Object.entries(insights)){
    const related=bySlug.get(guideLinks[slug]);
    const body=`<main class="wrap"><div class="crumb"><a href="../../">홈</a> / <a href="../">활용 가이드</a> / ${item.title}</div><article class="content-card insight-article"><div class="eyebrow">쓸모칸 활용 가이드</div><h1>${item.title}</h1><p class="lead">${item.description}</p><div class="editorial"><b>작성·검토: 쓸모칸 운영자</b><span>게시·수정 2026-09-20</span></div>${item.body}<section class="guide-next"><h2>직접 확인해 보기</h2><p>설명을 이해했다면 입력 자료를 준비해 관련 도구에서 결과를 비교해 보세요.</p><a class="btn" href="../../tools/${related[0]}/">${related[1]} 열기</a></section></article></main>`;
    const dir=path.join(root,'insights',slug);fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,'index.html'),doc(item.title,item.description,base+'insights/'+slug+'/',2,body));
  }

  const labTools=tools.filter(t=>!coreSlugs.has(t[0]));
  const labBody=`<main class="wrap"><div class="crumb"><a href="../">홈</a> / 실험실</div><section class="hero"><div class="eyebrow">LAB</div><h1>쓸모칸 실험실</h1><p class="lead">재미 기능과 보완 중인 도구를 모았습니다. 모든 기능은 계속 사용할 수 있지만 검색 색인과 광고에서는 제외됩니다.</p></section><section class="tool-directory">${labTools.map(([slug,title,cat,desc])=>`<a class="quality-card" href="../tools/${slug}/"><span>${cat}</span><h2>${title}</h2><p>${desc}</p></a>`).join('')}</section></main>`;
  let labHtml=doc('쓸모칸 실험실','보완 중인 유틸리티와 미니게임을 모은 쓸모칸 실험실입니다.',base+'lab/',1,labBody,'CollectionPage').replace('index,follow,max-image-preview:large','noindex,follow');
  fs.mkdirSync(path.join(root,'lab'),{recursive:true});fs.writeFileSync(path.join(root,'lab','index.html'),labHtml);

  const categories=[...new Set(tools.filter(t=>coreSlugs.has(t[0])).map(t=>t[2]))];
  const directory=categories.map(cat=>`<section class="directory-section"><div class="section-head"><h2>${cat}</h2><span>${tools.filter(t=>coreSlugs.has(t[0])&&t[2]===cat).length}개</span></div><div class="tool-directory">${tools.filter(t=>coreSlugs.has(t[0])&&t[2]===cat).map(([slug,title,,desc])=>`<a class="quality-card tool-result" data-search="${title} ${desc}" href="./tools/${slug}/"><h3>${title}</h3><p>${desc}</p><b>도구 열기 →</b></a>`).join('')}</div></section>`).join('');
  const homeBody=`<main><section class="home-hero"><div class="wrap"><div class="eyebrow">SEULMOKAN</div><h1>필요한 작업을<br>브라우저에서 바로</h1><p>설치와 로그인 없이 쓰는 계산·이미지·문서 도구. 입력 방식, 실제 예시와 결과의 한계까지 함께 설명합니다.</p><div class="home-actions"><a class="btn" href="#tools">핵심 도구 보기</a><a class="btn secondary" href="./insights/">활용 가이드 읽기</a></div></div></section><section class="wrap trust-strip"><div><b>${coreSlugs.size}</b><span>검토된 핵심 도구</span></div><div><b>${Object.keys(insights).length}</b><span>원문 활용 가이드</span></div><div><b>브라우저</b><span>우선 처리 원칙</span></div></section><section class="wrap" id="tools"><div class="section-head"><div><span class="eyebrow">CORE TOOLS</span><h2>검토를 마친 핵심 도구</h2></div><a href="./lab/">실험실 기능 보기 →</a></div><label class="directory-search">도구 검색<input id="tool-search" type="search" placeholder="예: 퇴직금, 이미지, 계약서"></label>${directory}</section><section class="wrap home-guides"><div class="section-head"><div><span class="eyebrow">GUIDES</span><h2>결과를 제대로 쓰는 법</h2></div><a href="./insights/">가이드 전체 보기 →</a></div><div class="quality-grid">${Object.entries(insights).slice(0,4).map(([slug,item])=>`<a class="quality-card" href="./insights/${slug}/"><span>활용 가이드</span><h3>${item.title}</h3><p>${item.description}</p></a>`).join('')}</div></section><section class="wrap editorial-policy"><h2>쓸모칸의 공개 기준</h2><div class="quality-grid"><div><b>기능 검증</b><p>정상 입력·경계값·잘못된 입력을 확인하고 실제 작동하는 도구만 핵심 목록에 둡니다.</p></div><div><b>고유한 설명</b><p>도구마다 준비 자료, 실제 예시, 결과 해석과 한계를 별도로 작성합니다.</p></div><div><b>광고보다 사용성</b><p>현재 심사 보완 기간에는 광고와 제휴 배너를 표시하지 않습니다.</p></div></div></section></main><script>document.getElementById('tool-search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.tool-result').forEach(x=>x.hidden=!x.dataset.search.toLowerCase().includes(q));});</script>`;
  fs.writeFileSync(path.join(root,'index.html'),doc('쓸모칸 — 무료 온라인 도구','계산, 이미지, 문서 작업을 설치 없이 처리하고 입력 예시와 결과 해석까지 확인하는 무료 온라인 도구 모음입니다.',base,0,homeBody,'WebSite').replace('<meta property="og:type" content="article">','<meta property="og:type" content="website">'));

  const privacy=path.join(root,'privacy','index.html');
  let privacyHtml=cleanHead(fs.readFileSync(privacy,'utf8'));
  privacyHtml=privacyHtml.replace(/<article class="content-card">[\s\S]*?<\/article>/,`<article class="content-card quality-article"><p><b>시행·최종 수정일: 2026년 9월 20일</b></p><h2>입력 데이터와 파일</h2><p>일반 계산·텍스트·이미지 도구는 입력 내용을 현재 브라우저에서 처리하며 쓸모칸 서버에 저장하지 않습니다. 공인 IP 확인과 QR 생성처럼 외부 요청이 필요한 기능은 해당 실행 화면에서 전송 대상과 목적을 따로 안내합니다.</p><h2>호스팅과 외부 라이브러리</h2><p>사이트는 GitHub Pages에서 제공됩니다. 글꼴, 문서 변환 라이브러리와 AI 모델을 jsDelivr 등 CDN에서 내려받을 때 해당 사업자가 IP 주소, 브라우저 정보와 요청 시각 같은 기술 로그를 처리할 수 있습니다.</p><h2>광고, 쿠키와 접속 정보</h2><p>현재는 사이트 소유 확인용 AdSense 메타태그와 ads.txt만 유지하고 광고 스크립트·광고 슬롯·제휴 배너는 표시하지 않습니다. 향후 광고를 게재하면 Google과 광고 파트너가 쿠키, 웹 비콘, IP 주소 또는 유사 기술을 이용해 광고 제공과 성과 측정을 할 수 있으며 필요한 동의·거부 수단을 제공합니다. Google의 처리 방식은 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Google 파트너 사이트 정책</a>에서 확인할 수 있습니다.</p><h2>이메일 문의</h2><p>contact@seulmokan.com으로 보낸 발신 주소, 제목과 본문은 Cloudflare Email Routing을 거쳐 운영자 메일함으로 전달되며 문의 확인과 답변 목적으로 보관될 수 있습니다. 주민등록번호, 계좌·카드정보와 같은 민감정보는 보내지 마세요.</p><h2>열람·삭제 요청</h2><p>개인정보 관련 문의와 정정·삭제 요청은 contact@seulmokan.com으로 접수할 수 있습니다. 외부 서비스가 처리한 정보는 해당 서비스의 정책과 절차가 적용됩니다.</p></article>`);
  fs.writeFileSync(privacy,privacyHtml);

  const about=path.join(root,'about','index.html');
  let aboutHtml=cleanHead(fs.readFileSync(about,'utf8'));
  aboutHtml=aboutHtml.replace(/<article class="content-card">[\s\S]*?<\/article>/,`<article class="content-card quality-article"><h2>누가 운영하나요?</h2><p>쓸모칸은 대한민국에서 쓸모칸 운영자가 직접 기획·개발·검토하는 무료 온라인 유틸리티 서비스입니다. 문의와 오류 제보는 contact@seulmokan.com으로 받습니다.</p><h2>무엇을 해결하나요?</h2><p>설치가 번거로운 작은 계산과 변환, 문서 초안 작업을 브라우저에서 빠르게 끝내도록 돕습니다. 단순 입력창만 제공하지 않고 필요한 자료, 실제 예시, 결과 해석과 한계를 각 도구에 함께 기록합니다.</p><h2>공개와 검토 기준</h2><ul><li>정상값·경계값·오류 입력을 확인한 기능만 핵심 도구에 공개합니다.</li><li>보완 중인 기능은 실험실로 분리하고 검색 색인과 광고에서 제외합니다.</li><li>법률·급여·세무 결과는 참고용임을 밝히고 확인 가능한 공식 자료를 연결합니다.</li><li>오류 제보를 확인하면 기능, 안내문과 최종 수정일을 함께 갱신합니다.</li></ul><h2>수익화 원칙</h2><p>현재 심사 보완 기간에는 광고와 제휴 배너를 노출하지 않습니다. 향후 광고가 적용되더라도 도구 실행과 본문 읽기를 방해하지 않고, 광고·제휴 여부를 명확히 표시합니다.</p><p><b>최종 수정일: 2026년 9월 20일</b></p></article>`);
  fs.writeFileSync(about,aboutHtml);

  for(const slug of Object.keys(infoPages)){
    const file=path.join(root,slug,'index.html');
    fs.writeFileSync(file,cleanHead(fs.readFileSync(file,'utf8')).replace(/최종 수정일: 2026년 9월 13일/g,'최종 수정일: 2026년 9월 20일'));
  }
  const urls=[base,...Object.keys(infoPages).map(x=>base+x+'/'),base+'insights/',...Object.keys(insights).map(x=>base+'insights/'+x+'/'),...tools.filter(t=>coreSlugs.has(t[0])).map(t=>base+'tools/'+t[0]+'/')];
  fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${u}</loc><lastmod>2026-09-20</lastmod></url>`).join('\n')+'\n</urlset>\n');

  const htmlFiles=[];const walk=dir=>{for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(item.name))continue;const full=path.join(dir,item.name);if(item.isDirectory())walk(full);else if(item.name.endsWith('.html'))htmlFiles.push(full);}};walk(root);
  for(const file of htmlFiles){let html=cleanHead(fs.readFileSync(file,'utf8'));fs.writeFileSync(file,html);}
  console.log(`quality pass: ${coreSlugs.size} core tools, ${labTools.length} lab tools, ${Object.keys(insights).length} guides, ${urls.length} indexed URLs`);
}
