const typedAnswerEl = document.getElementById('typedAnswer'),
      cardAnswerEl = document.getElementById('cardAnswer'),
      typedAnswerText = typedAnswerEl.textContent,
      cardAnswerText = cardAnswerEl.textContent,
      typedAnswerCharArr = typedAnswerText.split(''),
      cardAnswerCharArr = cardAnswerText.split(''),
      dmp = new diff_match_patch(),
      diff = dmp.diff_main(cardAnswerText, typedAnswerText);

let   charDiffArr = [],
      typedComparisonAnswerArr = [],
      cardComparisonAnswerArr = [],
      lastCorrectMatchIndex = 0;

// Create array of indiviual characters and their match type from array of diff strings
for (let i = 0; i < diff.length; i++ ) {
  let diffStr = diff[i][1]; // string such as 'plus'
  let diffStrArr = diffStr.split(''); // ['p', 'l', 'u', 's']
  let isDiffMatch = diff[i][0]; // -1, 0, or 1

  diffStrArr.forEach( char => {
    let diffChar = [isDiffMatch, char]; // example output: [-1, 'p']
    charDiffArr.push(diffChar);
  });
}

// Wrapped characters depending on their match type and inserted into the comparison answer arrays.
for( let i = 0; i < charDiffArr.length; i++ ) {
  let diffChar = charDiffArr[i][1], // 'p'
      sortDiffChar = charDiffArr[i][0], // -1, 0, or 1
      wrapTypedChar,
      wrapCardChar;

  if ( sortDiffChar === -1 ) {
    wrapCardChar = '<span class="typedMissing">' + diffChar + '</span>';
  } else if ( sortDiffChar === 0 ) {
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
    wrapTypedChar = '<span class="typedCorrect">' + diffChar + '</span>';
    wrapCardChar = '<span class="typedCorrect">' + diffChar + '</span>';
    lastCorrectMatchIndex = typedComparisonAnswerArr.length;

  } else if ( sortDiffChar === 1 ) {
    wrapTypedChar = '<span class="typedIncorrect">' + diffChar + '</span>';
  }

  if ( wrapTypedChar !== undefined ) {
    typedComparisonAnswerArr.push(wrapTypedChar);
  }
  if ( wrapCardChar !== undefined ) {
    cardComparisonAnswerArr.push(wrapCardChar);
  }
}
// Replace original typed and char answers with comparison answers
typedAnswerEl.innerHTML = typedComparisonAnswerArr.join('');
cardAnswerEl.innerHTML = cardComparisonAnswerArr.join('');
