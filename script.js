const WORDS = ['am','an','as','at','aw','ax','ay','be','by','do','go','he','hi','ho','if','in','is','it','jo','ka','ki','la','li','lo','ma','me','mi','mm','mu','my','no','od','oe','of','oh','oi','om','on','op','or','os','ow','ox','oy','pa','qi','re','sh','si','so'];

const state = { guesses: [], solved: new Set() };
const boards = document.querySelector('#boards');
const form = document.querySelector('#guess-form');
const input = document.querySelector('#guess-input');
const message = document.querySelector('#message');

function tileState(guess, answer, index) {
  if (guess[index] === answer[index]) return 'correct';
  if (answer.includes(guess[index])) return 'present';
  return 'absent';
}

function render() {
  boards.innerHTML = WORDS.map((answer, index) => {
    const solved = state.solved.has(index);
    const rows = state.guesses.map((guess) => `<div class="tiles" aria-label="Guess ${guess}">${guess.split('').map((letter, letterIndex) => `<span class="tile ${tileState(guess, answer, letterIndex)}">${letter}</span>`).join('')}</div>`).join('');
    return `<article class="board ${solved ? 'solved' : ''}" aria-label="Board ${index + 1}${solved ? ', solved' : ''}"><div class="board-number">${String(index + 1).padStart(2, '0')}</div>${rows || '<div class="tiles"><span class="tile unknown">?</span><span class="tile unknown">?</span></div>'}${solved ? '<span class="solved-label">Solved</span>' : ''}</article>`;
  }).join('');
  document.querySelector('#solved-count').textContent = state.solved.size;
  document.querySelector('#guess-count').textContent = state.guesses.length;
  document.querySelector('#remaining-count').textContent = WORDS.length - state.solved.size;
}

function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const guess = input.value.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(guess)) return showMessage('Please enter exactly two letters.', 'error');
  if (state.guesses.includes(guess)) { showMessage('You already tried that guess.', 'error'); input.select(); return; }
  state.guesses.push(guess);
  WORDS.forEach((answer, index) => { if (answer === guess) state.solved.add(index); });
  render();
  input.value = '';
  const remaining = WORDS.length - state.solved.size;
  showMessage(remaining === 0 ? `Perfect! You cleared all 50 boards in ${state.guesses.length} guesses.` : state.solved.size ? `You found ${state.solved.size} so far. ${remaining} boards remain.` : `${remaining} boards remain. Keep guessing!`, remaining === 0 ? 'success' : '');
  input.focus();
});

document.querySelector('#new-game').addEventListener('click', () => {
  state.guesses = [];
  state.solved.clear();
  showMessage('Enter any two-letter word to begin.');
  input.value = '';
  render();
  input.focus();
});

render();
