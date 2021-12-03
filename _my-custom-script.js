const hasMyCustomScript = true,
      isAnkiPC21 = typeof pycmd !== 'undefined';
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

  // Run functions again when changes are made to the div#qa element
  const targetNode = document.getElementById('qa'),
        config = { childList: true },
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
      }
      break; // Don't run functions again when changes made to the div#qa element are created by the functions
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
          // Show "Be precise" text in input title if comparison is active
          const hasDataCompare = inputTitle.getAttribute('data-compare');
          if ( hasDataCompare !== '' ) {
            inputTitle.innerHTML += '<span class="input-comparison">Be precise</span>';
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
  if ( inputField !== null && inputField.id !== typeans ) {
    inputField.focus();
  }
}

function returnInputs() {
  const inputDataList = document.querySelectorAll('.input-data');
  if ( inputDataList.length !== 0 ) {
    outputDataArr = Array(inputDataList.length);
    inputDataList.forEach( ( inputData, inputIndex ) => {
      // Add input data into an array to return for output
      inputData.addEventListener( 'input', event => {
        const inputValue = event.currentTarget.value;
        outputDataArr.splice( inputIndex, 1, inputValue );
      });
      // Return data on PC keypress
      if ( isAnkiPC21 ) {
        inputData.addEventListener( 'keydown', event => {
          if ( event.ctrlKey && event.key == 'Enter' ) pycmd('ans');
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
            outputData = outputWrap.querySelector('.output-data'),
            hasCompare = outputData.getAttribute('data-compare');

      // Show output-wrap if it contains an answer
      if ( outputAnswer !== null && outputAnswer.innerHTML !== '' ) {
        outputWrap.classList.add('active');
      }

      // If compare is active, run comparisons when there is data to compare
      if ( hasCompare !== null && hasCompare !== '' ) {

        // Create <pre> element to add comparison answer to
        const preEl = document.createElement('pre');
        preEl.classList.add('output-comparison');

        // Hide output-wrap inner elements when compare is active
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

        // Don't compare user answer to card answer if the user did NOT input an answer
        if ( outputDataArr[outputIndex] === undefined ) {
          const cardAnswerCharArr = outputAnswer.innerText.split(''),
                cardAnswerComparisonArr = [];
          cardAnswerCharArr.forEach( cardAnswerChar => {
            cardAnswerComparisonArr.push('<span class="typeMissed">' + cardAnswerChar + '</span>');
          })
          preEl.innerHTML = '\n&darr;\n' + cardAnswerComparisonArr.join('');
          outputWrap.append(preEl);

        } else {

          // Compare user's answer to card's answer
          const typedAnswer = outputDataArr[outputIndex],
                cardAnswer = outputAnswer.textContent,
                dmp = new diff_match_patch(),
                diffArr = dmp.diff_main( cardAnswer, typedAnswer ),
                diffSortCharArr = [],
                typedComparisonArr = [],
                cardComparisonArr = [];
          let   lastCorrectMatchIndex = 0;

          // Create array of indiviual characters and their match type from diffArr
          for ( let i = 0; i < diffArr.length; i++ ) {
            const diffSort = diffArr[i][0],              // -1, 0, or 1
                  diffStr = diffArr[i][1],               // example: 'plus'
                  diffCharArr = diffStr.split('');       // example: ['p', 'l', 'u', 's']

            diffCharArr.forEach( diffChar => {
              const diffSortChar = [diffSort, diffChar]; // example: [-1, 'p']
              diffSortCharArr.push(diffSortChar);
            });
          }

          // Wrapped characters depending on their match type and add to the comparison arrays.
          for ( let i = 0; i < diffSortCharArr.length; i++ ) {
            const charMatch = diffSortCharArr[i][1],     // 'p'
                  isCharMatch = diffSortCharArr[i][0];   // -1, 0, or 1
            let   wrapTypedChar,
                  wrapCardChar;

            if ( isCharMatch === -1 ) {
              wrapCardChar = '<span class="typeMissed">' + charMatch + '</span>';

            } else if ( isCharMatch === 0 ) {

              // Insert dashes if needed to align typed and card answers
              if ( typedComparisonArr.length < cardComparisonArr.length ) {
                const dashesStr = '<span class="typeBad">-</span>';
                let   dashesNeeded = cardComparisonArr.length - typedComparisonArr.length,
                      dashesAdded = 0;

                while ( dashesNeeded > dashesAdded ) {
                  typedComparisonArr.splice( lastCorrectMatchIndex + 1, 0, dashesStr );
                  dashesAdded++;
                }
              }
              wrapTypedChar = '<span class="typeGood">' + charMatch + '</span>';
              wrapCardChar = '<span class="typeGood">' + charMatch + '</span>';
              lastCorrectMatchIndex = typedComparisonArr.length;

            } else if ( isCharMatch === 1 ) {
              wrapTypedChar = '<span class="typeBad">' + charMatch + '</span>';
            }

            if ( wrapTypedChar !== undefined ) {
              typedComparisonArr.push(wrapTypedChar);
            }
            if ( wrapCardChar !== undefined ) {
              cardComparisonArr.push(wrapCardChar);
            }

            // Add comparison answers to <pre> element and append it to outputWrap
            preEl.innerHTML = typedComparisonArr.join('') + '\n&darr;\n' + cardComparisonArr.join('');
            outputWrap.append(preEl);
          }
        }

      // If compare is NOT active, output user's answer
      } else {
        if ( outputData !== null ) {
          outputData.textContent = outputDataArr[outputIndex];
        }
      }
    });
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
        hasNotes.classList.add('notes-long');
      }
    });
  }
}

// Check if it works on AnkiWeb and AnkiMobile iOS
