const SM=window.SM;
const H=window.SM_HANDLERS;
const E=SM.esc;

H['message-template-bank']=()=>{
  const banks={
    leave:['{to}, 안녕하세요. 개인 일정으로 {date} 연차를 사용하고자 합니다. {plan} 확인 부탁드립니다.','{to}, {date} 연차 사용 가능할지 문의드립니다. 업무에 차질 없도록 미리 정리해두겠습니다.','안녕하세요, {to}. {date} 개인 사정으로 휴가를 신청드립니다. 필요한 업무는 사전에 인계하겠습니다. 감사합니다.'],
    wedding:['{to}, 결혼 진심으로 축하해! {reason} 참석하지 못할 것 같아 정말 미안해. 두 사람의 앞날에 행복한 일만 가득하길 바랄게.','{to}, 결혼을 진심으로 축하드립니다. {reason} 예식에 참석하지 못해 죄송합니다. 멀리서나마 두 분의 행복한 앞날을 기원하겠습니다.','{to}, 초대해줘서 정말 고마워. 직접 가지 못해 아쉽지만 마음만은 누구보다 크게 축하할게. 행복하게 잘 살아!'],
    reject:['{to}, 안녕하세요. {subject}을 내부적으로 검토했으나 현재 일정과 조건을 고려할 때 이번에는 진행이 어렵습니다. 좋은 제안에 감사드리며 향후 적합한 기회가 생기면 다시 연락드리겠습니다.','{to}, {subject} 잘 확인했습니다. 검토 결과 현재는 협업을 진행하기 어렵다는 결론을 내렸습니다. 시간 내어 제안해주신 점에 감사드리며 너른 양해 부탁드립니다.','{to}, 제안에 감사드립니다. 다만 현재 예산과 우선순위상 도입이 어려워 이번 건은 정중히 사양하고자 합니다. 조건이 변경되면 추후 다시 검토하겠습니다.'],
    delay:['{to}, 죄송하지만 {reason} 약속드린 일정을 {date}로 변경할 수 있을지 문의드립니다. 불편을 드려 죄송하며 변경된 일정은 반드시 지키겠습니다.','{to}, 진행 상황을 공유드립니다. 예상보다 확인에 시간이 걸려 완료 일정을 {date}로 조정하고자 합니다. 지연된 점 사과드립니다.','안녕하세요, {to}. 부득이하게 기존 일정을 지키기 어려워 {date}로 변경을 요청드립니다. 가능 여부를 알려주시면 바로 조정하겠습니다.'],
    late:['{to}, 죄송합니다. {reason} 도착이 늦어지고 있습니다. 현재 이동 중이며 예상 도착 시각을 확인하는 대로 다시 말씀드리겠습니다.','{to}, {reason} 약속 시간보다 늦을 것 같습니다. 예상 도착은 {date}입니다. 기다리게 해드려 죄송합니다.','{to}, 지각하게 되어 죄송합니다. 도착 즉시 업무에 차질이 없도록 필요한 내용을 확인하겠습니다. 같은 일이 반복되지 않도록 주의하겠습니다.'],
    thanks:['{to}, {subject} 덕분에 잘 마무리할 수 있었습니다. 바쁘신데도 세심하게 챙겨주셔서 진심으로 감사합니다.','{to}, 늘 먼저 살펴주시고 도움 주셔서 감사합니다. 덕분에 많이 배우고 힘을 얻었습니다.','{to}, {subject}에 감사드립니다. 보내주신 배려 잊지 않고 저도 좋은 기회에 꼭 보답하겠습니다.']
  };
  SM.box.innerHTML=`<div class="grid2">${SM.select('templateSituation','상황',[['leave','연차 요청 카톡'],['wedding','결혼식 불참 문자'],['reject','거래처·제안 거절 메일'],['delay','일정 변경·마감 지연'],['late','지각 사과'],['thanks','감사 인사']])}${SM.field('templateTo','받는 사람 또는 호칭','text','팀장님','maxlength="40"')}${SM.field('templateDate','날짜·시간','text','○월 ○일','maxlength="60"')}${SM.field('templateSubject','제안·업무 내용','text','보내주신 제안','maxlength="120"')}${SM.field('templateReason','짧은 사유','text','부득이한 사정으로','maxlength="160"')}${SM.field('templatePlan','인계·대안 계획','text','진행 중인 업무는 전날까지 정리해 공유하겠습니다.','maxlength="200"')}</div><div class="actions"><button class="btn" id="templateRun">문구 추천받기</button><button class="btn secondary" id="templateReset">초기화</button><span class="action-status" id="templateStatus"></span></div><div class="template-list" id="result" aria-live="polite"></div>`;
  const render=()=>{
    const values={to:SM.val('templateTo').trim()||'담당자님',date:SM.val('templateDate').trim()||'○월 ○일',subject:SM.val('templateSubject').trim()||'보내주신 내용',reason:SM.val('templateReason').trim()||'부득이한 사정으로',plan:SM.val('templatePlan').trim()||'업무는 미리 정리해 공유하겠습니다.'};
    const fill=s=>s.replace(/\{(\w+)\}/g,(_,k)=>values[k]);
    const items=banks[SM.val('templateSituation')].map(fill);
    SM.result(items.map((text,i)=>`<article class="template-card"><div><span>추천 문구 ${i+1}</span><button type="button" class="btn secondary" data-template-copy="${i}">복사</button></div><p>${E(text)}</p></article>`).join(''),true);
    SM.q('#templateStatus').textContent=`${items.length}개 문구 준비됨`;
  };
  SM.q('#templateRun').onclick=render;
  SM.q('#templateSituation').onchange=render;
  SM.q('#result').onclick=async e=>{const button=e.target.closest('[data-template-copy]');if(!button)return;await SM.copy(button.closest('.template-card').querySelector('p').textContent);SM.q('#templateStatus').textContent='문구 복사 완료';button.textContent='복사됨';setTimeout(()=>button.textContent='복사',1200)};
  SM.q('#templateReset').onclick=()=>{SM.qa('input').forEach(x=>x.value=x.defaultValue);SM.q('#templateSituation').value='leave';render()};
  render();
};
