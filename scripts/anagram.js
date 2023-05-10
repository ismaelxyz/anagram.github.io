const TD_QUERY = ".custom-table > tbody > tr > td";
/*
element.style {
    transform: translate(10px, 0px);
}
*/



/*
  A function that is useful for creating a list with numbers in a range
  starting at 'start', ending at 'stop', and 'step' controls the increment
  between values in the range
*/
function arrayRange(start, stop, step) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );
}

/*
  Makes all the letters of the text are together without spaces and in lowercase
  to make it more difficult to recognize
*/
function dirtyText(text) {
  return text.toLocaleLowerCase().replaceAll(' ', '');
}

/*
  It is executed when the user presses 'Enter' and the program is focused on
  the main input
*/
function enterPress(event) {
  if (event.key == 'Enter')
    document.querySelector('#aceept-btn').click();
  
}

/*
  This function creates an anagram based not on a word as such, but on a text
*/
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

/*
  Here all the texts that the user enters into the program are stored together
  with their respective anagrams so that they can be manipulated in a simple way
*/
let Anagram = {
  // A record of texts with their anagrams
  'texts': {},

  /*
    Insert or update a text into texts list, ruturns true if it is inserted for
    firts time
  */
  'addText': function(sourceText) {
    let undefinedSourceText = Anagram.texts[sourceText] === undefined;
    Anagram.texts[sourceText] = disarrangeTextCharacters(sourceText);

    return undefinedSourceText;
  },

  // Answer the question Where is the text?
  'textIndex': function(text) {
    return Object.keys(this.texts).indexOf(text);
  },

  // Deletes a text and its anagram from the record
  'removeText': function(text) {
    delete this.texts[text];
  }
};


// The dynamics that make this program work
let AnagramView = {
  'selected': null,

  /*
    Each anagram is represented graphically. This function helps find the
    graphic representation of an anagram according to its 'index'
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
      trow.onclick = (event) => {
        AnagramView.openEditMenu(event.srcElement.parentNode);
      };
      column.appendChild(trow);


      trow.appendChild(wordTd);
      trow.appendChild(anagramwordTd);
    } else {
      let index = this.associatedIndex(Anagram.textIndex(sourceText));
      let anagramwordTd = document.querySelectorAll(TD_QUERY)[index];
      anagramwordTd.textContent = Anagram.texts[sourceText];
    }

  },
  
  'clearEditText': function() {
      let anagramEdit = document.querySelector(".edit .anagram-edit");
      let wordEdit = document.querySelector(".edit .word-edit");

      if (this.selected) {
        this.selected.childNodes[0].textContent = anagramEdit.value;
        this.selected.childNodes[1].textContent = wordEdit.value;
      }

      anagramEdit.value = "";
      wordEdit.value = "";

  },

  'accept': function() {
      if (this.selected) {
        this.clearEditText();
        this.selected = null;
        this.closeEditMenu();
      }
  },

  /*
    Remove the graphic representation of an anagram.
  */
  'remove': function() {
      if (this.selected) {
        Anagram.removeText(
          this.selected.firstElementChild.textContent
        );
        this.selected.remove();

        this.selected = null;
        this.clearEditText();
        this.closeEditMenu();
      }
  },

  /*
    Open the editing menu so that an anagram can be modified
  */
  'openEditMenu': function(parentNode) {
    let trs = document.querySelectorAll(".custom-table > tbody > tr");

    let anagramEdit = document.querySelector(".edit .anagram-edit");
    let wordEdit = document.querySelector(".edit .word-edit");

    anagramEdit.value = parentNode.childNodes[0].textContent;
    wordEdit.value = parentNode.childNodes[1].textContent;

    this.selected = parentNode;
    
    let edit = document.querySelector(".edit")
    edit.style.display = "block";
  },


  /*
    Close the editing menu
  */
  'closeEditMenu': function() {
      let edit = document.querySelector(".edit")
      edit.style.display = "none";
  }

}

