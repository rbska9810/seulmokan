import {moneyInsights} from './content-insights-money.mjs';
import {workInsights} from './content-insights-work.mjs';
import {lifeInsights} from './content-insights-life.mjs';
import {extraInsights} from './content-insights-extra.mjs';

// 가이드 목록 순서 = 활용 가이드 페이지와 홈에 노출되는 순서
const order=[
  'salary-table-2026','severance-pay-basics','minimum-wage-2026-monthly-pay','pyeong-square-meter-table',
  'annual-leave-calculation','salary-net-pay-checklist','loan-repayment-methods','vat-supply-price-guide','compound-interest-rule-of-72',
  'character-byte-limits','korean-age-rules','date-counting-rules','percent-percentage-point-guide',
  'unit-conversion-table','time-zone-dst-guide','pomodoro-technique-guide','qr-code-print-guide',
  'resignation-letter-guide','employment-contract-checklist','document-draft-safety','interview-answer-framework',
  'image-format-guide','background-removal-tips','spreadsheet-import-guide','browser-processing-privacy',
  'strong-password-guide','json-common-errors','unix-timestamp-guide','px-rem-css-units',
  'color-hex-rgb-contrast','markdown-syntax-cheatsheet','text-diff-comparison-guide','seo-title-description-guide'
];
const all={...moneyInsights,...workInsights,...lifeInsights,...extraInsights};
for(const slug of Object.keys(all))if(!order.includes(slug))throw Error(`가이드 순서 누락 ${slug}`);
export const insights=Object.fromEntries(order.map(slug=>{if(!all[slug])throw Error(`가이드 본문 누락 ${slug}`);return [slug,all[slug]]}));

// 도구 페이지에서 연결할 심화 가이드. 대표 도구 외에 함께 읽으면 좋은 도구도 연결한다.
const extraLinks={
  'salary-table-2026':['wage-converter'],
  'severance-pay-basics':['date-calculator'],
  'minimum-wage-2026-monthly-pay':['salary-calculator','buy-or-not-calculator'],
  'date-counting-rules':['date-calculator','work-countdown'],
  'percent-percentage-point-guide':['vat-calculator'],
  'compound-interest-rule-of-72':['loan-calculator'],
  'document-draft-safety':['power-of-attorney-maker','simple-receipt-maker','transaction-statement-maker'],
  'interview-answer-framework':['interview-question-planner','cover-letter-helper'],
  'image-format-guide':['image-cropper','psd-image-converter','image-base64-converter'],
  'spreadsheet-import-guide':['csv-json-converter'],
  'character-byte-limits':['whitespace-remover','cover-letter-helper'],
  'browser-processing-privacy':['background-remover','my-ip','qr-code-generator'],
  'json-common-errors':['csv-json-converter','url-encoder-decoder'],
  'annual-leave-calculation':['severance-pay-calculator','salary-calculator','wage-converter','work-countdown'],
  'unit-conversion-table':['area-converter'],
  'time-zone-dst-guide':['date-calculator'],
  'unix-timestamp-guide':['json-formatter'],
  'px-rem-css-units':['css-clamp-calculator','flexbox-playground'],
  'qr-code-print-guide':['url-encoder-decoder']
};
export const guidesForTool=slug=>Object.entries(insights)
  .filter(([key,item])=>item.tool[0]===slug||(extraLinks[key]||[]).includes(slug))
  .map(([key,item])=>({slug:key,title:item.title}));
export const insightText=item=>item.body.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
