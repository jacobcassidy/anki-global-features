const hasMyCustomScript = true,
      isAnkiPC = typeof pycmd !== 'undefined',
      isAnkiWeb = typeof study !== 'undefined',
      isAnkiDroid = typeof AnkiDroidJS !== 'undefined';
let   outputDataArr;

watchQA();

function watchQA() {
  // Run functions on first load
  showInputs();
  showPrimaryTitle();
  showTypeHint();
  focusFirstInput();
  returnInputs();
  showOutputs();
  showNotes();
  modifyAnkiWeb();
  // Run functions again when changes are made to the DOM
  let targetNode;
  if ( isAnkiDroid ) {
    targetNode = document.querySelector('body');
  } else {
    targetNode = document.getElementById('qa');
  }
  const config = { childList: true },
        callback = function( mutationsList, observer ) {
    for ( const mutation of mutationsList ) {
      if ( mutation.type === 'childList' ) {
        showInputs();
        showPrimaryTitle();
        showTypeHint();
        focusFirstInput();
        returnInputs();
        showOutputs();
        showNotes();
        modifyAnkiWeb();
      }
      break; // Don't run functions again when changes made to the DOM are created by the functions
    }
  };
  const observer = new MutationObserver( callback );
  observer.observe( targetNode, config );
}

