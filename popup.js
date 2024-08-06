document.addEventListener('DOMContentLoaded', () => {
    const frequencies = [60, 170, 350, 1000, 3500, 10000];
    
    frequencies.forEach((freq) => {
      const slider = document.getElementById(`${freq}hz`);
      slider.addEventListener('input', (event) => {
        const gainValue = parseFloat(event.target.value);
        
        chrome.storage.local.get('equalizer', (data) => {
          const equalizer = data.equalizer;
          if (equalizer) {
            const eqNode = equalizer.find(eq => eq.frequency === freq);
            if (eqNode && eqNode.gain) {
              eqNode.gain.value = gainValue;
            }
          }
        });
      });
    });
  });
  