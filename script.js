document.getElementById('runButton').addEventListener('click', () => {
    const selectedOption = document.getElementById('optionSelect').value;
    const content = document.getElementById('contentBox').innerText;
    alert('You selected: ' + selectedOption + '\nDisplayed content: ' + content);
  });
  
  // script.js

// script.js

// Truy cập các phần tử trong DOM
const runButton = document.getElementById('runButton');
const optionSelect = document.getElementById('optionSelect');
const contentBox = document.getElementById('contentBox');

// Sự kiện khi nhấn nút "Run"
runButton.addEventListener('click', () => {
  const selectedOption = optionSelect.value; // Lấy giá trị từ combo box

  // Kiểm tra tùy chọn đã chọn là Semaphore hay Monitor
  if (selectedOption === 'Semaphore') {
    simulateSemaphore();
  } else if (selectedOption === 'Monitor') {
    simulateMonitor();
  }
});

// Mô phỏng giải thuật Semaphore
function simulateSemaphore() {
  contentBox.innerText = 'Running Semaphore Algorithm...';
  
  // Đơn giản mô phỏng quá trình ăn và suy nghĩ
  setTimeout(() => {
    contentBox.innerText = 'Philosopher 1 is thinking...';
  }, 1000);
  
  setTimeout(() => {
    contentBox.innerText = 'Philosopher 1 is eating...';
  }, 3000);
  
  setTimeout(() => {
    contentBox.innerText = 'Philosopher 1 finished eating.';
  }, 5000);
}

// Mô phỏng giải thuật Monitor
function simulateMonitor() {
  contentBox.innerText = 'Running Monitor Algorithm...';
  
  // Đơn giản mô phỏng quá trình ăn và suy nghĩ
  setTimeout(() => {
    contentBox.innerText = 'Philosopher 2 is thinking...';
  }, 1000);
  
  setTimeout(() => {
    contentBox.innerText = 'Philosopher 2 is eating...';
  }, 3000);
  
  setTimeout(() => {
    contentBox.innerText = 'Philosopher 2 finished eating.';
  }, 5000);
}
