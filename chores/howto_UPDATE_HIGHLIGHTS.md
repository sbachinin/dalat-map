TODO
the following is out of date
Need to sort out the process first
I'm not sure if it's really that important to keep hl in their dedicated folder, 
    and to maintain strict correspondence btw highlights array and folder.
    At runtime highlights images are taken from common (large/thumbs) folder anyway.
    Only concern is that all strings in highlights array point to existing file in large/thumbs folders.
    Having something extra/missing in src/highlights folder isn't exactly a big problem I guess

Download highlights from google photos
Empty cities_images/<city>/src/highlights folder
Copy newly downloaded images to ^
Retrieve order of highlights (see chores/howto_retrieve_order_of_highlights.js)
node validate_highlights.mjs city=[city]
