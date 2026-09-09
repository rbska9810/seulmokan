import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const tools=[
['px-rem-converter','px ↔ rem 변환기','퍼블리싱·프론트엔드','기준 폰트 크기에 맞춰 px와 rem 단위를 양방향으로 변환합니다.'],
['css-gradient-generator','CSS 그라데이션 생성기','퍼블리싱·프론트엔드','두 색상과 방향을 조합해 바로 사용할 수 있는 CSS 그라데이션을 만듭니다.'],
['box-shadow-generator','CSS 박스 섀도우 생성기','퍼블리싱·프론트엔드','그림자 위치와 흐림 정도를 조절하고 box-shadow 코드를 생성합니다.'],
['color-converter','HEX · RGB · HSL 변환기','퍼블리싱·프론트엔드','HEX 색상을 RGB와 HSL 형식으로 정확하게 변환합니다.'],
['meta-tag-preview','메타태그 미리보기','퍼블리싱·프론트엔드','페이지 제목과 설명이 검색결과에 어떻게 보이는지 미리 확인합니다.'],
['border-radius-generator','Border Radius 생성기','퍼블리싱·프론트엔드','네 모서리 값을 조절해 border-radius 코드와 모양을 만듭니다.'],
['flexbox-playground','Flexbox 플레이그라운드','퍼블리싱·프론트엔드','정렬 옵션을 바꾸며 Flexbox 레이아웃과 CSS를 실험합니다.'],
['css-clamp-calculator','CSS Clamp 계산기','퍼블리싱·프론트엔드','최소·최대 크기와 화면 폭을 이용해 반응형 clamp 값을 계산합니다.'],
['image-base64-converter','Base64 이미지 변환기','퍼블리싱·프론트엔드','이미지 파일을 브라우저에서 Data URI 문자열로 변환합니다.'],
['svg-optimizer','SVG 최적화 도우미','퍼블리싱·프론트엔드','SVG 코드의 주석과 불필요한 공백을 정리해 용량을 줄입니다.'],
['character-byte-counter','실시간 글자수·바이트 계산기','텍스트·문서','공백 포함·제외 글자수, 단어, 줄과 UTF-8 바이트를 실시간 계산합니다.'],
['whitespace-remover','줄바꿈·공백 제거기','텍스트·문서','연속 공백과 빈 줄을 원하는 기준에 맞춰 간편하게 정리합니다.'],
['case-converter','대소문자 변환기','텍스트·문서','영문을 대문자, 소문자, 제목 표기와 카멜 케이스로 변환합니다.'],
['duplicate-line-remover','중복 줄 제거기','텍스트·문서','반복되는 행을 제거하고 처음 등장한 순서의 고유 목록을 만듭니다.'],
['json-formatter','JSON 포맷터·검증기','텍스트·문서','JSON 문법을 검증하고 보기 좋게 정렬하거나 압축합니다.'],
['url-encoder-decoder','URL 인코더·디코더','텍스트·문서','URL과 쿼리 문자열을 퍼센트 인코딩하거나 원문으로 복원합니다.'],
['html-entity-converter','HTML 엔티티 변환기','텍스트·문서','HTML 특수문자를 엔티티로 바꾸거나 다시 원문으로 복원합니다.'],
['lorem-ipsum-generator','Lorem Ipsum 생성기','텍스트·문서','디자인과 퍼블리싱 시안에 사용할 더미 문단을 생성합니다.'],
['text-sorter','텍스트 정렬·역순 변환기','텍스트·문서','여러 행을 가나다순, 숫자순 또는 역순으로 정렬합니다.'],
['slug-generator','슬러그 생성기','텍스트·문서','영문 제목을 검색 친화적인 소문자 URL 슬러그로 변환합니다.'],
['markdown-preview','마크다운 미리보기','텍스트·문서','기본 마크다운 문법을 입력하고 렌더링 결과를 바로 확인합니다.'],
['csv-json-converter','CSV ↔ JSON 변환기','텍스트·문서','표 형식 데이터를 CSV와 JSON 사이에서 양방향 변환합니다.'],
['word-sentence-counter','문장·단어 수 계산기','텍스트·문서','문장, 단어, 문단 수와 예상 읽기 시간을 계산합니다.'],
['text-diff-checker','텍스트 차이 비교기','텍스트·문서','두 텍스트를 행 단위로 비교해 추가와 삭제 내용을 찾습니다.'],
['korean-text-cleaner','맞춤법 검사 전처리기','텍스트·문서','잘못된 문장부호 간격과 반복 공백을 정돈합니다.'],
['dday-calculator','D-Day 계산기','일상·사무','선택한 날짜까지 남은 날 또는 지난 날을 계산합니다.'],
['korean-age-calculator','만 나이 계산기','일상·사무','생년월일을 기준으로 오늘의 만 나이를 계산합니다.'],
['percentage-calculator','퍼센트·할인율 계산기','일상·사무','비율과 할인 후 가격, 증감률을 한 번에 계산합니다.'],
['salary-calculator','연봉 실수령액 계산기','일상·사무','연봉에서 일반적인 공제율을 적용한 월 예상 실수령액을 계산합니다.'],
['qr-code-generator','QR코드 생성기','일상·사무','URL이나 텍스트를 입력해 다운로드 가능한 QR코드를 만듭니다.'],
['vat-calculator','부가세 계산기','일상·사무','합계금액 또는 공급가액을 기준으로 10% 부가세를 계산합니다.'],
['loan-calculator','대출 이자 계산기','일상·사무','원리금균등 방식의 월 납입금과 총이자를 계산합니다.'],
['compound-interest-calculator','복리 계산기','일상·사무','원금과 수익률, 기간에 따른 복리 만기금액을 계산합니다.'],
['wage-converter','시급·월급 변환기','일상·사무','시급과 주 근무시간을 월급과 연봉으로 환산합니다.'],
['bmi-calculator','BMI 계산기','일상·사무','키와 몸무게로 체질량지수와 일반적인 분류를 확인합니다.'],
['calorie-calculator','칼로리 권장량 계산기','일상·사무','신체 정보와 활동량으로 하루 예상 에너지 소비량을 계산합니다.'],
['date-calculator','날짜·기간 계산기','일상·사무','두 날짜 사이의 일수와 선택 날짜의 전후 날짜를 계산합니다.'],
['timezone-converter','세계 시간 변환기','일상·사무','한국 시간을 주요 세계 도시의 현지 시간으로 변환합니다.'],
['severance-pay-calculator','퇴직금 계산기','일상·사무','최근 평균임금과 재직일수로 예상 퇴직금을 계산합니다.'],
['area-converter','평수·제곱미터 변환기','일상·사무','평과 제곱미터 면적을 양방향으로 즉시 환산합니다.'],
['my-ip','내 IP 확인','기타 유틸리티','현재 인터넷 연결의 공인 IP 주소를 확인합니다.'],
['pomodoro-timer','포모도로 집중 타이머','기타 유틸리티','25분 집중과 5분 휴식을 반복하는 집중 타이머입니다.'],
['ladder-game','사다리타기','기타 유틸리티','참가자와 결과를 무작위로 공정하게 연결합니다.'],
['unit-converter','길이·무게 단위 변환기','기타 유틸리티','길이와 무게의 주요 단위를 서로 환산합니다.'],
['random-number-generator','랜덤 숫자 생성기','기타 유틸리티','지정 범위에서 원하는 개수의 무작위 숫자를 생성합니다.'],
['password-generator','랜덤 비밀번호 생성기','기타 유틸리티','보안 난수를 이용해 조건에 맞는 강력한 비밀번호를 생성합니다.'],
['random-wheel','룰렛 돌리기','기타 유틸리티','여러 후보 중 하나를 무작위로 선택합니다.'],
['dice-coin','주사위·동전 던지기','기타 유틸리티','주사위를 굴리거나 동전을 던져 무작위 결과를 얻습니다.'],
['stopwatch','스톱워치·랩 타이머','기타 유틸리티','경과 시간을 측정하고 구간별 랩 기록을 남깁니다.'],
['unix-timestamp-converter','Unix 타임스탬프 변환기','기타 유틸리티','Unix 초·밀리초와 읽을 수 있는 날짜를 상호 변환합니다.']];
const base='https://rbska9810.github.io/seulmokan/';
const schemaFor=(title,url,desc,cat)=>({'@context':'https://schema.org','@graph':[{'@type':'WebApplication',name:title,url,description:desc,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'KRW'},inLanguage:'ko-KR'},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'홈',item:base},{'@type':'ListItem',position:2,name:cat,item:base+'#tools'},{'@type':'ListItem',position:3,name:title,item:url}]},{'@type':'FAQPage',mainEntity:[{'@type':'Question',name:'무료로 사용할 수 있나요?',acceptedAnswer:{'@type':'Answer',text:'회원가입 없이 무료로 사용할 수 있습니다.'}},{'@type':'Question',name:'입력한 내용이 저장되나요?',acceptedAnswer:{'@type':'Answer',text:'브라우저에서 처리되는 도구는 입력 내용과 결과를 쓸모칸 서버에 저장하지 않습니다.'}},{'@type':'Question',name:'결과를 그대로 사용해도 되나요?',acceptedAnswer:{'@type':'Answer',text:'일반 변환 결과는 바로 활용할 수 있습니다. 급여, 금융, 건강 관련 계산은 참고용 예상치이므로 공식 자료와 함께 확인하세요.'}}]}]});
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const header=`<header><nav class="nav"><a class="brand" href="../../"><span class="mark">ㅆ</span>쓸모칸</a><div class="navlinks"><a href="../../#tools">전체 도구</a><a href="../../about/">소개</a><a href="../../privacy/">개인정보</a></div><button class="theme" data-theme aria-label="다크 모드">☾</button></nav></header>`;
const footer=`<footer><div class="foot"><b>쓸모 있는 도구를 한 칸에</b><span><a href="../../guide/">사용가이드</a><a href="../../about/">소개</a><a href="../../privacy/">개인정보처리방침</a><a href="../../terms/">이용약관</a><a href="../../contact/">문의</a></span><span>© <i data-year></i> SEULMOKAN</span></div></footer>`;
for(let i=0;i<tools.length;i++){const [slug,title,cat,desc]=tools[i];const related=tools.filter((x,j)=>x[2]===cat&&j!==i).slice(0,3);const url=base+'tools/'+slug+'/';const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — 무료 온라인 도구 | 쓸모칸</title><meta name="description" content="${esc(desc)} 설치와 로그인 없이 무료로 사용할 수 있습니다."><meta name="robots" content="index,follow"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${esc(title)} | 쓸모칸"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><link rel="stylesheet" href="../../assets/site.css"><script type="application/ld+json">${JSON.stringify(schemaFor(title,url,desc,cat))}</script></head><body>${header}<main class="wrap"><div class="crumb"><a href="../../">홈</a> / ${esc(cat)} / ${esc(title)}</div><section class="hero"><div class="eyebrow">${esc(cat)}</div><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p><div class="badges"><span class="badge">무료</span><span class="badge">로그인 없음</span><span class="badge">모바일 지원</span></div></section><div class="layout"><div><section class="panel" id="tool" data-slug="${slug}" aria-label="${esc(title)} 실행 영역"><p>도구를 불러오는 중입니다.</p></section><aside class="ad" aria-label="광고">ADVERTISEMENT<br>반응형 광고 영역</aside><article class="content-card"><h2>${esc(title)} 사용 방법</h2><ol><li>위 입력란에 변환하거나 계산할 값을 입력합니다.</li><li>필요한 옵션을 선택하고 실행 버튼을 누릅니다.</li><li>결과를 확인한 뒤 복사하거나 다음 작업에 활용합니다.</li></ol><h2>어떻게 처리되나요?</h2><p>${esc(desc)} 대부분의 작업은 현재 브라우저에서 실행되며 입력값을 쓸모칸 서버에 저장하지 않습니다. 외부 연결이 필요한 기능은 실행 화면에 별도로 안내합니다.</p><h2>자주 묻는 질문</h2><h3>무료로 사용할 수 있나요?</h3><p>네. 회원가입 없이 무료로 사용할 수 있습니다.</p><h3>입력한 내용이 저장되나요?</h3><p>브라우저에서 처리되는 도구는 입력 내용과 결과를 서버에 저장하지 않습니다.</p><h3>결과를 그대로 사용해도 되나요?</h3><p>일반 변환 결과는 바로 활용할 수 있습니다. 급여·금융·건강 관련 계산은 입력값에 따른 참고용 예상치이므로 공식 자료와 함께 확인하세요.</p></article><section class="content-card"><h2>관련 도구</h2><div class="related">${related.map(x=>`<a href="../${x[0]}/">${esc(x[1])} →</a>`).join('')}</div></section></div><aside class="side"><div class="ad">ADVERTISEMENT<br>300 × 400</div></aside></div></main>${footer}<script src="../../assets/common.js"></script><script src="../../assets/tools.js"></script></body></html>`;const dir=path.join(root,'tools',slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);}
const infoPages={guide:['사용가이드','쓸모칸의 도구를 빠르고 안전하게 사용하는 방법을 안내합니다.','홈에서 검색창이나 카테고리 필터로 필요한 도구를 찾고, 도구 페이지의 입력란에 값을 넣은 다음 실행 버튼을 누르세요. 결과 복사가 제공되는 도구는 버튼 한 번으로 클립보드에 저장할 수 있습니다. 텍스트·개발 도구는 대부분 브라우저 안에서 처리됩니다. 급여·금융·건강 계산은 참고값이므로 중요한 결정 전에는 공식 기준을 다시 확인하세요. 외부 통신이 필요한 내 IP 확인과 QR코드 생성기는 실행 화면에 데이터 전송 사실을 표시합니다.'],about:['쓸모칸 소개','작은 작업 하나가 하루를 무겁게 만들지 않도록, 빠르고 안전한 온라인 도구를 만듭니다.','쓸모칸은 반복되는 계산과 변환을 설치나 회원가입 없이 끝낼 수 있도록 만든 무료 온라인 유틸리티 서비스입니다. 가능한 작업은 사용자의 브라우저 안에서 처리하고, 기능보다 광고가 앞서지 않는 경험을 지향합니다.'],privacy:['개인정보처리방침','쓸모칸에서 입력 데이터와 접속 정보가 어떻게 처리되는지 개인정보 보호 원칙을 자세히 안내합니다.','쓸모칸의 일반 도구는 입력값을 브라우저 내부에서 처리하며 별도 서버에 저장하지 않습니다. 내 IP 확인과 QR코드처럼 외부 서비스가 필요한 기능은 해당 실행 화면에서 전송 사실을 안내합니다. GitHub Pages와 CDN 사업자는 접속 과정에서 일반적인 기술 로그를 처리할 수 있습니다. 문의 시 사용자가 직접 제공한 정보는 답변 목적으로만 사용합니다.'],terms:['이용약관','무료 온라인 도구인 쓸모칸을 안전하고 올바르게 이용하기 위한 권리와 책임을 안내합니다.','쓸모칸은 무료 온라인 도구를 현재 상태로 제공합니다. 계산 결과는 참고용이며 법률·세무·금융·의료 전문가의 판단을 대신하지 않습니다. 사용자는 본인이 사용할 권한이 있는 데이터만 입력해야 하며 결과 사용에 따른 최종 확인 책임은 사용자에게 있습니다. 서비스는 보안과 기능 개선을 위해 변경될 수 있습니다.'],contact:['문의하기','쓸모칸 도구의 오류를 제보하거나 필요한 새로운 기능과 온라인 도구를 제안하는 방법을 안내합니다.','현재 별도의 문의 서버를 운영하지 않습니다. GitHub 저장소의 Issues 메뉴에서 사용한 도구 이름, 문제 상황, 기대한 결과를 개인정보 없이 남겨주세요. 비밀번호, 주민등록번호, 금융정보와 같은 민감한 내용은 보내지 마세요.']};
for(const [slug,[title,lead,body]] of Object.entries(infoPages)){const url=base+slug+'/';const extra=slug==='contact'?`<p><a class="btn" href="https://github.com/rbska9810/seulmokan/issues" target="_blank" rel="noopener">GitHub에서 문의하기</a></p>`:'';const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 쓸모칸</title><meta name="description" content="${lead}"><link rel="canonical" href="${url}"><link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><link rel="stylesheet" href="../assets/site.css"></head><body>${header.replaceAll('../../','../')}<main class="wrap"><div class="crumb"><a href="../">홈</a> / ${title}</div><section class="hero"><div class="eyebrow">SEULMOKAN</div><h1>${title}</h1><p class="lead">${lead}</p></section><article class="content-card"><p>${body}</p>${extra}<h2>운영 원칙</h2><ul><li>실제로 작동하는 도구만 공개합니다.</li><li>가능한 모든 처리는 브라우저 내부에서 수행합니다.</li><li>광고가 도구 사용을 방해하지 않도록 배치합니다.</li><li>오류와 변경된 계산 기준을 지속적으로 바로잡습니다.</li></ul><p>최종 수정일: 2026년 9월 9일</p></article></main>${footer.replaceAll('../../','../')}<script src="../assets/common.js"></script></body></html>`;const dir=path.join(root,slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);}
const urls=[base,...Object.keys(infoPages).map(x=>base+x+'/'),...tools.map(x=>base+'tools/'+x[0]+'/')];fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${u}</loc></url>`).join('\n')+'\n</urlset>\n');fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`);fs.writeFileSync(path.join(root,'404.html'),`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>페이지를 찾을 수 없습니다 | 쓸모칸</title><link rel="stylesheet" href="${base}assets/site.css"></head><body><main class="wrap"><article class="content-card"><div class="eyebrow">404</div><h1>페이지를 찾을 수 없습니다</h1><p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p><p><a class="btn" href="${base}">전체 도구로 돌아가기</a></p></article></main></body></html>`);console.log(`generated ${tools.length} tools, ${Object.keys(infoPages).length} info pages, ${urls.length} sitemap URLs`);
