To populate ids_to_imgs entry in localstorage,
where i keep info about what images belong to which building:

open dev tools.
drop image on a building.
check console for errors;
if operation is successful, console prints how many entries are there in ids_to_imgs

update handmade_data.mjs:
    window.get_updated_buildings_data()
    copy the returned value to clipboard
    replace french_bldgs_handmade_data
    then a bit of shit:
        run find_french_impostors to see if some non-french weren't added as french
            if impostors found, manually move them to non_french_handmade_data