function showInputs() {
  const inputWrapList = document.querySelectorAll('.input-wrap');
  if ( inputWrapList.length !== 0 ) {
    inputWrapList.forEach( inputWrap => {
      // Show input if it contains .is-primary
      if ( inputWrap.classList.contains('is-primary') ) {
        inputWrap.classList.add('active');
      }
      // Show input if the faux textarea placeholder contains content
      const inputPlaceholder = inputWrap.querySelector('.input-faux-placeholder');
      if ( inputPlaceholder !== null && inputPlaceholder.innerText !== '' ) {
        const inputTitle = inputWrap.querySelector('.input-title'),
              inputTextarea = inputWrap.querySelector('textarea');
        inputWrap.classList.add('active');
        if ( inputTitle !== null ) {
          // For comparison inputs, show a forward slash
          const hasDataCompare = inputTitle.getAttribute('data-compare');
          if ( hasDataCompare !== '' ) {
            inputTitle.innerHTML += '<span class="input-comparison">&#47;</span>';
          }
          // Show type hint text in input title if it exists
          const hasDataTypeHint = inputTitle.getAttribute('data-type-hint');
          if ( hasDataTypeHint !== '' ) {
            inputTitle.innerHTML += `<span class="input-type-hint">${hasDataTypeHint}</span>`;
          }
        }
        // Hide faux textarea placeholder content when inputting data
        if ( inputTextarea !== null ) {
          inputTextarea.addEventListener( 'input', event => {
            if ( inputTextarea.value !== '' ) {
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
  if ( primaryList.length !== 0 ) {
    primaryList.forEach( primary => {
      const primaryTitle = primary.querySelector('.input-title'),
            primaryTextarea = primary.querySelector('textarea');
      if ( primaryTitle !== null ) {
        const hasCompare = primaryTitle.getAttribute('data-compare');
        if ( hasCompare === null || hasCompare === '' ) {
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
  if ( typeHintList.length !== 0 ) {
    typeHintList.forEach( typeHint => {
      if ( typeHint.innerText !== '' ) {
        typeHint.classList.add('active');
      }
    });
  }
}

function focusFirstInput() {
  // Add focus to first input/textarea element if the ID is not #typeans
  const inputField = document.querySelector( 'input, textarea' );
  if ( inputField !== null && inputField.id !== 'typeans' ) {
    inputField.focus();
  }
}

function returnInputs() {
  const inputDataList = document.querySelectorAll('.input-data');
  if ( inputDataList.length !== 0 ) {
    outputDataArr = Array( inputDataList.length );
    inputDataList.forEach( ( inputData, inputIndex ) => {
      inputData.addEventListener( 'input', event => {
        const inputValue = event.currentTarget.value;
        // Store input data on AnkiDroid
        if ( isAnkiDroid ) {
          try {
            sessionStorage.setItem( inputIndex, inputValue );
          } catch (error) {
            console.log(`${error.name}: ${error.message}`);
          }
        // Store input data on AnkiPC, AnkiWeb, & AnkiIOS
        } else {
          outputDataArr.splice( inputIndex, 1, inputValue );
        }
      });
      // Return data on AnkiPC keypress
      if ( isAnkiPC ) {
        inputData.addEventListener( 'keydown', event => {
          if ( event.ctrlKey && event.key === 'Enter' ) pycmd('ans');
        });
      // Return data on AnkiWeb keypress
      } else if ( isAnkiWeb ) {
        inputData.addEventListener( 'keydown', event => {
          if ( event.ctrlKey && event.key === 'Enter' ) {
            event.preventDefault();
            study.drawAnswer();
          }
        });
      }
    });
  }
}

function showOutputs() {
  const outputWrapList = document.querySelectorAll('.output-wrap');
  if ( outputWrapList.length !== 0 ) {
    outputWrapList.forEach( ( outputWrap, outputIndex ) => {
      const outputAnswer = outputWrap.querySelector('.output-answer'),
            outputClozeList = outputWrap.querySelectorAll('.cloze');
            outputData = outputWrap.querySelector('.output-data'),
            hasCompare = outputData.getAttribute('data-compare');
      // Show output-wrap if it contains an answer
      if ( outputAnswer !== null && outputAnswer.innerHTML !== '' ) {
        outputWrap.classList.add('active');
      }
      // Align text left if there are more than 150 characters in the output content
      if ( outputData !== null && outputData.innerText.length > 150 ) {
        outputData.classList.add('long-content');
      }
      if ( outputAnswer !== null && outputAnswer.innerText.length > 150 ) {
        outputAnswer.classList.add('long-content');
      }
      // For cloze answers, remove all text except the active cloze(s)
      if ( outputClozeList.length !== 0 ) {
        let clozeArr = [];
        outputClozeList.forEach ( cloze => {
          clozeArr.push(cloze.innerText);
        });
        outputAnswer.innerText = clozeArr.join(', ');
      }
      // Run comparison when compare field is active
      if ( hasCompare !== null && hasCompare !== '' ) {
        // Create <pre> element to add comparison answer to
        const preEl = document.createElement('pre');
        preEl.classList.add('output-comparison');
        // Hide output-wrap inner elements not wanted during comparison
        const outputTitleInnerList = outputWrap.querySelectorAll('.output-title.is-inner'),
              outputTitleSpanList = outputWrap.querySelectorAll('.output-title span');
        if ( outputWrap.classList.contains('is-primary') ) {
          outputWrap.querySelector('.output-title').classList.add('inactive');
        }
        if ( outputAnswer !== null ) {
          outputAnswer.classList.add('inactive');
        }
        if ( outputData !== null ) {
          outputData.classList.add('inactive');
        }
        if ( outputTitleInnerList !== 0 ) {
          outputTitleInnerList.forEach( outputTitleInner => outputTitleInner.classList.add('inactive') );
        }
        if ( outputTitleSpanList !== 0 ) {
          outputTitleSpanList.forEach( outputTitleSpan => outputTitleSpan.classList.add('inactive') );
        }
        // Don't compare user's answer to card's answer if the user did NOT input an answer
        if ( isAnkiDroid && sessionStorage === undefined || isAnkiDroid && sessionStorage[outputIndex] === undefined || !isAnkiDroid && outputDataArr === undefined || !isAnkiDroid && outputDataArr[outputIndex] === undefined ) {

          const cardAnswerCharArr = outputAnswer.innerText.split(''),
                cardAnswerComparisonArr = [];
          cardAnswerCharArr.forEach( cardAnswerChar => {
            cardAnswerComparisonArr.push('<span class="typeMissed">' + cardAnswerChar + '</span>');
          })
          preEl.innerHTML = '\n&darr;\n' + cardAnswerComparisonArr.join('');
          outputWrap.append(preEl);
        // Compare user's answer to card's answer when user did input an answer
        } else {
          let typedAnswer;
          // Get typedAnswer value for AnkiDroid
          if ( isAnkiDroid ) {
            console.log(sessionStorage);
            console.log(outputIndex);
            typedAnswer = sessionStorage[outputIndex];
          // Get typedAnswer value for AnkiPC, AnkiWeb, or AnkiIOS
          } else {
            typedAnswer = outputDataArr[outputIndex];
          }
          const cardAnswer = outputAnswer.textContent,
                dmp = new diff_match_patch(),
                dmpArr = dmp.diff_main( cardAnswer, typedAnswer ),
                dmpMatchTypeAndCharArr = [],
                typedComparisonArr = [],
                cardComparisonArr = [];
          let   lastCorrectMatchIndex = 0;
          // Create array of indiviual characters and their match type
          for ( let i = 0; i < dmpArr.length; i++ ) {
            const dmpMatchType = dmpArr[i][0],                      // -1, 0, or 1
                  dmpStr = dmpArr[i][1],                            // example: 'plus'
                  dmpCharArr = dmpStr.split('');                    // example: ['p', 'l', 'u', 's']
            dmpCharArr.forEach( dmpChar => {
              const dmpMatchTypeAndChar = [dmpMatchType, dmpChar];  // example: [-1, 'p']
              dmpMatchTypeAndCharArr.push(dmpMatchTypeAndChar);
            });
          }
          // Wrap characters depending on their match type and add to respective comparison array.
          for ( let i = 0; i < dmpMatchTypeAndCharArr.length; i++ ) {
            const char = dmpMatchTypeAndCharArr[i][1],              // 'p'
                  charMatchType = dmpMatchTypeAndCharArr[i][0];     // -1, 0, or 1
            let   wrapTypedChar,
                  wrapCardChar;
            // Wrap characters missed (for card answer)
            if ( charMatchType === -1 ) {
              // dmp doesn't consider &nbsp; and an empty space as a match, lets change that
              const nextIndex = i + 1,
                    regex = /\u00A0/, // unicode for &nbsp;
                    isNBSP = regex.test(char);
              let   nextChar;

              if ( dmpMatchTypeAndCharArr[nextIndex] !== undefined ) {
                nextChar = dmpMatchTypeAndCharArr[nextIndex][1];
              }
              if ( isNBSP && nextChar === ' ' ) {
                wrapCardChar = '<span class="typeGood">' + char + '</span>';
              } else {
                wrapCardChar = '<span class="typeMissed">' + char + '</span>';
              }
            // Wrap characters correct (for both typed and card answers)
            } else if ( charMatchType === 0 ) {
              // Insert dashes in typed answer if needed to align correct matches to card answer
              if ( typedComparisonArr.length < cardComparisonArr.length ) {
                const dashesStr = '<span class="typeBad">-</span>';
                let   dashesNeeded = cardComparisonArr.length - typedComparisonArr.length,
                      dashesAdded = 0;
                while ( dashesNeeded > dashesAdded ) {
                  typedComparisonArr.splice( lastCorrectMatchIndex + 1, 0, dashesStr );
                  dashesAdded++;
                }
              }
              wrapTypedChar = '<span class="typeGood">' + char + '</span>';
              wrapCardChar = '<span class="typeGood">' + char + '</span>';
              lastCorrectMatchIndex = typedComparisonArr.length;
            // Wrap characters wrong (for typed answer)
            } else if ( charMatchType === 1 ) {
              // dmp doesn't consider &nbsp; and an empty space as a match, lets change that
              const previousIndex = i - 1,
                    regex = /\u00A0/; // unicode for &nbsp;
              let   previousChar;
              if ( dmpMatchTypeAndCharArr[previousIndex] !== undefined ) {
                previousChar = dmpMatchTypeAndCharArr[previousIndex][1];
              }
              const isNBSP = regex.test(previousChar);
              if ( isNBSP && char === ' ' ) {
                wrapTypedChar = '<span class="typeGood">' + char + '</span>';
              } else {
                wrapTypedChar = '<span class="typeBad">' + char + '</span>';
              }
            }
            // Add characters to comparison arrays
            if ( wrapTypedChar !== undefined ) {
              typedComparisonArr.push(wrapTypedChar);
            }
            if ( wrapCardChar !== undefined ) {
              cardComparisonArr.push(wrapCardChar);
            }
            // Transform comparison arrays into strings and add them to the <pre> element
            preEl.innerHTML = typedComparisonArr.join('') + '\n&darr;\n' + cardComparisonArr.join('');
            outputWrap.append(preEl);
          }
        }
      // Directly output user's answer if comparison is NOT active,
      } else {
        if ( outputData !== null ) {
          if ( isAnkiDroid && sessionStorage !== undefined ) {
            outputData.textContent = sessionStorage[outputIndex];
          } else if ( !isAnkiDroid && outputDataArr !== undefined ) {
            outputData.textContent = outputDataArr[outputIndex];
          }
        }
      }
    });
    // Clear sessionStorage for next card on AnkiDroid
    if ( isAnkiDroid ) {
      sessionStorage.clear();
    }
  }
}

function showNotes() {
  const notesWrapList = document.querySelectorAll('.notes-wrap');
  if ( notesWrapList.length !== 0 ) {
    notesWrapList.forEach( notesWrap => {
      const hasNotes = document.querySelector('.notes-content')
      // Show notes if there is note content
      if ( hasNotes != null && hasNotes.innerText ) {
        notesWrap.classList.add('active');
      }
      // Align text left if there are more than 200 characters in the note content
      if ( hasNotes !== null && hasNotes.innerText.length > 200 ) {
        hasNotes.classList.add('long-content');
      }
    });
  }
}

function modifyAnkiWeb() {
  if ( isAnkiWeb ) {
    const leftStudyMenu = document.getElementById('leftStudyMenu'),
          rightStudyMenu = document.getElementById('rightStudyMenu'),
          studyMenuWrap = document.getElementById('study-menu-wrap');
    // Create and add study-menu-wrap element if it doesn't already exist
    if ( leftStudyMenu !== null && studyMenuWrap === null ) {
      const studyMenuParent = leftStudyMenu.parentNode,
            menuWrap = document.createElement('div');
      menuWrap.id = 'study-menu-wrap';
      menuWrap.append(leftStudyMenu);
      menuWrap.append(rightStudyMenu);
      studyMenuParent.prepend(menuWrap);
    }
  }
}
