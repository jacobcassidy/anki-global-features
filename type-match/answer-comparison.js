const typedAnswerEl = document.getElementById('typedAnswer'),
      typedAnswerText = typedAnswerEl.textContent,
      typedAnswerCharArr = typedAnswerText.split(''),
      cardAnswerEl = document.getElementById('cardAnswer'),
      cardAnswerText = cardAnswerEl.textContent,
      cardAnswerCharArr = cardAnswerText.split(''),
      dmp = new diff_match_patch(),
      typedDiff = dmp.diff_main(typedAnswerText, cardAnswerText),
      cardDiff = dmp.diff_main(cardAnswerText, typedAnswerText);

let   typedMatchCharArr = [],
      typedAnswerComparisonArr = [],
      cardMatchCharArr = [],
      cardAnswerComparisonArr = [];

function addToTypedMatchCharArr() {
  for (let i = 0; i < typedDiff.length; i++ ) {
    let typedStr = typedDiff[i][1]; // 'plus'
    let typedStrArr = typedStr.split(''); // ['p', 'l', 'u', 's']
    let isTypedMatch = typedDiff[i][0]; // -1

    typedStrArr.forEach( char => {
      let typedCharDiff = [isTypedMatch, char]; // [-1, 'p']
      if ( isTypedMatch !== 1 ) {
        typedMatchCharArr.push(typedCharDiff);
      }
    });
  }
}

function addToCardMatchCharArr() {
  for ( let i = 0; i < cardDiff.length; i++ ) {
    let cardStr = cardDiff[i][1]; // '+,' string
    let cardStrArr = cardStr.split(''); // ['+', ',']
    let isCardMatch = cardDiff[i][0]; // -1, 0, or 1

    cardStrArr.forEach( char => {
      let cardCharDiff = [isCardMatch, char]; // [0, 'K']
      if ( isCardMatch !== 1 ) {
        cardMatchCharArr.push(cardCharDiff);
      }
    });
  }
}

function addToTypedAnswerComparisonArr() {
  let lastCorrectCardCharIndex = -1;
  let lastCorrectTypedCharIndex = -1;
  let dashesInserted = 0;

  for( let i = 0; i < typedMatchCharArr.length; i++ ) {
    let typedMatchNum = typedMatchCharArr[i][0];
    let typedMatchChar = typedMatchCharArr[i][1];
    let wrapTypedMatchChar;

    if ( typedMatchNum === -1 ) {
      wrapTypedMatchChar = '<span class="typedIncorrect">' + typedMatchChar + '<span>';

    } else if ( typedMatchNum === 0 ) {
      let cardMatchCharIndex = cardMatchCharArr.findIndex( (innerArr, index) => innerArr[0] === 0 && innerArr[1] === typedMatchChar && index > lastCorrectCardCharIndex );
      let indexWithDashes = i + dashesInserted;

      if ( cardMatchCharIndex > indexWithDashes ) {
        let dashesNeeded = cardMatchCharIndex - indexWithDashes;
        let dashesStr = '<span class="typedIncorrect">-</span>';
        let dashesAdded = 0;

        while ( dashesNeeded > dashesAdded ) {
          typedAnswerComparisonArr.splice( lastCorrectTypedCharIndex + 1, 0, dashesStr );
          dashesAdded++;
        }

        dashesInserted += dashesNeeded;
      }
      wrapTypedMatchChar = '<span class="typedCorrect">' + typedMatchChar + '</span>';
      lastCorrectCardCharIndex = cardMatchCharIndex;
      lastCorrectTypedCharIndex = indexWithDashes;
    }
    typedAnswerComparisonArr.push(wrapTypedMatchChar);
  }
}

function addToCardAnswerComparisonArr() {
  for( let i = 0; i < cardMatchCharArr.length; i++ ) {
    let cardMatchNum = cardMatchCharArr[i][0];
    let cardMatchChar = cardMatchCharArr[i][1];

    if ( cardMatchNum === -1 ) {
      let wrapCardMatchChar = '<span class="typedNotFound">' + cardMatchChar + '<span>';
      cardAnswerComparisonArr.push(wrapCardMatchChar);

    } else if ( cardMatchNum === 0 ) {
      let wrapCardMatchChar = '<span class="typedCorrect">' + cardMatchChar + '<span>';
      cardAnswerComparisonArr.push(wrapCardMatchChar);
    }
  }
}

addToTypedMatchCharArr();
addToCardMatchCharArr();
addToTypedAnswerComparisonArr();
addToCardAnswerComparisonArr();
typedAnswerEl.innerHTML = typedAnswerComparisonArr.join('');
cardAnswerEl.innerHTML = cardAnswerComparisonArr.join('');
