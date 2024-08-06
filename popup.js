document.addEventListener('DOMContentLoaded', () => {
    const frequencies = [60, 170, 350, 1000, 3500, 10000];
    
    frequencies.forEach((freq) => {
      const slider = document.getElementById(`${freq}hz`);
      slider.addEventListener('input', (event) => {
        const gainValue = parseFloat(event.target.value);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'updateEqualizer',
            frequency: freq,
            gain: gainValue
          });
        });
      });
    });
  });
  