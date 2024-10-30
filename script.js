// Chọn các phần tử DOM
const runButton = document.getElementById('runButton');
const optionSelect = document.getElementById('optionSelect');
const numPhilosophersInput = document.getElementById('numPhilosophers');
const contentBox = document.getElementById('contentBox');

// Khai báo các biến toàn cục
let philosophers = [];
let numPhilosophers = 5; // Giá trị mặc định
let maxEats = 1; // Giới hạn số lần ăn tối đa cho mỗi triết gia
let maxItems = 10; // Giới hạn số sản phẩm tối đa cho Producer-Consumer
// Biến lưu trữ các sản phẩm trong kho
let buffer = [];
let bufferMaxSize = 10; 
let producerConsumerRunning = true;
// Hàm để hiển thị kết quả
function displayResult(message) {
    contentBox.innerHTML += message + "<br>";
    contentBox.scrollTop = contentBox.scrollHeight; // Cuộn xuống cùng
}

// Hàm tạm dừng (sleep)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Khai báo Semaphore
class Semaphore {
    constructor(count) {
        this.count = count;
        this.queue = [];
    }

    async wait() {
        if (this.count <= 0) {
            await new Promise(resolve => this.queue.push(resolve));
        }
        this.count--;
    }

    signal() {
        this.count++;
        if (this.queue.length > 0) {
            const resolve = this.queue.shift();
            resolve();
        }
    }
}

// Khai báo Monitor
class Monitor {
    constructor() {
        this.lock = false;
        this.queue = [];
    }

    async enter() {
        while (this.lock) {
            await new Promise(resolve => this.queue.push(resolve));
        }
        this.lock = true;
    }

    leave() {
        this.lock = false;
        if (this.queue.length > 0) {
            const resolve = this.queue.shift();
            resolve();
        }
    }
}

// Hàm cho Semaphore (Triết gia)
async function semaphorePhilosophers() {
    const chopsticks = new Array(numPhilosophers).fill(false);
    const semaphore = new Semaphore(numPhilosophers - 1); // Chỉ có thể có n-1 triết gia ngồi cùng một lúc

    async function philosopher(id) {
        let eats = 0; // Đếm số lần ăn

        while (eats < maxEats) {
            displayResult(`Triết gia số ${id}: đang suy nghĩ...`);
            await sleep(1000); // Thời gian suy nghĩ

            await semaphore.wait(); // Chờ đến lượt

            if (!chopsticks[id] && !chopsticks[(id + 1) % numPhilosophers]) {
                chopsticks[id] = true;
                chopsticks[(id + 1) % numPhilosophers] = true;
                displayResult(`Triết gia số ${id}: đã có đủ hai chiếc đũa và đang ăn...`);
                await sleep(1000); // Thời gian ăn
                chopsticks[id] = false;
                chopsticks[(id + 1) % numPhilosophers] = false;
                displayResult(`Triết gia số ${id}: đã ăn xong và thả đũa...`);
                eats++; // Tăng số lần ăn
            }

            semaphore.signal(); // Giải phóng semaphore
        }

        displayResult(`Triết gia số ${id}: đã ăn xong ${maxEats} lần và ra về.`);
    }

    for (let i = 0; i < numPhilosophers; i++) {
        philosophers[i] = philosopher(i);
    }
}

