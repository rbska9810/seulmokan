import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const assetVersion='20260918-3';
process.once('beforeExit',()=>{
  for(const [slug] of tools){
    const file=path.join(root,'tools',slug,'index.html');
    if(!fs.existsSync(file))continue;
    const html=fs.readFileSync(file,'utf8')
      .replace('assets/site.css"',`assets/site.css?v=${assetVersion}"`)
      .replace('assets/tool-ui.css"',`assets/tool-ui.css?v=${assetVersion}"`)
      .replace('assets/tools.js"',`assets/tools.js?v=${assetVersion}"`);
    fs.writeFileSync(file,html);
  }
});
const tools=[
['px-rem-converter','px ↔ rem 변환기','퍼블리싱·프론트엔드','기준 폰트 크기에 맞춰 px와 rem 단위를 양방향으로 변환합니다.'],
['css-gradient-generator','CSS 그라데이션 생성기','퍼블리싱·프론트엔드','두 색상과 방향을 조합해 바로 사용할 수 있는 CSS 그라데이션을 만듭니다.'],
['box-shadow-generator','CSS 박스 섀도우 생성기','퍼블리싱·프론트엔드','그림자 위치와 흐림 정도를 조절하고 box-shadow 코드를 생성합니다.'],
['color-converter','HEX · RGB · HSL 변환기','퍼블리싱·프론트엔드','HEX 색상을 RGB와 HSL 형식으로 정확하게 변환합니다.'],
['meta-tag-preview','메타태그 미리보기','퍼블리싱·프론트엔드','페이지 제목과 설명이 검색결과에 어떻게 보이는지 미리 확인합니다.'],
['flexbox-playground','Flexbox 플레이그라운드','퍼블리싱·프론트엔드','정렬 옵션을 바꾸며 Flexbox 레이아웃과 CSS를 실험합니다.'],
['css-clamp-calculator','CSS Clamp 계산기','퍼블리싱·프론트엔드','최소·최대 크기와 화면 폭을 이용해 반응형 clamp 값을 계산합니다.'],
['image-base64-converter','Base64 이미지 변환기','퍼블리싱·프론트엔드','이미지 파일을 브라우저에서 Data URI 문자열로 변환합니다.'],
['image-compressor','이미지 용량 줄이기','퍼블리싱·프론트엔드','여러 이미지를 브라우저에서 일괄 압축하고 개별 파일 또는 ZIP으로 다운로드합니다.'],
['image-cropper','이미지 자르기','퍼블리싱·프론트엔드','이미지를 원하는 비율과 크기로 자르고 회전해 PNG, JPG 또는 WebP로 저장합니다.'],
['background-remover','AI 누끼 따기','퍼블리싱·프론트엔드','음식·상품·인물 사진을 외부 전송 없이 범용 브라우저 AI로 정밀하게 분리합니다.'],
['psd-image-converter','PSD 이미지 변환기','퍼블리싱·프론트엔드','PSD의 합성 이미지를 브라우저에서 PNG, JPG 또는 WebP로 변환합니다.'],
['character-byte-counter','실시간 글자수·바이트 계산기','텍스트·문서','공백 포함·제외 글자수, 단어, 줄과 UTF-8 바이트를 실시간 계산합니다.'],
['whitespace-remover','줄바꿈·공백 제거기','텍스트·문서','연속 공백과 빈 줄을 원하는 기준에 맞춰 간편하게 정리합니다.'],
['case-converter','대소문자 변환기','텍스트·문서','영문을 대문자, 소문자, 제목 표기와 카멜 케이스로 변환합니다.'],
['duplicate-line-remover','중복 줄 제거기','텍스트·문서','반복되는 행을 제거하고 처음 등장한 순서의 고유 목록을 만듭니다.'],
['json-formatter','JSON 포맷터·검증기','텍스트·문서','JSON 문법을 검증하고 보기 좋게 정렬하거나 압축합니다.'],
['url-encoder-decoder','URL 인코더·디코더','텍스트·문서','URL과 쿼리 문자열을 퍼센트 인코딩하거나 원문으로 복원합니다.'],
['html-entity-converter','HTML 엔티티 변환기','텍스트·문서','HTML 특수문자를 엔티티로 바꾸거나 다시 원문으로 복원합니다.'],
['slug-generator','슬러그 생성기','텍스트·문서','영문 제목을 검색 친화적인 소문자 URL 슬러그로 변환합니다.'],
['markdown-preview','마크다운 미리보기','텍스트·문서','기본 마크다운 문법을 입력하고 렌더링 결과를 바로 확인합니다.'],
['csv-json-converter','CSV ↔ JSON 변환기','텍스트·문서','표 형식 데이터를 CSV와 JSON 사이에서 양방향 변환합니다.'],
['text-diff-checker','텍스트 차이 비교기','텍스트·문서','두 텍스트를 행 단위로 비교해 추가와 삭제 내용을 찾습니다.'],
['list-to-excel','목록·표 엑셀 변환기','텍스트·문서','붙여넣은 목록이나 표를 정리해 바로 열 수 있는 Excel 파일로 저장합니다.'],
['dday-calculator','D-Day 계산기','일상·사무','선택한 날짜까지 남은 날 또는 지난 날을 계산합니다.'],
['korean-age-calculator','만 나이 계산기','일상·사무','생년월일을 기준으로 오늘의 만 나이를 계산합니다.'],
['percentage-calculator','퍼센트·할인율 계산기','일상·사무','비율과 할인 후 가격, 증감률을 한 번에 계산합니다.'],
['salary-calculator','연봉 실수령액 계산기','일상·사무','연봉과 비과세액, 부양가족 조건을 바탕으로 2026년 월 예상 실수령액을 계산합니다.'],
['qr-code-generator','QR코드 생성기','일상·사무','URL이나 텍스트를 입력해 다운로드 가능한 QR코드를 만듭니다.'],
['vat-calculator','부가세 계산기','일상·사무','합계금액 또는 공급가액을 기준으로 10% 부가세를 계산합니다.'],
['loan-calculator','대출 이자 계산기','일상·사무','원리금균등 방식의 월 납입금과 총이자를 계산합니다.'],
['compound-interest-calculator','복리 계산기','일상·사무','원금과 수익률, 기간에 따른 복리 만기금액을 계산합니다.'],
['wage-converter','시급·월급 변환기','일상·사무','시급과 주 근무시간을 월급과 연봉으로 환산합니다.'],
['date-calculator','날짜·기간 계산기','일상·사무','두 날짜 사이의 일수와 선택 날짜의 전후 날짜를 계산합니다.'],
['timezone-converter','세계 시간 변환기','일상·사무','한국 시간을 주요 세계 도시의 현지 시간으로 변환합니다.'],
['severance-pay-calculator','퇴직금 계산기','일상·사무','입사일과 최근 3개월 임금으로 재직일수와 평균임금을 구해 예상 퇴직금을 계산합니다.'],
['area-converter','평수·제곱미터 변환기','일상·사무','평과 제곱미터 면적을 양방향으로 즉시 환산합니다.'],
['my-ip','내 IP 확인','기타 유틸리티','현재 인터넷 연결의 공인 IP 주소를 확인합니다.'],
['pomodoro-timer','포모도로 집중 타이머','기타 유틸리티','25분 집중과 5분 휴식을 반복하는 집중 타이머입니다.'],
['work-countdown','퇴근 카운트다운','기타 유틸리티','오늘의 퇴근 시각까지 남은 시간과 근무 진행률을 실시간으로 확인합니다.'],
['ladder-game','사다리타기','기타 유틸리티','참가자 이름과 당첨 인원을 정해 애니메이션 사다리로 추첨합니다.'],
['unit-converter','길이·무게 단위 변환기','기타 유틸리티','길이와 무게의 주요 단위를 서로 환산합니다.'],
['random-number-generator','로또 번호 추첨기','기타 유틸리티','로또 6/45 번호를 여러 게임 추첨하고 제외수와 일반 난수 범위도 설정합니다.'],
['password-generator','랜덤 비밀번호 생성기','기타 유틸리티','보안 난수를 이용해 조건에 맞는 강력한 비밀번호를 생성합니다.'],
['nickname-generator','랜덤 닉네임 생성기','기타 유틸리티','원하는 분위기와 언어를 선택해 중복 없는 닉네임 후보를 만듭니다.'],
['random-wheel','룰렛 돌리기','기타 유틸리티','여러 후보 중 하나를 무작위로 선택합니다.'],
['dice-coin','주사위·동전 던지기','기타 유틸리티','주사위를 굴리거나 동전을 던져 무작위 결과를 얻습니다.'],
['unix-timestamp-converter','Unix 타임스탬프 변환기','기타 유틸리티','Unix 초·밀리초와 읽을 수 있는 날짜를 상호 변환합니다.'],
['daily-fortune','오늘의 운세','운세·재미','생년월일과 날짜를 기준으로 일·금전·관계·컨디션 운세를 가벼게 확인합니다.'],
['zodiac-fortune','별자리 운세','운세·재미','생년월일로 태양 별자리를 찾고 날짜별 오락용 운세를 보여줍니다.'],
['saju-elements','사주 오행 성향 보기','운세·재미','양력 생년월일과 태어난 시간으로 단순화한 오행 성향 키워드를 조합합니다.'],
['reaction-speed-test','반응속도 테스트','미니게임','화면 신호가 바뀌는 순간 클릭해 반응속도를 밀리초 단위로 측정합니다.'],
['memory-card-game','기억력 카드 게임','미니게임','같은 그림 카드의 위치를 기억해 최소 횟수와 시간으로 짝을 맞춥니다.'],
['lunch-worldcup','점심 메뉴 월드컵','미니게임','32가지 기본 메뉴 사진에서 대결을 이어가 오늘의 점심을 결정합니다.'],
['number-memory-test','숫자 기억력 테스트','미니게임','잠시 보였다 사라지는 숫자를 기억하며 단계별 최고 기록에 도전합니다.'],
['up-down-game','업다운 숫자 게임','미니게임','숨은 숫자보다 크거나 작은지 힌트를 받으며 정답을 찾습니다.'],
['typing-speed-test','타자 속도 테스트','미니게임','한국어 문장을 입력해 분당 타수와 정확도, 오타와 재미있는 등급을 확인합니다.'],
['buy-or-not-calculator','이거 살까 말까 계산기','일상·사무','사고 싶은 물건값을 내 노동시간과 사용 1회당 비용으로 바꿔 지름을 현실적으로 판단합니다.'],
['resignation-letter-maker','사직서 작성기','서식·문서 생성','필수 정보를 입력해 인쇄하거나 텍스트로 저장할 수 있는 사직서를 작성합니다.'],
['power-of-attorney-maker','위임장 작성기','서식·문서 생성','위임인과 수임인 및 위임 범위를 입력해 기본 위임장을 작성합니다.'],
['simple-receipt-maker','간이 영수증 생성기','서식·문서 생성','거래 정보와 금액을 입력해 인쇄 가능한 간이 영수증을 생성합니다.'],
['transaction-statement-maker','거래명세서 생성기','서식·문서 생성','공급자·공급받는 자와 품목을 입력해 합계가 계산된 거래명세서를 만듭니다.'],
['certified-content-letter-maker','내용증명 작성기','서식·문서 생성','발신인·수신인·요구사항을 정리해 내용증명 초안을 작성합니다.'],
['employment-contract-maker','표준 근로계약서 작성기','서식·문서 생성','근무기간, 장소, 업무, 근로시간, 임금과 휴일을 입력해 근로계약서 초안을 만듭니다.'],
['message-template-bank','사회생활·카톡 대필 문구','서식·문서 생성','연차 요청, 결혼식 불참, 거래처 거절처럼 말이 막히는 상황에 맞는 문구를 골라 복사합니다.']];
const base='https://www.seulmokan.com/';
const adsenseScript='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9462573435168414" crossorigin="anonymous"></script>';
process.on('beforeExit',()=>{
  const pages=[path.join(root,'index.html'),...Object.keys(infoPages).map(slug=>path.join(root,slug,'index.html')),...tools.map(([slug])=>path.join(root,'tools',slug,'index.html'))];
  for(const file of pages){
    if(!fs.existsSync(file))continue;
    let html=fs.readFileSync(file,'utf8');
    const toolEntry=tools.find(([slug])=>file===path.join(root,'tools',slug,'index.html'));
    if(toolEntry){
      const [,title,,description]=toolEntry;
      const conciseDescription=description.length<30?`${title}: ${description}`:description;
      html=html.replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(conciseDescription)}">`);
    }
    if(!html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle'))html=html.replace('</head>',`${adsenseScript}</head>`);
    if(file===path.join(root,'privacy','index.html'))html=html.replace('현재 Google AdSense 사이트 확인용 메타태그가 적용되어 있습니다. 광고를 실제 게재하면','현재 Google AdSense 사이트 확인용 메타태그와 광고 로더가 적용되어 있습니다. 승인 후 실제 광고가 게재되면');
    if(file===path.join(root,'privacy','index.html')&&!html.includes('쿠팡 파트너스'))html=html.replace('<h2>문의 정보</h2>','<h2>제휴 링크</h2><p>홈 화면에는 쿠팡 파트너스 제휴 링크가 포함될 수 있습니다. 링크를 누르면 쿠팡으로 이동하며 구매가 발생하면 쓸모칸이 일정액의 수수료를 제공받을 수 있습니다. 상품 정보와 구매 과정에는 쿠팡의 개인정보처리방침이 적용됩니다.</p><h2>문의 정보</h2>');
    fs.writeFileSync(file,html);
  }
});
const topic=s=>{const c=s.at(-1)?.charCodeAt(0);return c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28!==0?'은':'는'};
const metaKeywords=(title,cat)=>`${title}, ${title} 무료, 온라인 ${title}, ${cat} 도구, 무료 온라인 도구, 쓸모칸`;
const schemaFor=(title,url,desc,cat,guide)=>({'@context':'https://schema.org','@graph':[{'@type':'WebApplication',name:title,url,description:desc,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',browserRequirements:'JavaScript enabled',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'KRW'},inLanguage:'ko-KR'},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'홈',item:base},{'@type':'ListItem',position:2,name:cat,item:base+'#tools'},{'@type':'ListItem',position:3,name:title,item:url}]},{'@type':'FAQPage',mainEntity:[{'@type':'Question',name:`${title}${topic(title)} 무료로 사용할 수 있나요?`,acceptedAnswer:{'@type':'Answer',text:'회원가입 없이 무료로 사용할 수 있습니다.'}},{'@type':'Question',name:`${title}에는 무엇을 입력하나요?`,acceptedAnswer:{'@type':'Answer',text:guide[0]}},{'@type':'Question',name:'결과를 사용할 때 무엇을 주의해야 하나요?',acceptedAnswer:{'@type':'Answer',text:guide[2]}}]}]});
const notes={
  'salary-calculator':'<h2>2026년 계산 기준</h2><p>국민연금 근로자 부담률 4.75%, 건강보험 3.595%, 장기요양 약 0.4724%, 고용보험 0.9%를 반영합니다. 소득세와 지방소득세는 개인 조건에 따라 달라 직접 입력하도록 했습니다. <a href="https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0095M0.do" target="_blank" rel="noopener">국민연금공단 기준 확인</a></p>',
  'severance-pay-calculator':'<h2>공식 산정 기준</h2><p>퇴직금은 1일 평균임금 × 30일 × 재직일수 ÷ 365 공식을 사용합니다. 통상임금, 제외기간, 상여금과 연차수당에 따라 실제 금액이 달라질 수 있습니다. <a href="https://www.moel.go.kr/retirementpayCal.do" target="_blank" rel="noopener">고용노동부 모의계산</a></p>',
  'csv-json-converter':'<h2>지원 범위</h2><p>간단한 쉼표 구분 표를 빠르게 변환하는 도구입니다. 셀 내부 줄바꿈이나 복잡한 인용부호를 포함한 CSV는 전문 스프레드시트 프로그램으로 결과를 다시 확인하세요.</p>',
  'ladder-game':'<h2>추첨 방식</h2><p>브라우저의 보안 난수로 가로선을 구성한 실제 사다리를 만들고 각 출발점의 경로를 따라 결과를 결정합니다. 생성한 뒤에는 참가자별 경로를 하나씩 확인할 수 있습니다.</p>',
  'qr-code-generator':'<h2>외부 전송 안내</h2><p>QR 이미지를 만들기 위해 입력한 URL 또는 텍스트가 QR Server로 전송됩니다. 비밀번호나 개인정보는 입력하지 마세요.</p>',
  'my-ip':'<h2>외부 전송 안내</h2><p>공인 IP 확인을 위해 ipify 서비스에 네트워크 요청을 보냅니다. 브라우저와 해당 서비스의 정책에 따라 접속 로그가 처리될 수 있습니다.</p>',
  'employment-contract-maker':'<h2>공식 기준 확인</h2><p>근로기준법 제17조는 임금, 소정근로시간, 휴일, 연차유급휴가 등 근로조건의 명시와 서면 교부를 정합니다. 본 도구는 초안 작성용이며 <a href="https://www.moel.go.kr/mainpop2.do" target="_blank" rel="noopener">고용노동부 표준근로계약서</a>와 최신 관계 법령을 함께 확인하세요.</p>',
  'certified-content-letter-maker':'<h2>법률 문서 주의사항</h2><p>내용증명은 어떤 내용의 문서를 언제 발송했는지를 남기는 수단입니다. 사실관계와 법적 주장을 구분하고 중요한 분쟁은 발송 전에 법률 전문가의 검토를 받으세요.</p>',
  'simple-receipt-maker':'<h2>증빙 주의사항</h2><p>생성된 문서는 거래 확인을 위한 간이 양식입니다. 세금계산서, 현금영수증, 신용카드 매출전표 등 세법상 적격증빙을 대체하는지 거래별로 확인하세요.</p>',
  'transaction-statement-maker':'<h2>증빙 주의사항</h2><p>거래명세서는 품목과 금액을 확인하는 보조 문서이며 세금계산서를 대신하지 않습니다. 실제 발행 전 사업자번호, 공급가액, 세액과 합계를 다시 확인하세요.</p>',
  'message-template-bank':'<h2>상황별 문구 예시</h2><p>연차 요청 카톡은 신청 날짜와 업무 인계 계획을, 결혼식 불참 문자는 축하와 불참 사유를, 거래처 거절 메일은 감사·결론·대안 순서를 담으면 뜻을 분명하면서도 정중하게 전달할 수 있습니다.</p><h3>연차 요청 카톡</h3><p>“안녕하세요. 개인 일정으로 ○월 ○일 연차를 사용하고자 합니다. 진행 중인 업무는 전날까지 정리하고 필요한 내용은 동료에게 공유하겠습니다. 확인 부탁드립니다.”처럼 날짜와 인계 계획을 함께 적으세요.</p><h3>결혼식 불참 문자</h3><p>초대에 대한 감사, 진심 어린 축하, 짧은 불참 사유를 차례로 전하는 편이 자연스럽습니다.</p><h3>거래처 거절 메일</h3><p>제안에 감사한 뒤 진행하기 어렵다는 결론을 명확히 적고, 가능하다면 재검토 시점이나 대안을 덧붙이세요.</p>'
};
const guideDetails={
'px-rem-converter':['변환 방향, 기준 폰트 크기와 숫자 값을 입력합니다.','px 또는 rem 환산값과 적용한 계산식을 함께 확인할 수 있습니다.','프로젝트의 html 루트 폰트 크기가 16px이 아닐 수 있으므로 실제 CSS 기준값을 먼저 확인하세요.'],
'css-gradient-generator':['선형·원형 종류, 방향 또는 위치, 시작색과 끝색을 선택합니다.','실시간 미리보기와 복사 가능한 background CSS가 생성됩니다.','텍스트가 올라가는 배경이라면 두 색상 구간 모두에서 명도 대비를 확인하세요.'],
'box-shadow-generator':['가로·세로 위치, 흐림, 퍼짐, 색상, 투명도와 inset 여부를 조절합니다.','미리보기와 완성된 box-shadow 선언을 제공합니다.','과도한 흐림과 큰 그림자는 저사양 모바일에서 렌더링 비용이 커질 수 있습니다.'],
'color-converter':['3·6자리 HEX 또는 rgb() 값과 알파값을 입력합니다.','HEX, RGB, HSL, RGBA 값을 동시에 변환해 보여줍니다.','알파값은 0부터 1까지이며 접근성 검토에는 실제 배경색도 함께 고려해야 합니다.'],
'meta-tag-preview':['페이지 제목, 설명과 실제 공개 URL을 입력합니다.','검색결과 형태의 미리보기와 제목·설명 길이를 표시합니다.','권장 글자 수는 참고 범위이며 Google이 검색어에 따라 문구를 바꿀 수 있습니다.'],
'flexbox-playground':['방향, 주축·교차축 정렬, 줄바꿈, 간격과 항목 수를 선택합니다.','선택값이 적용된 배치와 복사 가능한 Flexbox CSS를 보여줍니다.','자식 요소의 크기와 flex-grow 설정에 따라 실제 프로젝트 결과는 달라질 수 있습니다.'],
'css-clamp-calculator':['최소·최대 크기, 두 화면폭과 루트 폰트 크기를 입력합니다.','두 지점을 선형 보간하는 clamp() 식을 rem과 vw로 생성합니다.','최대값과 화면폭은 각각 최소값보다 커야 하며 브라우저에서 경계 폭을 확인하세요.'],
'image-base64-converter':['5MB 이하의 PNG, JPEG, WebP, GIF 또는 SVG 파일을 선택합니다.','미리보기와 복사 가능한 Data URI 문자열을 만듭니다.','Base64는 원본보다 용량이 커지므로 작은 아이콘이나 단일 파일 배포에만 권장합니다.'],
'image-compressor':['JPG, PNG 또는 WebP 이미지와 출력 형식, 화질, 최대 크기를 선택합니다.','압축 전후 용량과 감소율을 비교하고 개별 파일 또는 ZIP으로 내려받습니다.','움직이는 GIF와 SVG는 지원하지 않으며 PNG는 크기 조절 외에 용량이 줄지 않을 수 있습니다.'],
'image-cropper':['JPG, PNG 또는 WebP 이미지를 선택하고 자를 비율과 영역, 회전·반전 옵션을 조절합니다.','잘라낸 결과를 미리 보고 PNG, JPG 또는 WebP 파일로 다운로드합니다.','원본보다 크게 내보내면 화질이 좋아지지 않으며 움직이는 이미지는 첫 프레임만 처리됩니다.'],
'background-remover':['음식·상품·인물 등이 선명하게 나온 JPG, PNG 또는 WebP 이미지 한 장을 선택하거나 끌어 놓습니다.','정밀 또는 빠른 범용 AI 모델과 가장자리 정리 강도를 고른 뒤 투명 PNG로 다운로드합니다.','첫 실행에는 AI 모델 다운로드가 필요합니다. 피사체와 배경의 색이 비슷하면 가장자리 정리 옵션을 바꿔 비교하세요.'],
'psd-image-converter':['100MB 이하 PSD 파일과 출력 형식, JPG 배경색 및 화질을 선택합니다.','PSD에 저장된 합성 이미지를 미리 보고 PNG, JPG 또는 WebP로 다운로드합니다.','일부 색상 모드·효과는 원본과 다르게 보일 수 있으며 레이어별 내보내기는 지원하지 않습니다.'],
'character-byte-counter':['텍스트와 바이트 기준, 선택적으로 글자 제한을 입력합니다.','공백 포함·제외 글자, 단어, 줄, 바이트와 제한 초과 여부를 실시간 계산합니다.','서비스마다 한글 바이트 산정 규칙이 다르므로 제출처의 UTF-8 또는 2바이트 기준을 확인하세요.'],
'whitespace-remover':['텍스트를 붙여넣고 줄 앞뒤, 연속 공백, 빈 줄과 한 줄 변환 옵션을 선택합니다.','선택한 조건만 적용해 정리된 텍스트를 제공합니다.','코드와 표 데이터는 공백 자체가 의미를 가질 수 있으므로 원본을 보관하세요.'],
'case-converter':['변환할 문자열을 입력하고 대문자·소문자·camelCase 등 방식을 누릅니다.','선택한 표기법으로 즉시 변환하고 복사할 수 있습니다.','언어별 대소문자 규칙과 약어 표기는 자동 변환 후 다시 확인하세요.'],
'duplicate-line-remover':['행 목록과 공백·대소문자·빈 줄·정렬 기준을 선택합니다.','처음 등장한 행을 유지한 고유 목록과 제거 개수를 표시합니다.','대소문자 무시를 켜면 서로 다른 식별자로 쓰인 값도 같은 항목이 될 수 있습니다.'],
'json-formatter':['JSON 문자열, 들여쓰기와 키 정렬 여부를 입력합니다.','문법을 검증해 정렬 또는 압축하며 오류 행과 열을 안내합니다.','키 정렬은 객체의 표시 순서를 바꾸므로 서명이나 원문 비교 전에는 사용하지 마세요.'],
'url-encoder-decoder':['URL 전체, URL 구성요소 또는 쿼리 문자열과 처리 방식을 선택합니다.','퍼센트 인코딩·디코딩 또는 쿼리 키와 값을 출력합니다.','전체 URL과 개별 파라미터는 인코딩 범위가 다르므로 목적에 맞는 방식을 선택하세요.'],
'html-entity-converter':['HTML 또는 일반 텍스트와 인코딩·디코딩·태그 제거 방식을 선택합니다.','특수문자를 안전한 엔티티로 바꾸거나 표시 텍스트만 추출합니다.','태그 제거 결과는 HTML 구조와 줄바꿈을 완전히 보존하지 않습니다.'],
'slug-generator':['제목, 구분자, 한글 유지와 소문자 옵션을 선택합니다.','URL 경로에 사용할 정규화된 슬러그와 길이를 출력합니다.','공개 후 슬러그를 바꾸면 기존 URL에 리디렉션을 설정해야 SEO 손실을 줄일 수 있습니다.'],
'markdown-preview':['기본 마크다운 문법을 입력합니다.','제목, 목록, 링크, 강조와 코드의 렌더링 결과를 실시간 표시합니다.','안전을 위해 입력 HTML은 실행하지 않으며 고급 확장 문법은 지원 범위가 다릅니다.'],
'csv-json-converter':['CSV 또는 JSON과 CSV 구분자, 값 자동 변환 여부를 선택합니다.','인용부호를 처리해 두 형식 사이를 양방향 변환합니다.','헤더는 비어 있거나 중복될 수 없으며 변환 뒤 열 개수와 자료형을 검토하세요.'],
'text-diff-checker':['원본과 수정본을 각각 입력합니다.','행 단위로 유지·추가·삭제된 부분을 색상과 기호로 구분합니다.','매우 큰 문서는 브라우저 성능을 위해 크기 제한이 적용됩니다.'],
'list-to-excel':['탭·쉼표·줄바꿈으로 구분된 목록이나 표를 붙여넣고 구분 방식과 제목 행 여부를 선택합니다.','변환될 표를 미리 확인하고 열 너비가 정리된 XLSX 또는 CSV 파일로 다운로드합니다.','수식으로 시작하는 셀은 보안을 위해 일반 텍스트로 저장되며 복잡한 서식과 병합 셀은 지원하지 않습니다.'],
'dday-calculator':['목표 날짜, 선택적 일정 이름과 오늘 포함 여부를 입력합니다.','D-Day, 주·일 환산과 목표일이 남았는지 지났는지 보여줍니다.','날짜는 기기의 현지 날짜를 기준으로 하며 시간 단위는 계산하지 않습니다.'],
'korean-age-calculator':['생년월일과 확인하려는 기준일을 입력합니다.','기준일의 만 나이, 연 나이, 살아온 날과 다음 생일까지 일수를 계산합니다.','법적 판단에는 해당 제도의 기준일과 출생 신고 정보를 다시 확인하세요.'],
'percentage-calculator':['기준값, 비율, 선택적 비교값과 반올림 방식을 입력합니다.','비율값, 증가·감소 결과, 비율과 증감률을 한 번에 표시합니다.','기준값이 0이면 나눗셈 기반 비율과 증감률은 계산할 수 없습니다.'],
'salary-calculator':['세전 연봉, 월 비과세액, 부양가족·자녀 수와 소득세 방식을 입력합니다.','2026년 사회보험료와 세금 항목별 공제, 월 예상 실수령액을 계산합니다.','실제 원천징수는 간이세액표, 보수월액 상·하한과 회사 급여 규정에 따라 달라집니다.'],
'qr-code-generator':['URL·텍스트, 이미지 크기, 색상, 오류복원 수준과 여백을 입력합니다.','QR 이미지를 생성해 새 창에서 PNG로 열고 저장할 수 있습니다.','데이터가 외부 QR 서비스로 전송되며 배포 전 실제 카메라로 인식 여부를 검사하세요.'],
'vat-calculator':['금액, 부가세 포함 여부, 세율과 원 단위 처리 방식을 선택합니다.','공급가액, 부가세와 최종 합계를 분리해 계산합니다.','면세·영세율과 세금계산서의 단수 처리 규정은 거래 조건에 맞게 확인하세요.'],
'loan-calculator':['원금, 연이율, 기간과 원리금균등·원금균등·만기일시 방식을 선택합니다.','첫 달·마지막 달 상환액, 총 상환액과 총이자를 계산합니다.','변동금리, 일할 계산, 수수료와 중도상환은 포함하지 않습니다.'],
'compound-interest-calculator':['원금, 월 납입액, 연 수익률, 기간, 복리 주기와 세율을 입력합니다.','총 납입액과 세전 수익, 세금, 세후 만기금을 계산합니다.','월말 납입과 선택 주기 말 이자 지급을 가정하며 실제 상품 비용은 제외됩니다.'],
'wage-converter':['시급, 주 근로시간·근무일수와 주휴수당 포함 여부를 입력합니다.','주급, 월 환산액, 연봉과 유급 처리 시간을 보여줍니다.','세전 참고값이며 연장·야간·휴일 수당과 실제 근무일수는 별도입니다.'],
'date-calculator':['시작일, 종료일, 더할 일수와 양끝 날짜 포함 여부를 입력합니다.','기간 일수, 주 단위, 평일 수와 지정 일수 후 날짜를 계산합니다.','평일 수에는 대한민국 공휴일과 회사 휴무일이 포함되지 않습니다.'],
'timezone-converter':['날짜·시간, 입력 시간대와 변환 시간대를 선택합니다.','현지 표시 시간, UTC 오프셋과 ISO 시각을 제공합니다.','서머타임 전환 구간의 중복되거나 존재하지 않는 현지 시간은 별도 확인이 필요합니다.'],
'severance-pay-calculator':['입사일, 마지막 근무일, 퇴직 전 3개월 임금, 연간 상여·연차수당을 입력합니다.','재직일수와 3개월 산정일수, 1일 평균임금, 예상 퇴직금을 계산합니다.','휴직 등 평균임금 제외기간, 통상임금과 회사 규정은 공식 모의계산으로 재확인하세요.'],
'area-converter':['면적 값과 ㎡·평 변환 방향을 선택하거나 자주 쓰는 전용면적을 누릅니다.','1평=3.305785㎡ 기준의 양방향 환산값을 제공합니다.','아파트 전용면적과 공급면적은 다르므로 어떤 면적을 입력했는지 확인하세요.'],
'my-ip':['내 IP 확인 버튼을 누릅니다.','현재 연결의 공인 IPv4 또는 IPv6와 확인 시각을 표시합니다.','VPN, 프록시와 통신망 전환에 따라 값이 달라지며 ipify에 네트워크 요청을 보냅니다.'],
'pomodoro-timer':['집중·휴식 시간과 긴 주기 전 반복 횟수를 설정합니다.','진행 단계와 남은 시간을 표시하고 단계 전환 때 알림음을 냅니다.','브라우저 탭이 절전되면 알림 시점이 늦어질 수 있으니 중요한 일정용으로 쓰지 마세요.'],
'work-countdown':['출근·퇴근 시각, 휴게시간과 근무 요일을 설정합니다.','퇴근까지 남은 시간, 근무 진행률과 퇴근 후 경과 시간을 실시간 표시합니다.','브라우저를 닫으면 알림은 작동하지 않으며 회사의 실제 근태 기록을 대신하지 않습니다.'],
'ladder-game':['참가 인원과 당첨 인원을 정한 뒤 생성된 입력칸에 참가자 이름을 하나씩 적습니다.','사다리를 만든 뒤 참가자별 결과 보기를 누르면 경로가 위에서 아래로 움직이며 당첨 여부를 보여줍니다.','같은 이름은 중복 입력할 수 없으며 새 사다리를 만들면 결과가 달라집니다. 추첨 전 참가자와 당첨 인원을 함께 확인하세요.'],
'unit-converter':['종류, 숫자 값, 변환 전·후 단위를 선택합니다.','길이·무게·온도·속도·부피를 정밀 환산합니다.','컵과 큰술은 표시된 미터법 용량 기준이며 국가별 조리 단위와 다를 수 있습니다.'],
'random-number-generator':['로또 6/45 또는 일반 범위, 게임 수, 제외수와 중복·정렬 여부를 입력합니다.','편향을 줄인 브라우저 보안 난수로 최대 5게임의 번호를 추첨합니다.','난수 결과는 당첨을 예측·보장하지 않으며 구매는 무리하지 않는 범위에서 즐기세요.'],
'password-generator':['길이, 생성 개수와 포함할 문자군을 선택합니다.','각 문자군을 최소 한 번 포함하는 보안 난수 비밀번호를 생성합니다.','생성 후 안전한 비밀번호 관리자에 저장하고 다른 서비스에 재사용하지 마세요.'],
'nickname-generator':['한글·영문, 귀여운·감성·게임·깔끔한 분위기, 생성 개수와 선택 키워드를 설정합니다.','조건에 맞는 중복 없는 닉네임을 만들고 선택한 후보를 복사할 수 있습니다.','서비스별 금칙어와 중복 여부는 가입하려는 서비스에서 마지막으로 확인하세요.'],
'random-wheel':['후보를 한 줄씩 넣고 중복 제거와 당첨 항목 제거 여부를 선택합니다.','동일 확률로 하나를 추첨하고 회전 애니메이션과 결과를 표시합니다.','중요한 법적·금전적 추첨에는 참가자 합의와 별도 기록 절차가 필요합니다.'],
'dice-coin':['주사위 개수·면 수 또는 동전 개수를 입력합니다.','개별 결과와 주사위 합계·평균 또는 앞뒷면 개수를 표시합니다.','물리적 난수 인증이 필요한 게임이나 추첨을 대체하지는 않습니다.'],
'unix-timestamp-converter':['타임스탬프 단위와 값 또는 날짜·시간, 표시 시간대를 입력합니다.','Unix 초·밀리초, ISO 8601과 읽기 쉬운 현지 시간을 상호 변환합니다.','datetime-local 입력에는 시간대 정보가 없으므로 기기 현지 시간으로 해석됩니다.'],
'reaction-speed-test':['측정 횟수를 선택하고 시작한 뒤 화면이 초록색으로 바뀔 때 클릭합니다.','각 시도의 반응시간과 평균·최고 기록을 확인합니다.','신호 전에 클릭한 기록은 무효이며 기기·브라우저 지연에 따라 결과가 달라질 수 있습니다.'],
'memory-card-game':['난이도를 선택하고 카드를 뒤집어 같은 그림의 위치를 찾습니다.','완료 시간, 뒤집은 횟수와 최고 기록을 확인합니다.','카드 배치는 매번 보안 난수로 섞이며 새 게임을 누르면 진행 기록이 초기화됩니다.'],
'lunch-worldcup':['종합 32강·한식 16강·간편 메뉴·세계 메뉴 중 하나를 고릅니다. 원하는 경우에만 직접 메뉴를 입력합니다.','음식 사진이 있는 두 메뉴 중 하나를 계속 선택해 최종 우승 메뉴와 선택 경로를 확인합니다.','사진은 메뉴를 구분하기 위한 예시이며 실제 판매 음식과 다를 수 있습니다. 알레르기·식단 조건은 직접 확인하세요.'],
'daily-fortune':['생년월일, 확인할 날짜와 전체·일·금전·관계·컨디션 중 궁금한 분야를 선택합니다.','같은 날짜와 입력에는 같은 오락용 점수·한 줄 조언·행운 키워드가 표시됩니다.','운세는 오락과 자기성찰용이며 중요한 금전·의료·법률·인생 결정의 근거로 사용하지 마세요.'],
'zodiac-fortune':['생년월일과 운세를 확인할 날짜를 입력합니다.','태양 별자리, 분야별 메시지, 행운의 색과 숫자를 날짜별로 보여줍니다.','별자리 결과는 과학적 예측이 아닌 오락용 문구이므로 현실의 위험을 판단하는 데 사용하지 마세요.'],
'saju-elements':['양력 생년월일과 알고 있다면 태어난 시간대를 선택합니다.','JSON 규칙 데이터로 목·화·토·금·수 키워드의 상대적 분포와 강점·보완 문구를 조합합니다.','음력, 절기, 지역별 시차와 만세력을 계산한 전문 사주풀이가 아닌 순수한 오락용 성향 콘텐츠입니다.'],
'number-memory-test':['시작 버튼을 누르고 잠시 보이는 숫자를 기억합니다.','3자리부터 한 자리씩 늘어나는 문제와 3번의 기회, 브라우저 최고 기록을 제공합니다.','순간 기억 게임 결과는 인지능력 또는 건강 상태를 진단하지 않습니다.'],
'up-down-game':['숫자 범위와 시도 기회를 선택한 뒤 새 게임을 시작합니다.','UP·DOWN 힌트와 이전 추측 기록을 활용해 숨은 숫자를 최소 횟수로 찾습니다.','새 게임을 누르면 정답이 다시 생성되며 이전 게임의 숫자는 이어지지 않습니다.'],
'typing-speed-test':['시험 시간과 문장 길이를 고르고 한국어 제시 문장을 똑같이 입력합니다.','분당 한글 타수, WPM 환산, 정확도, 오타 추정과 거북이부터 고인물까지의 재미있는 등급을 보여줍니다.','브라우저·기기·한글 입력기에 따라 측정값이 달라질 수 있으며 공인 자격이나 능력 진단 결과가 아닙니다.'],
'buy-or-not-calculator':['물건 이름과 가격을 입력하고 월급 또는 시급 기준, 월 근무일수·하루 근무시간, 예상 사용 횟수를 설정합니다.','가격을 벌기 위해 필요한 노동시간·근무일과 사용 1회당 비용을 보여주고 판단 질문을 제공합니다.','세후 실수령액을 입력해야 체감 노동시간에 가까우며 할인, 유지비, 이자와 되팔 때의 가치는 별도로 고려하세요.'],
'resignation-letter-maker':['성명, 소속, 직위, 퇴직 예정일, 사유와 제출일을 입력합니다.','사직서 초안을 미리 보고 텍스트로 저장하거나 인쇄·PDF 저장합니다.','회사 규정의 제출기한과 인수인계 절차를 확인하고 최종 문구는 본인이 검토하세요.'],
'power-of-attorney-maker':['위임인·수임인 정보, 위임 업무와 유효기간을 입력합니다.','기본 위임장 초안을 미리 보고 텍스트 또는 인쇄본으로 저장합니다.','기관별 지정 양식, 인감증명서와 신분증 사본 등 별도 첨부 요구를 반드시 확인하세요.'],
'simple-receipt-maker':['발행일, 공급자, 구매자, 품목, 금액과 결제방법을 입력합니다.','합계가 표시된 간이 영수증을 인쇄하거나 텍스트로 저장합니다.','세법상 적격증빙 인정 여부는 거래 유형과 금액에 따라 다르므로 세무 전문가에게 확인하세요.'],
'transaction-statement-maker':['공급자·공급받는 자 정보와 품목별 수량·단가·세율을 입력합니다.','공급가액, 세액과 합계를 자동 계산한 거래명세서를 생성합니다.','거래명세서는 세금계산서를 대체하지 않으며 사업자정보와 반올림 금액을 확인하세요.'],
'certified-content-letter-maker':['발신인·수신인 정보, 제목, 사실관계, 요구사항과 이행기한을 입력합니다.','날짜와 항목이 정리된 내용증명 초안을 텍스트 또는 인쇄본으로 저장합니다.','내용증명은 발송 사실과 내용을 증명할 뿐 주장 자체의 진위를 확정하지 않으므로 분쟁 시 전문가 검토를 받으세요.'],
'employment-contract-maker':['사용자·근로자 정보, 계약기간, 근무장소, 업무, 근로시간, 임금, 지급일, 휴일과 연차를 입력합니다.','근로기준법 제17조의 주요 명시사항을 포함한 계약서 초안을 생성합니다.','사업장 규모와 근로형태에 따라 적용 기준이 달라질 수 있으므로 고용노동부 표준서식과 노무 전문가에게 최종 확인하세요.'],
'message-template-bank':['연차 요청, 결혼식 불참, 거래처 거절, 일정 변경, 지각 사과 등 상황과 말투를 선택하고 이름·날짜 같은 선택 정보를 입력합니다.','상황별 문구 여러 개를 비교해 바로 복사한 뒤 괄호 속 정보와 사실관계를 본인 상황에 맞게 고칩니다.','대필 문구는 참고 초안입니다. 상대와의 관계, 조직 문화와 실제 약속을 반영하고 사실과 다른 내용은 보내지 마세요.']};
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const header=`<header><nav class="nav"><a class="brand" href="../../"><span class="mark">ㅆ</span>쓸모칸</a><div class="navlinks"><a href="../../#tools">전체 도구</a><a href="../../about/">소개</a><a href="../../privacy/">개인정보</a></div><button class="theme" data-theme aria-label="다크 모드">☾</button></nav></header>`;
const footer=`<footer><div class="foot"><b>쓸모 있는 도구를 한 칸에</b><span><a href="../../guide/">사용가이드</a><a href="../../about/">소개</a><a href="../../privacy/">개인정보처리방침</a><a href="../../terms/">이용약관</a><a href="../../contact/">문의</a></span><span>© <i data-year></i> SEULMOKAN</span></div></footer>`;
for(let i=0;i<tools.length;i++){const [slug,title,cat,desc]=tools[i];const related=tools.filter((x,j)=>x[2]===cat&&j!==i).slice(0,3);const url=base+'tools/'+slug+'/';const note=notes[slug]||'',guide=guideDetails[slug];if(!guide)throw Error(`${slug} 상세 안내 없음`);const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — 무료 온라인 도구 | 쓸모칸</title><meta name="description" content="${esc(desc)} 설치와 로그인 없이 무료로 사용할 수 있습니다."><meta name="keywords" content="${esc(metaKeywords(title,cat))}"><meta name="google-adsense-account" content="ca-pub-9462573435168414"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ko-KR" href="${url}"><link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:site_name" content="쓸모칸"><meta property="og:title" content="${esc(title)} | 쓸모칸"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}assets/og-image.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="쓸모칸 로고"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} | 쓸모칸"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${base}assets/og-image.png"><link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><link rel="stylesheet" href="../../assets/site.css"><link rel="stylesheet" href="../../assets/tool-ui.css"><script type="application/ld+json">${JSON.stringify(schemaFor(title,url,desc,cat,guide))}</script></head><body>${header}<main class="wrap"><div class="crumb"><a href="../../">홈</a> / ${esc(cat)} / ${esc(title)}</div><section class="hero"><div class="eyebrow">${esc(cat)}</div><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p><div class="badges"><span class="badge">무료</span><span class="badge">로그인 없음</span><span class="badge">모바일 지원</span><span class="badge">브라우저 처리</span></div></section><div class="layout"><div><section class="panel" id="tool" data-slug="${slug}" aria-label="${esc(title)} 실행 영역"><p>도구를 불러오는 중입니다.</p></section><aside class="ad" aria-label="광고">ADVERTISEMENT<br>반응형 광고 영역</aside><article class="content-card tool-guide" data-guide="complete"><h2>${esc(title)} 사용 방법</h2><ol><li><b>입력값 준비:</b> ${esc(guide[0])}</li><li><b>실행과 확인:</b> 필요한 옵션을 고른 다음 계산·변환·생성 버튼을 누릅니다. 잘못된 값은 결과 영역에 수정 방법과 함께 표시됩니다.</li><li><b>결과 활용:</b> ${esc(guide[1])}</li></ol><h2>입력값과 결과 읽는 법</h2><p>${esc(desc)} 입력 범위가 있는 숫자와 날짜는 범위를 벗어나면 계산하지 않으며, 결과는 한국어 숫자 표기와 단위를 함께 표시합니다. 초기화 버튼으로 예시값을 복원하고 Ctrl 또는 ⌘ + Enter로 빠르게 실행할 수 있습니다.</p><h2>사용 전 확인사항</h2><p>${esc(guide[2])}</p><h2>개인정보와 처리 방식</h2><p>대부분의 계산과 변환은 현재 브라우저에서 실행되어 입력값을 쓸모칸 서버에 저장하지 않습니다. 외부 연결이 필요한 기능은 실행 영역과 개인정보처리방침에 전송 대상과 목적을 표시합니다.</p>${note}<h2>자주 묻는 질문</h2><h3>${esc(title)}${topic(title)} 무료인가요?</h3><p>네. 회원가입과 설치 없이 무료로 사용할 수 있습니다.</p><h3>어떤 값을 입력해야 하나요?</h3><p>${esc(guide[0])}</p><h3>결과가 공식 증빙으로 사용되나요?</h3><p>일반 변환값은 바로 활용할 수 있지만 급여·금융·건강·근로 관련 수치는 참고용입니다. 중요한 결정 전에는 최신 공식 자료와 담당 기관의 결과를 확인하세요.</p></article><section class="content-card"><h2>관련 도구</h2><div class="related">${related.map(x=>`<a href="../${x[0]}/">${esc(x[1])} →</a>`).join('')}</div></section></div><aside class="side"><div class="ad">ADVERTISEMENT<br>300 × 400</div></aside></div></main>${footer}<script src="../../assets/common.js"></script><script src="../../assets/tools.js"></script></body></html>`;const dir=path.join(root,'tools',slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);}
const infoPages={guide:['사용가이드','쓸모칸의 도구를 빠르고 안전하게 사용하는 방법을 안내합니다.','홈에서 검색창이나 카테고리 필터로 필요한 도구를 찾고, 도구 페이지의 입력란에 값을 넣은 다음 실행 버튼을 누르세요. 결과 복사가 제공되는 도구는 버튼 한 번으로 클립보드에 저장할 수 있습니다.<h2>도구별 확인 사항</h2><p>텍스트·개발 도구는 대부분 브라우저 안에서 처리됩니다. 날짜와 단위는 입력 형식을 확인하고, 생성 결과는 복사 전에 한 번 검토하세요.</p><h2>중요한 계산 결과</h2><p>급여·금융 계산은 참고값입니다. 세금과 보험료는 적용 연도 및 개인 조건에 따라 달라지므로 중요한 결정 전에는 공식 기준을 다시 확인하세요.</p><h2>외부 서비스 사용</h2><p>내 IP 확인과 QR코드 생성기는 기능 수행을 위해 외부 서비스에 요청하며 실행 화면에 데이터 전송 사실을 표시합니다.</p>'],about:['쓸모칸 소개','작은 작업 하나가 하루를 무겁게 만들지 않도록, 빠르고 안전한 온라인 도구를 만듭니다.','쓸모칸은 반복되는 계산과 변환을 설치나 회원가입 없이 끝낼 수 있도록 만든 무료 온라인 유틸리티 서비스입니다.<h2>운영 원칙</h2><p>가능한 작업은 사용자의 브라우저 안에서 처리하고, 기능보다 광고가 앞서지 않는 경험을 지향합니다. 작동하지 않는 링크를 공개하지 않고 계산 기준과 제한사항을 함께 설명합니다.</p><h2>콘텐츠 관리</h2><p>도구의 기능, 안내문과 계산 기준은 쓸모칸 운영자가 직접 관리합니다. 오류가 발견되면 문의 페이지를 통해 제보할 수 있습니다.</p>'],privacy:['개인정보처리방침','쓸모칸에서 입력 데이터와 접속 정보가 어떻게 처리되는지 개인정보 보호 원칙을 자세히 안내합니다.','<p><b>시행일: 2026년 9월 13일</b></p><h2>입력 데이터</h2><p>쓸모칸의 일반 도구는 입력값을 브라우저 내부에서 처리하며 별도 서버에 저장하지 않습니다. 내 IP 확인은 ipify, QR코드 생성은 QR Server에 요청하며 해당 화면에서 전송 사실을 안내합니다.</p><h2>파일 처리와 외부 라이브러리</h2><p>이미지·PSD·Excel 파일은 브라우저 메모리에서 처리되며 쓸모칸 서버로 업로드하지 않습니다. 기능 실행에 필요한 Three.js, SheetJS, fflate, ag-psd 및 AI 모델 코드는 외부 CDN에서 내려받을 수 있으며, 이때 CDN 사업자가 접속 관련 기술 로그를 처리할 수 있습니다.</p><h2>접속 기록과 외부 자원</h2><p>사이트는 GitHub Pages에서 제공되며 Pretendard 폰트를 jsDelivr에서 불러옵니다. 각 사업자는 보안과 서비스 제공을 위해 IP 주소, 브라우저 정보와 같은 기술 로그를 처리할 수 있습니다.</p><h2>광고와 쿠키</h2><p>현재 Google AdSense 사이트 확인용 메타태그가 적용되어 있습니다. 광고를 실제 게재하면 Google과 제3자 광고 사업자가 쿠키 또는 유사 기술을 사용해 광고를 제공하고 성과를 측정할 수 있으며 필요한 동의·거부 수단을 함께 제공합니다.</p><h2>문의 정보</h2><p>이메일 문의 시 발신 주소, 제목과 본문이 Cloudflare Email Routing을 거쳐 운영자의 메일함으로 전달되며 문의 확인과 답변을 위해 보관될 수 있습니다. 민감한 개인정보는 보내지 마세요. 개인정보 관련 요청은 contact@seulmokan.com으로 접수할 수 있습니다.</p>'],terms:['이용약관','무료 온라인 도구인 쓸모칸을 안전하고 올바르게 이용하기 위한 권리와 책임을 안내합니다.','<p><b>시행일: 2026년 9월 13일</b></p><h2>서비스 제공</h2><p>쓸모칸은 회원가입 없이 사용할 수 있는 무료 온라인 도구를 현재 상태로 제공합니다. 기능과 제공 범위는 보안, 정확성 및 운영상 필요에 따라 변경될 수 있습니다.</p><h2>결과의 활용</h2><p>계산 결과는 참고용이며 법률·세무·금융·의료 전문가의 판단을 대신하지 않습니다. 사용자는 중요한 결과를 공식 자료와 대조해야 합니다.</p><h2>사용자의 책임</h2><p>사용자는 본인이 사용할 권한이 있는 데이터만 입력해야 하며 타인의 개인정보와 저작권을 침해해서는 안 됩니다. 결과 사용 전 최종 확인 책임은 사용자에게 있습니다.</p><h2>외부 서비스</h2><p>일부 기능은 외부 서비스의 가용성과 정책에 영향을 받을 수 있습니다. 외부 서비스로 전송되는 정보는 해당 도구 화면에서 안내합니다.</p>'],contact:['문의하기','쓸모칸 도구의 오류를 제보하거나 필요한 새로운 기능과 온라인 도구를 제안하는 방법을 안내합니다.','<h2>문의 방법</h2><p>contact@seulmokan.com으로 이메일을 보내주세요. 아래 버튼을 누르면 기본 메일 앱이 열립니다. 사용한 도구 이름, 문제 상황과 기대한 결과를 함께 적어주시면 확인에 도움이 됩니다.</p><h2>오류 제보에 포함할 내용</h2><p>도구 이름, 사용한 브라우저, 입력값의 형식과 발생한 오류를 알려주면 확인에 도움이 됩니다. 실제 개인정보 대신 재현 가능한 예시 값을 사용하세요.</p><h2>보내면 안 되는 정보</h2><p>비밀번호, 주민등록번호, 계좌·카드정보, 업무상 비밀과 같은 민감한 내용은 보내지 마세요.</p>']};
for(const [slug,[title,lead,body]] of Object.entries(infoPages)){const url=base+slug+'/';const extra=slug==='contact'?`<p><a class="btn" href="mailto:contact@seulmokan.com?subject=%EC%93%B8%EB%AA%A8%EC%B9%B8%20%EB%AC%B8%EC%9D%98">이메일로 문의하기</a></p><p><a href="mailto:contact@seulmokan.com">contact@seulmokan.com</a></p>`:'';const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 쓸모칸</title><meta name="description" content="${lead}"><meta name="keywords" content="쓸모칸, ${title}, 무료 온라인 도구"><meta name="google-adsense-account" content="ca-pub-9462573435168414"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ko-KR" href="${url}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:site_name" content="쓸모칸"><meta property="og:title" content="${title} | 쓸모칸"><meta property="og:description" content="${lead}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}assets/og-image.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="쓸모칸 로고"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title} | 쓸모칸"><meta name="twitter:description" content="${lead}"><meta name="twitter:image" content="${base}assets/og-image.png"><link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><link rel="stylesheet" href="../assets/site.css"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:title,url,description:lead,inLanguage:'ko-KR'})}</script></head><body>${header.replaceAll('../../','../')}<main class="wrap"><div class="crumb"><a href="../">홈</a> / ${title}</div><section class="hero"><div class="eyebrow">SEULMOKAN</div><h1>${title}</h1><p class="lead">${lead}</p></section><article class="content-card">${body}${extra}<h2>운영 원칙</h2><ul><li>실제로 작동하는 도구만 공개합니다.</li><li>가능한 모든 처리는 브라우저 내부에서 수행합니다.</li><li>광고가 도구 사용을 방해하지 않도록 배치합니다.</li><li>오류와 변경된 계산 기준을 지속적으로 바로잡습니다.</li></ul><p>최종 수정일: 2026년 9월 13일</p></article></main>${footer.replaceAll('../../','../')}<script src="../assets/common.js"></script></body></html>`;const dir=path.join(root,slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);}
const urls=[base,...Object.keys(infoPages).map(x=>base+x+'/'),...tools.map(x=>base+'tools/'+x[0]+'/')],lastmod=new Date().toISOString().slice(0,10);fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')+'\n</urlset>\n');fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`);fs.writeFileSync(path.join(root,'404.html'),`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>페이지를 찾을 수 없습니다 | 쓸모칸</title><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/site.css"></head><body><main class="wrap"><article class="content-card"><div class="eyebrow">404</div><h1>페이지를 찾을 수 없습니다</h1><p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p><p><a class="btn" href="${base}">전체 도구로 돌아가기</a></p></article></main></body></html>`);console.log(`generated ${tools.length} tools, ${Object.keys(infoPages).length} info pages, ${urls.length} sitemap URLs`);
