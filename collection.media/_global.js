const hasMyCustomScript = true;
const isAnkiPC = typeof pycmd !== 'undefined';
const isAnkiWeb = typeof study !== 'undefined';
const isAnkiDroid = typeof AnkiDroidJS !== 'undefined';
let outputDataArr;
const boundInputElements = new WeakSet();
const renderedPlainOutputs = new WeakSet();

(function watchQA() {
  // Run functions on first load
  runFunctions();

  // Run functions again when changes are made to the DOM
  let targetNode;
  if (isAnkiDroid) {
    targetNode = document.querySelector('body');
  } else {
    targetNode = document.getElementById('qa');
  }
  const config = { childList: true },
    callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          runFunctions();
        }
        break; // Don't run functions again when changes made to the DOM are created by the functions
      }
    };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})();

function runFunctions() {
  balanceQuestionLines();
  showInputs();
  showPrimaryTitle();
  showTypeHint();
  focusFirstInput();
  returnInputs();
  showOutputs();
  showNotes();
  modifyAnkiWeb();
}

function balanceQuestionLines() {
  const questionEl = document.querySelector('.question');
  if (questionEl) {
    // Let layout balance rich text without rewriting its DOM or inserting breaks.
    questionEl.style.setProperty('text-wrap', 'balance');
  }
}

function hasVisibleContent(element) {
  return element !== null && (
    element.innerText.trim() !== '' ||
    element.querySelector('img, svg, canvas, video, audio, iframe, object, embed') !== null
  );
}

function showInputs() {
  const inputContainerList = document.querySelectorAll('.input-container');
  if (inputContainerList.length !== 0) {
    inputContainerList.forEach((inputContainer) => {
      // Show input if it is not a bonus input
      if (inputContainer.classList.contains('is-primary')) {
        inputContainer.classList.add('active');
      }
      // Show input if the faux textarea placeholder contains content (bonus inputs)
      const inputPlaceholder = inputContainer.querySelector('.input-faux-placeholder');
      if (hasVisibleContent(inputPlaceholder)) {
        const inputTitle = inputContainer.querySelector('.input-title');
        const inputTextarea = inputContainer.querySelector('textarea');
        inputContainer.classList.add('active');
        if (inputTitle !== null) {
          // Show type hint text in input title if it exists
          const hasDataTypeHint = inputTitle.getAttribute('data-type-hint');
          if (hasDataTypeHint && !inputTitle.querySelector('.input-type-hint')) {
            const hint = document.createElement('span');
            hint.classList.add('input-type-hint');
            hint.textContent = `(${hasDataTypeHint})`;
            inputTitle.append(' ', hint);
          }
        }
        // Hide faux textarea placeholder content when inputting data
        if (inputTextarea !== null) {
          inputTextarea.addEventListener('input', (event) => {
            if (inputTextarea.value !== '') {
              inputPlaceholder.classList.add('inactive');
            } else {
              inputPlaceholder.classList.remove('inactive');
            }
          });
        }
      }
    });
  }
}

function showPrimaryTitle() {
  // Show primary input title if comparison is NOT active
  const primaryList = document.querySelectorAll('.is-primary');
  if (primaryList.length !== 0) {
    primaryList.forEach((primary) => {
      const primaryTitle = primary.querySelector('.input-title');
      const primaryTextarea = primary.querySelector('textarea');
      if (primaryTitle !== null) {
        const hasCompare = primaryTitle.getAttribute('data-compare');
        if (hasCompare === null || hasCompare === '') {
          primaryTitle.classList.add('active');
          primaryTextarea.classList.add('has-title');
        }
      }
    });
  }
}

function showTypeHint() {
  // Show type hint if it contains content
  const typeHintList = document.querySelectorAll('.type-hint');
  if (typeHintList.length !== 0) {
    typeHintList.forEach((typeHint) => {
      if (typeHint.innerText !== '') {
        typeHint.classList.add('active');
      }
    });
  }
}

