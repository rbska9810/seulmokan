const H=window.SM_HANDLERS=window.SM_HANDLERS||{},SM=window.SM;
let dataPromise;
const loadData=()=>dataPromise??=fetch('../../assets/fortune-data.json').then(response=>{if(!response.ok)throw Error('운세 데이터를 불러오지 못했습니다.');return response.json()});
let lunarPromise;
const loadLunar=()=>{
  if(window.Solar&&window.Lunar)return Promise.resolve();
  return lunarPromise??=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/lunar-javascript@1.7.3/lunar.js';
    script.onload=()=>window.Solar&&window.Lunar?resolve():reject(Error('만세력 계산기를 초기화하지 못했습니다.'));
    script.onerror=()=>reject(Error('만세력 라이브러리를 내려받지 못했습니다. 인터넷 연결을 확인하세요.'));
    document.head.append(script);
  });
};
const today=()=>{const d=new Date(),offset=d.getTimezoneOffset()*60000;return new Date(d-offset).toISOString().slice(0,10)};
const hash=text=>{let value=2166136261;for(const char of text){value^=char.codePointAt(0);value=Math.imul(value,16777619)}return value>>>0};
const pick=(list,seed,step=0)=>list[(seed+step*2654435761>>>0)%list.length];
const score=(seed,step=0,min=62,max=96)=>min+((seed+step*2246822519>>>0)%(max-min+1));
const notice='<p class="fortune-notice">🎙️ 오락·자기성찰용 결과입니다. 의료·금전·법률·인생의 중요한 결정의 근거로 사용하지 마세요.</p>';
const copyButton='<div class="actions result-actions"><button class="btn secondary" id="fortuneCopy" type="button">결과 복사</button></div>';
const wireCopy=()=>SM.q('#fortuneCopy')?.addEventListener('click',()=>SM.copy(SM.q('#result').innerText));

H['daily-fortune']=()=>{
  SM.box.innerHTML=`<div class="grid2">${SM.field('birth','생년월일','date','','required')}${SM.field('fortuneDate','운세 날짜','date',today(),'required')}${SM.select('focus','궁금한 분야',[['overall','전체운'],['work','일·학업운'],['money','금전운'],['relationship','애정·대인운'],['health','컨디션']])}</div>${SM.buttons('오늘의 운세 보기')}`;
  SM.wire(async()=>{const data=await loadData(),birth=SM.required('birth'),date=SM.required('fortuneDate'),focus=SM.val('focus');if(birth>today())throw Error('생년월일은 오늘 이전이어야 합니다.');const seed=hash(`${birth}|${date}|${focus}`),total=score(seed),label=total>=90?'흐름이 좋은 날':total>=78?'차분히 풀리는 날':total>=68?'균형이 필요한 날':'속도를 조절할 날';const categories=['work','money','relationship','health'];const metrics=categories.map((key,index)=>`<div class="metric"><span>${{work:'일·학업',money:'금전',relationship:'관계',health:'컨디션'}[key]}</span><b>${score(seed,index+2,55,95)}점</b></div>`).join('');const text=pick(data.daily[focus]||data.daily.overall,seed,1);SM.result(`<div class="fortune-hero"><span>${date}</span><strong>${total}점</strong><b>${label}</b></div><p class="fortune-summary">${SM.esc(text)}</p><div class="metric-grid">${metrics}</div><div class="fortune-lucky"><span>🎨 행운의 색 <b>${pick(data.daily.colors,seed,3)}</b></span><span>🎒 행운 아이템 <b>${pick(data.daily.items,seed,4)}</b></span><span>🔢 행운 숫자 <b>${1+seed%45}</b></span></div>${notice}${copyButton}`,true);wireCopy()});
};

const zodiacFor=(month,day,data)=>data.zodiac.find(sign=>{const [fm,fd]=sign.from,[tm,td]=sign.to;if(fm>tm)return month===fm&&day>=fd||month===tm&&day<=td;return month===fm&&day>=fd||month===tm&&day<=td})||data.zodiac[0];
H['zodiac-fortune']=()=>{
  SM.box.innerHTML=`<div class="grid2">${SM.field('birth','생년월일로 별자리 찾기','date','','required')}${SM.field('fortuneDate','운세 날짜','date',today(),'required')}</div><p class="hint">생년월일로 태양 별자리를 계산합니다.</p>${SM.buttons('별자리 운세 보기')}`;
  SM.wire(async()=>{const data=await loadData(),birth=SM.required('birth'),date=SM.required('fortuneDate');if(birth>today())throw Error('생년월일은 오늘 이전이어야 합니다.');const [,month,day]=birth.split('-').map(Number),sign=zodiacFor(month,day,data),seed=hash(`${sign.id}|${date}`),total=score(seed);SM.result(`<div class="zodiac-hero"><span>${sign.symbol}</span><div><small>${birth.slice(5).replace('-','.')} 태생</small><strong>${sign.name}</strong><p>${sign.trait}</p></div><b>${total}점</b></div><p class="fortune-summary">${sign.message} ${pick(data.daily.overall,seed,1)}</p><div class="fortune-columns"><div><span>일·학업</span><p>${pick(data.daily.work,seed,2)}</p></div><div><span>금전</span><p>${pick(data.daily.money,seed,3)}</p></div><div><span>관계</span><p>${pick(data.daily.relationship,seed,4)}</p></div><div><span>컨디션</span><p>${pick(data.daily.health,seed,5)}</p></div></div><div class="fortune-lucky"><span>행운의 색 <b>${pick(data.daily.colors,seed,6)}</b></span><span>행운 숫자 <b>${1+seed%45}</b></span></div>${notice}${copyButton}`,true);wireCopy()});
};

