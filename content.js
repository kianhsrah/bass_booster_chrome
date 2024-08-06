(function() {
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;
  
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const frequencies = [60, 170, 350, 1000, 3500, 10000];
    const equalizer = frequencies.map(freq => {
      const filter = audioContext.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });
  
    function setupEqualizer() {
      const audioElements = document.querySelectorAll('audio, video');
      audioElements.forEach(element => {
        const source = audioContext.createMediaElementSource(element);
        source.connect(equalizer[0]);
        for (let i = 0; i < equalizer.length - 1; i++) {
          equalizer[i].connect(equalizer[i + 1]);
        }
        equalizer[equalizer.length - 1].connect(audioContext.destination);
      });
    }
  
    document.addEventListener('play', setupEqualizer, true);
  
    chrome.storage.local.get('equalizer', (data) => {
      if (data.equalizer) {
        data.equalizer.forEach((gain, index) => {
          if (equalizer[index]) {
            equalizer[index].gain.value = gain;
          }
        });
      }
    });
  
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'updateEqualizer') {
        const { frequency, gain } = message;
        const eqNode = equalizer.find(eq => eq.frequency.value === frequency);
        if (eqNode) {
          eqNode.gain.value = gain;
          chrome.storage.local.set({ equalizer: equalizer.map(eq => eq.gain.value) });
          sendResponse({status: 'success'});
        } else {
          sendResponse({status: 'error', message: 'Equalizer node not found'});
        }
      }
    });
  })();
  