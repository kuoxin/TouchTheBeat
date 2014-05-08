<?php
error_reporting(E_ALL ^ E_NOTICE);
$page = $_GET['p'];
if ($page == null)
    $page = "home";
?>
<!DOCTYPE html>
<html>
    <!-- DEBUG: https://soundcloud.com/user859035069/magistratsabteilung-35-1 -->
    <head>
        <meta charset="utf-8">
        <title>TouchTheBeat - <?php echo $page; ?></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.1.js"><\/script>')</script>
        <script src="js/vendor/bootstrap.min.js"></script>

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
        </style>
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
    </head>
    <body>
        <div class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="index.php">TouchTheBeat</a>
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li <?php if ($page == 'home') echo 'class="active"'; ?>><a href="index.php">Home</a></li>
                        <li <?php if ($page == 'play') echo 'class="active"'; ?>><a href="index.php?p=play">Play</a></li>
                        <li <?php if ($page == 'levelgenerator') echo 'class="active"'; ?>><a href="?p=levelgenerator">Level Generator</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">About <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Development Blog</a></li>
                                <li><a href="#">Roadmap</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li class="divider"></li>
                                <li class="dropdown-header">Nav header</li>
                                <li><a href="#">Separated link</a></li>
                                <li><a href="#">One more separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                    <!--<form class="navbar-form navbar-right">
                      <div class="form-group">
                        <input type="text" placeholder="Email" class="form-control">
                      </div>
                      <div class="form-group">
                        <input type="password" placeholder="Password" class="form-control">
                      </div>
                      <button type="submit" class="btn btn-success">Sign in</button>
                    </form>-->
                </div><!--/.navbar-collapse -->
            </div>
        </div>

        <?php
        if (file_exists('content/' . $page . '.php'))
            include 'content/' . $page . '.php';
        else
            include 'content/404.php';
        ?>

        <hr>
        <div class="container">  
            <footer>
                <p>&copy; <a href="http://coloreddrums.de" target="_blank">coloreddrums</a> 2014 <a class="pull-right" href="http://soundcloud.com"><img src="img/powered_by_black.png"></img></a></p>
            </footer>
        </div>
    </body>
</html>
