import { mkdirSync, writeFileSync } from 'node:fs';
import { directions } from './content.mjs';

const glyph = `<svg viewBox="0 0 42 42" aria-hidden="true"><path fill="currentColor" d="M4 9a7 7 0 0 1 7-7h27L26 14H15v12L4 38zM38 8v25a7 7 0 0 1-7 7H5l12-12h10V17z"/></svg>`;
const esc = str => str.replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const arrow = `<span aria-hidden="true">↗</span>`;
const dir = (p, slug) => p + 'directions/' + slug + '/';
const shell = (p, title, description, body) => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f6f4ee">
<link rel="icon" href="${p}assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="${p}assets/site.css">
<script src="${p}assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#content">К содержанию</a>
<header class="frame site-header">
  <a class="brand" href="${p}" aria-label="ГЕЛИКС, главная">${glyph}<span>ГЕЛИКС<small>Архитектура и инжиниринг</small></span></a>
  <nav aria-label="Основное меню"><a href="${p}#directions">Направления</a><a href="${p}#approach">Подход</a><a href="${p}#implementation">Реализация</a></nav>
  <a class="button compact" href="${p}#brief">Составить бриф ${arrow}</a>
</header>
<main id="content">${body}</main>
<footer class="frame footer"><a class="brand" href="${p}" aria-label="ГЕЛИКС, главная">${glyph}<span>ГЕЛИКС<small>Архитектура и инжиниринг</small></span></a><small>ООО «Лаборатория»</small><a href="${p}#directions">Все направления ↑</a></footer>
</body></html>\n`.replace(/^ +$/gm, '');
const picture = (p, name, alt, eager = false) => `<img src="${p}assets/${name}.webp" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
const catalogue = directions.map((d,i) => `<a class="card card-${i+1}" href="${dir('./',d.slug)}"><div class="card-media">${picture('./',d.image,d.alt)}</div><div class="card-line"><span class="index">${String(i+1).padStart(2,'0')}</span><div><h3>${d.title}</h3><p>${d.summary}</p></div>${arrow}</div></a>`).join('');
const views = [
  ['Территория','territory','Парк с павильонами, дорожками и водоёмом','Парк аттракционов','Планировка и архитектурный облик'],
  ['Конструкция','structure','Посадочная станция со стальным каркасом','Посадочный вокзал аттракциона','Архитектура и несущий каркас'],
  ['Деталь','detail','Болтовое соединение стальных элементов','Узел металлоконструкции','Соединение элементов каркаса']
];
const homepage = `
<section class="frame hero" aria-labelledby="hero-title">
  <p class="eyebrow"><i></i> Архитектура · Инжиниринг · Визуализация</p>
  <div class="hero-head"><h1 id="hero-title">От территории<br>до конструктивного узла</h1><p>Парки, спортивные пространства, защитные конструкции и отдельные изделия.</p></div>
  <div class="view-tabs" data-view-list hidden>${views.map((v,i)=>`<button type="button" id="tab-${v[1]}" data-view="${v[1]}" aria-controls="view-${v[1]}" aria-pressed="${i===0}"><span>0${i+1}</span>${v[0]}</button>`).join('')}</div>
  ${views.map((v,i)=>`<figure class="hero-visual ${v[1]}" id="view-${v[1]}"${i?' hidden':''}>${picture('./',v[1],v[2],!i)}<figcaption><strong>${v[3]}</strong><span>${v[4]}</span><span class="visual-note">Концептуальная визуализация</span></figcaption></figure>`).join('')}
</section>
<section class="frame section" id="directions">
  <div class="section-heading"><div><p class="eyebrow"><i></i> 01 / Направления</p><h2>С чем работаем</h2></div><p>Выберите направление, чтобы посмотреть, что входит в работу и какие данные нужны для старта.</p></div>
  <div class="catalogue">${catalogue}</div>
</section>
<section class="approach section" id="approach">
  <div class="frame"><div class="section-heading"><div><p class="eyebrow"><i></i> 02 / Подход</p><h2>Три стороны проекта</h2></div><p>В работу можно включить одну из задач или собрать их в единый проект.</p></div>
  <div class="steps"><article><span class="index">01</span><h3>Архитектура</h3><p>Концепция территории, планировка, архитектурный облик, тематизация, оформление и свет.</p></article><article><span class="index">02</span><h3>Инжиниринг</h3><p>Конструктивная схема, материалы, соединения и сопряжение с оборудованием и площадкой.</p></article><article><span class="index">03</span><h3>Визуализация</h3><p>Модели и изображения для согласования: от общего вида территории до деталей объекта.</p></article></div></div>
</section>
<section class="frame section realization" id="implementation">
  <div><p class="eyebrow"><i></i> 03 / Реализация</p><h2>Изготовление<br>и монтаж</h2><p>Реализацию обсуждаем отдельно. По согласованному проекту определяем, что предстоит изготовить, как подготовить площадку и в какой последовательности вести монтаж.</p><a class="text-link" href="#brief">Перейти к брифу ${arrow}</a></div>
  <figure>${picture('./','structure',views[1][2])}<figcaption>Посадочный вокзал · концептуальная визуализация</figcaption></figure>
</section>
<section class="brief section" id="brief"><div class="frame brief-grid">
  <div><p class="eyebrow"><i></i> 04 / Бриф</p><h2>Расскажите<br>о задаче</h2><p>Выберите направление и опишите объект. Получится короткий бриф, который можно сохранить и передать команде проекта.</p></div>
  <form id="brief-form"><label>Направление<select name="direction" required><option value="">Выберите направление</option>${directions.map(d=>`<option value="${d.slug}">${d.title}</option>`).join('')}<option value="several">Несколько направлений</option></select></label>
  <label>Объект или площадка <span>(необязательно)</span><input name="location" maxlength="200" placeholder="Например, городской парк"></label>
  <label>Что нужно сделать<textarea required name="task" maxlength="2400" rows="4" placeholder="Опишите задачу, ограничения и желаемые сроки"></textarea></label>
  <button class="button" type="submit">Скачать бриф <span aria-hidden="true">↓</span></button>
  <p class="form-note">Сайт сохранит бриф файлом на вашем устройстве.</p><p class="form-status" aria-live="polite"></p>
  </form>
</div></section>`;

