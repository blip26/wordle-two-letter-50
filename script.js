const WORDS = [
  'am', 'an', 'as', 'at', 'aw', 'ax', 'ay', 'be', 'by', 'do',
  'go', 'he', 'hi', 'ho', 'if', 'in', 'is', 'it', 'jo', 'ka',
  'ki', 'la', 'li', 'lo', 'ma', 'me', 'mi', 'mm', 'mu', 'my',
  'no', 'od', 'oe', 'of', 'oh', 'oi', 'om', 'on', 'op', 'or',
  'os', 'ow', 'ox', 'oy', 'pa', 'qi', 're', 'sh', 'si', 'so'
];

const state = { guesses: [], solved: new Set() };
const boards = document.querySelector('#boards');
const form = document.querySelector('#guess-form');
const input = document.querySelector('#guess-input');
const message = document.querySelector('#message');

function tileState(guess, answer, index) {
  if (guess[index] === answer[index]) return 'correct';
  if (answer.includes(guess[index])) return 'present';
  return '';
}

function render() {
  boards.innerHTML = WORDS.map((answer, index) => {
    const solved = state.solved.has(index);
    const rows = state.guesses.map((guess) => {
      const classes = guess.split('').map((_, letterIndex) => tileState(guess, answer, letterIndex)).join(' ');
      return `<div class="tiles" aria-label="Guess ${guess}">${guess.split('').map((letter, letterIndex) => `<span class="tile ${classes.split(' ')[letterIndex]}">${letter}</span>`).join('')}</div>`;
    }).join('');
    return `<article class="board ${solved ? 'solved' : ''}"><div class="board-number">${String(index + 1).padStart(2, '0')}</div>${rows || '<div class="tiles"><span class="tile">?</span><span class="tile">?</span></div>'}</article>`;
  }).join('');
  document.querySelector('#solved-count').textContent = state.solved.size;
  document.querySelector('#guess-count').textContent = state.guesses.length;
  document.querySelector('#remaining-count').textContent = WORDS.length - state.solved.size;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const guess = input.value.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(guess)) {
    message.textContent = 'Please enter exactly two letters.';
    message.className = 'message error';
    input.focus();
    return;
  }
  if (state.guesses.includes(guess)) {
    message.textContent = 'You already tried that guess.';
    message.className = 'message error';
    return;
  }
  state.guesses.push(guess);
  WORDS.forEach((answer, index) => { if (answer === guess) state.solved.add(index); });
  render();
  input.value = '';
  const remaining = WORDS.length - state.solved.size;
  message.textContent = remaining === 0 ? `Perfect! You cleared all 50 boards in ${state.guesses.length} guesses.` : `${state.solved.size ? `You found ${state.solved.size} so far. ` : ''}${remaining} boards remaining.`;
  message.className = `message ${remaining === 0 ? 'success' : ''}`;
  input.focus();
});

document.querySelector('#new-game').addEventListener('click', () => {
  state.guesses = [];
  state.solved.clear();
  message.textContent = 'Enter any two-letter word to begin.';
  message.className = 'message';
  input.value = '';
  render();
  input.focus();
});

render();
