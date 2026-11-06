const tabs = document.querySelector('[data-view-list]');
if (tabs) {
  tabs.hidden = false;
  tabs.addEventListener('click', event => {
    const choice = event.target.closest('button[data-view]');
    if (!choice) return;
    tabs.querySelectorAll('button').forEach(button => {
      const active = button === choice;
      button.setAttribute('aria-pressed', String(active));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !active;
    });
  });
}

const brief = document.querySelector('#brief-form');
if (brief) {
  const direction = brief.elements.direction;
  const initial = new URLSearchParams(location.search).get('direction');
  if (initial && Array.from(direction.options).some(option => option.value === initial)) direction.value = initial;

  brief.addEventListener('submit', event => {
    event.preventDefault();
    const task = brief.elements.task;
    if (!task.value.trim()) {
      task.setCustomValidity('Опишите задачу.');
      task.reportValidity();
      return;
    }
    const where = brief.elements.location.value.trim() || 'Не указано';
    const output = [
      'ГЕЛИКС / БРИФ ПРОЕКТА', '', 'Направление: ' + direction.selectedOptions[0].text,
      'Объект или площадка: ' + where, '', 'Задача:', task.value.trim(), ''
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', output], {type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geliks-brief.txt';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    brief.querySelector('.form-status').textContent = 'Бриф подготовлен к скачиванию.';
  });
  brief.elements.task.addEventListener('input', () => brief.elements.task.setCustomValidity(''));
}
