+++
title = "PGP tools"
description = "A client-side utility to encrypt messages for Vasilios Syrakis using his public PGP key, or verify digital signatures sent by him."
+++

<script src="https://cdn.jsdelivr.net/npm/openpgp@5.11.2/dist/openpgp.min.js" defer></script>

<style>
.pgp-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.pgp-card {
  background-color: var(--fg-muted-1);
  border: 1px solid var(--fg-muted-2);
  border-radius: var(--rounded-corner);
  box-shadow: var(--edge-highlight), var(--shadow);
  padding: 1.5rem;
}

.pgp-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--fg-muted-2);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  display: flex;
}

.pgp-tab-btn {
  background: transparent;
  border: none;
  color: var(--fg-muted-4);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--rounded-corner-small);
  transition: all var(--transition);
}

.pgp-tab-btn:hover {
  color: var(--fg-color);
  background-color: var(--fg-muted-1);
}

.pgp-tab-btn.active {
  color: var(--accent-color);
  background-color: var(--fg-muted-2);
}

.pgp-panel {
  display: none;
}

.pgp-panel.active {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pgp-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pgp-input-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--fg-color);
}

.pgp-textarea {
  width: 100%;
  min-height: 160px;
  background-color: var(--fg-muted-1);
  border: 1px solid var(--fg-muted-2);
  border-radius: var(--rounded-corner-small);
  color: var(--fg-color);
  font-family: var(--font-monospace, monospace);
  font-size: 0.85rem;
  padding: 0.75rem;
  resize: vertical;
  transition: border-color var(--transition);
}

.pgp-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.pgp-button-row {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  align-items: center;
}

.pgp-btn {
  background-color: var(--accent-color);
  color: var(--contrast-color, #000);
  border: none;
  border-radius: var(--rounded-corner-small);
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--transition), transform var(--transition);
}

.pgp-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.pgp-btn:active {
  transform: translateY(0);
}

.pgp-btn-secondary {
  background-color: var(--fg-muted-2);
  color: var(--fg-color);
}

.pgp-btn-secondary:hover {
  background-color: var(--fg-muted-3);
  opacity: 1;
}

.pgp-status {
  padding: 0.75rem;
  border-radius: var(--rounded-corner-small);
  font-size: 0.9rem;
  font-weight: 600;
  display: none;
}

.pgp-status.success {
  display: block;
  background-color: rgba(40, 167, 69, 0.15);
  border: 1px solid rgb(40, 167, 69);
  color: #28a745;
}

.pgp-status.error {
  display: block;
  background-color: rgba(220, 53, 69, 0.15);
  border: 1px solid rgb(220, 53, 69);
  color: #dc3545;
}

.pgp-status.info {
  display: block;
  background-color: var(--fg-muted-2);
  border: 1px solid var(--fg-muted-3);
  color: var(--fg-color);
}

.pgp-key-badge {
  font-size: 0.8rem;
  font-family: var(--font-monospace, monospace);
  background-color: var(--fg-muted-2);
  border: 1px solid var(--fg-muted-3);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
  color: var(--fg-color);
}
</style>

