TouchTheBeat [![Build Status](https://travis-ci.org/TouchTheBeat/TouchTheBeat.svg?branch=master)](https://travis-ci.org/TouchTheBeat/TouchTheBeat)
============

TouchTheBeat is a HTML5 multi-touch rhythm game currently in development. 

###Quick Links
- **current alpha version**: https://touchthebeat.github.io/TouchTheBeat/latest/
- **latest development build**: https://touchthebeat.github.io/TouchTheBeat/edge/master/

###The Game
TouchTheBeat is **level-based**. Each level consists of a song and a composition of interactive objects. The objects can be either tapped ~~, hold, dragged or slided~~ _(soon)_. The more **rhythmically accurate** you interact with the objects, the more points you get in the end.

###The Level-Builder
You can easily create your own levels by using any **SoundCloud track** as music for your level. When finished, you might share and exchange your levels online in text-format. This way it is easy to **play levels created by others**.

###Development
TouchTheBeat is currently in active development. We are using GitHub Issues to organize feature-ideas and development progress. You can influence the further development by opening or commenting on an issue. 

###Dependencies:

TouchTheBeat uses the following **third party services**:
- **'audio streaming service' offered by SoundCloud Limited**, a company incorporated under the laws of England & Wales and with its main place of business at Rheinsberger Str. 76/77, 10115 Berlin, Germany. More information about SoundCloud is available here: https://soundcloud.com/imprint 

We may not be associated with any of these third party services or content provided by them.

TouchTheBeat uses and/or contains the following **software components** and **resources** under their respective licenses:

- **jQuery** JavaScript Library v2.1.1, http://jquery.com/, Includes Sizzle.js http://sizzlejs.com/ Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors Released under the MIT license
- **Underscore.js** 1.6.0 http://underscorejs.org (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors MIT license.
- **Backbone.js** 1.1.2 http://backbonejs.org (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors MIT license
- **RequireJS** 2.1.15 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved. Available via the MIT or new BSD license. see: http://github.com/jrburke/requirejs for details
- **RequireJS text** 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved. Available via the MIT or new BSD license. see: http://github.com/requirejs/text for details
- **Bootstrap** v3.2.0 (http://getbootstrap.com) Copyright 2011-2014 Twitter, Inc. Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
- **Snap.svg** 0.3.0 Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved. Licensed under the Apache License, Version 2.0 ; http://www.apache.org/licenses/LICENSE-2.0
- **TV4.js** Author: Geraint Luff and others Year: 2013 This code is released into the "public domain" by its author(s).  Anybody may use, alter and distribute the code without restriction.  The author makes no guarantees, and takes no liability of any kind for use of this code. If you find a bug or make an improvement, it would be courteous to let the author know, but it is not compulsory.
- **CryptoJS** v3.1.2 https://code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott. All rights reserved. https://code.google.com/p/crypto-js/wiki/License
- **Backbone.Select** v1.2.8 http://github.com/hashchange/backbone.select Copyright (c) 2014 Michael Heim (c) 2013 Derick Bailey, Muted Solutions, LLC. Distributed under MIT license
- **backbone.paginator** 2.0.0 http://github.com/backbone-paginator/backbone.paginator Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors Licensed under the MIT @license.
- **bootstrap-sweetalert** https://github.com/hstolte/bootstrap-sweetalert Copyright (c) 2014 Tristan Edwards Licensed under MIT License
- **Material Design Icons** https://github.com/google/material-design-icons/ released under an [Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/) license.

###Build

To build a compressed version of TouchTheBeat perform the following steps.

- Ensure you have installed [Node.js](https://nodejs.org/), [Grunt](http://gruntjs.com/) (along with grunt-cli!) and [Bower](http://bower.io/).
- Run `` npm install ``.
- Create the file ``config.js`` in ``src/js``. You can refer to ``config.sample.js`` (in the same directory).

Now you can run the following grunt tasks:

| command | description |
|---------|-------------|
|``grunt lint``|runs jshint code analysis and logs the results to the console|
|``grunt build``|creates a minified build in the ``dist/`` directory|
|``grunt buildDocs``|generates the docs from the code's comments to the ``docs/`` directory|
|``grunt update``|updates the bower dependencies and also automatically adjusts the requirejs paths configurtaion in ``app/main.js``|

There also exist several grunt-sub-tasks and a set of tasks used for continuous integration and deployment in Travis Ci.

##Contributing
We are happy if you want to help us developing TouchTheBeat. Feel free to open (or comment on) an [issue](https://github.com/TouchTheBeat/TouchTheBeat/issues) and make pull-requests.
