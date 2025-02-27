CRITICAL
    Had to remote-debug by serving from winodws
        therefore:
            develop in windows;
            some commands run on linux 
                and cp results via git
                    copying via terminal breaks crlf:
                        cp -r js /mnt/c/Users/Admin/projects/dalat-map

**********************************************************************************


IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
IMPORTANT
MPORTANT



SLIDER

	scroll thumbs list as pswp changes?
		or at least switch to fade animation on pswp close?
		on('change', () => scrollLeft/Top = lb.pswp.currentIndex


	alongside thumbs on large landscape
	
	desktop: try fadein
	


Try slideable panel from swiper;
	if not, remove swiper's remains








button zoom with open panel -> should consider panel
	(or just remove the button huh)


can i find de marie good photos?

ui goodie: on desktop, on hover thumb, show a link to "go to bldg"



low-zoom tile size:
    ensure no roads and no secondary buildings, check size diff


MAKE BLDGS MORE EASILY CLICKABLE AT LOW Z
    ? extend clickable area


PRIORITY OF TITLES
    - those visible at low z must remain at higher z,
        - need a classification of importance, ideally to show (auto) as much as there is space
    - selected should be protected from disappearance
        symbol-z-order:
            1) check if it works at all
                (is it only per-layer btw? Though french might be enough)
            2) ensure that it's not adjustable by feature state
            3) try to create another layer/source with selected title & title+square


sort out highways
    remove unused props from json




OTHER PANEL CONTENT
	are buildings now conveniently linkable?


	Some bldgs need at least some info:
		google link or wikipedia link
			bao dai 1, 3

	add "HL" heading with a medal icon
	google link, wikipedia, "fly to bldg", copy link,
      	bldg name, ?suggest an edit




PANEL EXPAND EASING CURVE - more dynamic
    how this curve plays with map.easeTo?
    after-drag: quick from start, spring-like
	any 3rd party solutions for panels?
    




SORT OUT HOW TO SHOW 1-IMG DETAILS





**** 
CLASSIFY BLDGS
A lot of kinds of bldgs that need diff rendering and diff interaction:
	french
		first-class and not
		titled and not
	dead french
	maybe french
	non french




Check all boring titles positions
	Fix them
	Are there any left that need to be rendered under?





PHOTOS WORKFLOW
    merge images scripts into one build_images
            (generate, check if all used etc)    
    How to add new without rebuilding all?
    How much i borrow?
        (very possible that little)
            dinh 1,3? More Domaine? Ankroet? Just a google link might better, need think
        Currently, i remember only zoo
            (pics are already shown but they are not processed)
        If a lot,
            Should i keep borrowed in a separate folder?
                If y,
                    need to fix imggen script


? one build script


is ml version fixed?

would be great to load swiper bundle only when necessary





========================================================================

NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE
NICE TO HAVE


user location

swipe down - close slider (my intuitive gesture)


MAKE NON-FRENCH with details CLICKABLE
	A bunch of bldgs from non_french_bldgs_handmade_data have images but not clickable and not selectable
	E.g., ana mandara big elegant bldg,
		light green one near weird tower
	First decide how many of detailful non-french I have - it will add complexity and must be justified



RENDER DOUBT
	Currently there are 2 possible source of truth about doubt:
	1) maybe_french_colonial in osm (these are just ignored now)
	2) doubt prop in handmade data (i like this more)
	

IF IT'S EASY:
        rm sel bldg from url when panel collapsed
        restore it to url when expanded
        REASON WHY:
            now if you open a buliding, -> collapse panel, -> forget the bldg, -> refresh, -> forgotten bldg gets focused and it makes little sense. Doesn't look like a big problem


should check:
	bldgs with 0-length images array may get dark border




perhaps render a star for bldgs from "highlights"


OPTIMIZE FOR_RUNTIME DATA
	** todos in script files


tiny_non_french_square is used by datanla and cable car
    should be renamed at least


ankroet

dont' add ana mandara geometry to tiles
    (if it still happens)


CURSOR_POINTER_MINZOOM - adequate?


check adequacy of full_size_promise
    replaceable with wait(0)?













UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED
UNCATEGORIZED

peaks and land areas titles are still in other layers

minzoom:
    (IF GOOD A CONCEPT)
    works only for land_areas,
    need for all titles









    
    
    
    


        
    
    
    a lot of old crappy photos:
        https://bois.com.vn/bo-suu-tap-100-tam-anh-biet-thu-co-da-lat-xua/
    
    write to thi tuan, can they provide photos / info