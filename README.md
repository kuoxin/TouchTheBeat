
TouchTheBeat
============

TouchTheBeat is a HTML5 multi-touch game currently in development. 

###Quick Links
- **current stable version**: http://ttb.coloreddrums.de/latest
- **Trello** development board: https://trello.com/b/uJHkG6xQ/

###The Game
TouchTheBeat is **level-based**. Each level consists of a song and a composition of interactive objects. The objects can be either tapped ~~, hold, dragged or slided~~ _(soon)_. The more **rhythmically accurate** you interact with the objects, the more points you get in the end.

###The Level-Builder
You can easily create your own levels by using any **SoundCloud track** as music for your level. When finished, you might share and exchange your levels online in text-format. This way it is easy to **play levels created by others**.

###Development
TouchTheBeat is currently in active development. I am using Trello to organize feature-ideas and development progress. You can influence the further development by voting for features or commenting on them. Click on the screenshot below to get started:
[<img src="https://trello.com/b/uJHkG6xQ.png">](https://trello.com/b/uJHkG6xQ)

###Dependencies:

TouchTheBeat uses the following **third party services**:
- **'audio streaming service' offered by SoundCloud Limited**, a company incorporated under the laws of England & Wales and with its main place of business at Rheinsberger Str. 76/77, 10115 Berlin, Germany. More information about SoundCloud is available here: https://soundcloud.com/imprint 

I may not be associated with any of these third party services or content provided by them.

TouchTheBeat uses and contains the following **software components** under their respective licenses:

- **jQuery** JavaScript Library v1.10.1, http://jquery.com/, Includes Sizzle.js http://sizzlejs.com/ Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors Released under the MIT license
- **Underscore.js** 1.6.0 http://underscorejs.org (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors MIT license.
- **Backbone.js** 1.1.2 http://backbonejs.org (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors MIT license
- **RequireJS** 2.1.13 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved. Available via the MIT or new BSD license. see: http://github.com/jrburke/requirejs for details
- **RequireJS text** 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved. Available via the MIT or new BSD license. see: http://github.com/requirejs/text for details
- **Bootstrap** v3.2.0 (http://getbootstrap.com) Copyright 2011-2014 Twitter, Inc. Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
- **Snap.svg** 0.3.0 Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved. Licensed under the Apache License, Version 2.0 ; http://www.apache.org/licenses/LICENSE-2.0
- **TV4.js** Author: Geraint Luff and others Year: 2013 This code is released into the "public domain" by its author(s).  Anybody may use, alter and distribute the code without restriction.  The author makes no guarantees, and takes no liability of any kind for use of this code. If you find a bug or make an improvement, it would be courteous to let the author know, but it is not compulsory.

###Build

To build the compressed version of TouchTheBeat, run the folliowing command
```
node r.js -o build.js
```