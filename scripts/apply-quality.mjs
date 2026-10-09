import fs from 'node:fs';
import path from 'node:path';
import {coreSlugs,qualityArticle,insights} from './content-quality.mjs';
import {extraQuality} from './content-quality-extra.mjs';

const cleanHead=html=>html
  .replace(/<meta name="keywords"[^>]*>/gi,'')
  .replace(/<script[^>]+pagead2\.googlesyndication\.com[\s\S]*?<\/script>/gi,'')
  .replace(/<aside class="ad"[^>]*>[\s\S]*?<\/aside>/gi,'')
  .replace(/<div class="ad"[^>]*>[\s\S]*?<\/div>/gi,'')
  .replace(/<aside class="side">\s*<\/aside>/gi,'')
  .replace(/<div class="layout">/g,'<div class="layout quality-layout">');

const seoOverrides={
  'area-converter':{
    title:'평수 계산기 | 제곱미터(㎡) 평 변환·아파트 면적표',
    description:'제곱미터(㎡)와 평을 양방향으로 바로 변환하세요. 59㎡·74㎡·84㎡ 아파트 공급면적과 전용면적을 구분하는 환산표도 함께 확인할 수 있습니다.'
  },
  'salary-calculator':{
    title:'2026 연봉 실수령액 계산기 | 월급·4대보험 공제',
    description:'2026년 연봉과 비과세액, 부양가족 수를 입력해 월 예상 실수령액과 국민연금·건강보험·고용보험·세금 공제액을 계산합니다.'
  },
  'severance-pay-calculator':{
    title:'퇴직금 계산기 | 입사일·최근 3개월 임금 자동 계산',
    description:'입사일과 퇴사일, 최근 3개월 급여를 입력하면 재직일수와 1일 평균임금, 예상 퇴직금을 자동으로 계산합니다.'
  },
  'text-diff-checker':{
    title:'텍스트 비교 사이트 | 글자·문장 차이 찾기',
    description:'두 텍스트를 붙여 넣으면 줄별 추가·삭제·변경 내용을 표시합니다. 문서, 코드, 문자 내용을 설치 없이 빠르게 비교하세요.'
  },
  'character-byte-counter':{
    title:'글자수·바이트 계산기 | 공백 포함·제외·UTF-8',
    description:'텍스트를 입력하면 공백 포함·제외 글자수, 단어·줄 수와 UTF-8 바이트를 실시간 계산합니다. 자기소개서와 문자 길이 확인에 활용하세요.'
  },
  'lunch-worldcup':{
    title:'점심메뉴 월드컵 | 오늘 뭐 먹지? 32강 음식 추천',
    description:'오늘 뭐 먹을지 고민될 때 한식·중식·일식·분식 등 32가지 음식을 사진으로 비교해 점심 메뉴를 고르는 무료 이상형 월드컵입니다.'
  }
};

const relatedOverrides={
  'area-converter':['percentage-calculator','loan-calculator','date-calculator'],
  'salary-calculator':['wage-converter','severance-pay-calculator','percentage-calculator'],
  'severance-pay-calculator':['salary-calculator','wage-converter','date-calculator'],
  'text-diff-checker':['character-byte-counter','whitespace-remover','duplicate-line-remover'],
  'character-byte-counter':['text-diff-checker','whitespace-remover','case-converter'],
  'lunch-worldcup':['random-wheel','ladder-game','dice-coin']
};

