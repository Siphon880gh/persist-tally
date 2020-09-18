$(()=>{
  // Dependencies
  var SaveLoadSystem1 = new SaveLoadSystem();
  if(typeof TriggerWhenStopTyping==="undefined") alert(`Error: Missing TriggerWhenStopTyping`);
  if(typeof MultisearchTextarea==="undefined") alert(`Error: Missing MultisearchTextarea`);

  // Textarea Dependencies
  let { keyup, checkIfEnterKey, jumpAndHighlight, selectAndCopyTextarea, openPrintDialogue } = new TextareaHelpers();
  window.keyup = keyup;
  // window.checkIfEnterKey = checkIfEnterKey;
  window.jumpAndHighlight = jumpAndHighlight;
  window.selectAndCopyTextarea = selectAndCopyTextarea.bind(window);
  window.openPrintDialogue = openPrintDialogue;

  // Apps
  var BookmarkSystem1 = new BookmarkSystem();
  var FormulaSystem1 = new FormulaSystem();
  var ResizeTextareaSystem1 = new ResizeTextareaSystem();
  var App1 = new App();
});

// Classes
var App = null,
    SaveLoadSystem = null,
    BookmarkSystem = null,
    FormulaSystem = null,
    ResizeTextareaSystem = null,
    TextareaHelpers = null;

ResizeTextareaSystem = class {
  constructor() {
    setTimeout(()=>{
      this.once();
      this.hooks();
    }, 200);
  }

  once() {
    this.readjustTextareaHeight( $("#textarea") ); // once resize textarea to window
    this.readjustInputHeight( $("#input") );
    this.readjustInputHeight( $("#input2") );
    this.readjustInputHeight( $("#beforeATally") );
    this.readjustInputHeight( $("#afterAllTally") );
  }

  hooks() {

    $("#dropdown-openable-wrapper select").on("change", (ev)=>{
      let value = ev.target.value;
      if(value.length) {
        let filename = value;
        $("#opened-filename").text(filename);
        window.history.pushState(null, filename, `?open=${filename}`);
        load();
        $("#dropdown-openable-wrapper").addClass("hide");
      }
    });

    // if(prompt1!==null && prompt1.length>0) {
    //   $.get("data-read/file-exists.php", {filename: prompt1}, (res)=>{
    //     if(res.indexOf("error")===0)
    //       alertError();
    //     else {
    //       $("#opened-filename").text(prompt1);
    //       window.history.pushState(null, prompt1, `?open=${prompt1}`);
    //       load();
    //     }
    //   }); // check file exists
    // } // Opening not cancelled

    $(window).on("resize", ()=> {
      this.readjustTextareaHeight( $("#textarea") );
      this.readjustInputHeight( $("#input") );
      this.readjustInputHeight( $("#input2") );
      this.readjustInputHeight( $("#beforeATally") );
      this.readjustInputHeight( $("#afterAllTally") );
    });
  }

  readjustTextareaHeight($textarea) {
    var textareaTop = $textarea.offset().top;
    var windowHeight = $(window).innerHeight();
    var minHeightTextarea = $(window).height() * .75; // Equivalent 75vh

    textareaTop = parseInt(textareaTop);
    windowHeight = parseInt(windowHeight);

    if( windowHeight-(textareaTop*2) >= minHeightTextarea )
    $textarea.height( windowHeight-(textareaTop*2) );
  } // readjustTextareaHeight

  readjustInputHeight($field) {
    var minHeightTextarea = 25;
    var field = $field[0];
    if(field.value.length===0) {
      field.style.height = 25;
      return;
    }
    
    // Reset field height
    field.style.height = 'inherit';
  
    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);
  
    // Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                  + parseInt(computed.getPropertyValue('padding-top'), 10)
                  + field.scrollHeight
                  + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                  + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
  
    field.style.height = height + 'px';

    // textareaTop = parseInt(textareaTop);
    // windowHeight = parseInt(windowHeight);
    // if( windowHeight-(textareaTop*2) >= minHeightTextarea )
    // $textarea.height( windowHeight-(textareaTop*2) );
  } // readjustInputHeight

} // ResizeTextareaSystem

