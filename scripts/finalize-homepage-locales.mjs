import { readFileSync, writeFileSync } from "node:fs";
const keys=["Built with restraint","Qraftt is being built around a simple promise: useful QR tools should be accessible to everyone.","Events","Reviews","Payments","Files","QR preview is ready and updates automatically."];
const rows={
fr:["Conçu avec simplicité","Qraftt repose sur une promesse simple : des outils QR utiles et accessibles à tous.","Événements","Avis","Paiements","Fichiers","L’aperçu QR est prêt et se met à jour automatiquement."],
ar:["تصميم يركّز على الأساسيات","يقوم Qraftt على وعد بسيط: أدوات QR المفيدة يجب أن تكون متاحة للجميع.","الفعاليات","التقييمات","المدفوعات","الملفات","معاينة QR جاهزة وتتحدث تلقائيًا."],
es:["Diseñado con sencillez","Qraftt se basa en una promesa sencilla: las herramientas QR útiles deben ser accesibles para todos.","Eventos","Reseñas","Pagos","Archivos","La vista previa QR está lista y se actualiza automáticamente."],
de:["Bewusst einfach gestaltet","Qraftt folgt einem einfachen Versprechen: Nützliche QR-Werkzeuge sollten für alle zugänglich sein.","Veranstaltungen","Bewertungen","Zahlungen","Dateien","Die QR-Vorschau ist bereit und wird automatisch aktualisiert."],
it:["Progettato con semplicità","Qraftt nasce da una promessa semplice: gli strumenti QR utili devono essere accessibili a tutti.","Eventi","Recensioni","Pagamenti","File","L’anteprima QR è pronta e si aggiorna automaticamente."],
pt:["Criado com simplicidade","Qraftt se baseia em uma promessa simples: ferramentas QR úteis devem ser acessíveis a todos.","Eventos","Avaliações","Pagamentos","Arquivos","A prévia QR está pronta e é atualizada automaticamente."],
nl:["Bewust eenvoudig ontworpen","Qraftt is gebouwd rond een eenvoudige belofte: nuttige QR-tools moeten voor iedereen toegankelijk zijn.","Evenementen","Beoordelingen","Betalingen","Bestanden","Het QR-voorbeeld is klaar en wordt automatisch bijgewerkt."],
tr:["Sadelikle tasarlandı","Qraftt basit bir söz üzerine kuruluyor: faydalı QR araçları herkes için erişilebilir olmalı.","Etkinlikler","Yorumlar","Ödemeler","Dosyalar","QR önizlemesi hazır ve otomatik olarak güncellenir."],
ru:["Продуманная простота","Qraftt основан на простом обещании: полезные QR-инструменты должны быть доступны каждому.","Мероприятия","Отзывы","Платежи","Файлы","Предпросмотр QR готов и обновляется автоматически."],
zh:["简约设计","Qraftt 秉持一个简单的承诺：让每个人都能使用实用的 QR 工具。","活动","评价","付款","文件","QR 预览已准备就绪，并会自动更新。"],
ja:["シンプルな設計","Qraftt は、便利な QR ツールを誰もが使えるようにするというシンプルな約束を大切にしています。","イベント","レビュー","支払い","ファイル","QR プレビューの準備ができました。自動的に更新されます。"],
ko:["간결한 설계","Qraftt는 유용한 QR 도구를 누구나 사용할 수 있어야 한다는 단순한 약속을 바탕으로 만들어집니다.","이벤트","리뷰","결제","파일","QR 미리보기가 준비되었으며 자동으로 업데이트됩니다."],
hi:["सरलता के साथ बनाया गया","Qraftt का एक सरल वादा है: उपयोगी QR उपकरण सभी के लिए उपलब्ध होने चाहिए।","कार्यक्रम","समीक्षाएँ","भुगतान","फ़ाइलें","QR पूर्वावलोकन तैयार है और अपने आप अपडेट होता है।"],
id:["Dirancang dengan sederhana","Qraftt dibangun dengan janji sederhana: alat QR yang berguna harus dapat diakses semua orang.","Acara","Ulasan","Pembayaran","Berkas","Pratinjau QR siap dan diperbarui secara otomatis."],
ms:["Direka dengan ringkas","Qraftt dibina atas janji mudah: alat QR yang berguna patut boleh diakses oleh semua orang.","Acara","Ulasan","Pembayaran","Fail","Pratonton QR sedia dan dikemas kini secara automatik."],
vi:["Thiết kế tinh gọn","Qraftt được xây dựng với một cam kết đơn giản: mọi người đều có thể tiếp cận các công cụ QR hữu ích.","Sự kiện","Đánh giá","Thanh toán","Tệp","Bản xem trước QR đã sẵn sàng và tự động cập nhật."],
pl:["Przemyślana prostota","Qraftt powstaje w oparciu o prostą obietnicę: przydatne narzędzia QR powinny być dostępne dla każdego.","Wydarzenia","Opinie","Płatności","Pliki","Podgląd QR jest gotowy i aktualizuje się automatycznie."],
uk:["Продумана простота","Qraftt побудовано на простій обіцянці: корисні QR-інструменти мають бути доступними кожному.","Події","Відгуки","Платежі","Файли","Попередній перегляд QR готовий та оновлюється автоматично."],
ro:["Proiectat cu simplitate","Qraftt se bazează pe o promisiune simplă: instrumentele QR utile trebuie să fie accesibile tuturor.","Evenimente","Recenzii","Plăți","Fișiere","Previzualizarea QR este gata și se actualizează automat."],
};
const inventoryPath="lib/i18n/ui-messages.json";
const inventory=new Set(JSON.parse(readFileSync(inventoryPath,"utf8")));
keys.forEach(key=>inventory.add(key));
writeFileSync(inventoryPath,JSON.stringify([...inventory].sort(),null,2)+"\n");
for(const [locale,values] of Object.entries(rows)) {
  const path=`public/locales/${locale}.json`;
  const catalog=JSON.parse(readFileSync(path,"utf8"));
  keys.forEach((key,index)=>{catalog[key]=values[index];});
  if(locale==="ar") {
    catalog["Create & Customize QR Codes for"]="أنشئ وخصّص رموز QR";
    catalog.FREE="مجانًا";
    catalog["Scan Me"]="امسح الرمز";
    catalog["to link Pro securely. No second checkout is needed."]="لربط Pro بأمان. لا تحتاج إلى الدفع مرة أخرى.";
  }
  writeFileSync(path,JSON.stringify(catalog,null,2)+"\n");
}
