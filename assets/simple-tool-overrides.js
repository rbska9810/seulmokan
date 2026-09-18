const H=window.SM_HANDLERS=window.SM_HANDLERS||{},SM=window.SM;

if(H['nickname-generator']){
  const originalNickname=H['nickname-generator'];
  H['nickname-generator']=()=>{
    originalNickname();
    const count=SM.q('#nickCount');
    count.value='1';
    count.closest('.field').hidden=true;
    SM.q('#nickRun').textContent='닉네임 하나 만들기';
    SM.q('#nickCopy').hidden=true;
  };
}

if(H['dice-coin']){
  const originalDice=H['dice-coin'];
  H['dice-coin']=()=>{
    originalDice();
    const notation=SM.q('#diceNotation'),options=SM.qa('[data-dice]');
    notation.value='1d6';
    notation.closest('.field').hidden=true;
    notation.closest('.grid2').style.gridTemplateColumns='1fr';
    const presets=[['1d6','1개'],['2d6','2개'],['3d6','3개'],['4d6','4개']];
    options.forEach((button,index)=>{button.dataset.dice=presets[index][0];button.textContent=presets[index][1]});
    options[0]?.classList.add('active');
    options[0]?.parentElement.insertAdjacentHTML('beforebegin','<div class="simple-dice-title"><b>일반 6면체 주사위</b><span>굴릴 개수만 고르세요.</span></div>');
  };
}

const addImageDrop=(inputId)=>{
  const input=SM.q(`#${inputId}`),zone=input?.closest('.drop-zone');
  if(!input||!zone)return;
  const title=zone.querySelector('b');
  if(title)title.textContent=inputId==='cropFile'?'자를 이미지를 놓거나 클릭해서 선택':'배경을 지울 이미지를 놓거나 클릭해서 선택';
  ['dragenter','dragover'].forEach(type=>zone.addEventListener(type,event=>{event.preventDefault();event.stopPropagation();zone.classList.add('is-over')}));
  ['dragleave','drop'].forEach(type=>zone.addEventListener(type,event=>{event.preventDefault();event.stopPropagation();zone.classList.remove('is-over')}));
  zone.addEventListener('drop',event=>{
    const file=[...event.dataTransfer.files].find(item=>item.type.startsWith('image/'));
    if(!file)return SM.fail(Error('JPG, PNG 또는 WebP 이미지 파일을 놓아주세요.'));
    const transfer=new DataTransfer();transfer.items.add(file);input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  });
};

if(H['image-cropper']){
  const originalCropper=H['image-cropper'];
  H['image-cropper']=()=>{originalCropper();addImageDrop('cropFile')};
}

if(H['background-remover']){
  const originalBackground=H['background-remover'];
  H['background-remover']=()=>{originalBackground();addImageDrop('bgFile')};
}