BookmarkSystem = class {
  globalize() {
      window.reparseBookmarks = this.reparseBookmarks;
      window.addBookmark = this.addBookmark;
  }

  constructor() {
      this.globalize()

      this.once();
      this.hooks();
  }

  once() {

      $(".bookmark .move-up").each((i, el)=>{
        $(el).click(el=>{
          this.insertBeforePrev(el);
          save();
        });
      });
      $(".bookmark .move-down").each((i, el)=>{
        $(el).click(el=>{
          this.insertAfterNext(el);
          save();
        });
      });

      $(".bookmark .title").each((i, el)=>{
        $(el).on("change", save);
      });
  }

  hooks() {

        $("#title").on("click", () => {
          alert(`Enhanced Notepad is a text editor that supports automatic saving and lets you bookmark lines. When selecting a bookmark, the text will scroll to that line. You can also group different types of bookmarks.`);
          //alert(`Enhanced Notepad is a live text editor that supports multiple users at the same time. The text is automatically saved. You can create lines you can jump to by starting the line with your own notation, called bookmarks.`);
      });

      $("#add-parser").on("click", () => {
          let preparedNew = {token:"#", preview: "0", title: ""};
          this.addBookmark( preparedNew );
          let bottomPagePx = $(document).height();
          $('html,body').animate({ scrollTop: bottomPagePx });
          reparseBookmarks();
          // setWroteHere();
      });

      $(".bookmark").whenLive(el=> {
        var $block = $(el),
            $title = $block.find(".title"),
            $token = $block.find(".token"),
            $moveUp = $block.find(".move-up"),
            $moveDown = $block.find(".move-down"),
            $destroyer = $block.find(".destroy-parser");
      
        $title.on("change", save);
        
        $moveUp.click(()=>{
            this.insertBeforePrev(el);
            save();
        });
        $moveDown.click(()=>{
            this.insertAfterNext(el);
            save();
        });

        $token.on("keyup", ()=> { 
          save(); 
          reparseBookmarks(); 
        });
        $destroyer.on("click", ()=> { 
          this.remove(); 
          setTimeout(save, 200);
        });
      });

  } // hooks

  insertBeforePrev(that) {
      var $current = $(that).closest(".bookmark"), 
          $prev = $current.prev(); 
      
      if($prev.length) { 
          var $up = $current.find(".fa-arrow-up");
          $up.addClass("active-icon");
          var $detached = $current.detach(); 
          $detached.insertBefore($prev); 
          setTimeout( ()=> { $up.removeClass("active-icon") }, 2000);
      }
  } // insertBeforePrev

  insertAfterNext(that) {
      var $current = $(that).closest(".bookmark"), 
          $next = $current.next(); 
          
      if($next.length) { 
          var $down = $current.find(".fa-arrow-down");
          $down.addClass("active-icon");
          var $detached = $current.detach(); 
          $detached.insertAfter($next); 
          setTimeout( ()=> { $down.removeClass("active-icon") }, 2000);
      }
  } // insertAfterNext

  remove() {
      let x = $(event.target);
      let title = x.closest(".bookmark").find(".title").val()?x.closest(".bookmark").find(".title").val():"Untitled";
      if(confirm(`Are you sure you want to remove ${title}?`))
      x.closest(".bookmark").remove();
  } // remove

  reparseBookmarks() {
      // event.stopPropagation();
      // event.preventDefault();
      // console.log("Reparsing dropdowns");

      var lines = $("#textarea").val()
                              .split("\n");

      $(".token").each( (i, tokenDom) => {
          var token = tokenDom.value,
              $dd = $(tokenDom).closest(".bookmark")
                          .find("select");

          $dd.html(`<option selected value="Jump to...">- Jump to -</option>`);
          if(token.length===0) return;

          for(var i=0; i<lines.length; i++) {
              var line = lines[i],
                  lc_line = line.toLowerCase(); // lower case line for matching
              if(lc_line.indexOf(token.toLowerCase()+" ")===0) {
                  var parsed = line.substr(token.length+1);
                  if(parsed.length>60)
                      parsed = parsed.substr(0, 57) + "..."; 
                  // console.log(parsed);

                  var $opt = $("<option/>").attr("value", parsed)
                                          .data("jump", i)
                                          .text(parsed);
                  $dd.append($opt)
                      .on("change", () => {
                          var opt = event.target [ event.target.selectedIndex ],
                              $opt = $(opt);
                          var jump = $opt.data("jump");

                          // $('html,body').animate({scrollTop: 0});
                          window.scrollTo(0, 0);
                          setTimeout(()=>{
                            jumpAndHighlight(jump, $("#textarea"));
                          }, 200);
                      });
              } // if
          } // for  
      }); // each token

      return false;
  }

  addBookmark(prepared) {
      
      let renderTemplate = (prepared) => {
          // debugger;
          return `<div class="bookmark">
              <div class="inner">
                  <div class="spacer"></div>
                  <div class="form-group">
                      <div class="form-row">
                          <label>Title: </label>
                          <input class="title" type="text" placeholder="Untitled" value="${prepared.title}"></input>
                      </div>
                      <div class="form-row">
                          <label>Line starts with: </label>
                          <input type="text" class="token" value="${prepared.token}" />
                      </div>
  
                  </div> <!-- form-group -->
  
                  <div class="dropdown-wrapper">
                      <select class="dropdown" name="" id="">
                          <option selected value="Jump to line.."></option>
                      </select>
                  </div>
                  <div style="clear:both;"></div>
  
                  <div style="text-align:right; margin-top:10px; height:15px;">
                      <div class="float-left">
                          <a class="move-up" href="javascript:void(0);"><span class="fa fa-arrow-up bookmark-btn"></span></a>
                          <span style="width:10px; height:1px;"></span>
                          <a class="move-down" href="javascript:void(0);"><span class="fa fa-arrow-down bookmark-btn"></span></a>
                      </div>
                      <a href="javascript:void(0);" class="destroy-parser float-right"><span class="fa fa-close bookmark-btn "></span></a>
                  </div>
              </div>
          </div>`
      };
  
      var $block = $( renderTemplate({token:prepared.token, preview:prepared.preview, title:prepared.title}) );
      $(".bookmarks").append($block);
  
      return $block;
  } // addBookmark

} // BookmarkSystem

