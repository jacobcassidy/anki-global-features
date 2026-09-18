const typedAnswerEl = document.getElementById('typedAnswer'),
      cardAnswerEl = document.getElementById('cardAnswer'),
      typedAnswerText = typedAnswerEl.textContent,
      cardAnswerText = cardAnswerEl.textContent,
      dmp = new diff_match_patch(),
      diff = dmp.diff_main(cardAnswerText, typedAnswerText);

let   diffSortCharArr = [],
      typedComparisonAnswerArr = [],
      cardComparisonAnswerArr = [],
      lastCorrectMatchIndex = 0;

// Create array of indiviual characters and their match type from array of diff strings
for (let i = 0; i < diff.length; i++ ) {
  let diffSort = diff[i][0];             // -1, 0, or 1
  let diffStr = diff[i][1];              // example: 'plus'
  let diffStrSplit = diffStr.split('');  // example: ['p', 'l', 'u', 's']

  diffStrSplit.forEach( diffChar => {
    let diffSortChar = [diffSort, diffChar]; // example: [-1, 'p']
    diffSortCharArr.push(diffSortChar);
  });
}

// Wrapped characters depending on their match type and inserted into the comparison answer arrays.
for( let i = 0; i < diffSortCharArr.length; i++ ) {
  let charMatch = diffSortCharArr[i][1],   // 'p'
      isCharMatch = diffSortCharArr[i][0], // -1, 0, or 1
      wrapTypedChar,
      wrapCardChar;

  if ( isCharMatch === -1 ) {
    wrapCardChar = '<span class="typedMissing">' + charMatch + '</span>';

  } else if ( isCharMatch === 0 ) {
    // Insert dashes if needed to align typed and card answers
    if ( typedComparisonAnswerArr.length < cardComparisonAnswerArr.length ) {
      let dashesNeeded = cardComparisonAnswerArr.length - typedComparisonAnswerArr.length;
      let dashesStr = '<span class="typedIncorrect">-</span>';
      let dashesAdded = 0;

      while ( dashesNeeded > dashesAdded ) {
        typedComparisonAnswerArr.splice( lastCorrectMatchIndex + 1, 0, dashesStr );
        dashesAdded++;
      }
    }
    wrapTypedChar = '<span class="typedCorrect">' + charMatch + '</span>';
    wrapCardChar = '<span class="typedCorrect">' + charMatch + '</span>';
    lastCorrectMatchIndex = typedComparisonAnswerArr.length;

  } else if ( isCharMatch === 1 ) {
    wrapTypedChar = '<span class="typedIncorrect">' + charMatch + '</span>';
  }

  if ( wrapTypedChar !== undefined ) {
    typedComparisonAnswerArr.push(wrapTypedChar);
  }
  if ( wrapCardChar !== undefined ) {
    cardComparisonAnswerArr.push(wrapCardChar);
  }
}

// Replace original answers with comparison answers inserted in the <pre> tag
typedAnswerEl.firstElementChild.innerHTML = typedComparisonAnswerArr.join('');
cardAnswerEl.firstElementChild.innerHTML = cardComparisonAnswerArr.join('');
