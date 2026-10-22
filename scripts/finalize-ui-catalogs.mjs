// Locally authored final pricing labels; no network access.
import { readFileSync, writeFileSync } from "node:fs";
const keys=["Downloads","Up to 2000 × 2000","Free forever · no signup","Billed monthly","Billed yearly"];
const translations={
  fr:["Téléchargements","Jusqu’à 2000 × 2000","Gratuit à vie · sans inscription","Facturation mensuelle","Facturation annuelle"],
  ar:["التنزيلات","حتى 2000 × 2000","مجاني دائمًا · دون تسجيل","فوترة شهرية","فوترة سنوية"],
  es:["Descargas","Hasta 2000 × 2000","Gratis para siempre · sin registro","Facturación mensual","Facturación anual"],
  de:["Downloads","Bis zu 2000 × 2000","Dauerhaft kostenlos · ohne Anmeldung","Monatliche Abrechnung","Jährliche Abrechnung"],
  it:["Download","Fino a 2000 × 2000","Gratis per sempre · senza registrazione","Fatturazione mensile","Fatturazione annuale"],
  pt:["Downloads","Até 2000 × 2000","Grátis para sempre · sem cadastro","Cobrança mensal","Cobrança anual"],
  nl:["Downloads","Tot 2000 × 2000","Altijd gratis · geen registratie","Maandelijks gefactureerd","Jaarlijks gefactureerd"],
  tr:["İndirmeler","2000 × 2000 piksele kadar","Her zaman ücretsiz · kayıt gerekmez","Aylık faturalandırma","Yıllık faturalandırma"],
  ru:["Скачивания","До 2000 × 2000","Всегда бесплатно · без регистрации","Ежемесячная оплата","Ежегодная оплата"],
  zh:["下载次数","最高 2000 × 2000","永久免费 · 无需注册","按月计费","按年计费"],
  ja:["ダウンロード","最大 2000 × 2000","ずっと無料・登録不要","月払い","年払い"],
  ko:["다운로드","최대 2000 × 2000","항상 무료 · 가입 불필요","월별 결제","연간 결제"],
  hi:["डाउनलोड","2000 × 2000 तक","हमेशा मुफ़्त · साइन अप ज़रूरी नहीं","मासिक बिलिंग","वार्षिक बिलिंग"],
  id:["Unduhan","Hingga 2000 × 2000","Gratis selamanya · tanpa daftar","Tagihan bulanan","Tagihan tahunan"],
  ms:["Muat turun","Sehingga 2000 × 2000","Percuma selamanya · tanpa pendaftaran","Bil bulanan","Bil tahunan"],
  vi:["Lượt tải xuống","Tối đa 2000 × 2000","Miễn phí mãi mãi · không cần đăng ký","Thanh toán hằng tháng","Thanh toán hằng năm"],
  pl:["Pobrania","Do 2000 × 2000","Zawsze bezpłatnie · bez rejestracji","Rozliczenie miesięczne","Rozliczenie roczne"],
  uk:["Завантаження","До 2000 × 2000","Завжди безкоштовно · без реєстрації","Щомісячна оплата","Щорічна оплата"],
  ro:["Descărcări","Până la 2000 × 2000","Gratuit mereu · fără înregistrare","Facturare lunară","Facturare anuală"],
};
for(const [locale,values] of Object.entries(translations)) {
  const path=`public/locales/${locale}.json`;
  const catalog=JSON.parse(readFileSync(path,"utf8"));
  catalog["512 × 512"]="512 × 512";
  keys.forEach((key,index)=>{catalog[key]=values[index];});
  writeFileSync(path,JSON.stringify(catalog,null,2)+"\n");
}