TextareaHelpers = class {
    constructor() {
        return {
          keyup: this.keyup,
          // checkIfEnterKey: this.checkIfEnterKey,
          jumpAndHighlight: this.jumpAndHighlight,
          selectAndCopyTextarea: this.selectAndCopyTextarea,
          openPrintDialogue: this.openPrintDialogue
        };
    }

    keyup() {
      // console.log("Keyup -> tally, eval, save");
      tallier();
      evalier();
      reparseBookmarks();
      save();
    }

    // checkIfEnterKey(event) {
    //   // console.log("event.key, Enter/Return");
    //   if(event.key.toLowerCase() === "enter" || event.key.toLowerCase() === "return") {
    //     keyup();
    //   }
    // }

    jumpAndHighlight(lineNumber, $ta) {
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

    selectAndCopyTextarea($el, $done) {
        this.selectTextarea = function($el, callback) {
        var isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

        if(isIOS)
            $el.get(0).setSelectionRange(0,9999);
        else
            $el.select();

        callback();
        } // selectTextarea

        this.saveToClipboard =function() {
        try {
            var successful = document.execCommand( 'copy' );
            var msg = successful ? 'successful' : 'unsuccessful';
            // console.log('Copying text command was ' + msg);
            $done.fadeIn(800).delay(1200).fadeOut(500);
        } catch (err) {
            // console.log('Oops, unable to copy');
        }

        } // saveToClipboard

        this.selectTextarea($el, saveToClipboard);

    } // selectAndCopyTextarea

    openPrintDialogue() {
        var myWindow=window.open("about:blank");
        myWindow.document.write("<h5><?php echo basename(getcwd()); ?></h5><pre>" + $("#textarea").val() + "</pre>");
        myWindow.document.close(); // otherwise print dialogue does not appear

        myWindow.focus();
        myWindow.print(); 
    } // openPrintDialogue

} // TextareaHelpers

App = class {
  globalize() {
    window.tallier = this.tallier;
  }

  constructor() {
    this.globalize();

    // Nocache
    $.ajaxSetup({ cache: false });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('open')) {
      let filename = urlParams.get('open');
      if(filename.length) loadByUrl(filename);
    }
    
    // Attach saving when stop typing
    TriggerWhenStopTyping($("#textarea"), ()=>{
      keyup();
    });

    // Attach: Search with multiple results jumping to textarea
    MultisearchTextarea({
      $input: $("#jump-to-line"),
      $searchBtn: $("#jump-to-line-btn"),
      $clearBtn: $("#jump-to-line-clear"),
      $textarea: $("#textarea")
    });

    // Events
    this.hooks();

    setTimeout(()=>{
      tallier(); // tally the loaded data
      evalier(); // evaluate any formula lines
    }, 200);

  } // constructor

  hooks() {
    // save on keyup
    $("#input, #input2, #beforeATally, #afterAllTally").on("keyup", keyup);
    // $("#textarea").on("change", keyup);
    // $("#textarea").on("keyup", checkIfEnterKey);

    // save on formula changes 
    $(".desc").on("blur", keyup);
    $(".equation").on("keyup", keyup);
  } // hooks

  tallier() {
    let $ta = $("#textarea");
    let $tally = $("#results");
    let $counter = $("#counter");
    window.tally = 0;
    window.counter = 0;
    let num = 0;

    let lines = $ta.val().split('\n');
    lines.forEach(line=>{
      if(line.length===0) return;
      var matched = line.match(/^([0-9+.*\-()\[v/]+)/i);
      var matched_ = 0;

      if(matched!==null) {
        var matched_ = matched[1];
        // console.log("matched_:" + matched_[1]);
        // matched_ = matched_[1];  // index 1 is where the match group is
        try {
          var hasNumeral = (matched_.match(/[0-9]/g) || []).length>0;
      
          if(hasNumeral) {
            matched_ = eval(matched_); // like 1/2 becomes .5
            matched_ = parseFloat(matched_) || 0;
            console.log("hasNumeral");
          } else {
            // v (v [v ( [
            console.log("v (v [v ( [");
            matched_ = matched_.replace(/\[v/gi, "").replace(/\(v/gi, "");
            matched_ = matched_.replace(/v/gi, "");
            var semi = (matched_.match(/\(/g) || []).length;
            var def = (matched_.match(/\[/g) || []).length*2;
            matched_ = semi+def;
          }
        } catch(e) {
          // console.log("FALSE");
          // return false;
        }
      }
      if(matched!==null && !isNaN(matched_)) {
        num = matched_;
        if($("#beforeATally").val().length>0) {
          var evalCode = $("#beforeATally").val();
          try {
            eval(evalCode); // prevents js from stopping all other lines if fails
            // debugger;
            // console.log(line);
          } catch(err) { }
        } // before a number
    
        if($("#afterAllTally").val().length>0) {
          var evalCode = $("#afterAllTally").val();
          try {
            eval(evalCode); // prevents js from stopping all other lines if fails
          } catch(err) { }
          // console.log(tally);
        } // after a number
    
        window.tally += parseFloat(num); // parseFloat is necessary again or it becomes a string due to toFixed
        window.counter++;
      } // if there's a number starting a line
    }); // foreach
    
    $tally.text(window.tally.toFixed(2));
    $counter.text(window.counter);
  } // tallier

} // App
    
// SaveLoadSystem
SaveLoadSystem = class {
    globalize() {
      window.load = this.load;
      window.save = this.save;
      window.saveByUser = this.saveByUser;
      window.loadByUser = this.loadByUser;
      window.loadByUrl = this.loadByUrl;
    }

    constructor() {
        this.globalize();

    } // constructor

    loadByUrl(urlFilename) {
      $.get("data-read/file-exists.php", {filename: urlFilename}, (res)=>{
        if(res.indexOf("error")===0) {
          console.error("Error: File in url param 'open' does not exist. Please check spelling or notify person giving you the url.");
          window.history.pushState(null, "", "?"); // erase url param
        } else {
          $("#opened-filename").text(urlFilename);
          load();
        }
      }); // check file exists
    } // loadByUrl

    saveByUser() {
      let prompt1 = prompt("Give a name to this document:");
      if(prompt1!==null && prompt1.length>0) {
        $("#opened-filename").text(prompt1);
        window.history.pushState(null, prompt1, `?open=${prompt1}`);
      }
      save();
    }

    loadByUser() {
      $("#dropdown-openable-wrapper select").html("");
      $("#dropdown-openable-wrapper select").append(`<option value="">- Select file -</option>`);
      $.get("data-read/list-files.php", (list)=>{
        list = JSON.parse(list);
        var filenames = []; 

        list.forEach((filename)=>{ 
          if(filename!=="." && filename!==".." && filename!==".DS_Store") 
          filenames.push( filename.replace(".json", "") ); 
        });
        filenames.forEach(filename=>{
          var $option = `<option value="${filename}">${filename}</option>`;
          $("#dropdown-openable-wrapper select").append($option);
        });
      });

      $("#dropdown-openable-wrapper").toggleClass("hide");

    } // loadByUser

    save() {
      let hasFilename = $("#opened-filename").text().length>0;
      if( !hasFilename ) { console.error("Error: No filename to save to. Click Save icon to add a filename."); return; }
      let filename = $("#opened-filename").text();

      window.formulas = [];
      window.tally = 0;
      window.counter = 0;
      window.bookmarkTokens = [];
      window.bookmarkTitles = [];

      $(".formula").each((a, el,)=>{ 
        var $formula = $(el); 
        var formula = {desc:"", equation:""};
        formula.desc = $formula.find(".desc").text(); 
        formula.equation = $formula.find(".equation").val();
        // formula.equation = $formula.find(".equation").val();
        // formula.equation = encodeURIComponent(formula.equation); // escape $, etc
        formulas.push(formula);
      });

      $(".bookmark").each(  (i, cb) => { 
        var $cb = $(cb),
          title = $cb.find(".title").val(),
          token = $cb.find(".token").val();
          
          bookmarkTitles.push( title );
          bookmarkTokens.push( token );
      });

      var data = {
        filename,
        textarea:$("#textarea").val(),
        input:$("#input").val(),
        input2:$("#input2").val(),
        beforeATally:$("#beforeATally").val(),
        afterAllTally:$("#afterAllTally").val(),
        formulas:formulas,
        bookmarkTitles: bookmarkTitles,
        bookmarkTokens: bookmarkTokens
      }
      $.post("data-write/write.php", {payload:data}).done(res=>{
        // console.log("Triggered to save" + res);
        $("#page-corner-anim").fadeIn(200); setTimeout(()=>{ $("#page-corner-anim").fadeOut(300); }, 500);
      }); // post

    }; // save

  load() {
    let hasFilename = $("#opened-filename").text().length>0;
    if( !hasFilename ) { return; }
    let filename = $("#opened-filename").text();

    $.getJSON(`data/${filename}.json`)
    .done(obj=>{
      var {
            textarea="", input="", input2="", 
            beforeATally="", afterAllTally="", 
            formulas=[],
            bookmarkTitles=[],
            bookmarkTokens=[],
          } = (obj.toString().length>2) ? obj:{};

      $("#textarea").val(textarea);
      $("#input").val(input);
      $("#input2").val(input2);
      $("#beforeATally").val(beforeATally);
      $("#afterAllTally").val(afterAllTally);
      
      // $("#textarea").val(decodeURIComponent(textarea));
      // $("#input").val(decodeURIComponent(input));
      // $("#input2").val(decodeURIComponent(input2));
      // $("#beforeATally").val(decodeURIComponent(beforeATally));
      // $("#afterAllTally").val(decodeURIComponent(afterAllTally));

      $(".bookmarks").html("");
      $("#formulas-wrapper").html("");
      // var bookmarks = [];
      if(formulas.length) {
        formulas.forEach(formulaPanel=>{
          var {desc, equation} = formulaPanel;
          var $newDom = $(`
            <div class='formula'><span class='fa fa-close close'>&nbsp;</span><span class='desc' contenteditable></span><br/><span>{ <input class='equation' type='text'></input> } => </span><span class='result'></span></div>
          `);
          $newDom.find(".desc").html(desc);
          $newDom.find(".equation").val(equation);
          // $newDom.find(".desc").html(decodeURIComponent(desc));
          // $newDom.find(".equation").val(decodeURIComponent(equation));
          $("#formulas-wrapper").append($newDom);
        }); // foreach formulaPanel
      } // formulas, if

      // debugger;
      bookmarkTitles.forEach( (title, i) => {
        var token = bookmarkTokens[i];
        // addBookmark({ title: title, token:token });
        addBookmark({ title, token });
      });
      reparseBookmarks();
      tallier();
      evalier();
      
    }); // done
  }; // load

} // SaveLoadSystem

FormulaSystem = class {
    globalize() {
      window.getResult = this.getResult;
      window.evalier = this.evalier;
    }

    constructor() {
      this.globalize();

      this.once();
      this.hooks();

    } // constructor

    once() {
      // Add formula row
      $("#btn-add-formula").on("click", ()=> {
        var newFormula = $("#formula-template").html();
        var $formulas = $("#formulas-wrapper");
        $formulas.append(newFormula);
        setTimeout(save, 200);
      });

      // Formula tips
      $("#btn-tips-formula").on("click", ()=> {
        alert(`Hints
      Use mathematical equations between curly brackets {}.

      The tally number is available to you:
        tally = the tally number below the textarea

      You can get previous results. Notice indices at the eq numbers:
        getResult(0)
        getResult(1)
        getResult(2)
        getResult(3)
      
      You can do many js functions:
        parseInt(..)
        parseFloat(..)
        Math.max(..)
        Math.abs(..)
        ... and so on
      `);
      }); // formula tips
      
    } // once

    hooks() {

      // formula
      $(".formula").whenLive(formula=>{ 
        let $formula = $(formula),
            $title = $formula.find(".desc"),
            $equation = $formula.find(".equation"),
            $close = $formula.find(".close");
            
            $title.on("blur", keyup);
            $equation.on("keyup", keyup);
            $close.on("click", ()=>{
              let title =$title.text();
              if(!confirm(`Are you sure you want to remove formula "${title}"?`)) return false;

              $formula.remove();
              setTimeout(save, 200);
            });
      });

    } // hooks

    getResult(i) {
      return parseFloat($(".formula").eq(i).find(".result").text())
    }

    evalier() {
      
      $(".formula").each((a, el,)=>{ 
        var $formula = $(el),
            $result = $formula.find(".result"),
            equation = $formula.find(".equation").val(),
            result = "";
            try { 
              result = eval(equation); // prevents js from stopping all other lines if fails
            } catch(err) { }

        $result.text(result);
      });
    } // evalier
    
} // FormulaSystem