function focusFirstInput() {
  const activeElement = document.activeElement;
  if (activeElement && (
    activeElement.matches('input, textarea, select') || activeElement.isContentEditable
  )) {
    return;
  }
  // Add focus to first input/textarea element if the ID is not #typeans
  const inputField = document.querySelector('input, textarea');
  if (inputField !== null && inputField.id !== 'typeans') {
    inputField.focus();
  }
}

function returnInputs() {
  const inputDataList = document.querySelectorAll('.input-data');
  if (inputDataList.length !== 0) {
    outputDataArr = Array.from(inputDataList, (inputData) => inputData.value);
    inputDataList.forEach((inputData, inputIndex) => {
      if (boundInputElements.has(inputData)) {
        return;
      }
      boundInputElements.add(inputData);
      inputData.addEventListener('input', (event) => {
        const inputValue = event.currentTarget.value;
        // Store input data on AnkiDroid
        if (isAnkiDroid) {
          try {
            sessionStorage.setItem(inputIndex, inputValue);
          } catch (error) {
            console.log(`${error.name}: ${error.message}`);
          }
          // Store input data on AnkiPC, AnkiWeb, & AnkiIOS
        } else {
          outputDataArr.splice(inputIndex, 1, inputValue);
        }
      });
      // Return data on AnkiPC keypress
      if (isAnkiPC) {
        inputData.addEventListener('keydown', (event) => {
          if (event.ctrlKey && event.key === 'Enter') pycmd('ans');
        });
        // Return data on AnkiWeb keypress
      } else if (isAnkiWeb) {
        inputData.addEventListener('keydown', (event) => {
          if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            study.drawAnswer();
          }
        });
      }
    });
  }
}

function getRenderedAnswerText(answerElement) {
  // innerText preserves HTML line breaks, but only when the element has layout.
  // Comparison mode hides the original answer, so measure an invisible copy.
  const copy = answerElement.cloneNode(true);
  copy.style.setProperty('display', 'block', 'important');
  copy.style.setProperty('position', 'absolute', 'important');
  copy.style.setProperty('visibility', 'visible', 'important');
  copy.style.setProperty('opacity', '0', 'important');
  copy.style.setProperty('pointer-events', 'none', 'important');
  // Keep temporary child mutations below the body/#qa nodes watched by watchQA.
  answerElement.closest('.card-inner').appendChild(copy);
  try {
    return copy.innerText;
  } finally {
    copy.remove();
  }
}

function diffAnswerCharacters(cardAnswer, typedAnswer) {
  // Give each Unicode code point one BMP token so the diff cannot split a pair.
  const characters = Array.from(new Set([...cardAnswer, ...typedAnswer]));
  // Exclude surrogate code units from the token alphabet.
  if (characters.length > 0x10000 - 0x800) {
    return [[-1, cardAnswer], [1, typedAnswer]].filter(([, text]) => text);
  }
  const tokens = new Map(characters.map((char, index) => [
    char, String.fromCharCode(index < 0xd800 ? index : index + 0x800),
  ]));
  const encode = (text) => Array.from(text, (char) => tokens.get(char)).join('');
  const dmp = new diff_match_patch();
  return dmp.diff_main(encode(cardAnswer), encode(typedAnswer)).map((diff) => [
    diff[0],
    Array.from(diff[1], (token) => {
      const index = token.charCodeAt(0);
      return characters[index < 0xd800 ? index : index - 0x800];
    }).join(''),
  ]);
}

