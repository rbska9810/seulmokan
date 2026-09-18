const H=window.SM_HANDLERS=window.SM_HANDLERS||{},SM=window.SM;

H['background-remover']=()=>{
  SM.box.innerHTML=`<label class="drop-zone" for="bgFile"><b>배경을 지울 이미지를 놓거나 클릭해서 선택</b><span>JPG · PNG · WebP, 최대 25MB · 사진은 기기 밖으로 전송되지 않습니다.</span><input id="bgFile" type="file" accept="image/jpeg,image/png,image/webp" hidden></label>
  <div class="grid2">${SM.select('bgQuality','AI 처리 품질',[['isnet','정밀 · 음식·상품 권장'],['isnet_fp16','빠르게 · 일반 사진']])}${SM.select('bgEdge','가장자리 정리',[['natural','자연스럽게'],['clean','흰 테두리 줄이기'],['sharp','선명하게']])}</div>
  <p class="hint">첫 실행에는 범용 AI 모델을 내려받아 시간이 걸릴 수 있습니다. 흰 물체와 흰 배경처럼 경계가 비슷한 사진은 ‘흰 테두리 줄이기’를 권장합니다.</p>
  <div class="actions"><button class="btn" id="removeBg" disabled>정밀 AI로 배경 제거</button><button class="btn secondary" id="bgDownload" disabled>투명 PNG 다운로드</button><span class="action-status" id="bgStatus" role="status"></span></div>
  <div class="compare-grid" id="bgPreview"><div class="empty-state">이미지를 선택하세요.</div></div>
  <div class="result" id="result">사람뿐 아니라 음식·상품·동물 사진도 처리하는 범용 AI 도구입니다.</div>
  <p class="hint">브라우저 AI 기술: <a href="https://github.com/imgly/background-removal-js" target="_blank" rel="noopener">IMG.LY Background Removal</a> (AGPL)</p>`;

  const status=SM.q('#bgStatus');
  let file=null,output=null,sourceUrl='',outputUrl='',modulePromise=null;
  const formatBytes=bytes=>bytes<1024?`${bytes} B`:bytes<1048576?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1048576).toFixed(2)} MB`;
  const safeBase=name=>(name.replace(/\.[^.]+$/,'').replace(/[^\p{L}\p{N}._-]+/gu,'-').replace(/^-+|-+$/g,'')||'image').slice(0,80);
  const saveBlob=(blob,name)=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)};
  const toBlob=(canvas,type='image/png')=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('결과 PNG를 만들지 못했습니다.')),type,1));
  const refineEdges=async(blob,mode)=>{
    if(mode==='natural')return blob;
    const bitmap=await createImageBitmap(blob),canvas=document.createElement('canvas');
    canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);bitmap.close?.();
    const image=ctx.getImageData(0,0,canvas.width,canvas.height),data=image.data;
    const low=mode==='sharp'?0.12:0.055,high=mode==='sharp'?0.84:0.94;
    for(let i=3;i<data.length;i+=4){let x=(data[i]/255-low)/(high-low);x=Math.max(0,Math.min(1,x));x=x*x*(3-2*x);data[i]=Math.round(x*255)}
    ctx.putImageData(image,0,0);return toBlob(canvas);
  };
  const clearUrls=()=>{if(sourceUrl)URL.revokeObjectURL(sourceUrl);if(outputUrl)URL.revokeObjectURL(outputUrl);sourceUrl=outputUrl=''};

  SM.q('#bgFile').onchange=event=>{
    const next=event.target.files[0];output=null;SM.q('#bgDownload').disabled=true;clearUrls();
    if(!next){file=null;SM.q('#removeBg').disabled=true;return}
    if(!['image/jpeg','image/png','image/webp'].includes(next.type)||next.size>25*1024*1024){file=null;SM.q('#removeBg').disabled=true;return SM.fail(Error('JPG, PNG, WebP 파일을 25MB 이하로 선택하세요.'))}
    file=next;sourceUrl=URL.createObjectURL(file);SM.q('#removeBg').disabled=false;status.textContent='정밀 처리 준비됨';
    SM.q('#bgPreview').innerHTML=`<figure><img src="${sourceUrl}" alt="원본"><figcaption>원본 · ${formatBytes(file.size)}</figcaption></figure>`;
  };

  SM.q('#removeBg').onclick=async()=>{
    if(!file)return;
    const button=SM.q('#removeBg');button.disabled=true;SM.q('#bgDownload').disabled=true;status.textContent='범용 AI 모델 준비 중…';
    try{
      if(!modulePromise)modulePromise=import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm').catch(error=>{modulePromise=null;throw error});
      const module=await modulePromise,removeBackground=module.default||module.removeBackground;
      if(typeof removeBackground!=='function')throw Error('AI 모듈을 불러오지 못했습니다.');
      let lastPercent=-1;
      const raw=await removeBackground(file,{
        model:SM.val('bgQuality'),
        device:'cpu',
        output:{format:'image/png',quality:1,type:'foreground'},
        progress:(key,current,total)=>{if(!total)return;const percent=Math.max(0,Math.min(100,Math.round(current/total*100)));if(percent!==lastPercent){lastPercent=percent;status.textContent=percent<100?`AI 자료 준비 ${percent}%`:'피사체 경계 정밀 분석 중…'}}
      });
      status.textContent='가장자리 정리 중…';output=await refineEdges(raw,SM.val('bgEdge'));
      if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl=URL.createObjectURL(output);
      SM.q('#bgPreview').querySelector('figure+figure')?.remove();
      SM.q('#bgPreview').insertAdjacentHTML('beforeend',`<figure class="transparent-bg"><img src="${outputUrl}" alt="배경 제거 결과"><figcaption>정밀 배경 제거 · ${formatBytes(output.size)}</figcaption></figure>`);
      SM.q('#bgDownload').disabled=false;status.textContent='배경 제거 완료';
      SM.result(`<strong>정밀 배경 제거 완료</strong><p class="inline-note">그릇·상품의 가장자리를 확대해 확인하세요. 흰 잔상이 보이면 ‘선명하게’, 가장자리가 잘리면 ‘자연스럽게’로 바꿔 다시 실행할 수 있습니다.</p>`,true);
    }catch(error){const message=error?.message||String(error);SM.fail(Error(`배경 제거에 실패했습니다. ${message}`));status.textContent=`실패 · ${message}`}
    finally{button.disabled=false}
  };
  SM.q('#bgDownload').onclick=()=>output&&saveBlob(output,`${safeBase(file.name)}-no-bg.png`);
};
