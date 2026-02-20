// General Visualizer Controller
function showVisualizer(type, event) {
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    // Update content
    document.querySelectorAll('.viz-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${type}-viz`).classList.add('active');

    if (type === 'sorting') {
        generateSortArray();
    } else if (type === 'binary-search') {
        generateBSArray();
    }
}

// Ensure sorting is visible on load
window.addEventListener('load', () => {
    generateSortArray();
});

// Utility: Delay for animations
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Sorting Logic ---
let sortArray = [];
function generateSortArray() {
    const size = document.getElementById('sort-size').value;
    const display = document.getElementById('sorting-display');
    if (!display) return;
    display.innerHTML = '';
    sortArray = [];
    for (let i = 0; i < size; i++) {
        sortArray.push(Math.floor(Math.random() * 250) + 20);
    }
    renderSortBars();
}

function renderSortBars() {
    const display = document.getElementById('sorting-display');
    display.innerHTML = '';
    sortArray.forEach(val => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${val}px`;
        display.appendChild(bar);
    });
}

async function startBubbleSort() {
    const bars = document.querySelectorAll('.bar');
    const speed = 101 - document.getElementById('sort-speed').value;

    for (let i = 0; i < sortArray.length; i++) {
        for (let j = 0; j < sortArray.length - i - 1; j++) {
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            await sleep(speed);

            if (sortArray[j] > sortArray[j + 1]) {
                let temp = sortArray[j];
                sortArray[j] = sortArray[j + 1];
                sortArray[j + 1] = temp;
                bars[j].style.height = `${sortArray[j]}px`;
                bars[j + 1].style.height = `${sortArray[j + 1]}px`;
            }
            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
        bars[sortArray.length - i - 1].classList.add('sorted');
    }
}

async function startSelectionSort() {
    const bars = document.querySelectorAll('.bar');
    const speed = 101 - document.getElementById('sort-speed').value;

    for (let i = 0; i < sortArray.length; i++) {
        let minIdx = i;
        bars[i].classList.add('comparing');
        for (let j = i + 1; j < sortArray.length; j++) {
            bars[j].classList.add('comparing');
            await sleep(speed);
            if (sortArray[j] < sortArray[minIdx]) {
                bars[minIdx].classList.remove('comparing');
                minIdx = j;
            } else {
                bars[j].classList.remove('comparing');
            }
        }
        if (minIdx !== i) {
            let temp = sortArray[i];
            sortArray[i] = sortArray[minIdx];
            sortArray[minIdx] = temp;
            bars[i].style.height = `${sortArray[i]}px`;
            bars[minIdx].style.height = `${sortArray[minIdx]}px`;
        }
        bars[minIdx].classList.remove('comparing');
        bars[i].classList.add('sorted');
    }
}

async function startInsertionSort() {
    const bars = document.querySelectorAll('.bar');
    const speed = 101 - document.getElementById('sort-speed').value;

    for (let i = 1; i < sortArray.length; i++) {
        let key = sortArray[i];
        let j = i - 1;
        bars[i].classList.add('comparing');
        await sleep(speed);

        while (j >= 0 && sortArray[j] > key) {
            bars[j].classList.add('comparing');
            sortArray[j + 1] = sortArray[j];
            bars[j + 1].style.height = `${sortArray[j + 1]}px`;
            await sleep(speed);
            bars[j].classList.remove('comparing');
            j--;
        }
        sortArray[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        bars[i].classList.remove('comparing');
    }
    bars.forEach(bar => bar.classList.add('sorted'));
}

async function startMergeSort() {
    const speed = 101 - document.getElementById('sort-speed').value;
    const bars = document.querySelectorAll('.bar');

    async function merge(start, mid, end) {
        let n1 = mid - start + 1;
        let n2 = end - mid;
        let left = sortArray.slice(start, mid + 1);
        let right = sortArray.slice(mid + 1, end + 1);

        let i = 0, j = 0, k = start;
        while (i < n1 && j < n2) {
            bars[k].classList.add('comparing');
            await sleep(speed);
            if (left[i] <= right[j]) {
                sortArray[k] = left[i];
                i++;
            } else {
                sortArray[k] = right[j];
                j++;
            }
            bars[k].style.height = `${sortArray[k]}px`;
            bars[k].classList.remove('comparing');
            k++;
        }
        while (i < n1) {
            sortArray[k] = left[i];
            bars[k].style.height = `${sortArray[k]}px`;
            i++; k++;
        }
        while (j < n2) {
            sortArray[k] = right[j];
            bars[k].style.height = `${sortArray[k]}px`;
            j++; k++;
        }
    }

    async function sort(l, r) {
        if (l >= r) return;
        let m = Math.floor((l + r) / 2);
        await sort(l, m);
        await sort(m + 1, r);
        await merge(l, m, r);
        for (let i = l; i <= r; i++) bars[i].classList.add('sorted');
    }
    await sort(0, sortArray.length - 1);
}

// --- Binary Search Logic ---
let bsArray = [];
function generateBSArray() {
    bsArray = [];
    for (let i = 0; i < 15; i++) {
        bsArray.push(Math.floor(Math.random() * 100));
    }
    bsArray.sort((a, b) => a - b);
    renderBSNodes();
}

function renderBSNodes() {
    const display = document.getElementById('bs-display');
    if (!display) return;
    display.innerHTML = '';
    bsArray.forEach((val, index) => {
        const node = document.createElement('div');
        node.className = 'bs-node';
        node.id = `bs-node-${index}`;
        node.innerText = val;
        display.appendChild(node);
    });
}

async function startBinarySearch() {
    const target = parseInt(document.getElementById('bs-input').value);
    if (isNaN(target)) return;

    renderBSNodes(); // Reset highlight
    let low = 0;
    let high = bsArray.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const node = document.getElementById(`bs-node-${mid}`);

        // Highlight range
        for (let i = 0; i < bsArray.length; i++) {
            const n = document.getElementById(`bs-node-${i}`);
            n.classList.remove('active-range', 'mid-point');
        }
        for (let i = low; i <= high; i++) {
            document.getElementById(`bs-node-${i}`).classList.add('active-range');
        }

        node.classList.add('mid-point');
        await sleep(800);

        if (bsArray[mid] === target) {
            node.classList.add('found');
            return;
        }
        if (bsArray[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    alert("Value not found!");
}
