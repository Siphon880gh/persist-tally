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
    <script src="//raw.githack.com/tkambler/whenLive/master/src/jquery.whenlive.js"></script>
    <script src="assets/js/libs/trigger-when-stop-typing.js"></script>
    <script src="assets/js/libs/multisearch-textarea.js"></script>

    <!-- JS -->
    <script src="assets/js/app.js?v=<?php echo time(); ?>"></script>
    <script src="assets/js/backup.js?v=<?php echo time(); ?>"></script>
    <script src="dates/date.js?v=<?php echo time(); ?>"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/index.css">

</head>
    <body>
        <div class="container" style="position:relative;">
        <h3>Persistent Tally</h3>
        <h6 style="font-weight:400;" ><?php 
            require("dates/data-printer.php");
        ?></h6>

          <div id="app">
            <div><b>Sum up negative and positive numbers on each line (you may add notes after it on the same line). And this saves persistently so helps you over long run to tally up.</b></div>

            <div id="textarea-wrapper" style="position:relative;">
              <div id="page-corner-anim" style="display: none; position: absolute; top:3px; right:3px; font-weight:400; background-color:yellow; border: 1.5px solid orange; border-radius:2.5px; padding-left: 5px; padding-right:5px; padding-top:2.5px; padding-bottom:2.5px;
                ">Saved!</div>
              <textarea id="textarea" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="## some desc
## some desc"></textarea>
            </div>
            <span class="text-info bg-info" id="results-wrapper">
              <b>Tallied:&nbsp;</b>
              <span id="results">0</span>
            </span><br/>
            <span id="counter-wrapper">
              <b>Count:&nbsp;</b>
              <span id="counter">0</span>
            </span>

            <br/><br/>
            <div>
              <span style="font-weight:800;">Status: </span>
              <span id="status"><span style="color:gray">You can display statuses or results here with the code $("#status").text(....) from any run code input fields.</span></span>
            </div>
            <hr/>

            <div class="input-form">
              <label for="input">Notes: Describe recent situations (such as recently subtracted):</label>
              <textarea id="input" type="text"></textarea>
            <div style="width:1px; height:5px;"></div>
            </div>
            <div class="input-form">
              <label for="input" style="color:#9ba8b8;">Notes: Describe big picture situations:</label>
              <textarea id="input2" type="text" style="color:#9ba8b8;"></textarea>
            </div>
            <div style="width:1px; height:5px;"></div>
            </div>
            <div class="input-form">
              <label for="input" style="color:#9ba8b8;">Event: Run code before tallying at each line (lets you set read/write variable <i>num</i> and read <i>line</i>):</label>
              <textarea id="beforeATally" type="text" style="color:#9ba8b8;"></textarea>
            </div>
            <div class="input-form">
              <label for="input" style="color:#9ba8b8;">Event: Run code after tallying all lines (lets you set read/write variable <i>tally</i>):</label>
              <textarea id="afterAllTally" type="text" style="color:#9ba8b8;"></textarea>
            </div>
            <br/>
            <div id="info-jump-line-container">
                <button id="jump-to-line-btn" style="cursor: pointer;"><span class="fa fa-file-text-o" style="cursor: pointer;"></span> Find text</button>
                <input id="jump-to-line" class="toolbar" type="text" placeholder="" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="width:180px;" />
                <span>&nbsp;</span>
                <button id="jump-to-line-clear">Clear</button>
            </div>

            <hr/>

            <div id="formulas-wrapper"></div>

            <div id="options-bottom-right-off" style="margin-top:18px;">
              <span class="clickable" id="btn-add-formula" style="margin-right:20px;"><span class="fa fa-plus"></span><span>&nbsp; Add formula</span></span>
              <span class="clickable" id="btn-tips-formula" style="margin-right:20px;"><span class="fa fa-question"></span><span>&nbsp; Some tips</span></span>
              <span class="clickable" id="info-backup-as" onclick="downloadChain();"><span class="fa fa-save"></span><span>&nbsp; Backup</span></span>

              <template id="formula-template">
                <div class="formula"><span class='fa fa-close close clickable'>&nbsp;</span><span class="desc" contenteditable="">Untitled formula</span><br/><span>{ <input class="equation" type="text" value=""> } =&gt; </span><span class="result"></span></div>
              </template>
            </div>

            <hr/>            

            <div class="bookmarks-wrapper">
                <div id="options-bookmark-jump">
                    <span>
                        <span style="font-size:1.3rem;">Bookmarks</span>
                        <a href="#" id="add-parser"><span class="fa fa-plus"></span></a>
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

            <div id="mobile-flushed-bottom"></div>
        </div> <!-- /.container -->

        
        <!-- Designer: FontAwesome -->
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.css">

        <!-- Mobile: jQuery UI, jQuery UI Touch Punch -->
        <link href="//code.jquery.com/ui/1.11.3/themes/ui-lightness/jquery-ui.css" rel="stylesheet"/>
        <script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
       
        <!-- Bootstrap JS -->
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

    </body>
</html>