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

//-----------------------------------------------------
//--- WATCH FOR CHANGES AND RUN FUNCTIONS ON CHANGE ---
//-----------------------------------------------------
function watchQA() {
  const targetNode = document.getElementById('qa');
  const config = { childList: true };
  const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.');
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

//---------------------
//--- MAIN TEXTAREA ---
//---------------------
// Changes Anki's default type input into a textarea element
function createTextarea() {
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

//-------------------------------
//--- TEXTAREA FOCUS ON FIRST ---
//-------------------------------
// If first textarea is not #typeans, focus textarea
function focusTextarea() {
  let textarea = document.querySelector('textarea');
  if (textarea && textarea.id !== 'typeans') {
    textarea.focus();
  }
}

//-----------------------
//--- PERSISTENT DATA ---
//-----------------------
// Persist data of custom input/textarea elements to back of card
function persistData() {
  dataInput = document.getElementById('data-input');
  if (dataInput) {
    dataInput.addEventListener('input', (event) => {
      dataOutput = event.currentTarget.value;
      if (!isAnkiPc21) { // AnkiDroid, AnkiMobile, AnkiWeb
        try {
          sessionStorage.setItem('dataOutput', JSON.stringify(dataOutput));
        } catch (error) {
          console.log(`${error.name}: ${error.message}`);
        }
      }
    });
    if (isAnkiPc21) {
      dataInput.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key == 'Enter') pycmd("ans");
      });
    }
  }
}

function printPersistentData() {
  // Activate bonus box if persistent data will be printed to it
  bonusOutputWrap = document.getElementById('bonus-output-wrap');
  if (bonusOutputWrap && dataOutput) {
    bonusOutputWrap.classList.add("active");
  }
  // Print persistent data
  needsOutput = document.getElementById('data-output');
  if (needsOutput) {
    needsOutput.textContent = dataOutput;
    dataOutput = '';
  }
}

//----------------------
//--- BONUS TEXTAREA ---
//----------------------
function activateBonus() {
  bonusInputWrap = document.getElementById('bonus-input-wrap');
  hasBonus = document.getElementById('hasBonus');
  if (bonusInputWrap && hasBonus.innerHTML) {
    bonusInputWrap.classList.add("active");
  }
}

function toggleBonusQuestion() {
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

//-- REPLACED WITH persistData()
// function returnBonus() {
//   bonusInput = document.getElementById('bonus-input');
//   if (bonusInput) {
//     bonusInput.addEventListener('input', (event) => {
//       bonusOutput = event.currentTarget.value;
//       if (!isAnkiPc21) { // AnkiDroid, AnkiMobile, AnkiWeb
//         try {
//           sessionStorage.setItem('bonusOutput', JSON.stringify(bonusOutput));
//         } catch (error) {
//           console.log(`${error.name}: ${error.message}`);
//         }
//       }
//     });
//     if (isAnkiPc21) {
//       bonusInput.addEventListener('keydown', event => {
//         if (event.ctrlKey && event.key == 'Enter') pycmd("ans");
//       });
//     }
//   }
// }

// REPLACED WITH printPersistentData()
// function printBonus() {
//   bonusOutputWrap = document.getElementById('bonus-output-wrap');
//   if (bonusOutputWrap && bonusOutput) { // Anki 2.1(PC)
//     bonusValue = bonusOutput;
//     document.getElementById('bonus-output').textContent = bonusValue;
//     bonusOutputWrap.classList.add("active");
//     bonusOutput = '';
//   } else { // AnkiDroid, AnkiMobile, AnkiWeb
//     try {
//       bonusOutputMobile = JSON.parse(sessionStorage.getItem('bonusOutput'));
//       sessionStorage.removeItem('bonusOutput');
//     } catch (error) {
//       bonusOutputMobile = `${error.name}: ${error.message}`;
//     }
//   }
// }


//-------------
//--- NOTES ---
//-------------
function printNote() {
  notesWrap = document.getElementById('notes-wrap');
  hasNote = document.getElementsByClassName('notes')[0];
  if (notesWrap && !hasNote.innerHTML) {
    notesWrap.classList.add("inactive");
  }
  if (hasNote && hasNote.innerText.length > 200) {
    hasNote.classList.add('long');
  }
}
