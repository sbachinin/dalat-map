import { AREA_TYPES } from "../../js/layers/constants.mjs"
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

        title_coords (for areas with complex geometry where centerOfMass looks bad),
        
        area_type (for areas),
        
        myhint,

        // if second_rate is true, feature gets higher minzoom
        // and (if priority not set here) lowest priority
        second_rate: boolean,
    
        priority: TITLES_PRIORITY,

        doubt: bool // is it really colonial?

        year: number
    }
*/

export const land_areas_handmade_data = {
    // !!! empty items are needed here in order to generate land_areas tile layer
    696794335: {
        title: "SOS Children's\nvillage",
        area_type: AREA_TYPES.INSTITUTION,
    },
    18721003: {
        title: 'Mercure hotel',
        title_coords: [108.45915576, 11.94629814],
        area_type: AREA_TYPES.INSTITUTION
    },
    99661190: {
        title: 'Nguyen Du Park',
        second_rate: true
    },
    1356068490: {},
    1356539899: {},
    1303695917: {
        title: "High school\nfor the gifted",
        area_type: AREA_TYPES.INSTITUTION,
        second_rate: true
    },
    473755163: {
        title: 'Du Sinh\ncemetery',
        area_type: AREA_TYPES.CEMETERY
    },
    1303837487: {
        title: "Lam Vien\nsquare",
        area_type: AREA_TYPES.SQUARE,
        minzoom: 14
    },
    1353912255: {
        title: `Lam Dong\nchildren's hospital`,
        second_rate: true,
        area_type: AREA_TYPES.INSTITUTION
    },
    473556897: {},
    473547263: {
        title: 'Flower garden',
        second_rate: true
    },
    1356150764: {},
    1356152943: {},
    1232634198: {
        title: 'Lam Dong \nStadium',
        title_coords: [108.432371, 11.959375]
    },
    1355656405: {
        area_type: AREA_TYPES.INSTITUTION,
        title: 'Vinh Son Parish',
        second_rate: true
    },
    99661160: {},

    971585499: {
        title: "Da Lat Pedagogy College",
        area_type: AREA_TYPES.INSTITUTION,
        second_rate: true
    },
    99661351: {},
    1356080427: {},
    1356080833: {},
    521598336: {},
    1356287796: {
        title: 'Truc Lam\nmonastery',
        area_type: AREA_TYPES.INSTITUTION
    },
    1356337559: {},
    99660971: {},
    1355659863: {},
    1355661170: {},
    788097430: {},
    1355662100: {},
    1355663200: {},
    473540518: {},
    1303678437: {
        title: 'Something\nmilitary',
        second_rate: true,
        area_type: AREA_TYPES.INSTITUTION
    },
    1086020940: {
        title: "College",
        area_type: AREA_TYPES.INSTITUTION,
        title_coords: [108.42800380452292, 11.938586878593512],
        second_rate: true
    },
    "1355564844": {
        title: "Military Academy",
        area_type: AREA_TYPES.INSTITUTION
    },
    361692208: {},
    99660916: {
        title: 'Yersin Park',
        second_rate: true
    },
    473547288: {
        title: 'Nuclear \nResearch \nInstitute',
        title_coords: [108.452563, 11.955891]
    },
    1307493492: {
        title: 'Ana Mandara \nResort',
        title_coords: [108.4233402669314, 11.945999359025265],
        area_type: AREA_TYPES.INSTITUTION
    },
    99661171: {
        title: 'Golf course',
        title_coords: [108.44559047175477, 11.949050440541242]
    },
    473556887: {
        title: 'Hospital',
        title_coords: [108.43045966699538, 11.946530838356935],
        area_type: AREA_TYPES.INSTITUTION
    },
    99660966: {
        title: 'Anh Sang \npark',
        title_coords: [108.43695899199463, 11.93885673022271],
        second_rate: true
    },
    969458761: {
        title: 'Da Lat \nUniversity',
        title_coords: [108.445401, 11.956080],
        area_type: AREA_TYPES.INSTITUTION
    },
    521598340: {
        title: 'Yersin \nUniversity',
        area_type: AREA_TYPES.INSTITUTION
    },
    1356369848: {}
}

export const lakes_handmade_data = {
    99660972: {
        title: 'Xuan Huong\nLake',
        title_coords: [108.44589, 11.94145]
    },
    125165263: {
        title: 'Tuyen Lam Lake',
        title_coords: [108.42535285552634, 11.893930932153538]
    },
    141724748: {
        title: 'Da Thien\nlake',
        title_coords: [108.45115998514689, 11.982616688724448]
    },
    141724891: {
        title: 'Chien Thang\nlake',
        title_coords: [108.46564657614073, 11.974080820149084]
    }
}

export const all_handmade_data = {
    ...bldgs_handmade_data,
    ...land_areas_handmade_data
}