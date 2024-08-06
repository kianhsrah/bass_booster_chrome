chrome.action.onClicked.addListener((tab) => {
    chrome.tabCapture.capture({audio: true}, (stream) => {
      if (stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        
        // Create the equalizer (gain nodes for different frequencies)
        const equalizer = [];
        const frequencies = [60, 170, 350, 1000, 3500, 10000];
        frequencies.forEach(freq => {
          const eq = audioContext.createBiquadFilter();
          eq.type = "peaking";
          eq.frequency.value = freq;
          eq.Q.value = 1;
          eq.gain.value = 0;
          equalizer.push(eq);
        });
  
        // Connect nodes in the correct order
        source.connect(equalizer[0]);
        for (let i = 0; i < equalizer.length - 1; i++) {
          equalizer[i].connect(equalizer[i + 1]);
        }
        equalizer[equalizer.length - 1].connect(audioContext.destination);
  
        // Store the equalizer nodes for later control
        const eqNodeReferences = equalizer.map(eq => {
          return {
            frequency: eq.frequency.value,
            gain: eq.gain,
            node: eq
          };
        });
        chrome.storage.local.set({equalizer: eqNodeReferences});
      }
    });
  });
  