// Hàm cho Monitor (Triết gia)
async function monitorPhilosophers() {
    const chopsticks = new Array(numPhilosophers).fill(false);
    const monitor = new Monitor();

    async function philosopher(id) {
        let eats = 0; // Đếm số lần ăn

        while (eats < maxEats) {
            displayResult(`Triết gia số ${id}: đang suy nghĩ...`);
            await sleep(1000); // Thời gian suy nghĩ

            await monitor.enter(); // Nhập vào monitor

            if (!chopsticks[id] && !chopsticks[(id + 1) % numPhilosophers]) {
                chopsticks[id] = true;
                chopsticks[(id + 1) % numPhilosophers] = true;
                displayResult(`Triết gia số ${id}: đã có đủ hai chiếc đũa và đang ăn...`);
                await sleep(1000); // Thời gian ăn
                chopsticks[id] = false;
                chopsticks[(id + 1) % numPhilosophers] = false;
                displayResult(`Triết gia số ${id}: đã ăn xong và thả đũa...`);
                eats++; // Tăng số lần ăn
            }

            monitor.leave(); // Giải phóng monitor
        }

        displayResult(`Triết gia số ${id}: đã ăn xong ${maxEats} lần và ra về.`);
    }

    for (let i = 0; i < numPhilosophers; i++) {
        philosophers[i] = philosopher(i);
    }
}
// Hàm để tạo Deadlock với Semaphore (Triết gia)
// Hàm để tạo Deadlock với Semaphore (Triết gia)
async function semaphorePhilosophersDeadlock() {
    const chopsticks = new Array(numPhilosophers).fill(false);
    const semaphore = new Semaphore(numPhilosophers); // Cho phép tất cả triết gia cùng giữ một chiếc đũa

    async function philosopher(id) {
        while (true) { // Lặp vô tận để mô phỏng deadlock
            displayResult(`Triết gia số ${id}: đang suy nghĩ...`);
            await sleep(1000); // Thời gian suy nghĩ

            await semaphore.wait(); // Chờ đến lượt

            // Mỗi triết gia chỉ lấy một chiếc đũa và không bao giờ có được chiếc đũa thứ hai
            if (!chopsticks[id]) {
                chopsticks[id] = true;
                displayResult(`Triết gia số ${id}: đang giữ một chiếc đũa bên trái mình.`);
            } else if (!chopsticks[(id + 1) % numPhilosophers]) {
                // Nếu triết gia có cả hai chiếc đũa, họ sẽ không bao giờ thả ra để ăn
                chopsticks[(id + 1) % numPhilosophers] = true;
                displayResult(`Triết gia số ${id}: đã có đủ hai chiếc đũa nhưng không thể ăn (Deadlock)!`);
            }

            // Không có "signal" để thả đũa, giữ triết gia trong trạng thái deadlock
        }
    }

    for (let i = 0; i < numPhilosophers; i++) {
        philosophers[i] = philosopher(i);
    }
}

// Producer-Consumer với Semaphore
async function semaphoreProducerConsumer() {
    const empty = new Semaphore(bufferMaxSize); // Semaphore đếm số ô trống
    const full = new Semaphore(0); // Semaphore đếm số ô có sản phẩm
    const mutex = new Semaphore(1); // Semaphore khóa truy cập vào buffer
    let producedCount = 0; // Đếm số sản phẩm đã sản xuất
    let consumedCount = 0; // Đếm số sản phẩm đã tiêu thụ

    async function producer() {
        while (producerConsumerRunning && producedCount < maxItems) {
            await empty.wait(); // Đợi có ô trống
            await mutex.wait(); // Đợi truy cập buffer

            const item = Math.floor(Math.random() * 100);
            buffer.push(item);
            producedCount++;
            displayResult(`Producer: sản xuất ${item} (Tổng số sản xuất: ${producedCount}, Buffer: ${buffer.length}/${bufferMaxSize})`);

            mutex.signal(); // Mở khóa truy cập buffer
            full.signal(); // Tăng số lượng sản phẩm
            await sleep(1500); // Thay đổi thời gian để làm nổi bật
        }
        displayResult("Producer: Đã đạt giới hạn sản phẩm.");
    }

    async function consumer() {
        while (producerConsumerRunning && consumedCount < maxItems) {
            await full.wait(); // Đợi có sản phẩm
            await mutex.wait(); // Đợi truy cập buffer

            const item = buffer.shift();
            consumedCount++;
            displayResult(`Consumer: tiêu thụ ${item} (Tổng số tiêu thụ: ${consumedCount}, Buffer: ${buffer.length}/${bufferMaxSize})`);

            mutex.signal(); // Mở khóa truy cập buffer
            empty.signal(); // Tăng số lượng ô trống
            await sleep(1000);
        }
        displayResult("Consumer: Đã đạt giới hạn sản phẩm tiêu thụ.");
    }

    producer();
    consumer();
}

