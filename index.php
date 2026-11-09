<?php require("nocache.php");
      require("dates/date-headers.php");
?><!DOCTYPE html>
<html lang="en">
  <head>
   <title>Persistent Tally</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

    <!-- jQuery and Bootstrap  -->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
    
    <!-- LiveQuery -->
    <script src="vendor/jquery.whenlive.js"></script>
    <script src="assets/js/libs/trigger-when-stop-typing.js"></script>
    <script src="assets/js/libs/multisearch-textarea.js"></script>

    <!-- JS -->
    <script src="assets/js/formula-views.js?v=<?php echo time(); ?>"></script>
    <script src="assets/js/app.js?v=<?php echo time(); ?>"></script>
    <script src="assets/js/backup.js?v=<?php echo time(); ?>"></script>
    <script src="dates/date.js?v=<?php echo time(); ?>"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/index.css?v=<?php echo time(); ?>">

</head>
    <body>
        <div class="container" style="position:relative;">
        <h3 onclick="window.location.href='index.php'" style="cursor:pointer; display:inline-block;">Persistent Tally</h3>

          <div id="app">
            <div id="app-desc">This is a flexible text editor that has built-in saving, tallying, formulas, and bookmarks. 
              <a href="?open=sample1">Sample 1</a>. 
              <a href="?open=sample2">Sample 2</a>.
          </div>
            <!-- <br/> -->

            <div id="dates" style="margin-top:1.25rem; margin-bottom:0.5rem;"><?php 
              require("dates/date-printer.php");
            ?></div><br id="dates-spacer-bottom" />

            <div id="warning-localhost" class="hide" style="color:orange; padding:10px; border: 1px solid orange; margin-bottom:30px;">WARNING: This is on localhost. We recommend using the online version so you have access to the most updated content on all devices.</div>

            <div id="textarea-wrapper" style="position:relative;">

              <div class="buttons" style="position:absolute; top:-1.25rem; left:3px">
                  <i class="fa fa-print clickable" onclick="openPrintDialogue();"></i>
                  <span>&nbsp;&nbsp;&nbsp;</span>
                  <i class="fa fa-copy clickable" onclick="selectAndCopyTextarea($('#textarea'), $('#status-textarea-copied'))"></i>
                  <span>&nbsp;<span class="vertical-bar">&nbsp;&nbsp;|&nbsp;</span>&nbsp;</span>
                  <i class="fa fa-save clickable" onclick="saveByUser();"></i>
                  <span>&nbsp;&nbsp;</span>
                  <span style="padding:5px; border-radius:2.5px; background-color:darkorange; position:relative">
                    <span id="dropdown-openable-wrapper" class="hide" style="position:absolute; bottom:3px; left:24px">
                      <select style="width: 200px;">
                        <option>- Select file -</option>
                      </select>
                    </span>
                    <i class="fa fa-folder-open clickable" onclick="loadByUser();" onmouseover="loadByUser();"></i>
                    <span id="opened-filename" style="margin-right:5px;"></span>
                  </span>
              </div>

              <div id="page-corner-anim" style="display: none; position: absolute; top:-2px; right:3px; font-weight:400; background-color:yellow; border: 1.5px solid orange; border-radius:2.5px; padding-left: 5px; padding-right:5px; padding-top:2.5px; padding-bottom:2.5px;
                ">Saved!</div>
              <textarea id="textarea" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="margin-top:1.25rem;"></textarea>
            </div>
            <span class="text-info bg-info" id="results-wrapper">
              <b>Tallied:&nbsp;</b>
              <span id="results">0</span>
            </span><br/>
            <span id="counter-wrapper">
              <b>Count:&nbsp;</b>
              <span id="counter">0</span>
            </span>
            <div style="margin-top:5px"></div>
            <span>
              <span style="font-weight:800;">Status: </span>
              <span id="status"><span style="color:gray">Empty. You can display calculation highlights here with the formula $("#status").text(_TO_DISPLAY_).</span></span>
            </span>
            
            <hr/>

            <div id="formula-views-bar" class="hide">
              <span id="formula-view-normal">
                <span class="fa fa-eye" title="Formula view"></span>
                <select id="formula-view-select"><option value="">Original</option></select>
                <a href="javascript:void(0)" id="formula-view-rearrange" title="Drag formulas into a saved view (getResult indices stay the same)"><span class="fa fa-arrows-v"></span><span>&nbsp; Rearrange</span></a>
                <a href="javascript:void(0)" id="formula-view-rename" class="hide" title="Rename view"><span class="fa fa-pencil"></span></a>
                <a href="javascript:void(0)" id="formula-view-delete" class="hide" title="Delete view"><span class="fa fa-trash"></span></a>
              </span>
              <span id="formula-view-rearranging" class="hide">
                <span class="text-muted">Drag rows to rearrange.</span>
                <a href="javascript:void(0)" id="formula-view-save"><span class="fa fa-check"></span><span>&nbsp; Save view</span></a>
                <a href="javascript:void(0)" id="formula-view-cancel"><span class="fa fa-close"></span><span>&nbsp; Cancel</span></a>
              </span>
            </div>
            <div id="formula-view-list"></div>

            <div id="formulas-wrapper"></div>

            <div id="options-bottom-right-off" style="margin-top:18px;">
              <a href="javascript:void(0)" id="btn-open" style="margin-right:20px;"><span class="fa fa-download"></span><span>&nbsp; Open</span></a>
              <a href="javascript:void(0)" id="btn-add-formula" style="margin-right:20px;"><span class="fa fa-plus"></span><span>&nbsp; Add formula</span></a>
              <a href="javascript:void(0)" id="btn-tips-formula" style="margin-right:20px;"><span class="fa fa-question"></span><span>&nbsp; Some tips</span></a>
              <a href="javascript:void(0)" id="info-backup-as" onclick="downloadChain();"><span class="fa fa-save"></span><span>&nbsp; Backup</span></a>

              <template id="formula-template">
                <div class="formula"><span class='fa fa-close close clickable'>&nbsp;</span><span class="desc" contenteditable="">Untitled formula</span><br/><span>{ <input class="equation" type="text" value=""> } =&gt; </span><span class="result"></span></div>
              </template>
            </div>

            <hr/>         

            <div class="bookmarks-wrapper">
                <div id="options-bookmark-jump">
                    <span>
                      <a href="#" id="add-parser" style="font-size:14px;"><span class="fa fa-plus"></span>&nbsp; Bookmarks</a>
                    </span>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    <span>
                        <a href="javascript:void(0);" onclick="$('html,body').animate({scrollTop: 0});"><span class="fa fa-caret-square-o-up"></span></a>
                        <span>&nbsp;</span>
                        <a href="javascript:void(0);" onclick="$('html,body').animate({ scrollTop: $('#options-bookmark-jump').offset().top });"><span class="fa fa-caret-square-o-down"></span></a>
                    </span>
                </div>
                <div class="bookmarks">
                </div> <!-- cb's -->
            </div> <!-- cb wrapper -->

            <hr/>

            <div class="input-form">
              <label for="input">Notes: Describe recent situations</label>
              <textarea id="input" type="text"></textarea>
            <div style="width:1px; height:5px;"></div>
            </div>
            <div class="input-form">
              <label for="input" style="color:#9ba8b8;">Notes: How to use, Big picture of this tally, etc</label>
              <textarea id="input2" type="text" style="color:#9ba8b8;"></textarea>
            </div>
            <div style="width:1px; height:5px;"></div>
            </div>
            <div class="input-form">
              <label for="input" style="color:#9ba8b8;">Before Tally Line: Run code before tallying at each line (lets you set read/write variable <i>num</i>, and read <i>matched</i> and <i>line</i>. Variable num is the number that gets calculated from the line's first characters and added to the tally. Variable matched is the text that gets parsed before evaluating into num. You can alert or console the variable.):</label>
              <textarea id="beforeATally" type="text" style="color:#9ba8b8;"></textarea>
            </div>
            <div class="input-form">
              <label for="input" style="color:#9ba8b8;">After Tally Line: Run code after tallying all lines (lets you set read/write variable <i>tally</i>):</label>
              <textarea id="afterAllTally" type="text" style="color:#9ba8b8;"></textarea>
            </div>
            <br/>
            <div id="info-jump-line-container">
                <button id="jump-to-line-btn" style="cursor: pointer;"><span class="fa fa-file-text-o" style="cursor: pointer;"></span> Find text</button>
                <input id="jump-to-line" class="toolbar" type="text" placeholder="" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="width:180px;" />
                <span>&nbsp;</span>
                <button id="jump-to-line-clear">Clear</button>
            </div>

            <div id="mobile-flushed-bottom"></div>
        </div> <!-- /.container -->

        
        <!-- Designer: FontAwesome -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.5.0/css/font-awesome.min.css">

        <!-- Mobile: jQuery UI, jQuery UI Touch Punch -->
        <link href="//code.jquery.com/ui/1.11.3/themes/ui-lightness/jquery-ui.css" rel="stylesheet"/>
        <script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery-ui-touch-punch@0.2.3/jquery.ui.touch-punch.min.js"></script>
       
        <!-- Bootstrap JS -->
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

    </body>
</html>