const sharp = require('sharp');
const fs = require('fs');
const B = 'drive/Site Archives/';
const OUT = 'imagens/';

const resultados = ['IMG_9687.PNG','IMG_0950.PNG','IMG_0951.PNG','IMG_0952.PNG','IMG_3560.PNG','IMG_0948.JPG','86BA6365-B726-440F-8357-6CABCBE993F1.jpg','df9ee8ee-39b7-46a2-89a4-d024e2ee0d8c.jpg'];
const depoimentos = ['IMG_0942.JPG','IMG_0943.JPG','IMG_0953.PNG','IMG_0954.PNG','IMG_0955.JPG','IMG_7310.PNG','IMG_9675.PNG','IMG_9676.PNG'];

(async () => {
  const log = [];

  // logo: mantem transparencia
  await sharp(B + '1. Imagens e Logo/Logo.png').resize(600, 600, { fit: 'inside' }).png({ quality: 90, compressionLevel: 9 }).toFile(OUT + 'logo.png');
  await sharp(B + '1. Imagens e Logo/Logo.png').resize(600, 600, { fit: 'inside' }).webp({ quality: 92 }).toFile(OUT + 'logo.webp');
  log.push(['logo.png', fs.statSync(OUT + 'logo.png').size]);

  // hero: duas versoes — recorte vertical pro celular, horizontal pro desktop
  await sharp('drive/bg-horizontal.jpg').resize(1800, 1350, { fit: 'cover' }).webp({ quality: 80 }).toFile(OUT + 'hero-desktop.webp');
  await sharp('drive/bg-horizontal.jpg').resize(900, 1300, { fit: 'cover', position: 'centre' }).webp({ quality: 80 }).toFile(OUT + 'hero-mobile.webp');
  log.push(['hero-desktop.webp', fs.statSync(OUT + 'hero-desktop.webp').size]);
  log.push(['hero-mobile.webp', fs.statSync(OUT + 'hero-mobile.webp').size]);

  // retrato do Luis pro CTA final (4:5, focando o rosto)
  await sharp(B + '1. Imagens e Logo/Quem é Luis_Background Site Vertical.jpg')
    .resize(900, 1125, { fit: 'cover', position: 'top' }).webp({ quality: 82 }).toFile(OUT + 'luis.webp');
  log.push(['luis.webp', fs.statSync(OUT + 'luis.webp').size]);

  // resultados: quadrados na origem, mantidos 1:1 (zero corte)
  for (let i = 0; i < resultados.length; i++) {
    const dst = OUT + 'resultado-' + (i + 1) + '.webp';
    await sharp(B + '3. Resultados/' + resultados[i]).resize(900, 900, { fit: 'cover' }).webp({ quality: 82 }).toFile(dst);
    log.push([dst.replace(OUT, ''), fs.statSync(dst).size]);
  }

  // depoimentos: prints de conversa — proporcao original preservada
  for (let i = 0; i < depoimentos.length; i++) {
    const dst = OUT + 'depoimento-' + (i + 1) + '.webp';
    await sharp(B + '5. Depoimentos/' + depoimentos[i]).resize({ height: 1100, withoutEnlargement: true }).webp({ quality: 84 }).toFile(dst);
    log.push([dst.replace(OUT, ''), fs.statSync(dst).size]);
  }

  // imagem de compartilhamento (WhatsApp/Instagram)
  const overlay = Buffer.from(`<svg width="1200" height="630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="45%" stop-color="#0A0A0A" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0A0A0A" stop-opacity="0.94"/>
    </linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="60" y="540" font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="bold" fill="#14F028" letter-spacing="2">LFTEAM</text>
    <text x="60" y="588" font-family="Arial,Helvetica,sans-serif" font-size="26" fill="#F2F2F0">Resultados reais com metodo, sem achismo</text>
  </svg>`);
  await sharp('drive/bg-horizontal.jpg').resize(1200, 630, { fit: 'cover' })
    .composite([{ input: overlay, top: 0, left: 0 }]).jpeg({ quality: 86, mozjpeg: true }).toFile(OUT + 'og-image.jpg');
  log.push(['og-image.jpg', fs.statSync(OUT + 'og-image.jpg').size]);

  let total = 0;
  log.forEach(([n, s]) => { total += s; console.log('  ' + n.padEnd(26) + (s / 1024).toFixed(0).padStart(6) + ' KB'); });
  console.log('  ' + '-'.repeat(34));
  console.log('  ' + 'TOTAL'.padEnd(26) + (total / 1024).toFixed(0).padStart(6) + ' KB');
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
