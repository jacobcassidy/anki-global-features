window.addEventListener('DOMContentLoaded', (event) => {
  compareAnswers();
});

function compareAnswers() {
  const typedAnswerEl = document.getElementById('typedAnswer'),
        typedAnswerText = typedAnswerEl.textContent,
        typedAnswerCharArr = typedAnswerText.split(''),
        cardAnswerEl = document.getElementById('cardAnswer'),
        cardAnswerText = cardAnswerEl.textContent,
        cardAnswerCharArr = cardAnswerText.split('');

  let   typedAnswerComparisonArr = [],
        cardAnswerComparisonHTML = '',
        typedMatchArr = [],
        cardMatchArr = [],
        lastTypedMatchIndexUsed = -1;

  for ( let i = 0; i < cardAnswerCharArr.length; i++ ) {
    // For each cardAnswerCharArr index, loop through typedAnswerCharArr for a match
    let cardChar = cardAnswerCharArr[i],
        cardCharEscaped = cardChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // $& means the whole matched string
        regexp = new RegExp(cardCharEscaped, 'g'),
        matchTypedtoCardArr = Array.from(typedAnswerText.matchAll(regexp), match => match['index']),
        wrapCardChar;

    if ( matchTypedtoCardArr.length !== 0  ) {
      let match = matchTypedtoCardArr.find( typedMatchIndex => typedMatchIndex > lastTypedMatchIndexUsed );
      if ( match !== undefined ) {
        wrapCardChar = '<span class="typedCorrect">' + cardChar + '</span>';
        lastTypedMatchIndexUsed  = match;
        typedMatchArr.push(match);
        cardMatchArr.push(i);
      } else {
        wrapCardChar = '<span class="typedNotFound">' + cardChar + '</span>';
      }
    } else {
      wrapCardChar = '<span class="typedNotFound">' + cardChar + '</span>';
    }
    cardAnswerComparisonHTML += wrapCardChar;
  }

  for (let i = 0; i < typedAnswerCharArr.length; i++ ) {
    // For each typedAnswerCharArr index, add a conditional wrap around the typed character based on the match status
    let typedChar = typedAnswerCharArr[i],
        typedMatch = typedMatchArr.find( match => match === i ),
        typedMatchIndex = typedMatchArr.findIndex( match => match === i ),
        typedMatchIndexValue = typedMatchArr[typedMatchIndex],
        cardMatchIndexValue = cardMatchArr[typedMatchIndex],
        lastTypedMatchIndexValue = typedMatchArr[typedMatchIndex - 1],
        wrapTypedChar;

    if ( typedMatch !== undefined && typedMatchIndexValue >= cardMatchIndexValue ) {
      wrapTypedChar = '<span class="typedCorrect">' + typedChar + '</span>';

    } else if ( typedMatch !== undefined ) {
      let dashesNeeded =  cardMatchArr[typedMatchIndex] - typedAnswerComparisonArr.length,
          dashesString =  '<span class="typedIncorrect">-</span>';
          dashesAdded = 0;

      while ( dashesNeeded > dashesAdded ) {
        typedAnswerComparisonArr.splice( lastTypedMatchIndexValue + 1, 0, dashesString );
        dashesAdded++;
      }
      wrapTypedChar = '<span class="typedCorrect">' + typedChar + '</span>';

    } else {
      wrapTypedChar = '<span class="typedIncorrect">' + typedChar + '</span>';
    }

    typedAnswerComparisonArr.push(wrapTypedChar);
  }

  typedAnswerEl.innerHTML = typedAnswerComparisonArr.join('');
  cardAnswerEl.innerHTML = cardAnswerComparisonHTML;

}
