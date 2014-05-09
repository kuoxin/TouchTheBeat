<div class="container">
    <div class="alert alert-info alert-dismissable" id="alert_tracknotfound" style="display:none;">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        <div id="alert_tracknotfound_text"><strong>Track not found!</strong> Use a Soundcloud URL in this format: https://soundcloud.com/artist/track.</div>
    </div>
    <div id="trackselection">    
        <h3>Enter a link to a <a href="http://soundcloud.com/">Soundcloud</a>-Track to start:</h3>
        <div class="input-group">
            <input type="text" class="form-control" id="input_entertrack" placeholder="Paste Soundcloud URL here (https://soundcloud.com/artist/track)">
            <span class="input-group-btn">
                <button class="btn btn-default" type="button" id="btn_recommendedtrack"><span class='glyphicon glyphicon-random'></span></button>
                <button class="btn btn-primary" type="button" id="btn_entertrack">Select this track!</button>
            </span>
        </div>
    </div>

    <div class="row" id="trackinfo" style="display: none">
        <div class="col-md-3">
            <center>
                <img id="infoImage" src="">
                <div id="infoArtist"></div>
                <div id="infoTrack"></div>
            </center>
        </div>
        <div class="col-md-9" id="instructions">
            <h3>Great!</h3>
            <p>You selected a track from Soundcloud. You can now add the following GameObjects by pressing the corresponding keys in time:</p>
            <ul>
                <li>TapObject - <strong>space</strong></li>
                <li><i>more to come...</i></li>
            </ul>

            <button class="btn btn-primary pull-right" type="button" id="btn_gameobjectpanel">I'm ready to roll!</button>
            <div class="progress" id="progress" style="display:none">
                <div class="progress-bar lg" id="progressbar" role="progressbar" style="width: 0%;"></div>
            </div>

        </div>

        <div class="col-md-9" id="publish" style="display: none">
            <h3>Allright! Let's finish this.</h3>
            <p>All your gameobjects have been recorded correctly. You can now give a name to your level and publish it.</p>
            <div class="input-group">
                <input type="text" class="form-control" id="levelname">
                <span class="input-group-btn">
                    <button class="btn btn-primary" type="button" id="btn_publish">Publish!</button>
                </span>
            </div>
        </div>

        <div class="col-md-9" id="finished" style="display: none">
            <h3>Congratulations! Your level has been uploaded successfully.</h3>
            <p>You can now play your level by pressing the button below.</p>
            <button class="btn btn-primary pull-right" type="button" id="btn_playnow">Play now!</button>
        </div>

    </div>
</div>
</div>
<audio id="player" controls="" preload="auto" autobuffer class="hidden"></audio>
</div>

<script src="http://connect.soundcloud.com/sdk.js"></script>
<script src="js/levelgenerator.js"></script>