const doc=(title,description,url,depth,body,schemaType='Article')=>{
  const prefix='../'.repeat(depth);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 쓸모칸</title><meta name="description" content="${description}"><meta name="google-adsense-account" content="ca-pub-9462573435168414"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="article"><meta property="og:site_name" content="쓸모칸"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://www.seulmokan.com/assets/og-image.png"><link rel="stylesheet" href="${prefix}assets/site.css?v=20260920-1"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':schemaType,headline:title,description,url,author:{'@type':'Organization',name:'쓸모칸'},publisher:{'@type':'Organization',name:'쓸모칸',url:'https://www.seulmokan.com/'},datePublished:'2026-09-20',dateModified:url=== 'https://www.seulmokan.com/'||url.endsWith('/updates/')?'2026-10-09':'2026-09-20',inLanguage:'ko-KR'})}</script></head><body><header><nav class="nav"><a class="brand" href="${prefix}"><span class="mark">ㅆ</span>쓸모칸</a><div class="navlinks"><a href="${prefix}#tools">핵심 도구</a><a href="${prefix}insights/">활용 가이드</a><a href="${prefix}about/">소개</a></div><button class="theme" data-theme aria-label="다크 모드">☾</button></nav></header>${body}<footer><div class="foot"><b>쓸모 있는 도구를 한 칸에</b><span><a href="${prefix}guide/">사용가이드</a><a href="${prefix}updates/">업데이트</a><a href="${prefix}about/">소개</a><a href="${prefix}privacy/">개인정보처리방침</a><a href="${prefix}terms/">이용약관</a><a href="${prefix}contact/">문의</a></span><span>© <i data-year></i> SEULMOKAN</span></div></footer><script src="${prefix}assets/common.js?v=20260920-1"></script></body></html>`;
};