// Producer-Consumer với Monitor
async function monitorProducerConsumer() {
    const monitor = new Monitor();
    let producedCount = 0; // Đếm số sản phẩm đã sản xuất
    let consumedCount = 0; // Đếm số sản phẩm đã tiêu thụ

    async function producer() {
        while (producerConsumerRunning && producedCount < maxItems) {
            await monitor.enter();
            if (buffer.length < bufferMaxSize) {
                const item = Math.floor(Math.random() * 100);
                buffer.push(item);
                producedCount++;
                displayResult(`Producer: sản xuất ${item} (Tổng số sản xuất: ${producedCount}, Buffer: ${buffer.length}/${bufferMaxSize})`);
            }
            monitor.leave();
            await sleep(1000); // Thời gian chờ cho Monitor
        }
        displayResult("Producer: Đã đạt giới hạn sản phẩm.");
    }

    async function consumer() {
        while (producerConsumerRunning && consumedCount < maxItems) {
            await monitor.enter();
            if (buffer.length > 0) {
                const item = buffer.shift();
                consumedCount++;
                displayResult(`Consumer: tiêu thụ ${item} (Tổng số tiêu thụ: ${consumedCount}, Buffer: ${buffer.length}/${bufferMaxSize})`);
            }
            monitor.leave();
            await sleep(1200); // Thay đổi thời gian chờ cho Monitor
        }
        displayResult("Consumer: Đã đạt giới hạn sản phẩm tiêu thụ.");
    }

    producer();
    consumer();
}





// Sự kiện khi nhấn nút deadlock
const deadlockButton = document.getElementById('deadlockButton');
if (deadlockButton) {
    deadlockButton.addEventListener('click', async () => {
        contentBox.innerHTML = ""; // Xóa nội dung trước khi chạy
        numPhilosophers = parseInt(numPhilosophersInput.value); // Lấy số triết gia
        await semaphorePhilosophersDeadlock();
    });
}


