const hasMyCustomScript = true,
      isAnkiPC21 = typeof pycmd !== 'undefined';

let   dataOutputArr;

watchQA();

function watchQA() {
  // Run once on first load
  showInput();
  focusInput();
  showPrimaryTitle();
  modifyNotes();
  holdData();
  showOutput();

  // Then watch for changes in div#qa and run functions again when div#qa changes
  const targetNode = document.getElementById('qa');
  const config = { childList: true };
  const callback = function( mutationsList, observer ) {
    for ( const mutation of mutationsList ) {
      if ( mutation.type === 'childList' ) {
        showInput();
        focusInput();
        showPrimaryTitle();
        modifyNotes();
        holdData();
        showOutput();
      }
      break; // don't loop again from changes made to div#qa by running this script
    }
  };
  const observer = new MutationObserver( callback );
  observer.observe( targetNode, config );
}

function showInput() {
  let inputWrapList = document.querySelectorAll('.input-wrap');
  if ( inputWrapList.length !== 0 ) {
    inputWrapList.forEach( inputWrap => {
      let placeholder = inputWrap.querySelector('.faux-placeholder');

      // If faux placeholder question is not empty, show input
      if ( placeholder !== null && placeholder.innerHTML !== '' ) {
        let inputTitle = inputWrap.querySelector('.input-title');
        let textarea = inputWrap.querySelector('textarea');
        inputWrap.classList.add('active');

        if ( inputTitle !== null ) {
          let hasCompare = inputTitle.getAttribute('data-compare');
          let hasTypeHint = inputTitle.getAttribute('data-type-hint');

          // Add "precise" text to input title if comparison is active
          if ( hasCompare && hasCompare !== '' ) {
            inputTitle.innerHTML += '<span class="is-comparison">precise</span>';
          }

          // Add type hint text to input title if available
          if ( hasTypeHint && hasTypeHint !== '' ) {
            inputTitle.innerHTML += `<span class="is-type-hint">${hasTypeHint}</span>`;
          }
        }

        // Hide faux placeholder when inputting data
        if ( textarea !== null ) {
          textarea.addEventListener( 'input', event => {
            if ( textarea.value !== '' ) {
              placeholder.classList.add('inactive');
            } else {
              placeholder.classList.remove('inactive');
            }
          });
        }
      }
    });
  }
}

function focusInput() {
  // Add focus to first input/textarea element if the ID is not #typeans
  let inputField = document.querySelector( 'input, textarea' );
  if ( inputField !== null && inputField.id !== typeans ) {
    inputField.focus();
  }
}

function showPrimaryTitle() {
  let primary = document.querySelector('.is-primary');
  if ( primary !== null ) {
    let textarea = primary.querySelector('textarea');
    let title = primary.querySelector('.input-title');
    if ( title !== null ) {
      let hasCompare = title.getAttribute('data-compare');
      // Show primary input title if comparison is not active
      if ( hasCompare && hasCompare === '' ) {
        title.classList.add('active');
        textarea.classList.add('has-title');
      }
    }
  }
}

function modifyNotes() {
  // Hide notes box if there is no note content
  let notesBox = document.querySelector('.notes-box');
  let hasNote = document.querySelector('.notes')
  if ( notesBox != null && !hasNote.innerHTML ) {
    notesBox.classList.add('inactive');
  }
  // Align text left if there are more than 200 characters in the notes
  if ( hasNote !== null && hasNote.innerText.length > 200 ) {
    hasNote.classList.add('long');
  }
}

function holdData() {
  let inputDataList = document.querySelectorAll('.input-data');

  if ( inputDataList.length !== 0 ) {
    dataOutputArr = Array(inputDataList.length);
    inputDataList.forEach( ( inputData, inputIndex ) => {
      // Insert input data in array for output
      inputData.addEventListener('input', event => {
        let inputValue = event.currentTarget.value;
        dataOutputArr.splice( inputIndex, 1, inputValue );
      });
      // Return data on PC keypress
      if ( isAnkiPC21 ) {
        inputData.addEventListener('keydown', event => {
          if (event.ctrlKey && event.key == 'Enter') pycmd("ans");
        });
      }
    });
  }
}

function showOutput() {
  let outputDataList = document.querySelectorAll('.output-data');
  let outputCompareList = document.querySelectorAll('.output-compare');

  if ( outputDataList.length !== 0 ) {
    outputDataList.forEach( (outputData, outputIndex) => {
      outputData.textContent = dataOutputArr[outputIndex];
    });
  }



  // if ( outputDataList.length !== 0 ) {
  //   outputCompareList.forEach( ( outputCompare, outputIndex ) => {
  //     let hasCompare = outputCompare.getAttribute('data-compare');
  //     if ( hasCompare !== '' ) {

  //       outputCompare.innerText = dataOutputArr[outputIndex];

  //     }
  //   });
  // } else if ( )
}

// HIDE .output-compare and .box by default
// SHOW either .output-compare or .box depending on if compare is active
// If compare active, insert comparison data
// Check if it works on AnkiWeb and AnkiMobile iOS


// function showInput() {
//   let inputWrapList = document.querySelectorAll('.input-wrap');
//   if ( inputWrapList.length !== 0 ) {
//     inputWrapList.forEach( inputWrap => {
//       let placeholder = inputWrap.querySelector('.faux-placeholder');

//       // If faux placeholder question is not empty, show input
//       if ( placeholder !== null && placeholder.innerHTML !== '' ) {
//         let inputTitle = inputWrap.querySelector('.input-title');
//         let textarea = inputWrap.querySelector('textarea');
//         inputWrap.classList.add('active');

//         if ( inputTitle !== null ) {
//           let hasCompare = inputTitle.getAttribute('data-compare');
//           let hasTypeHint = inputTitle.getAttribute('data-type-hint');

//           // Add "precise" text to input title if comparison is active
//           if ( hasCompare && hasCompare !== '' ) {
//             inputTitle.innerHTML += '<span class="is-comparison">precise</span>';
//           }

//           // Add type hint text to input title if available
//           if ( hasTypeHint && hasTypeHint !== '' ) {
//             inputTitle.innerHTML += `<span class="is-type-hint">${hasTypeHint}</span>`;
//           }
//         }

//         // Hide faux placeholder when inputting data
//         if ( textarea !== null ) {
//           textarea.addEventListener( 'input', event => {
//             if ( textarea.value !== '' ) {
//               placeholder.classList.add('inactive');
//             } else {
//               placeholder.classList.remove('inactive');
//             }
//           });
//         }
//       }
//     });
//   }
// }