export function applyQuality({root,base,tools,infoPages,notes,guideDetails,esc}){
  const bySlug=new Map(tools.map(tool=>[tool[0],tool]));
  for(const [slug,title,category,description] of tools){
    const file=path.join(root,'tools',slug,'index.html');
    let html=cleanHead(fs.readFileSync(file,'utf8'));
    const isCore=coreSlugs.has(slug);
    html=html.replace(/<meta name="robots" content="[^"]*">/,`<meta name="robots" content="${isCore?'index,follow,max-image-preview:large':'noindex,follow'}">`);
    const seo=seoOverrides[slug];
    const metaDescription=seo?.description||(description.length<30?`${description} 입력값과 결과를 한 화면에서 확인합니다.`:description);
    if(seo){
      html=html.replace(/<title>[^<]*<\/title>/,`<title>${esc(seo.title)} | 쓸모칸</title>`);
      html=html.replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${esc(seo.title)}">`);
      html=html.replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${esc(seo.description)}">`);
      html=html.replace(/<meta name="twitter:title" content="[^"]*">/,`<meta name="twitter:title" content="${esc(seo.title)}">`);
      html=html.replace(/<meta name="twitter:description" content="[^"]*">/,`<meta name="twitter:description" content="${esc(seo.description)}">`);
    }
    html=html.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(metaDescription)}">`);
    const guide=guideDetails[slug];
    const article=isCore
      ? `<article class="content-card tool-guide quality-article" data-guide="quality"><h2>${esc(title)} 사용 방법</h2><p>${esc(guide[0])}</p><h2>결과에서 확인할 내용</h2><p>${esc(guide[1])}</p>${qualityArticle(slug)}${notes[slug]||''}<h2>사용 전 꼭 확인하세요</h2><p>${esc(guide[2])}</p>${extraQuality[slug]?'<p class="editorial">도구 설명 최종 수정: 2026년 10월 9일</p>':''}</article>`
      : `<article class="content-card tool-guide lab-article" data-guide="lab"><div class="lab-notice"><b>실험실 기능</b><p>이 페이지는 기능을 유지하되 검색 색인과 광고 대상에서 제외했습니다. 사용 의견을 반영해 설명과 검증 기준을 보강한 뒤 핵심 도구로 전환합니다.</p></div><h2>${esc(title)} 사용 방법</h2><ol><li>${esc(guide[0])}</li><li>${esc(guide[1])}</li></ol><h2>사용 전 확인</h2><p>${esc(guide[2])}</p>${notes[slug]||''}</article>`;
    html=html.replace(/<article class="content-card tool-guide"[\s\S]*?<\/article>/,article);
    const sameCategory=tools.filter(t=>t[0]!==slug&&coreSlugs.has(t[0])&&t[2]===category);
    const fallback=tools.filter(t=>t[0]!==slug&&coreSlugs.has(t[0])&&t[2]!==category);
    const related=relatedOverrides[slug]
      ? relatedOverrides[slug].map(id=>bySlug.get(id)).filter(Boolean)
      : [...sameCategory,...fallback].slice(0,3);
    html=html.replace(/<div class="related">[\s\S]*?<\/div>/,`<div class="related">${related.map(t=>`<a href="../${t[0]}/">${esc(t[1])} →</a>`).join('')}</div>`);
    fs.writeFileSync(file,html);
  }

  const guideLinks={
    'interview-answer-framework':'one-minute-introduction-builder',
    'severance-pay-basics':'severance-pay-calculator','salary-net-pay-checklist':'salary-calculator',
    'image-format-guide':'image-compressor','background-removal-tips':'background-remover',
    'spreadsheet-import-guide':'list-to-excel','vat-supply-price-guide':'vat-calculator',
    'document-draft-safety':'employment-contract-maker','browser-processing-privacy':'image-cropper',
    'pyeong-square-meter-table':'area-converter','salary-table-2026':'salary-calculator',
    'character-byte-limits':'character-byte-counter'
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

  const updatesBody=`<main class="wrap"><div class="crumb"><a href="../">홈</a> / 업데이트</div><article class="content-card quality-article"><div class="eyebrow">SITE UPDATES</div><h1>쓸모칸 업데이트 기록</h1><p class="lead">도구의 기능과 설명을 언제, 왜 바꿨는지 공개합니다. 오류를 발견했다면 <a href="../contact/">문의 페이지</a>로 알려주세요.</p><h2>2026년 10월 9일 · 도구별 설명 보강</h2><p>공개 도구 68개의 사용 안내를 전부 점검했습니다. 특히 별도의 실제 예시가 없던 36개 페이지에 입력 사례, 결과 해석, 지원 범위와 완료 전 확인사항을 추가했습니다. 예를 들어 <a href="../tools/korean-age-calculator/">만 나이 계산기</a>는 세 가지 나이 기준을 실제 생년월일로 비교하고, <a href="../tools/unix-timestamp-converter/">타임스탬프 변환기</a>는 초와 밀리초 혼동을 설명합니다. 이후 같은 빈 안내가 새 도구에 생기면 사이트 생성 단계에서 오류가 나도록 검사합니다.</p><h2>2026년 10월 7일 · 점심 메뉴 월드컵</h2><p><a href="../tools/lunch-worldcup/">점심 메뉴 월드컵</a>의 선택 흐름과 검색 결과 설명을 개선하고 시작·선택·완료 이벤트를 추가했습니다. 메뉴를 직접 일일이 입력하지 않아도 준비된 후보로 바로 진행할 수 있고, 결과를 친구와 공유할 수 있습니다.</p><h2>2026년 10월 3일 · 검색 결과 설명</h2><p>실수령액, 평수, 글자수 같은 주요 도구의 제목과 설명을 실제 기능에 맞게 다듬었습니다. 페이지마다 같은 홍보 문구를 반복하는 대신 사용자가 입력하는 값과 얻는 결과를 설명했습니다.</p><h2>2026년 9월 30일 · 가이드와 사용 흐름</h2><p>퇴직금·실수령액·이미지 형식처럼 계산 결과를 해석해야 하는 주제에 <a href="../insights/">활용 가이드</a>를 확장했습니다. 개인정보를 포함한 도구 입력값은 분석 이벤트로 보내지 않으면서 도구 실행과 결과 표시 여부만 집계하도록 했습니다.</p><h2>검수와 제보</h2><p>공개 전에는 내부 링크, 메타데이터, 모바일 가로 넘침과 도구 초기화를 검사합니다. 계산이나 문서 결과가 중요한 업무에 쓰인다면 화면의 기준과 공식 자료를 함께 확인하세요. 오류 제보에는 도구 이름, 재현 순서와 기대 결과를 적어주시면 확인에 도움이 됩니다.</p></article></main>`;
  fs.mkdirSync(path.join(root,'updates'),{recursive:true});
  fs.writeFileSync(path.join(root,'updates','index.html'),doc('업데이트 기록','쓸모칸 도구와 활용 가이드의 변경 내용, 검수 방식과 오류 제보 방법을 날짜별로 공개합니다.',base+'updates/',1,updatesBody));

  const labTools=tools.filter(t=>!coreSlugs.has(t[0]));
  const labBody=`<main class="wrap"><div class="crumb"><a href="../">홈</a> / 실험실</div><section class="hero"><div class="eyebrow">LAB</div><h1>쓸모칸 실험실</h1><p class="lead">재미 기능과 보완 중인 도구를 모았습니다. 모든 기능은 계속 사용할 수 있지만 검색 색인과 광고에서는 제외됩니다.</p></section><section class="tool-directory">${labTools.map(([slug,title,cat,desc])=>`<a class="quality-card" href="../tools/${slug}/"><span>${cat}</span><h2>${title}</h2><p>${desc}</p></a>`).join('')}</section></main>`;
  let labHtml=doc('쓸모칸 실험실','보완 중인 유틸리티와 미니게임을 모은 쓸모칸 실험실입니다.',base+'lab/',1,labBody,'CollectionPage').replace('index,follow,max-image-preview:large','noindex,follow');
  fs.mkdirSync(path.join(root,'lab'),{recursive:true});fs.writeFileSync(path.join(root,'lab','index.html'),labHtml);

  const categoryPriority=['일상·사무','텍스트·문서','퍼블리싱·프론트엔드','취업 준비','서식·문서 생성','기타 유틸리티','미니게임','운세·재미'];
  const categories=[...new Set(tools.filter(t=>coreSlugs.has(t[0])).map(t=>t[2]))].sort((a,b)=>{const ai=categoryPriority.indexOf(a),bi=categoryPriority.indexOf(b);return (ai<0?999:ai)-(bi<0?999:bi)});
  const directory=categories.map(cat=>`<section class="directory-section"><div class="section-head"><h2>${cat}</h2><span>${tools.filter(t=>coreSlugs.has(t[0])&&t[2]===cat).length}개</span></div><div class="tool-directory">${tools.filter(t=>coreSlugs.has(t[0])&&t[2]===cat).map(([slug,title,,desc])=>`<a class="quality-card tool-result" data-search="${title} ${desc}" href="./tools/${slug}/"><h3>${title}</h3><p>${desc}</p><b>도구 열기 →</b></a>`).join('')}</div></section>`).join('');
  const featured=['character-byte-counter','area-converter','salary-calculator','severance-pay-calculator','percentage-calculator','text-diff-checker'].map(slug=>tools.find(t=>t[0]===slug));
  const homeBody=`<main><section class="home-hero"><div class="wrap"><div class="eyebrow">SEULMOKAN</div><h1>자주 쓰는 작업을<br>설치 없이 바로</h1><p>평수·연봉·퇴직금 계산부터 글자수 확인과 텍스트 비교, 이미지 작업까지. 입력 내용은 가능한 한 브라우저 안에서 처리합니다.</p><div class="home-actions"><a class="btn" href="#tools">도구 골라보기</a><a class="btn secondary" href="./insights/">활용 가이드</a></div></div></section><section class="wrap trust-strip"><div><b>파일은 로컬에서</b><span>이미지와 문서 입력을 서버에 보관하지 않습니다.</span></div><div><b>결과는 확인 가능하게</b><span>계산 기준과 주의사항을 결과 옆에서 설명합니다.</span></div><div><b>회원가입 없이</b><span>필요할 때 바로 열어 사용할 수 있습니다.</span></div></section><section class="wrap home-guides"><div class="section-head"><div><span class="eyebrow">POPULAR</span><h2>많이 찾는 계산·문서 도구</h2></div></div><div class="quality-grid">${featured.map(([slug,title,,desc])=>`<a class="quality-card" href="./tools/${slug}/"><span>바로 사용</span><h3>${title}</h3><p>${desc}</p><b>도구 열기 →</b></a>`).join('')}</div></section><section class="wrap" id="tools"><div class="section-head"><div><span class="eyebrow">TOOLS</span><h2>지금 바로 사용할 수 있는 도구</h2></div></div><label class="directory-search">도구 검색<input id="tool-search" type="search" placeholder="예: 평수, 실수령액, 글자 비교"></label>${directory}</section><section class="wrap home-guides"><div class="section-head"><div><span class="eyebrow">GUIDES</span><h2>결과를 제대로 쓰는 법</h2></div><a href="./insights/">가이드 전체 보기 →</a></div><div class="quality-grid">${Object.entries(insights).slice(0,4).map(([slug,item])=>`<a class="quality-card" href="./insights/${slug}/"><span>활용 가이드</span><h3>${item.title}</h3><p>${item.description}</p></a>`).join('')}</div></section><section class="wrap editorial-policy"><h2>쓸모칸은 이렇게 만들고 있습니다</h2><div class="quality-grid"><div><b>입력부터 결과까지 한 화면</b><p>복잡한 가입이나 설치 없이 바로 작업하고 결과를 확인할 수 있게 구성합니다.</p></div><div><b>계산 근거와 한계 표시</b><p>숫자만 보여주지 않고 결과가 달라질 수 있는 조건과 확인할 자료를 함께 안내합니다.</p></div><div><b>오류 제보 반영</b><p>작동하지 않거나 설명이 부족한 부분은 문의를 받아 직접 수정합니다. <a href="./updates/">업데이트 기록 보기 →</a></p></div></div></section></main><script>document.getElementById('tool-search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.tool-result').forEach(x=>x.hidden=!x.dataset.search.toLowerCase().includes(q));});</script>`;
  fs.writeFileSync(path.join(root,'index.html'),doc('쓸모칸 — 무료 온라인 도구','계산, 이미지, 문서 작업을 설치 없이 처리하고 입력 예시와 결과 해석까지 확인하는 무료 온라인 도구 모음입니다.',base,0,homeBody,'WebSite').replace('<meta property="og:type" content="article">','<meta property="og:type" content="website">'));

  const privacy=path.join(root,'privacy','index.html');
  let privacyHtml=cleanHead(fs.readFileSync(privacy,'utf8'));
  privacyHtml=privacyHtml.replace(/<article class="content-card">[\s\S]*?<\/article>/,`<article class="content-card quality-article"><p><b>시행일: 2026년 9월 13일 · 최종 수정일: 2026년 9월 30일</b></p><h2>입력 데이터와 파일</h2><p>일반 계산·텍스트·이미지 도구는 입력 내용을 현재 브라우저에서 처리하며 쓸모칸 서버에 저장하지 않습니다. 공인 IP 확인과 QR 생성처럼 외부 요청이 필요한 기능은 해당 실행 화면에서 전송 대상과 목적을 따로 안내합니다.</p><h2>방문 통계(Google Analytics)</h2><p>서비스 개선과 유입 경로 분석을 위해 Google Analytics 4를 사용합니다. 페이지 주소, 브라우저·기기 정보, 대략적인 지역, 방문·스크롤 및 도구 실행·결과 표시·복사·다운로드 같은 상호작용이 수집될 수 있습니다. 도구에 입력한 텍스트·파일·계산값과 결과 내용은 분석 이벤트에 포함하지 않으며 광고 개인화 신호는 사용하지 않습니다. 브라우저의 쿠키 차단 또는 Google Analytics 차단 기능으로 수집을 제한할 수 있습니다.</p><h2>호스팅과 외부 라이브러리</h2><p>사이트는 GitHub Pages에서 제공됩니다. 글꼴, 문서 변환 라이브러리와 AI 모델을 jsDelivr 등 CDN에서 내려받을 때 해당 사업자가 IP 주소, 브라우저 정보와 요청 시각 같은 기술 로그를 처리할 수 있습니다.</p><h2>광고, 쿠키와 접속 정보</h2><p>Google Analytics 및 광고 파트너는 쿠키, 웹 비콘, IP 주소 또는 유사 기술을 이용해 이용 현황과 광고 성과를 측정할 수 있습니다. 필요한 지역에는 동의·거부 수단을 제공합니다. Google의 처리 방식은 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Google 파트너 사이트 정책</a>에서 확인할 수 있습니다.</p><h2>이메일 문의</h2><p>contact@seulmokan.com으로 보낸 발신 주소, 제목과 본문은 Cloudflare Email Routing을 거쳐 운영자 메일함으로 전달되며 문의 확인과 답변 목적으로 보관될 수 있습니다. 주민등록번호, 계좌·카드정보와 같은 민감정보는 보내지 마세요.</p><h2>열람·삭제 요청</h2><p>개인정보 관련 문의와 정정·삭제 요청은 contact@seulmokan.com으로 접수할 수 있습니다. 외부 서비스가 처리한 정보는 해당 서비스의 정책과 절차가 적용됩니다.</p></article>`);
  fs.writeFileSync(privacy,privacyHtml);

  const about=path.join(root,'about','index.html');
  let aboutHtml=cleanHead(fs.readFileSync(about,'utf8'));
  aboutHtml=aboutHtml.replace(/<article class="content-card">[\s\S]*?<\/article>/,`<article class="content-card quality-article"><h2>누가 운영하나요?</h2><p>쓸모칸은 대한민국에서 개인 운영자가 직접 기획하고 개발하는 무료 온라인 유틸리티 서비스입니다. 문의와 오류 제보는 contact@seulmokan.com으로 받습니다.</p><h2>무엇을 해결하나요?</h2><p>설치가 번거로운 작은 계산과 변환, 문서 초안 작업을 브라우저에서 빠르게 끝내도록 돕습니다. 숫자나 파일만 반환하지 않고 입력 자료, 결과 해석과 주의할 점을 해당 도구에 함께 기록합니다.</p><h2>도구를 공개하는 기준</h2><ul><li>정상값뿐 아니라 빈 값과 범위를 벗어난 입력도 확인합니다.</li><li>계산 결과가 실제 제도나 계약에 영향을 줄 수 있으면 공식 확인 경로와 한계를 표시합니다.</li><li>사용자 파일은 가능한 한 브라우저 안에서 처리하고 외부 전송이 필요한 기능은 화면에서 알립니다.</li><li>오류 제보가 들어오면 재현한 뒤 기능과 안내문을 함께 수정합니다.</li></ul><h2>광고와 제휴</h2><p>광고나 제휴 링크를 제공하는 경우 본문 및 도구와 구분해 표시하고, 작업 흐름을 가리거나 결과 확인을 방해하지 않도록 배치합니다.</p><p><b>최종 수정일: 2026년 9월 30일</b></p></article>`);
  fs.writeFileSync(about,aboutHtml);

  for(const slug of Object.keys(infoPages)){
    const file=path.join(root,slug,'index.html');
    fs.writeFileSync(file,cleanHead(fs.readFileSync(file,'utf8')).replace(/최종 수정일: 2026년 9월 13일/g,'최종 수정일: 2026년 9월 20일'));
  }
  const urls=[base,...Object.keys(infoPages).map(x=>base+x+'/'),base+'insights/',...Object.keys(insights).map(x=>base+'insights/'+x+'/'),base+'updates/',...tools.filter(t=>coreSlugs.has(t[0])).map(t=>base+'tools/'+t[0]+'/')];
  fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>{const slug=u.match(/\/tools\/([^/]+)\/$/)?.[1];const date=u===base||u===base+'updates/'||slug&&extraQuality[slug]?'2026-10-09':'2026-10-03';return `  <url><loc>${u}</loc><lastmod>${date}</lastmod></url>`}).join('\n')+'\n</urlset>\n');

  const htmlFiles=[];const walk=dir=>{for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(item.name))continue;const full=path.join(dir,item.name);if(item.isDirectory())walk(full);else if(item.name.endsWith('.html'))htmlFiles.push(full);}};walk(root);
  for(const file of htmlFiles){let html=cleanHead(fs.readFileSync(file,'utf8'));fs.writeFileSync(file,html);}
  console.log(`quality pass: ${coreSlugs.size} core tools, ${labTools.length} lab tools, ${Object.keys(insights).length} guides, ${urls.length} indexed URLs`);
}
