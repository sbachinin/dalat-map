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


hue: mark also all hue unesco sites (Arena!)  https://whc.unesco.org/en/list/678/maps/#map


year can be number or string; better do it string only


handle new dalat pictures (dalat extra album)

indicate that bldg is dead in bldg details
selected dead bldg style


better ways to show very compact bldg details?



desk-portr: images shrink even when enough space for big



? make non-french clickable, showing at least wiki and ggl
	there are many places in wikipedia, linked from here:
		https://vi.wikipedia.org/wiki/L%C4%83ng_Nguy%E1%BB%85n_H%E1%BB%AFu_H%C3%A0o


indicate better the geometry that was just chosen




MAKE BLDGS MORE EASILY CLICKABLE AT LOW Z
    ? extend clickable area









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


can i release it as modules?



WHAT TO TEST ON OTHER DESKTOPS/LAPTOPS
absense of easeTo animation (I assumed it's my comp's glitch. If it's not, have to provide the animation).



Panel initially expands before map has finished drawing itself.
	At least that's what I observed on safari from ghpages.
	I assumed that on('idle') fixes this but not.
	Solutions suggested by AI are complicated.
	Can basically just increase the timeout for panel expand, idk.



user location



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


PERF
	Load fonts (So far only Merriweather) only before panel is opened

	Minimize, Remove dev artifacts
		DEV folder
		comments


Add buildings links to handmade data


Portrait mob: only buttons in building details? align them vertically


Consider panel when disabling the flyto button

extra ugly blinking scrollbar in ff, landscape desktop (when entering the panel with cursor)
	solutions from ai didn't work ({scrollbar-width: auto/thin})




try handle pswp close on desktop, providing fadeout
	but only if there are pswp options to disable closing func



fadein lazy loader
	because it blinks badly sometimes


easeTo on bldg select is ugly because of loading tiles


sometimes laggy panel reveal from github
	already took measures:
		panel is initialized on 'idle',
			need to TEST the effect later from github
	Other possible improvements:
		request less thumbs
		|| request them only after panel finished expanding







Add a chore that validates the links in handmade data, makes sure they ar not broken


show in which language is wikipedia link


On hover highlights thumbs, draw a line to a bldg polygon if it's visible


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




















some possible domains
    mapofcities.com
    somegoodarchitecture
    wayofarchitecture.com

    whatwasbuilt.com

    humanbuildings.org / net

    architecturalshock.com

    badmaps.org
    ohmymap.org

    mapfulness (there is some shit company with this name)

    mapsforjoy
    atlasofcities
    mapsforhumans