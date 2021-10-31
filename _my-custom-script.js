var hasMyCustomScript = true,
    isAnkiPc21 = typeof pycmd !== 'undefined',
    defaultInput,
    newTextarea,
    textareaAnswer,
    dataInput,
    dataOutput,
    needsOutput,
    hasBonus,
    bonusInputWrap,
    bonusOutputWrap,
    notesWrap,
    hasNote;

createTextarea();
printTextareaAnswer();
focusTextarea();
activateBonus();
toggleBonusQuestion()
persistData();
printPersistentData();
printNote();
watchQA();

function watchQA() {
  // Watch for changes in div#qa and run functions when change
  const targetNode = document.getElementById('qa');
  const config = { childList: true };
  const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        createTextarea();
        printTextareaAnswer();
        focusTextarea();
        activateBonus();
        toggleBonusQuestion()
        persistData();
        printPersistentData();
        printNote();
      }
      break;
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

function createTextarea() {
  // Changes Anki's default input field into a textarea on desktop
  defaultInput = document.getElementById('typeans');
  if (defaultInput && defaultInput.nodeName == "INPUT") {
    newTextarea = document.createElement('textarea');
    newTextarea.id = defaultInput.id;
    newTextarea.autofocus = true;
    defaultInput.parentNode.replaceChild(newTextarea, defaultInput);
    typeans = newTextarea;
    if (isAnkiPc21) {
      newTextarea.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key == 'Enter') pycmd("ans");
      });
    }
  }
}

function printTextareaAnswer() {
  // Replace default output with trimmed HTML
  textareaAnswer = document.getElementById('textarea-output');
  if (textareaAnswer) {
    typeans = document.getElementById('typeans');
    let code = document.createElement('code');
    code.setAttribute('id','typeans');
    code.innerHTML = typeans.innerHTML.trim();
    textareaAnswer.innerHTML = '';
    textareaAnswer.appendChild(code);
  }
}

function focusTextarea() {
  // If textarea#typeans does not exist, add focus to new textarea element
  let textarea = document.querySelector('textarea');
  if (textarea && textarea.id !== 'typeans') {
    textarea.focus();
  }
}

function activateBonus() {
  // Activate front card bonus box if bonus question exists
  bonusInputWrap = document.getElementById('bonus-input-wrap');
  hasBonus = document.getElementById('hasBonus');
  if (bonusInputWrap && hasBonus.innerHTML) {
    bonusInputWrap.classList.add("active");
  }
}

function toggleBonusQuestion() {
  // Hide bonus question when typing into bonus textarea
  let textarea = document.querySelector('#bonus-input-wrap textarea');
  let bonusQuestion = document.getElementById('hasBonus');
  if (textarea) {
    textarea.addEventListener('input', event => {
      if (textarea.value !== '') {
        bonusQuestion.classList.add('hidden');
      } else {
        bonusQuestion.classList.remove('hidden');
      }
    });
  }
}

function persistData() {
  dataInput = document.getElementById('data-input');
  if (dataInput) {
    // Persist input data of new textarea for AnkiDroid, AnkiMobile, AnkiWeb
    dataInput.addEventListener('input', (event) => {
      dataOutput = event.currentTarget.value;
      if (!isAnkiPc21) {
        try {
          sessionStorage.setItem('dataOutput', JSON.stringify(dataOutput));
        } catch (error) {
          console.log(`${error.name}: ${error.message}`);
        }
      }
    });
    // Return input data on desktop
    if (isAnkiPc21) {
      dataInput.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key == 'Enter') pycmd("ans");
      });
    }
  }
}

function printPersistentData() {
  // Activate back card bonus box if data will be printed to it
  bonusOutputWrap = document.getElementById('bonus-output-wrap');
  if (bonusOutputWrap && dataOutput) {
    bonusOutputWrap.classList.add("active");
  }
  // Print data to back card output box
  needsOutput = document.getElementById('data-output');
  if (needsOutput) {
    needsOutput.textContent = dataOutput;
    dataOutput = '';
  }
}

function printNote() {
  // Hide notes section if there are no notes added
  notesWrap = document.getElementById('notes-wrap');
  hasNote = document.getElementsByClassName('notes')[0];
  if (notesWrap && !hasNote.innerHTML) {
    notesWrap.classList.add("inactive");
  }
  // Align text left if there are more than 200 characters in the notes
  if (hasNote && hasNote.innerText.length > 200) {
    hasNote.classList.add('long');
  }
}