This utility runs entirely client-side in your browser using
[OpenPGP.js](https://openpgpjs.org/). It allows you to encrypt messages using
my public key before sending them, or verify that a signed message actually
originated from me.

<div class="pgp-container">
<div class="pgp-card">
<div id="key-badge" class="pgp-key-badge">Loading PGP public key...</div>
<div id="key-fingerprint" style="font-size: 0.75rem; color: var(--fg-muted-4); font-family: var(--font-monospace, monospace); margin-top: 0.5rem;">Fetching public key metadata...</div>
<div id="key-status" class="pgp-status info" style="margin-top: 0.75rem;">Initializing Cryptographic modules...</div>
</div>
<div class="pgp-card">
<div class="pgp-tabs">
<button class="pgp-tab-btn active" data-tab="encrypt-panel">Encrypt Message</button>
<button class="pgp-tab-btn" data-tab="verify-panel">Verify Signature</button>
</div>
<div id="encrypt-panel" class="pgp-panel active">
<div class="pgp-input-group">
<label for="plaintext">Message to Encrypt</label>
<textarea id="plaintext" class="pgp-textarea" placeholder="Type your secret message here..."></textarea>
</div>
<div class="pgp-button-row">
<button id="encrypt-btn" class="pgp-btn">Encrypt</button>
</div>
<div id="encrypt-status" class="pgp-status"></div>
<div class="pgp-input-group" style="margin-top: 0.5rem;">
<label for="ciphertext">Encrypted Message</label>
<textarea id="ciphertext" class="pgp-textarea" readonly placeholder="Encrypted output will appear here..."></textarea>
</div>
<div class="pgp-button-row">
<button id="copy-cipher-btn" class="pgp-btn pgp-btn-secondary">Copy to Clipboard</button>
</div>
</div>
<div id="verify-panel" class="pgp-panel">
<div class="pgp-input-group">
<label for="signed-message">Signed PGP Cleartext</label>
<textarea id="signed-message" class="pgp-textarea" placeholder="Paste the signed message block (e.g. starting with -----BEGIN PGP SIGNED MESSAGE-----) here..."></textarea>
</div>
<div class="pgp-button-row">
<button id="verify-btn" class="pgp-btn">Verify Signature</button>
</div>
<div id="verify-status" class="pgp-status"></div>
<div class="pgp-input-group" style="margin-top: 0.5rem;">
<label for="verified-text">Verified Message</label>
<textarea id="verified-text" class="pgp-textarea" readonly placeholder="Verified text content will appear here..."></textarea>
</div>
<div class="pgp-button-row">
<button id="copy-verified-btn" class="pgp-btn pgp-btn-secondary">Copy Content</button>
</div>
</div>
</div>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
  let publicKeyArmored = '';
  let publicKey = null;

  async function loadPublicKey() {
    const statusEl = document.getElementById('key-status');
    try {
      const res = await fetch('/key.txt');
      if (!res.ok) throw new Error('Failed to load key.txt');
      publicKeyArmored = await res.text();
      
      let attempts = 0;
      while (typeof openpgp === 'undefined' && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (typeof openpgp === 'undefined') {
        throw new Error('OpenPGP library failed to load from CDN.');
      }
      
      publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
      
      const fingerprint = publicKey.getFingerprint();
      const shortFingerprint = fingerprint.slice(-16).toUpperCase();
      document.getElementById('key-fingerprint').innerText = `Fingerprint:\n${fingerprint.match(/.{1,4}/g).join(' ')}\n0x${shortFingerprint}`;
      document.getElementById('key-badge').innerText = publicKeyArmored;
      statusEl.style.display = 'none';
    } catch (err) {
      console.error(err);
      statusEl.innerText = 'Error loading public PGP key: ' + err.message;
      statusEl.className = 'pgp-status error';
      statusEl.style.display = 'block';
    }
  }

  const tabBtns = document.querySelectorAll('.pgp-tab-btn');
  const panels = document.querySelectorAll('.pgp-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  document.getElementById('encrypt-btn').addEventListener('click', async () => {
    const plaintext = document.getElementById('plaintext').value;
    const resultArea = document.getElementById('ciphertext');
    const statusEl = document.getElementById('encrypt-status');
    
    if (!plaintext.trim()) {
      statusEl.innerText = 'Please enter a message to encrypt.';
      statusEl.className = 'pgp-status error';
      statusEl.style.display = 'block';
      return;
    }
    
    if (!publicKey) {
      statusEl.innerText = 'PGP public key is not loaded yet.';
      statusEl.className = 'pgp-status error';
      statusEl.style.display = 'block';
      return;
    }
    
    statusEl.innerText = 'Encrypting message...';
    statusEl.className = 'pgp-status info';
    statusEl.style.display = 'block';
    
    try {
      const message = await openpgp.createMessage({ text: plaintext });
      const encrypted = await openpgp.encrypt({
        message,
        encryptionKeys: publicKey
      });
      
      resultArea.value = encrypted;
      statusEl.innerText = 'Message encrypted successfully!';
      statusEl.className = 'pgp-status success';
    } catch (err) {
      console.error(err);
      statusEl.innerText = `Encryption failed: ${err.message}`;
      statusEl.className = 'pgp-status error';
    }
  });

  document.getElementById('verify-btn').addEventListener('click', async () => {
    const signedMessage = document.getElementById('signed-message').value;
    const resultArea = document.getElementById('verified-text');
    const statusEl = document.getElementById('verify-status');
    
    if (!signedMessage.trim()) {
      statusEl.innerText = 'Please paste a signed PGP message.';
      statusEl.className = 'pgp-status error';
      statusEl.style.display = 'block';
      return;
    }
    
    if (!publicKey) {
      statusEl.innerText = 'PGP public key is not loaded yet.';
      statusEl.className = 'pgp-status error';
      statusEl.style.display = 'block';
      return;
    }
    
    statusEl.innerText = 'Verifying signature...';
    statusEl.className = 'pgp-status info';
    statusEl.style.display = 'block';
    
    try {
      let message;
      if (signedMessage.includes('-----BEGIN PGP SIGNED MESSAGE-----')) {
        message = await openpgp.readCleartextMessage({ cleartextMessage: signedMessage });
      } else {
        message = await openpgp.readMessage({ armoredMessage: signedMessage });
      }
      
      const verificationResult = await openpgp.verify({
        message,
        verificationKeys: publicKey
      });
      
      const { verified, keyID } = verificationResult.signatures[0];
      await verified;
      
      let verifiedContent = '';
      if (typeof message.getText === 'function') {
        verifiedContent = message.getText();
      } else if (verificationResult.data) {
        verifiedContent = verificationResult.data;
      }
      
      resultArea.value = verifiedContent;
      statusEl.innerText = `Signature verified successfully! Signed by Key ID: 0x${keyID.toHex().toUpperCase()}`;
      statusEl.className = 'pgp-status success';
    } catch (err) {
      console.error(err);
      statusEl.innerText = `Verification failed: ${err.message}`;
      statusEl.className = 'pgp-status error';
      resultArea.value = '';
    }
  });

  function setupCopy(btnId, textareaId, statusId) {
    document.getElementById(btnId).addEventListener('click', () => {
      const textarea = document.getElementById(textareaId);
      const text = textarea.value;
      const statusEl = document.getElementById(statusId);
      if (!text.trim()) return;
      
      navigator.clipboard.writeText(text).then(() => {
        const originalText = statusEl.innerText;
        const originalClass = statusEl.className;
        const originalDisplay = statusEl.style.display;
        
        statusEl.innerText = 'Copied to clipboard!';
        statusEl.className = 'pgp-status success';
        statusEl.style.display = 'block';
        
        setTimeout(() => {
          statusEl.innerText = originalText;
          statusEl.className = originalClass;
          statusEl.style.display = originalDisplay;
        }, 2000);
      });
    });
  }

  setupCopy('copy-cipher-btn', 'ciphertext', 'encrypt-status');
  setupCopy('copy-verified-btn', 'verified-text', 'verify-status');

  loadPublicKey();
});
</script>
