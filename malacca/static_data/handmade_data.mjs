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
        title_coords: [102.257651, 2.200041],
        area_type: AREA_TYPES.CEMETERY
    },

    12402718: {
        title: `Int.
            Airport`,
        area_type: AREA_TYPES.AIRPORT
    },

    383045382: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    1314696672: {
        title: `Methodist
        School`,
        area_type: AREA_TYPES.INSTITUTION
    },

    925801043: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    925802509: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    636067905: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    925801044: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    8052958: {
        title: `Recreational
        Park`,
        title_coords: [102.268472, 2.202818]
    },

    506618260: {
        title: 'Cemetery',
        title_coords: [102.262574, 2.261456],
        area_type: AREA_TYPES.CEMETERY
    },


    17961170: { // high school. Title is shown for a building
        area_type: AREA_TYPES.INSTITUTION
    },

    648898131: {
        title: 'Hospital',
        area_type: AREA_TYPES.INSTITUTION
    },

    943883241: {
        title: `Customs
        Academy`,
        area_type: AREA_TYPES.INSTITUTION
    },


    925802508: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    883063456: {
        title: `Industrial
        area`,
        area_type: AREA_TYPES.INSTITUTION
    },

    12724123: {
        title: `Free
        industrial
        zone`,
        area_type: AREA_TYPES.INSTITUTION
    },

    506610022: {
        title: `Universiti
        Teknikal`,
        area_type: AREA_TYPES.INSTITUTION
    },

    499599430: {
        title: 'Golf course'
    },

    943998543: {
        title: `Universiti
            Multimedia`,
        area_type: AREA_TYPES.INSTITUTION
    },

    768331768: {
        title: `General
            hospital`,
        area_type: AREA_TYPES.INSTITUTION
    },

    945813623: {
        // forest around st john's fort
    },

    242010620: {
        title: 'Bukit Serindit\n(old Christian\ncemetery)',
        area_type: AREA_TYPES.CEMETERY
    },

    1419914017: {
        title: 'Japanese\noccupation\nMemorial'
    },

    1293044462: {
        title: 'Dutch\ngraveyard',
        area_type: AREA_TYPES.CEMETERY
    },

    286023454: {
        title: 'Mausoleum of\nHang Jebat',
    },

    712550643: {
        area_type: AREA_TYPES.CEMETERY
    },
    905284499: {
        title: 'Prison\nmuseum',
        area_type: AREA_TYPES.INSTITUTION
    },

    1314696670: { // the one with white beautiful bldg in the west
        area_type: AREA_TYPES.CEMETERY
    },

    104634809: {
        title: 'Stadium'
    },

    610242612: {
        title: `Forest
        reserve`,
        title_coords: [102.283382, 2.243872]
    },
    1422407517: {

    }
}

export const lakes_handmade_data = {

}

export const all_handmade_data = {
    ...bldgs_handmade_data,
    ...land_areas_handmade_data,
    ...lakes_handmade_data,
    5780772689: {
        title: `Bukit Beruang`
    },
    8799507465: {
        title: `Bukit
        Peringgit`
    }
}

Object.keys(all_handmade_data).forEach((feat_id) => {
    all_handmade_data[feat_id].id = feat_id
})