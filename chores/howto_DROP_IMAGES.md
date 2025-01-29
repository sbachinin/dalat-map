To populate ids_to_imgs entry in localstorage,
where i keep info about what images belong to which building:

open dev tools.
drop image on a building.
check console for errors;
if operation is successful, console prints how many entries are there in ids_to_imgs

update handmade_data.mjs:
    window.get_updated_buildings_data()
    copy the returned value to clipboard
    paste into handmade_data.mjs