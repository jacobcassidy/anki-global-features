const hasMyCustomScript = true;
const isAnkiPC = typeof pycmd !== 'undefined';
const isAnkiWeb = typeof study !== 'undefined';
const isAnkiDroid = typeof AnkiDroidJS !== 'undefined';
let outputDataArr;

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
  showInputs();
  showPrimaryTitle();
  showTypeHint();
  focusFirstInput();
  returnInputs();
  showOutputs();
  showNotes();
  modifyAnkiWeb();
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
      if (inputPlaceholder !== null && inputPlaceholder.innerText !== '') {
        const inputTitle = inputContainer.querySelector('.input-title');
        const inputTextarea = inputContainer.querySelector('textarea');
        inputContainer.classList.add('active');
        if (inputTitle !== null) {
          // For comparison inputs, show a forward slash
          const hasDataCompare = inputTitle.getAttribute('data-compare');
          if (hasDataCompare !== '') {
            inputTitle.innerHTML += '<span class="input-comparison">&nbsp; &#47; &nbsp;</span>';
          }
          // Show type hint text in input title if it exists
          const hasDataTypeHint = inputTitle.getAttribute('data-type-hint');
          if (hasDataTypeHint !== '') {
            inputTitle.innerHTML += ` <span class="input-type-hint">${hasDataTypeHint}</span>`;
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
  // Add focus to first input/textarea element if the ID is not #typeans
  const inputField = document.querySelector('input, textarea');
  if (inputField !== null && inputField.id !== 'typeans') {
    inputField.focus();
  }
}

function returnInputs() {
  const inputDataList = document.querySelectorAll('.input-data');
  if (inputDataList.length !== 0) {
    outputDataArr = Array(inputDataList.length);
    inputDataList.forEach((inputData, inputIndex) => {
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

function showOutputs() {
  const outputContainerList = document.querySelectorAll('.output-container');

  if (outputContainerList.length !== 0) {
    outputContainerList.forEach((outputContainer, outputIndex) => {
      const outputAnswer = outputContainer.querySelector('.output-answer');
      const outputClozeList = outputContainer.querySelectorAll('.cloze');
      const outputData = outputContainer.querySelector('.output-data');
      const hasCompare = outputData.getAttribute('data-compare');
      const bonusQuestion = document.querySelector('.bonus-question');
      const bonusTypeHint = document.querySelector('.bonus-type-hint');

      // Show bonus question and type hint if they contain content
      if ( bonusQuestion !== null && bonusQuestion.innerText !== '') {
        bonusQuestion.classList.add('active');
      }
      if ( bonusTypeHint !== null && bonusTypeHint.innerText !== '') {
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
          const cardAnswerCharArr = outputAnswer.innerText.split('');
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
          const cardAnswer = outputAnswer.textContent;
          const dmp = new diff_match_patch();
          const dmpArr = dmp.diff_main(cardAnswer, typedAnswer);
          const dmpMatchTypeAndCharArr = [];
          const typedComparisonArr = [];
          const cardComparisonArr = [];
          let lastCorrectMatchIndex = 0;
          // Create array of individual characters and their match type
          for (let i = 0; i < dmpArr.length; i++) {
            const dmpMatchType = dmpArr[i][0]; // -1, 0, or 1
            const dmpStr = dmpArr[i][1]; // example: 'plus'
            const dmpCharArr = dmpStr.split(''); // example: ['p', 'l', 'u', 's']
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
              // dmp doesn't consider &nbsp; and an empty space as a match, lets change that
              const nextIndex = i + 1;
              const regex = /\u00A0/; // unicode for &nbsp;
              const isNBSP = regex.test(char);
              let nextChar;

              if (dmpMatchTypeAndCharArr[nextIndex] !== undefined) {
                nextChar = dmpMatchTypeAndCharArr[nextIndex][1];
              }
              if (isNBSP && nextChar === ' ') {
                containerCardChar = '<span class="typeGood">' + char + '</span>';
              } else {
                containerCardChar = '<span class="typeMissed">' + char + '</span>';
              }
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
              // dmp doesn't consider &nbsp; and an empty space as a match, lets change that
              const previousIndex = i - 1;
              const regex = /\u00A0/; // unicode for &nbsp;
              let previousChar;
              if (dmpMatchTypeAndCharArr[previousIndex] !== undefined) {
                previousChar = dmpMatchTypeAndCharArr[previousIndex][1];
              }
              const isNBSP = regex.test(previousChar);
              if (isNBSP && char === ' ') {
                containerTypedChar = '<span class="typeGood">' + char + '</span>';
              } else {
                containerTypedChar = '<span class="typeBad">' + char + '</span>';
              }
            }
            // Add characters to comparison arrays
            if (containerTypedChar !== undefined) {
              typedComparisonArr.push(containerTypedChar);
            }
            if (containerCardChar !== undefined) {
              cardComparisonArr.push(containerCardChar);
            }
            // Transform comparison arrays into strings and add them to the <pre> element
            preEl.innerHTML = typedComparisonArr.join('') + '\n&darr;\n' + cardComparisonArr.join('');
          }
        }
        divContainer.append(divTitle);
        divContainer.append(preEl);
        outputContainer.append(divContainer);

      // Directly output user's answer if comparison is NOT active,
      } else {
        if (outputData !== null) {
          if (isAnkiDroid && sessionStorage !== undefined) {
            outputData.textContent = sessionStorage[outputIndex];
          } else if (!isAnkiDroid && outputDataArr !== undefined) {
            outputData.textContent = outputDataArr[outputIndex];
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
      const hasNotes = document.querySelector('.notes-content');
      // Show notes if there is note content
      if (hasNotes != null && hasNotes.innerText) {
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
