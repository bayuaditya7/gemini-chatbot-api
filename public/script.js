const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const conversation = [];

// Event listener for form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    // tampilkan pesan user
    appendMessage('user', userMessage);
    input.value = '';

    // simpan ke memory
    conversation.push({
        role: 'user',
        text: userMessage
    });

    // tampilkan loading
    const loadingMsg = appendMessage('bot', 'Gemini sedang mengetik...');

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conversation })
        });

        const data = await response.json();

        // hapus loading
        loadingMsg.remove();

        if (!response.ok) {
            appendMessage('bot', data.error || 'Terjadi kesalahan');
            return;
        }

        // tampilkan balasan bot
        appendMessage('bot', data.result);

        // simpan balasan ke memory
        conversation.push({
            role: 'model',
            text: data.result
        });

    } catch (error) {
        loadingMsg.remove();
        appendMessage('bot', 'Gagal terhubung ke server');
        console.error(error);
    }
});

// Function to append message to chat box
function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.innerHTML = formatText(text);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\n/g, '<br>'); // line break
}

// Theme toggle
const toggle = document.getElementById('theme-toggle');

// load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  toggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