// Thêm hàm cho Reader-Writer với Semaphore
async function semaphoreReaderWriter() {
    const mutex = new Semaphore(1); // Kiểm soát truy cập vào reader_count
    const db = new Semaphore(1); // Kiểm soát truy cập vào cơ sở dữ liệu
    let readerCount = 0; // Số lượng reader đang truy cập

    async function reader(id) {
        for (let i = 0; i < 5; i++) { // Giới hạn số lần đọc
            await mutex.wait(); // Truy cập vào reader_count
            readerCount++;
            if (readerCount === 1) {
                await db.wait(); // Nếu đây là reader đầu tiên, chờ truy cập vào cơ sở dữ liệu
            }
            mutex.signal(); // Giải phóng mutex

            // Đọc cơ sở dữ liệu
            displayResult(`Reader ${id}: Đang đọc cơ sở dữ liệu...`);
            await sleep(1000); // Giả lập thời gian đọc

            await mutex.wait(); // Truy cập vào reader_count
            readerCount--;
            if (readerCount === 0) {
                db.signal(); // Nếu không còn reader nào, cho phép writer truy cập
            }
            mutex.signal(); // Giải phóng mutex

            await sleep(1000); // Thời gian nghỉ trước khi đọc lại
        }
    }

    async function writer(id) {
        for (let i = 0; i < 3; i++) { // Giới hạn số lần ghi
            // Giả lập thời gian tạo dữ liệu
            displayResult(`Writer ${id}: Đang tạo dữ liệu...`);
            await sleep(1000);

            await db.wait(); // Chờ truy cập vào cơ sở dữ liệu

            // Viết thông tin vào cơ sở dữ liệu
            displayResult(`Writer ${id}: Đang viết vào cơ sở dữ liệu...`);
            await sleep(1000); // Giả lập thời gian viết
            db.signal(); // Giải phóng db

            await sleep(1000); // Thời gian nghỉ trước khi ghi lại
        }
    }

    // Khởi động các reader và writer
    for (let i = 0; i < 3; i++) {
        reader(i);
    }
    for (let i = 0; i < 2; i++) {
        writer(i);
    }
}
async function monitorReaderWriter() {
    const monitor = new Monitor();
    let readerCount = 0; // Number of active readers
    let waitingWriters = 0; // Number of waiting writers

    async function startRead() {
        await monitor.enter();
        // Wait if there's any writer waiting
        while (waitingWriters > 0) {
            await new Promise(resolve => monitor.queue.push(resolve));
        }
        readerCount++;
        monitor.leave();
    }

    async function endRead() {
        await monitor.enter();
        readerCount--;
        if (readerCount === 0) {
            // Notify the next waiting writer if there are any
            if (monitor.queue.length > 0) {
                const resolve = monitor.queue.shift();
                resolve();
            }
        }
        monitor.leave();
    }

    async function startWrite() {
        await monitor.enter();
        waitingWriters++; // Increase the waiting writer count
        // Wait while there are readers or other writers
        while (readerCount > 0) {
            await new Promise(resolve => monitor.queue.push(resolve));
        }
        waitingWriters--; // Decrease the waiting writer count
        monitor.leave();
    }

    async function endWrite() {
        await monitor.enter();
        // Notify the next waiting reader or writer
        if (monitor.queue.length > 0) {
            const resolve = monitor.queue.shift();
            resolve();
        }
        monitor.leave();
    }

    async function reader(id) {
        for (let i = 0; i < 5; i++) {
            await startRead();
            displayResult(`Reader ${id}: Đang đọc cơ sở dữ liệu...`);
            await sleep(1000); // Simulate read time
            await endRead();
            await sleep(1000); // Wait before reading again
        }
    }

    async function writer(id) {
        for (let i = 0; i < 3; i++) {
            displayResult(`Writer ${id}: Đang tạo dữ liệu...`);
            await sleep(1000); // Simulate data creation
            await startWrite();
            displayResult(`Writer ${id}: Đang viết vào cơ sở dữ liệu...`);
            await sleep(1000); // Simulate write time
            await endWrite();
            await sleep(1000); // Wait before writing again
        }
    }

    const readerPromises = [];
    const writerPromises = [];
    for (let i = 0; i < 3; i++) {
        readerPromises.push(reader(i));
    }
    for (let i = 0; i < 2; i++) {
        writerPromises.push(writer(i));
    }

    await Promise.all([...readerPromises, ...writerPromises]);
}




// Sự kiện khi nhấn nút chạy
runButton.addEventListener('click', async () => {
    contentBox.innerHTML = ""; // Xóa nội dung trước khi chạy
    numPhilosophers = parseInt(numPhilosophersInput.value); // Lấy số triết gia
    producerConsumerRunning = true;
    const selectedOption = optionSelect.value;

    switch (selectedOption) {
        case 'Philosophers - Semaphore':
            await semaphorePhilosophers();
            break;
        case 'Philosophers - Monitor':
            await monitorPhilosophers();
            break;
        case 'Producer-Consumer - Semaphore':
            await semaphoreProducerConsumer();
            break;
        case 'Producer-Consumer - Monitor':
            await monitorProducerConsumer();
            break;
        case 'Reader-Writer - Semaphore': // Thêm tùy chọn cho Reader-Writer Semaphore
            await semaphoreReaderWriter();
            break;
        case 'Reader-Writer - Monitor': // Thêm tùy chọn cho Reader-Writer Monitor
            await monitorReaderWriter();
            break;
        default:
            displayResult('Chưa chọn phương pháp nào.');
            break;
    }
});

