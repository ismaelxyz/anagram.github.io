const TD_QUERY = ".custom-table > tbody > tr > td";

function arrayRange(start, stop, step) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );
}


function dirtyText(text) {
  return text.toLocaleLowerCase().replaceAll(' ', '');
}
/*
element.style {
    transform: translate(10px, 0px);
}
*/

function enterPress(event) {

  if (event.key == 'Enter')
    document.querySelector('#aceept-btn').click();
  
}


function disarrangeTextCharacters(text) {
    text = dirtyText(text);
    let newText = text.split('');
    let textLength = text.length;
    let indices = arrayRange(0, textLength -1, 1);

    for (let indexCharacter = 0; indexCharacter < textLength; indexCharacter++) {
      let index = Math.round(Math.random() * (indices.length - 1));
      index = indices.splice(index, 1)[0];
      newText[index] = text[indexCharacter];
    }

    return newText.join('')
}


function moveTo(event) {
  console.log("Event: ", event);
}

let EditWord = {
  'state': null,

  'prepareElement': function(htmlElement) {
    htmlElement.ontouchstart = EditWord.onEventStart;
    htmlElement.ontouchend = EditWord.onEventEnd;
    htmlElement.onmousedown = EditWord.onEventStart;
    htmlElement.onmouseup = EditWord.onEventEnd;
  },

  'onEventStart': function(event) {
    this.state = {
      isStart: true,
      htmlElement: event.srcElement,
      x: event.x,
      y: event.y,
    };
    // console.log("Ontouchstart: ", event.srcElement);
  },

  'onEventEnd': function(event) {
    if (!this.state) return;

    let location = {
      x: this.state.x - event.x,
      y: this.state.y - event.y
    }

    if (location.x < 0)
      AnagramView.remove(this.state.htmlElement.parentNode);

    this.state = null;
  },
};

let Anagram = {
  'texts': {},
  /*
    Insert or update a text into texts list, ruturns true if it is inserted for
    firts time.
  */
  'addText': function(sourceText) {
    let undefinedSourceText = Anagram.texts[sourceText] === undefined;
    Anagram.texts[sourceText] = disarrangeTextCharacters(sourceText);

    return undefinedSourceText;
  },

  'wordIndex': function(word) {
    return Object.keys(this.texts).indexOf(word);
  },

  'removeText': function(word) {
    delete this.texts[word];
  }
};

let AnagramView = {
  /*
    Each anagram is represented graphically. This function helps find the
    graphic representation of an anagram according to its .index
  */
  'associatedIndex': function(index) {
    return 2 * index + 1;
  },
  /*
    Add or update the graphic representation of an anagram.
  */
  'addOrUpdate': function(sourceText) {
    let anagramInput = document.querySelector('#anagram-input');
    sourceText = sourceText || anagramInput.value;

    if (Anagram.addText(sourceText)) {
      let column = document.querySelector(".custom-table tbody");
      let wordTd = document.createElement("td");
      wordTd.textContent = sourceText;

      let anagramwordTd = document.createElement("td");
      anagramwordTd.textContent = Anagram.texts[sourceText];

      let trow = document.createElement("tr");

      EditWord.prepareElement(trow);

      // trow.onclick = moveTo;
      column.appendChild(trow);


      trow.appendChild(wordTd);
      trow.appendChild(anagramwordTd);
    } else {
      let index = this.associatedIndex(Anagram.wordIndex(sourceText));
      let anagramwordTd = document.querySelectorAll(TD_QUERY)[index];
      anagramwordTd.textContent = Anagram.texts[sourceText];
    }

  },
  /*
    Remove the graphic representation of an anagram.
  */
  'remove': function(parentNode) {
    let trs = document.querySelectorAll(".custom-table > tbody > tr");

    for (let index = 0; index < trs.length; index++) {

      if (trs[index] == parentNode) {
        Anagram.removeText(trs[index].firstElementChild.textContent);
        parentNode.remove();
        break;
      }

    }
  }
}

