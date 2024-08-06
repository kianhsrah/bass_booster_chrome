document.addEventListener('DOMContentLoaded', () => {
    const frequencies = [60, 170, 350, 1000, 3500, 10000];
  
    frequencies.forEach((freq) => {
      const slider = document.getElementById(`${freq}hz`);
      slider.addEventListener('input', (event) => {
        const gainValue = parseFloat(event.target.value);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'updateEqualizer',
              frequency: freq,
              gain: gainValue
            }, (response) => {
              if (response && response.status === 'success') {
                console.log(`Updated ${freq} Hz to ${gainValue}`);
              } else {
                console.error('Failed to update equalizer', response);
              }
            });
          }
        });
      });
    });
  });
  