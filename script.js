const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainScreen = document.getElementById('mainScreen');
const secondScreen = document.getElementById('secondScreen');
const messageContainer = document.getElementById('messageContainer');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

const popMessages = [
  'Are you sure?',
  'Really not happy?',
  'Please don’t do this 💔',
  'Think again 😭',
  'You can’t escape this question ❤️',
  'Just one more moment...',
  'My heart is racing.',
  'Stay with me here.',
];

let interactionCount = 0;
let yesScale = 1;
let noScale = 1;
let isTransitioning = false;

function getRandomPosition(button) {
  const padding = 24;
  const btnRect = button.getBoundingClientRect();

  const maxX = window.innerWidth - btnRect.width - padding;
  const maxY = window.innerHeight - btnRect.height - padding;
  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  return { x, y };
}

function showMessage(text) {
  const message = document.createElement('div');
  message.className = 'message-bubble';
  message.textContent = text;
  message.style.left = `${30 + Math.random() * 40}%`;
  message.style.top = `${20 + Math.random() * 20}%`;
  messageContainer.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2400);
}

function updateButtonSizes() {
  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;
}

function moveNoButton() {
  const { x, y } = getRandomPosition(noBtn);
  noBtn.style.transition = 'left 0.45s cubic-bezier(0.2, 1, 0.3, 1), top 0.45s cubic-bezier(0.2, 1, 0.3, 1), transform 0.45s ease';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = `scale(${noScale})`;
}

function maybeDodge(event) {
  if (isTransitioning) return;

  const rect = noBtn.getBoundingClientRect();
  const distance = Math.hypot(
    event.clientX - (rect.left + rect.width / 2),
    event.clientY - (rect.top + rect.height / 2)
  );

  if (distance < 150) {
    interactionCount += 1;
    noScale = Math.max(0.45, 1 - interactionCount * 0.12);
    yesScale = Math.min(1.15, 1 + interactionCount * 0.035);

    updateButtonSizes();
    moveNoButton();

    const nextMessage = popMessages[interactionCount % popMessages.length];
    showMessage(nextMessage);
  }
}

function attachNoButtonListeners() {
  noBtn.addEventListener('mouseenter', (event) => {
    maybeDodge(event);
  });

  noBtn.addEventListener('click', (event) => {
    event.preventDefault();
    maybeDodge(event);
  });

  document.addEventListener('mousemove', (event) => {
    maybeDodge(event);
  });
}

function startCinematicTransition() {
  if (isTransitioning) return;
  isTransitioning = true;
  mainScreen.classList.remove('active');
  mainScreen.style.opacity = '0';
  mainScreen.style.transform = 'scale(0.96) translateY(-40px)';

  setTimeout(() => {
    secondScreen.classList.add('active');
    secondScreen.style.opacity = '1';
    secondScreen.style.transform = 'none';
  }, 600);
}

function updateCursorMotion(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 14;

  document.documentElement.style.setProperty('--mouse-x', `${x}px`);
  document.documentElement.style.setProperty('--mouse-y', `${y}px`);
}

function initBackgroundMotion() {
  const scene = document.querySelector('.scene');
  scene.style.transform = 'translate3d(0, 0, 0)';
  document.addEventListener('mousemove', (event) => {
    updateCursorMotion(event);
    const x = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mouse-x')) || 0;
    const y = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mouse-y')) || 0;
    scene.style.transform = `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`;
  });
}

function setupMusic() {
  musicToggle.addEventListener('click', () => {
    if (!bgMusic.querySelector('source')) {
      musicToggle.textContent = 'No audio source available';
      return;
    }

    if (bgMusic.muted) {
      bgMusic.muted = false;
      bgMusic.play().catch(() => {
        musicToggle.textContent = 'Tap to enable music';
      });
      musicToggle.textContent = 'Pause music';
    } else {
      bgMusic.muted = true;
      musicToggle.textContent = 'Play soft music';
    }
  });
}

yesBtn.addEventListener('click', () => {
  if (isTransitioning) return;
  yesBtn.classList.add('active');
  showMessage('You made the right choice ❤️');
  setTimeout(startCinematicTransition, 250);
});

window.addEventListener('load', () => {
  attachNoButtonListeners();
  initBackgroundMotion();
  setupMusic();

  noBtn.style.position = 'fixed';
  noBtn.style.left = 'calc(50% + 120px)';
  noBtn.style.top = '50%';
  noBtn.style.transform = 'scale(1)';
  noBtn.style.zIndex = '3';
  yesBtn.style.transform = 'scale(1)';
});
