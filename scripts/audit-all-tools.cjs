const {chromium}=require('C:/Users/rbska/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const root=path.resolve(__dirname,'..'),port=8773,base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,[path.join(__dirname,'serve.mjs'),String(port)],{cwd:root,windowsHide:true});
const specialText={
  'json-formatter':'{"name":"쓸모칸","count":2}',
  'url-encoder-decoder':'https://example.com/검색?q=무료 도구',
  'html-entity-converter':'<p>쓸모칸 & 도구</p>',
  'slug-generator':'Useful Online Tool',
  'markdown-preview':'# 제목\n\n**굵은 글씨**와 목록\n\n- 하나\n- 둘',
  'csv-json-converter':'이름,점수\n홍길동,90\n김영희,85',
  'text-diff-checker':'첫째 줄\n둘째 줄',
  'duplicate-line-remover':'사과\n배\n사과',
  'case-converter':'hello useful tools',
  'whitespace-remover':'첫째  문장\n\n둘째 문장',
  'character-byte-counter':'한글 ABC 123',
  'list-to-excel':'이름,점수\n홍길동,90',
  'message-template-bank':'테스트',
  'cover-letter-helper':'고객 문의 데이터를 분석해 반복 문의를 20% 줄였습니다.',
  'interview-question-planner':'고객 문의 500건을 분석해 도움말을 개선한 경험',
  'one-minute-introduction-builder':'고객 문의 500건을 분석해 반복 문의를 20% 줄였습니다.'
};
const existingDeep=new Set(['dice-coin','random-number-generator','ladder-game','random-wheel','image-compressor','image-cropper','background-remover','psd-image-converter','list-to-excel','nickname-generator','reaction-speed-test','memory-card-game','lunch-worldcup','buy-or-not-calculator','message-template-bank','daily-fortune','zodiac-fortune','saju-elements','typing-speed-test','up-down-game','resignation-letter-maker','simple-receipt-maker','transaction-statement-maker','employment-contract-maker','power-of-attorney-maker','certified-content-letter-maker']);
const explicit={
  'meta-tag-preview':{title:'무료 온라인 도구',description:'계산과 변환을 브라우저에서 바로 처리하는 무료 온라인 도구입니다.',url:'https://www.seulmokan.com/'},
  'cover-letter-helper':{clCompany:'쓸모회사',clRole:'서비스 기획',clSituation:'고객 문의가 반복되어 응답 시간이 길어지는 문제가 있었습니다.',clAction:'문의 500건을 유형별로 분류하고 상위 원인을 찾아 도움말과 안내 흐름을 개편했습니다.',clResult:'반복 문의가 20% 감소하고 평균 응답 시간이 2일에서 1일로 줄었습니다.',clConnection:'데이터를 근거로 고객 문제의 우선순위를 정하는 데 활용하겠습니다.'},
  'interview-question-planner':{interviewCompany:'B2B SaaS',interviewExperience:'고객 문의 500건을 분석해 반복 문의를 20% 줄였습니다.'},
  'one-minute-introduction-builder':{introRole:'서비스 기획',introStrength:'고객 문제를 수치로 확인하는 실행력',introExperience:'고객 문의 500건을 분석하고 도움말을 개편해 반복 문의를 20% 줄였습니다.',introContribution:'고객 행동과 문의 데이터를 함께 살펴 제품 개선 우선순위를 정하겠습니다.'}
};
const badWords=/도구 설정을 불러오지 못했습니다|NaN|Infinity|undefined|\[object Object\]/;
const liveTools=new Set(['character-byte-counter','flexbox-playground','markdown-preview','work-countdown']);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{let browser;const results=[];try{
  await delay(500);browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
  const slugs=fs.readdirSync(path.join(root,'tools')).filter(s=>fs.existsSync(path.join(root,'tools',s,'index.html'))).sort();
  for(const slug of slugs){const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/favicon|net::ERR/.test(m.text()))errors.push(m.text())});
    try{
      const response=await page.goto(`${base}/tools/${slug}/`,{waitUntil:'domcontentloaded'});if(!response||response.status()!==200)throw Error(`HTTP ${response?.status()}`);
      await page.waitForFunction(()=>document.querySelector('#tool input,#tool textarea,#tool button'),null,{timeout:20000});
      const initial=await page.locator('#tool').innerText();if(/불러오는 중|불러오지 못했습니다/.test(initial))throw Error('도구 초기화 실패');
      if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('모바일 가로 넘침');
      if(await page.locator('html').evaluate(e=>e.classList.contains('dark')))throw Error('기본 다크 모드');
      const values=explicit[slug]||{};
      for(const [id,value] of Object.entries(values)){const el=page.locator('#'+id);if(await el.count())await el.fill(value)}
      let mode=existingDeep.has(slug)?'existing-deep':'generic';
      if(slug==='number-memory-test'){
        await page.click('#memoryStart');await page.waitForSelector('#memoryStage strong',{timeout:5000});const target=(await page.locator('#memoryStage strong').innerText()).trim();if(!/^\d{3}$/.test(target))throw Error('기억할 숫자 표시 이상');await page.waitForFunction(()=>!document.querySelector('#memoryAnswer').disabled,null,{timeout:5000});await page.fill('#memoryAnswer',target);await page.click('#memorySubmit');if(!/정답/.test(await page.locator('#result').innerText()))throw Error('정답 판정 실패');mode='game-round';
      }else if(!existingDeep.has(slug)){
        const inputs=page.locator('#tool input:not([type=file]):not([type=checkbox]):not([type=radio]):not([disabled]),#tool textarea:not([disabled])');
        for(let i=0;i<await inputs.count();i++){const el=inputs.nth(i),id=await el.getAttribute('id'),type=(await el.getAttribute('type'))||'text',value=await el.inputValue();if(value)continue;let fill=specialText[slug]||'테스트 입력';if(type==='number'){const min=Number(await el.getAttribute('min'));fill=String(Number.isFinite(min)?Math.max(min,1):1)}else if(type==='date')fill='2026-09-30';else if(type==='datetime-local')fill='2026-09-30T12:00';else if(type==='time')fill='18:00';else if(type==='email')fill='test@example.com';else if(type==='url')fill='https://example.com/';if(id&&values[id]!=null)fill=values[id];await el.fill(fill)}
        if(slug==='image-base64-converter'){
          const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lVx8GQAAAABJRU5ErkJggg==','base64');await page.setInputFiles('#file',{name:'pixel.png',mimeType:'image/png',buffer:png});await delay(200);const text=await page.locator('#tool').innerText();if(!/data:image\/png;base64/i.test(text))throw Error('Base64 결과 없음');mode='file-input';
        }else if(slug==='meta-tag-preview'){
          await delay(200);const text=await page.locator('#result').innerText();if(!text.includes('제목 길이')||!text.includes('HTTPS')||!text.includes('<meta name="description"'))throw Error('메타태그 미리보기 결과 이상');mode='live';
        }else if(liveTools.has(slug)){
          await delay(300);const text=await page.locator('#tool').innerText();if(badWords.test(text)||text.length<initial.length)throw Error('실시간 결과 이상');mode='live';
        }else{
        const before=await page.locator('#result').count()?await page.locator('#result').innerText():initial;
        const candidates=['#run','#calculate','#convert','#generate','#preview','#interviewRun','#clRun','#introRun','#fromTs','#fromDate'];let clicked=false;
        for(const selector of candidates){const b=page.locator(selector);if(await b.count()&&await b.isVisible()&&await b.isEnabled()){await b.click();clicked=true;break}}
        if(!clicked){const buttons=page.locator('#tool button:not([disabled])');for(let i=0;i<await buttons.count();i++){const b=buttons.nth(i),t=(await b.innerText()).trim();if(!/복사|초기화|다운로드|인쇄|저장|삭제|지우기|다크/.test(t)){await b.click();clicked=true;break}}}
        if(clicked){await delay(250);const after=await page.locator('#result').count()?await page.locator('#result').innerText():await page.locator('#tool').innerText();if(after===before)throw Error('실행 후 결과 변화 없음');if(badWords.test(after))throw Error(`비정상 결과: ${after.slice(0,100)}`)}else mode='load-only';
        }
      }
      if(errors.length)throw Error(errors.join(' | '));results.push({slug,status:'PASS',mode});console.log(JSON.stringify(results.at(-1)));
    }catch(e){results.push({slug,status:'FAIL',error:e.message,errors});console.log(JSON.stringify(results.at(-1)))}finally{await page.close()}
  }
  fs.writeFileSync(path.join(__dirname,'audit-results','all-tools.json'),JSON.stringify(results,null,2));
  const failed=results.filter(x=>x.status==='FAIL');console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length,failures:failed.map(x=>x.slug)}));process.exitCode=failed.length?1:0;
}finally{await browser?.close();server.kill()}})();