const detailPage = (d,i) => {
  const p = '../../';
  const next = directions[(i+1)%directions.length];
  return `
  <section class="frame detail-hero">
    <a class="text-link breadcrumb" href="${p}#directions">← Все направления</a>
    <p class="eyebrow"><i></i> Направление ${String(i+1).padStart(2,'0')} / 07</p>
    <div class="hero-head"><h1>${d.title}</h1><p>${d.intro}</p></div>
    <figure class="detail-visual ${d.image}">${picture(p,d.image,d.alt,true)}<figcaption>Концептуальная визуализация</figcaption></figure>
  </section>
  <section class="frame section"><div class="section-heading"><div><p class="eyebrow"><i></i> Состав работ</p><h2>Что прорабатываем</h2></div></div>
    <div class="steps">${d.steps.map(([title,copy],i)=>`<article><span class="index">0${i+1}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div>
  </section>
  ${d.detail ? `<section class="frame detail-extra"><figure>${picture(p,d.detail[0],d.detail[1])}<figcaption>${d.detail[1]} · концептуальная визуализация</figcaption></figure></section>` : ''}
  <section class="approach section"><div class="frame section-heading"><div><p class="eyebrow"><i></i> Исходные данные</p><h2>С чего начать</h2></div><div><p>${d.inputs}</p><a class="button" href="${p}?direction=${d.slug}#brief">Составить бриф ${arrow}</a></div></div></section>
  <div class="frame next"><a class="text-link" href="${p}#directions">← Все направления</a><a class="text-link" href="../${next.slug}/">${next.title} ${arrow}</a></div>`;
};

mkdirSync('docs/assets', {recursive:true});
writeFileSync('docs/.nojekyll','');
writeFileSync('docs/assets/mark.svg', glyph.replace('aria-hidden="true"','xmlns="http://www.w3.org/2000/svg"').replaceAll('currentColor','#222923'));
writeFileSync('docs/index.html', shell('./','ГЕЛИКС — архитектура и инжиниринг','Проектирование парков, спортивных пространств и конструкций. Архитектура, инжиниринг и визуализация.',homepage));
directions.forEach((d,i)=>{
  const folder='docs/directions/'+d.slug;
  mkdirSync(folder,{recursive:true});
  writeFileSync(folder+'/index.html',shell('../../',d.title+' — ГЕЛИКС',d.summary,detailPage(d,i)));
});