function showOutputs() {
  const outputContainerList = document.querySelectorAll('.output-container');

  if (outputContainerList.length !== 0) {
    outputContainerList.forEach((outputContainer, outputIndex) => {
      // Keep the existing result when initialization runs again on the same card.
      if (outputContainer.querySelector('.output-comparison')) {
        return;
      }
      const outputAnswer = outputContainer.querySelector('.output-answer');
      const outputClozeList = outputContainer.querySelectorAll('.cloze');
      const outputData = outputContainer.querySelector('.output-data');
      const hasCompare = outputData.getAttribute('data-compare');
      const bonusQuestion = document.querySelector('.bonus-question');
      const bonusTypeHint = document.querySelector('.bonus-type-hint');

      // Show bonus question and type hint if they contain content
      if (hasVisibleContent(bonusQuestion)) {
        bonusQuestion.classList.add('active');
      }
      if (bonusTypeHint !== null && bonusTypeHint.innerText !== '') {
        bonusTypeHint.classList.add('active');
      }

      // Show output-container if it contains an answer
      if (outputAnswer !== null && outputAnswer.innerHTML !== '') {
        outputContainer.classList.add('active');
      }

      // For cloze answers, remove all text except the active cloze(s)
      if (outputClozeList.length !== 0) {
        let clozeArr = [];
        outputClozeList.forEach((cloze) => {
          clozeArr.push(cloze.innerText);
        });
        outputAnswer.innerText = clozeArr.join(', ');
      }

      // Run comparison when compare field is active
      if (hasCompare !== null && hasCompare !== '') {
        const cardAnswer = getRenderedAnswerText(outputAnswer).replace(/\u00a0/g, ' ');
        // Hide output-cols when comparison is active
        outputContainer.classList.add('is-comparison');

        // Create comparison element
        const divContainer = document.createElement('div');
        const divTitle = document.createElement('div');
        const preEl = document.createElement('pre');
        divContainer.classList.add('output-comparison');
        divTitle.classList.add('output-comparison-title');
        preEl.classList.add('output-comparison-pre');

        if (outputContainer.classList.contains('is-primary')) {
          divTitle.innerHTML = 'Answer Comparison';
        } else {
          divTitle.innerHTML = 'Bonus Answer Comparison';
        }

        // Don't compare user's answer to card's answer if the user did NOT input an answer
        if (
          (isAnkiDroid && sessionStorage === undefined) ||
          (isAnkiDroid && sessionStorage[outputIndex] === undefined) ||
          (!isAnkiDroid && outputDataArr === undefined) ||
          (!isAnkiDroid && outputDataArr[outputIndex] === undefined)
        ) {
          const cardAnswerCharArr = Array.from(cardAnswer);
          const cardAnswerComparisonArr = [];
          cardAnswerCharArr.forEach((cardAnswerChar) => {
            cardAnswerComparisonArr.push('<span class="typeMissed">' + cardAnswerChar + '</span>');
          });
          preEl.innerHTML = '\n&darr;\n' + cardAnswerComparisonArr.join('');
          // Compare user's answer to card's answer when user did input an answer
        } else {
          let typedAnswer;
          // Get typedAnswer value for AnkiDroid
          if (isAnkiDroid) {
            console.log(sessionStorage);
            console.log(outputIndex);
            typedAnswer = sessionStorage[outputIndex];
            // Get typedAnswer value for AnkiPC, AnkiWeb, or AnkiIOS
          } else {
            typedAnswer = outputDataArr[outputIndex];
          }
          const dmpArr = diffAnswerCharacters(cardAnswer, typedAnswer.replace(/\u00a0/g, ' '));
          const dmpMatchTypeAndCharArr = [];
          const typedComparisonArr = [];
          const cardComparisonArr = [];
          let lastCorrectMatchIndex = 0;
          // Create array of individual characters and their match type
          for (let i = 0; i < dmpArr.length; i++) {
            const dmpMatchType = dmpArr[i][0]; // -1, 0, or 1
            const dmpStr = dmpArr[i][1]; // example: 'plus'
            const dmpCharArr = Array.from(dmpStr); // example: ['p', 'l', 'u', 's']
            dmpCharArr.forEach((dmpChar) => {
              const dmpMatchTypeAndChar = [dmpMatchType, dmpChar]; // example: [-1, 'p']
              dmpMatchTypeAndCharArr.push(dmpMatchTypeAndChar);
            });
          }
          // Container characters depending on their match type and add to respective comparison array.
          for (let i = 0; i < dmpMatchTypeAndCharArr.length; i++) {
            const char = dmpMatchTypeAndCharArr[i][1]; // 'p'
            const charMatchType = dmpMatchTypeAndCharArr[i][0]; // -1, 0, or 1
            let containerTypedChar, containerCardChar;
            // Container characters missed (for card answer)
            if (charMatchType === -1) {
              containerCardChar = '<span class="typeMissed">' + char + '</span>';
              // Container characters correct (for both typed and card answers)
            } else if (charMatchType === 0) {
              // Insert dashes in typed answer if needed to align correct matches to card answer
              if (typedComparisonArr.length < cardComparisonArr.length) {
                const dashesStr = '<span class="typeBad">-</span>';
                let dashesNeeded = cardComparisonArr.length - typedComparisonArr.length;
                let dashesAdded = 0;
                while (dashesNeeded > dashesAdded) {
                  typedComparisonArr.splice(lastCorrectMatchIndex + 1, 0, dashesStr);
                  dashesAdded++;
                }
              }
              containerTypedChar = '<span class="typeGood">' + char + '</span>';
              containerCardChar = '<span class="typeGood">' + char + '</span>';
              lastCorrectMatchIndex = typedComparisonArr.length;
              // Container characters wrong (for typed answer)
            } else if (charMatchType === 1) {
              containerTypedChar = '<span class="typeBad">' + char + '</span>';
            }
            // Add characters to comparison arrays
            if (containerTypedChar !== undefined) {
              typedComparisonArr.push(containerTypedChar);
            }
            if (containerCardChar !== undefined) {
              cardComparisonArr.push(containerCardChar);
            }
          }
          // Render the completed comparison once, after processing all characters.
          preEl.innerHTML = typedComparisonArr.join('') + '\n&darr;\n' + cardComparisonArr.join('');
        }
        divContainer.append(divTitle);
        divContainer.append(preEl);
        outputContainer.append(divContainer);

        // Directly output user's answer if comparison is NOT active,
      } else {
        if (outputData !== null && !renderedPlainOutputs.has(outputData)) {
          if (isAnkiDroid && sessionStorage !== undefined) {
            outputData.textContent = sessionStorage[outputIndex];
            renderedPlainOutputs.add(outputData);
          } else if (!isAnkiDroid && outputDataArr !== undefined) {
            outputData.textContent = outputDataArr[outputIndex];
            renderedPlainOutputs.add(outputData);
          }
        }
      }
    });
    // Clear sessionStorage for next card on AnkiDroid
    if (isAnkiDroid) {
      sessionStorage.clear();
    }
  }
}

function showNotes() {
  const notesContainerList = document.querySelectorAll('.notes-container');
  if (notesContainerList.length !== 0) {
    notesContainerList.forEach((notesContainer) => {
      const notesContent = notesContainer.querySelector('.notes-content');
      // Show notes if there is note content
      if (hasVisibleContent(notesContent)) {
        notesContainer.classList.add('active');
      }
    });
  }
}

function modifyAnkiWeb() {
  if (isAnkiWeb) {
    const leftStudyMenu = document.getElementById('leftStudyMenu');
    const rightStudyMenu = document.getElementById('rightStudyMenu');
    const studyMenuWrap = document.getElementById('study-menu-wrap');
    // Create and add study-menu-wrap element if it doesn't already exist
    if (leftStudyMenu !== null && studyMenuWrap === null) {
      const studyMenuParent = leftStudyMenu.parentNode;
      const menuWrap = document.createElement('div');
      menuWrap.id = 'study-menu-wrap';
      menuWrap.append(leftStudyMenu);
      menuWrap.append(rightStudyMenu);
      studyMenuParent.prepend(menuWrap);
    }
  }
}
