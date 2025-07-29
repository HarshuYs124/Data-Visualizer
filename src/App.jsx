// File: src/App.jsx
import React, { useState, useEffect } from 'react';

const playBeep = (frequency = 400, duration = 150) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
};

const generateRandomArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 10);

function App() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(15);
  const [algorithm, setAlgorithm] = useState("Insertion Sort");
  const [isSorting, setIsSorting] = useState(false);
  const [highlighted, setHighlighted] = useState({ i: -1, j: -1, message: '' });
  const [target, setTarget] = useState('');

  useEffect(() => {
    setArray(generateRandomArray(size));
  }, [size]);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const getLabel = (i) => String.fromCharCode(97 + (i % 26));

  const handleGenerate = () => {
    if (!isSorting) {
      setArray(generateRandomArray(size));
      setHighlighted({ i: -1, j: -1, message: '' });
    }
  };

  const insertionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      setHighlighted({ i, j, message: `Comparing ${getLabel(i)} with left side.` });
      await sleep(800);
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        setHighlighted({ i: j + 1, j, message: `Shifting ${getLabel(j + 1)} right.` });
        playBeep(600);
        await sleep(800);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setHighlighted({ i: j + 1, j, message: `Inserting ${getLabel(i)}.` });
      playBeep(800);
      await sleep(800);
    }
    setHighlighted({ i: -1, j: -1, message: 'Sorting complete!' });
    setIsSorting(false);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setHighlighted({ i: j, j: j + 1, message: `Comparing ${getLabel(j)} and ${getLabel(j + 1)}` });
        await sleep(700);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          playBeep(700);
          setHighlighted({ i: j, j: j + 1, message: `Swapped ${getLabel(j)} and ${getLabel(j + 1)}` });
          await sleep(800);
        }
      }
    }
    setHighlighted({ i: -1, j: -1, message: 'Sorting complete!' });
    setIsSorting(false);
  };

  const selectionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        setHighlighted({ i: minIdx, j, message: `Finding min between ${getLabel(minIdx)} and ${getLabel(j)}` });
        await sleep(600);
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        playBeep(800);
        setHighlighted({ i, j: minIdx, message: `Swapped ${getLabel(i)} with ${getLabel(minIdx)}` });
        await sleep(700);
      }
    }
    setHighlighted({ i: -1, j: -1, message: 'Sorting complete!' });
    setIsSorting(false);
  };

  const mergeSort = async (arr, l, r) => {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    await mergeSort(arr, l, mid);
    await mergeSort(arr, mid + 1, r);
    let merged = [], i = l, j = mid + 1;

    while (i <= mid && j <= r) {
      setHighlighted({ i, j, message: `Merging ${getLabel(i)} and ${getLabel(j)}` });
      await sleep(500);
      if (arr[i] <= arr[j]) merged.push(arr[i++]);
      else merged.push(arr[j++]);
    }
    while (i <= mid) merged.push(arr[i++]);
    while (j <= r) merged.push(arr[j++]);
    for (let k = l; k <= r; k++) arr[k] = merged[k - l];
    setArray([...arr]);
    await sleep(500);
  };

  const startMergeSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    await mergeSort(arr, 0, arr.length - 1);
    setHighlighted({ message: 'Sorting complete!', i: -1, j: -1 });
    setIsSorting(false);
  };

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high);
      await quickSort(arr, low, pivotIndex - 1);
      await quickSort(arr, pivotIndex + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      setHighlighted({ i: j, j: high, message: `Comparing ${getLabel(j)} with pivot ${getLabel(high)}` });
      await sleep(600);
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(600);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(600);
    return i + 1;
  };

  const startQuickSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    await quickSort(arr, 0, arr.length - 1);
    setHighlighted({ message: 'Sorting complete!', i: -1, j: -1 });
    setIsSorting(false);
  };

  const linearSearch = async () => {
    setIsSorting(true);
    const arr = [...array];
    const tgt = parseInt(target);
    for (let i = 0; i < arr.length; i++) {
      setHighlighted({ i, j: -1, message: `Checking ${getLabel(i)}: ${arr[i]}` });
      await sleep(500);
      if (arr[i] === tgt) {
        setHighlighted({ i, j: -1, message: `Found ${tgt} at ${getLabel(i)}!` });
        setIsSorting(false);
        return;
      }
    }
    setHighlighted({ i: -1, j: -1, message: `${tgt} not found.` });
    setIsSorting(false);
  };

  const binarySearch = async () => {
    setIsSorting(true);
    const arr = [...array].sort((a, b) => a - b);
    setArray([...arr]);
    let l = 0, r = arr.length - 1, tgt = parseInt(target);
    while (l <= r) {
      let mid = Math.floor((l + r) / 2);
      setHighlighted({ i: mid, j: -1, message: `Mid: ${getLabel(mid)} (${arr[mid]})` });
      await sleep(600);
      if (arr[mid] === tgt) {
        setHighlighted({ i: mid, j: -1, message: `Found ${tgt} at ${getLabel(mid)}` });
        setIsSorting(false);
        return;
      } else if (arr[mid] < tgt) l = mid + 1;
      else r = mid - 1;
    }
    setHighlighted({ message: `${tgt} not found.`, i: -1, j: -1 });
    setIsSorting(false);
  };

  const handleSort = () => {
    if (algorithm === 'Insertion Sort') insertionSort();
    else if (algorithm === 'Bubble Sort') bubbleSort();
    else if (algorithm === 'Selection Sort') selectionSort();
    else if (algorithm === 'Merge Sort') startMergeSort();
    else if (algorithm === 'Quick Sort') startQuickSort();
    else if (algorithm === 'Linear Search') linearSearch();
    else if (algorithm === 'Binary Search') binarySearch();
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      background: 'linear-gradient(to right, #0f172a, #1e293b)',
      color: '#fff',
      padding: '20px',
      height: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '3rem',
        marginBottom: '10px',
        color: '#38bdf8',
        textShadow: '0 0 10px #38bdf8',
      }}>🔍 DATA VISUALIZER</h1>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: '10px',
        marginBottom: '10px', flexWrap: 'wrap'
      }}>
        <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}
          style={{ padding: '6px', borderRadius: '5px' }}>
          <option>Insertion Sort</option>
          <option>Bubble Sort</option>
          <option>Selection Sort</option>
          <option>Merge Sort</option>
          <option>Quick Sort</option>
          <option>Linear Search</option>
          <option>Binary Search</option>
        </select>
        <input type="number" min={5} max={26} value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ padding: '6px', width: '60px' }} />
        {algorithm.includes('Search') && (
          <input type="number" placeholder="Target"
            value={target} onChange={e => setTarget(e.target.value)}
            style={{ padding: '6px', width: '80px' }} />
        )}
        <button onClick={handleGenerate} disabled={isSorting}
          style={{ padding: '6px 12px', background: '#f59e0b', border: 'none', borderRadius: '5px' }}>Generate</button>
        <button onClick={handleSort} disabled={isSorting}
          style={{ padding: '6px 12px', background: '#10b981', border: 'none', borderRadius: '5px' }}>Start</button>
      </div>

      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#facc15' }}>{highlighted.message}</p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '6px',
        flexGrow: 1,
        maxWidth: '100vw',
        overflowX: 'auto',
        padding: '0 10px',
      }}>
        {array.map((val, idx) => (
          <div key={idx} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#fef08a', marginBottom: '4px' }}>{val}</span>
            <div style={{
              height: `${val * 3}px`,
              width: '30px',
              borderRadius: '6px',
              background: idx === highlighted.i
                ? 'linear-gradient(to top, #22d3ee, #67e8f9)'
                : idx === highlighted.j
                  ? 'linear-gradient(to top, #facc15, #fde68a)'
                  : 'linear-gradient(to top, #f97316, #fdba74)',
              boxShadow: idx === highlighted.i || idx === highlighted.j
                ? '0 0 8px 2px rgba(255,255,255,0.4)' : '',
              transition: 'height 0.3s ease, background 0.3s ease'
            }}></div>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>{getLabel(idx)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
