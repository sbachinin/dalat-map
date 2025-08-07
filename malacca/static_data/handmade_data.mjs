import { AREA_TYPES } from "../../js/common_drawing_layers/constants.mjs"
import { bldgs_handmade_data } from "./bldgs_handmade_data.mjs"

/*
    {
        images: string[],
        
        title,

        viet_title,

        subtitle, // TODO show them;
        // but it's complicated;
        // i need to push subtitles down with text-offset
        // but titles' height is variable so text-offset has to be too

        description,
      
        links: string[],

        title_coords (for areas with complex geometry where centroid looks bad),
        
        area_type (for areas),
        
        myhint,

        symbol-sort-key: number, // copied as such to titles' geojson props

        doubt: bool // is it really colonial?

        year: number
    }
*/

export const land_areas_handmade_data = {
    // !!! empty items are needed here in order to generate land_areas tile layer
    17961173: {
        title: 'Bukit Cina\n(ancient chinese\ncemetery)',
        title_coords: [102.257651, 2.200041]
    },
    945813623: {
        // forest around st john's fort
    },

    242010620: {
        title: 'Bukit Serindit\n(old Christian\ncemetery)',
    },

    1419914017: {
        title: 'Japanese\noccupation\nMemorial'
    },

    1293044462: {
        title: 'Dutch\ngraveyard',
    },

    286023454: {
        title: 'Mausoleum of\nHang Jebat',
    },

    712550643: {
        // ayer salak cemetery
    },
    905284499: {
        title: 'Prison\nmuseum',
    }
}

export const lakes_handmade_data = {
    
}

export const all_handmade_data = {
    ...bldgs_handmade_data,
    ...land_areas_handmade_data,
    ...lakes_handmade_data
}

Object.keys(all_handmade_data).forEach((feat_id) => {
    all_handmade_data[feat_id].id = feat_id
})