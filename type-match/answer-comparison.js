window.addEventListener('DOMContentLoaded', (event) => {
  compareAnswers();
});

function compareAnswers() {
  const typedAnswerEl = document.getElementById('typedAnswer');
  const typedAnswerText = typedAnswerEl.textContent;
  const typedAnswerCharArr = typedAnswerText.split('');
  const cardAnswerEl = document.getElementById('cardAnswer');
  const cardAnswerText = cardAnswerEl.textContent;
  // const cardAnswerCharArr = cardAnswerText.split('');

  // let typedMatchArr = [];
  let typedAnswerComparisonArr = [];
  // let typedAnswerComparisonHTML = '';
  // let cardAnswerComparisonHTML = '';
  let lastCardMatchIndex = -1;
  // let cardMatchIndexArr = [];


  // For each typedAnswerCharArr index, find the next available match in cardAnswerCharArr
  for (let i = 0; i < typedAnswerCharArr.length; i++ ) {

    let typedChar = typedAnswerCharArr[i];
    let typedCharEscaped = typedChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    let regexp = new RegExp(typedCharEscaped, 'g');
    let cardToTypedMatchArr = Array.from(cardAnswerText.matchAll(regexp), match => match['index']);
    let wrapTypedChar;

    console.log('\nlast card match: ' + lastCardMatchIndex);
    console.log('card match array: ' + cardToTypedMatchArr);

    if ( cardToTypedMatchArr.length !== 0  ) {

      let cardMatchIndex = cardToTypedMatchArr.find( match => match > lastCardMatchIndex );

      console.log('available match index: ' + cardMatchIndex);

      if ( cardMatchIndex <= typedAnswerComparisonArr.length )  {
        wrapTypedChar = '<span class="typedCorrect">' + typedChar + '</span>';
        lastCardMatchIndex  = cardMatchIndex;
        // cardMatchIndexArr.push( lastCardMatchIndex );

      } else if ( cardMatchIndex ) {
        let dashesNeeded =  cardMatchIndex - typedAnswerComparisonArr.length;
        let dashesString =  '<span class="typedIncorrect">-</span>';
        let dashesAdded = 0;

        while ( dashesNeeded > dashesAdded ) {
          typedAnswerComparisonArr.splice( lastCardMatchIndex + 1, 0, dashesString );
          dashesAdded++;
        }

        wrapTypedChar = '<span class="typedCorrect">' + typedChar + '</span>';
        // cardMatchIndexArr.push(cardMatchIndex);
        lastCardMatchIndex  = cardMatchIndex;
        // typedMatchArr.push(i);

      } else {
        wrapTypedChar = '<span class="typedIncorrect">' + typedChar + '</span>';
      }

    } else {
      wrapTypedChar = '<span class="typedIncorrect">' + typedChar + '</span>';
    }

    typedAnswerComparisonArr.push(wrapTypedChar);
  }

  typedAnswerEl.innerHTML = typedAnswerComparisonArr.join('');
  // cardAnswerEl.innerHTML = cardAnswerComparisonHTML;
}
