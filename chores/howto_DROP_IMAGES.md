To populate ids_to_imgs entry in localstorage,
where i keep info about what images belong to which building:

open dev tools.
drop image on a building.
check console for errors;
if operation is successful, console prints how many entries are there in ids_to_imgs

copy to french_buildings_meta.mjs:
    window.merge_imgs_data_into_meta()
    copy to clipboard the contents of window.french_building_details
    paste into french_buildings_meta.mjs