H['saju-elements']=()=>{
  SM.box.innerHTML=`<div class="grid2">${SM.select('calendarType','생일 기준',[['solar','양력'],['lunar','음력']])}${SM.field('birth','생년월일','date','','required')}${SM.field('birthTime','태어난 시각','time','12:00')}${SM.check('unknownTime','태어난 시각 모름')}</div><div id="lunarOptions" hidden>${SM.check('leapMonth','음력 윤달')}</div><p class="hint">한국 표준시를 기준으로 절기와 만세력을 적용해 연주·월주·일주·시주를 계산합니다. 출생 시각을 모르면 시주는 표시하지 않습니다.</p>${SM.buttons('사주팔자 보기')}`;
  const calendar=SM.q('#calendarType'),lunarOptions=SM.q('#lunarOptions'),time=SM.q('#birthTime'),unknown=SM.q('#unknownTime');
  calendar.addEventListener('change',()=>lunarOptions.hidden=calendar.value!=='lunar');
  unknown.addEventListener('change',()=>{time.disabled=unknown.checked});
  SM.wire(async()=>{
    const [data]=await Promise.all([loadData(),loadLunar()]),birth=SM.required('birth');
    if(calendar.value==='solar'&&birth>today())throw Error('생년월일은 오늘 이전이어야 합니다.');
    const [year,month,day]=birth.split('-').map(Number),[hour,minute]=(time.value||'12:00').split(':').map(Number);
    let solar;
    try{
      if(calendar.value==='lunar'){
        const lunarMonth=SM.q('#leapMonth').checked?-month:month;
        solar=window.Lunar.fromYmdHms(year,lunarMonth,day,unknown.checked?12:hour,unknown.checked?0:minute,0).getSolar();
      }else solar=window.Solar.fromYmdHms(year,month,day,unknown.checked?12:hour,unknown.checked?0:minute,0);
    }catch{throw Error('입력한 날짜를 만세력으로 변환할 수 없습니다. 윤달 여부와 날짜를 확인하세요.')}
    const lunar=solar.getLunar(),eight=lunar.getEightChar();
    const pillars=[['연주',eight.getYear()],['월주',eight.getMonth()],['일주',eight.getDay()]];
    if(!unknown.checked)pillars.push(['시주',eight.getTime()]);
    const stemElement={甲:'wood',乙:'wood',丙:'fire',丁:'fire',戊:'earth',己:'earth',庚:'metal',辛:'metal',壬:'water',癸:'water'};
    const branchElement={寅:'wood',卯:'wood',巳:'fire',午:'fire',辰:'earth',戌:'earth',丑:'earth',未:'earth',申:'metal',酉:'metal',亥:'water',子:'water'};
    const keys=['wood','fire','earth','metal','water'],counts=Object.fromEntries(keys.map(key=>[key,0]));
    for(const [,value] of pillars){counts[stemElement[value[0]]]++;counts[branchElement[value[1]]]++}
    const ranked=keys.toSorted((a,b)=>counts[b]-counts[a]),strong=data.elements[ranked[0]],weak=data.elements[ranked.at(-1)],dayMaster=data.elements[stemElement[eight.getDayGan()]],max=Math.max(...Object.values(counts),1);
    const pillarCards=pillars.map(([label,value],index)=>`<div class="saju-pillar"><span>${label}</span><strong>${value}</strong><small>${index===2?'나를 나타내는 일주':index===0?'가문·초년의 자리':index===1?'사회·성장의 자리':'후반·표현의 자리'}</small></div>`).join('');
    const bars=keys.map(key=>{const item=data.elements[key];return `<div class="element-row"><span>${item.symbol} ${item.name}</span><i><b style="width:${Math.round(counts[key]/max*100)}%"></b></i><strong>${counts[key]}</strong></div>`}).join('');
    const solarText=`${solar.getYear()}-${String(solar.getMonth()).padStart(2,'0')}-${String(solar.getDay()).padStart(2,'0')}`;
    SM.result(`<div class="saju-heading"><small>${calendar.value==='lunar'?'음력 입력을 양력으로 환산 · ':''}${solarText}${unknown.checked?' · 출생 시각 미상':''}</small><h3>사주 원국</h3></div><div class="saju-pillars">${pillarCards}</div><div class="element-title"><span>${dayMaster.symbol}</span><div><small>일간 · 나를 나타내는 중심 기운</small><strong>${eight.getDayGan()} · ${dayMaster.name}</strong><p>${dayMaster.keywords.join(' · ')}</p></div></div><h3 class="result-subtitle">팔자에 드러난 오행</h3><div class="element-bars">${bars}</div><div class="fortune-columns"><div><span>두드러진 오행</span><p>${strong.name}의 비중이 높습니다. ${strong.strength}</p></div><div><span>적게 드러난 오행</span><p>${weak.name}의 글자가 적습니다. 부족하다고 단정하기보다 전체 조합과 계절을 함께 봐야 합니다.</p></div><div><span>일간 성향 참고</span><p>${dayMaster.caution}</p></div><div><span>해석 범위</span><p>현재 결과는 원국 네 기둥과 표면 오행을 보여줍니다. 용신·대운처럼 학파별 판단이 필요한 항목은 단정하지 않습니다.</p></div></div><p class="fortune-notice">절기 기반 만세력으로 사주팔자를 계산하지만, 출생지에 따른 진태양시 보정과 학파별 해석 차이는 반영하지 않습니다. 전통문화·자기성찰용 참고 결과이며 중요한 결정을 대신하지 않습니다.</p>${copyButton}`,true);wireCopy()
  });
};
