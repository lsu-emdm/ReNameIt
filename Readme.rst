ReNameIt (renoate part 2: Electric Boogaloo)
============================================
Webserver (and other utilities) for the automated, crowd-sourced encoding of music

Installation and Running
------------------------

1. See the next section to ensure dependencies are installed
2. ``npm install``
3. ``npm start`` to start the webserver (on port 8080)

Dependencies
------------
1. Node.js (running the webserver and task scheduler)
2. ``npm`` Package manager for Node.js
3. ``python`` > 3.4 and the Python package manager of your choice
   (``pip`` or ``conda``). Needed to run librosa
4. Librosa
5. An installation of MongoDB

Folder Structure
----------------

- ``static/`` statically served client web pages
- ``uploads/`` base directory for submitted audio jobs
- ``Makefile`` small development scripts (like clearing local submitted audio jobs)
