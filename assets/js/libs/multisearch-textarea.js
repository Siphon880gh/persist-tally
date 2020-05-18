let MultisearchTextarea = function(params) {
    let {$input, $searchBtn, $clearBtn, $textarea} = params;
    
    var matchesQueue = [],
        matchesQPtr = -1;

    function getAllIndexes(arr, val) {
        var indexes = [];
        for(i = 0; i < arr.length; i++) {
            console.log(line)
            var line = arr[i];
            if(  line.toLowerCase().indexOf( val.toLowerCase() )!==-1  )
                indexes.push(i);
        }
        console.log(indexes);
        return indexes;
    } // getAllIndexes

    function reinitMatch($textarea) {
        let lines = $textarea.val().split('\n');
        let jumpToLineText = $input.val();
        matchesQueue = getAllIndexes(lines, jumpToLineText);
        matchesQPtr = -1;
        console.log("reinitMatch");
    }
    
    function jumpBy$PartialText($textarea) {
      let lineNumber = 0,
          text = $textarea.val(),
          lines = $textarea.val().split("\n");
      
      if(text.length===0) {
          alert("Nothing to search!");
          return;
      } else if($input.val()==="") {
          alert("What do you want to search?");
          return;
      } else if(matchesQueue.length===0) {
          alert("Not found!")
          return;
      }

      matchesQPtr++;
      if(matchesQPtr < matchesQueue.length) {
          let matchLine = matchesQueue[matchesQPtr];
          jumpAndHighlight(matchLine, $textarea);
      } else {
          matchesQPtr = 0;
          let matchLine = matchesQueue[0];
          jumpAndHighlight(matchLine, $textarea);
      }
    } // jumpBy$PartialText

    function jumpAndHighlight(lineNumber, $ta) {
        // alert("Highlighted and jumped");
        var lines = $ta.val().split("\n"),
            lineLength = lines.length;
    
        var charsStart = 0,
            charsEnd = 0;
        for(var i=0; i<lineNumber; i++) {
            charsStart+=lines[i].length+1;
        }
        charsEnd=charsStart+lines[lineNumber].length;
    
        $ta.focus();
        $ta[0].selectionStart = charsStart;
        $ta[0].selectionEnd = charsEnd;
    
        var scrollHeight = $ta[0].scrollHeight,
            clientHeight = $ta[0].clientHeight,
            scrollTo = Math.round((lineNumber/lineLength)*scrollHeight);
    
        // And to scroll to the middle whether than top:
        scrollTo -= Math.round(clientHeight/2);
        $ta.scrollTop(scrollTo);
    } // jumpAndHighlight

    $input.on("keyup", ()=> {
        reinitMatch($textarea);
    })

    $searchBtn.on("click", ()=> {
        jumpBy$PartialText($textarea);
    });

    $clearBtn.on("click", ()=> {
        if(confirm('Clear Find text field?')) {
            $input.val('');
        }
    });
}