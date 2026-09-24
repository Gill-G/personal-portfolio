/*
 * "Copy email" button. The button holds the text in data-copy; after copying,
 * its label briefly changes so the result is announced as well as shown.
 */
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  const label = button.querySelector('[data-copy-label]');
  const original = label?.textContent ?? '';

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy ?? '');
      if (label) label.textContent = 'Copied!';
    } catch {
      if (label) label.textContent = 'Copy failed';
    }
    setTimeout(() => {
      if (label) label.textContent = original;
    }, 2000);
  });
});
