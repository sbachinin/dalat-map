CRITICAL
    Had to remote-debug by serving from winodws
        therefore:
            develop in windows;
            some commands run on linux 
                and cp results via git
                    copying via terminal breaks crlf:
                        cp -r js /mnt/c/Users/Admin/projects/dalat-map



check adequacy of full_size_promise
    replaceable with wait(0)?

seems that building tap causes touchend and then panel.setSize

any reason for different easing for panel expand and for easeTo?

check freeze after many popstate (served from gh, on xia)

are buildings now conveniently linkable?




need to organize photos, the workflow
    how borrowed get into thumbs/large?
    why not copy the interesting borrowed to "dalat architecture" and thus to originals-other?
    is zoo shown?
    dinh 1 needs photos
        there is 1 photo in borrowed, not processed yet
    also in wsl dalat-map-images repo was deleted and clone failed, hopefully just because of bad connection




    disable map rotation?
        (i guess it won't play well with map limits
        + can be problems with offset)

    is ml version fixed?

would be great to load swiper bundle only when necessary

marking french bldgs via setFeatureState is perhaps performance not nice.   
    try to save isFrenchBldg into tiles

    
    rotated photo

    add "HL" heading with a medal icon

    should 2-col details be allowed on landsc?



    in details, a button to locate the bldg
    ??? open in google?

    user location
    
    panel after-drag animation: quick from start

    after linking imgs done:
        check missing pictures in the resulting meta obj, compare to files
        render all imgs, check broken, dupes and reorder
            render bldg id, img names, look in mobile

    restrict details height
    where else i reset panel scroll pos?
        can be broken

    ghost in mercure: needs a historical brother
        IMG_4783~2




to think:
return to hash
    use id in url only when "copying link" and on page init
    BUT: does it mean that when the bldg is opened (photos seen in the panel but map is panned away), refresh -> bldg photos lost




GOOD TO HAVE
    IF IT'S EASY:
        rm sel bldg from url when panel collapsed
        restore it to url when expanded
        REASON WHY:
            now if you open a buliding, -> collapse panel, -> forget the bldg, -> refresh, -> forgotten bldg gets focused and it makes little sense. Doesn't look like a big problem

    originals, including "borrowed" should be gitignored.
        Backed up via google photos

    look in pinterest














    a lot of old crappy photos:
        https://bois.com.vn/bo-suu-tap-100-tam-anh-biet-thu-co-da-lat-xua/

    write to thi tuan, can they provide photos / info?