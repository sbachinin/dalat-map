import { AREA_TYPES } from "../../js/common_drawing_layers/constants.mjs"
import { dead_buildings_data } from "./dead_buildings_data.mjs"


export const buildings_handmade_data = {

    ...dead_buildings_data,

    173151286: {
        title: `Ngọc Hương
        pagoda`
    },

    205805244: {
        title: `Stele
        pavilion`, // in tu duc
        title_side: 'north'
    },

    240143621: {
        title: `Central
        indoor stadium`
    },

    1435288831: {
        title: `Northern
        bus station`,
        title_side: 'north'
    },

    239449133: {
        title: `Bus
        station`
    },

    260244336: {
        title: `Southern
        bus station`
    },

    493381029: {
        title: `Thien An
        monastery
        (catholic)`,
        title_side: 'center'
    },

    632173205: {
        title: 'Library',
    },

    240131252: {
        title: `Hotel`,
    },

    1280445132: {
        title: 'Hotel',
    },

    731095046: {
        title: 'Hotel',
    },

    218439300: {
        title: 'Supermarket',
    },

    695770476: {
        title: `People's
        commitee`,
    },

    /* 1433190508: {
        // turned out it's outside the map, and not interesting enough to extend to it
        title: `Linh Thuy
        church`,
    }, */

    749331141: {
        title: `The
        skyscraper`,
    },

    1433191883: {
        title: `Lại Ân
        church`,
    },

    1433206537: {
        title: `An Nhơn
        church`,
        subtitle: 'It seems this was a lovely little church some time ago (on the picture). However, after the recent paint job in 2024, it looks really ugly (not shown here) and is hardly recognizable as colonial.'
    },

    1433210182: {
        title: `Tân Mỹ
        church`,
    },

    /*
    // tiny brutalist one in the west, no good pics
    885012165: {
        title: `Bo Dien
        church`
    }, */

    1433313074: {
        title: `An Truyền
        church`
    },

    1433241176: {
        title: `Quy Lai
        church`
    },

    205795043: {
        title: `Phước Duyên
        tower`
    },

    1433495412: {
        title: `Hương Cần
        church`,
        subtitle: `With a new coat of bad blueish paint, this church in 2025 is not of great visual interest. However, it is still surprising to see the original colonial architecture mostly untouched (or rebuilt?), which is rare in Hue. Small old parish churches in this area are quickly disappearing, and in 2020s this process seems to have accelerated. A couple of churches very similar to the current one has gone very recently: [Doc So church](1433243405346257) was demolished and [Ngoc Ho](1433304540947235) was extended to become a totally different building.`
    },

    1433225026: {
        title: `An Vân church`
    },

    /* 1433239491: {
        // outside the bounds
        title: 'Ha Uc church'
    }, */

    1430131350: {
        // subtitle: `Temple of Princess Ngoc Son` (now a private residence, open for pre-arranged visits). A kind of garden house. So it's many things and unclear.
    },

    1433193496: {
        title: `Mậu Tài
        church`
    },

    "1377444109": { // Hue Industrial College main ancient bldg
        year: '1924'
    },
    "1377444112": {
        title_for_panel_only: 'Workshop',
        year: '1924'
    },

    1388902200: {
        title: 'Gorgeous\nsoviet condo',
        title_side: 'south',
        subtitle: `This residential complex neither belongs to the colonial era nor is it a recognized architectural landmark. Still I can't resist including it in the "colonial highlights" of Hue because, first of all, this complex is a sheer architectural delight, and secondly, it's a very foreign piece of architecture, introduced by a very different civilization - soviet in this case. 

        It  looks totally out of place in this featureless suburb, next to the busy and very casual street market. Against this backdrop it look almost opulent. It also carries a faint french feel - thought it's unlikely that any french architectural forces were involved in this project. 
        
        I guess it was built around 1960s or 70s - judging by its similarity to Hanoi's "Community houses" (Nha Tap The), which were also built during the early post-independence period. It's essentially a very soviet project, with 3 identical bulky builidings, 4 storeys height, without much decoration but well-considered proportions and a non-linear layout. Overall, there’s a lot to appreciate here for anyone interested in architecture. All the chaotic additions and enhancements introduced by the tenants don't destroy the architecture but only add more character to it.`
    },

    "118542146": {
        title: 'Francis Xavier\nChurch',
        title_side: 'north',
        subtitle: `In a way, it's the most important of all colonial churches in Hue, and possibly the oldest. However, it was severely damaged during the Tet Offensive in 1968. By 1972, the church was mostly restored, but still lacked the bell tower. Photos from that time show an incomplete but really beautiful version of the building. In 2008, a full restoration was completed — as far as I can tell, the original design was followed, but without much scrutiny. Some minor simplifications sneaked in, and most notably, the bell tower became thinner, which really ruined the overall proportions. (The most reliable part is the ground-floor arcade that wasn't destroyed in the war). Also — traditionally for churches in Hue — the paint was chosen very poorly. As a result, today the building doesn’t look colonial at all (and perhaps that wasn’t the goal of the restoration). It’s not the worst church in Hue, but I hesitate to consider it a historical building.`,
        year: '1911'
    },
    "118542754": {
        // a building in the north of european city, which I have not seen
        subtitle: 'As of 2025, this building belongs to the grounds of a police department'
        // photo from gmaps downloaded to Documents/hue
    },

    "732304130": { // THCS Ng Chí Diểu, very near the center of european part, with rounded "axis"
        year: 1979
    },

    240266283: {
        title: 'La Residence\nhotel',
        title_side: 'north',
        year: 1930,
        subtitle: 'This is perhaps the most clearly Art Deco building in Hue. Originally it was built as the residence of a high-ranking French official (the Résident Supérieur). Operates as a hotel since 2005.'
    },

    118541538: {
        subtitle: 'As of 2025, this building houses the department of tropical diseases of Hue central hospital'
    },

    1377450377: {
        subtitle: 'As of 2025, this building belongs to the psychiatric department of Hue central hospital'
    },

    1431655095: {
        title: `Kilns (What
        remains of an
        old factory)`,
        subtitle: 'This is the only remaining structure of a cement factory built here in 1896 by a french private company. It was almost completely demolished by 2021, allegedly because of being a serious air polluter. (No doubt it was.) Kilns are bottle-shaped brick structures where the lime was burned (calcinated) for some construction purposes. Kilns can be found in many parts of the world, but their vietnamese variety has some unique features. The historical importance of these structures was recognized by the local government, and some plans of renovation are being made.'
    },

    1431680514: {
        title: `Huyen Khong
        temple`,
        subtitle: `Built fairly recently, this structure is a slightly simplified version of the magnificent 6th-century Mahabodhi temple in India. (A place where Siddhartha Gautama attained enlightenment under the Bodhi Tree.)`
    },

    239985079: {
        title: `Abandoned
        waterpark`,
        title_coords: [107.576808, 16.409635]
    },

    239972934: {
        title_for_panel_only: 'Museum of\nculture',
        title_side: 'north'
    },

    1431465867: {
        title: `Tomb of
        Tuy Lý Vương`
    },

    118542346: {
        title: `Le Cercle
        Sportif`,
        title_side: 'north',
        subtitle: `This example of the Streamline Moderne style (a variety of Art Deco) was likely built in the 1930s. It served as a sports and social club for colonial officials and Hue's elite. In postcolonial times, it continued to function as a sports venue until it was repurposed in the early 2020s into a restaurant and event space. The “sportif” part of the name was dropped, and today it is known simply as “Le Cercle.”`
    },

    175063593: {
        title: 'Railway\nstation',
        title_side: 'north',
        year: 1908
    },

    1192697531: {
        subtitle: `This villa is known as the seat of the regional Union of Literature and Art Associations. In 2022, local officials announced that it was going to be “relocated” to another site in Huế. As of spring 2025, this plan had not yet been implemented. I suppose the relocation may have proved technically impossible, while outright demolition could be incompatible with preservation laws. In any case, it seems this building may not last much longer. By 2025, it looks rather abandoned — perhaps the literary association has already been moved elsewhere as part of the demolition plan.`
    },

    118792054: {
        title: `Phu Cam
        Cathedral`,
        year: '1963-2000',
        subtitle: 'A grand colonial church was built on this site in 1902. It was demolished in the 1960s to make way for the current structure, which took nearly 40 years to complete.',
        wikipedia: 'https://en.wikipedia.org/wiki/Ph%E1%BB%A7_Cam_Cathedral',
        google: 'https://maps.app.goo.gl/n3bUekZiQAdJp2fZA'
    },

    732309970: {
        title: 'Mossy\ncondo',
        title_side: 'south',
    },

    1174028275: {
        title: 'Redemptorist\nmonastery',
        year: 1925,
        title_side: 'north',
        google: 'https://maps.app.goo.gl/HWdR8iUjqZ6HZ69cA',

    },

    1172894102: {
        title: 'Redemptorist\nchurch',
        year: '1959-1962',
        subtitle: `Honestly, it's one of the most ridiculous pieces of architecture I've ever seen`,
        google: 'https://maps.app.goo.gl/zKjuh1W3cfKTbU1r9'
    },

    118542341: {
        title_for_panel_only: 'Gymnasium',
        subtitle: 'This building, as far as I can tell, has probably been used for sports since the colonial era. Despite that remarkable history, the structure itself is visually quite uninteresting.',
    },

    240267335: {
        title: 'Hue University',
        year: 1927,
        subtitle: 'A prime example of neoclassical architecture in Hue, this building today appears rather plain and is easily overlooked as a colonial-era structure.',
        google: 'https://maps.app.goo.gl/5JjWfSHgpsnAMwxA9',

    },

    173151284: {
        title: `National\nLibrary`,
        year: '1825',
        subtitle: 'Originally, it served as an archive for official documents. Built in the middle of the lake presumably to protect the important papers from fire. The volume and value of the materials stored here were said to be immense at the time. During the post-colonial wars, much of the archive was destroyed, though the building itself remained intact. It was later taken over by local residents and used as housing, with numerous makeshift extensions. In 2015, it was restored to its original design and transformed into some blend of library and museum.',
        wikipedia: 'https://vi.wikipedia.org/wiki/T%C3%A0ng_Th%C6%B0_l%C3%A2u',
        google: 'https://maps.app.goo.gl/dwyiebznHvdFeKDBA',
    },

    "118543157": {
        subtitle: 'Currently this building belongs to the Center For Vocational Education',
    },

    "19381147": {
        title: 'Arena for\nanimal fight',
        title_side: 'south',
        year: '1820',
        subtitle: 'During the Nguyen Dynasty, this arena hosted deadly battles between elephants and tigers — sacrifices to the gods during festivals and a source of entertainment for the king, mandarins, and the people.',
        wikipedia: 'https://vi.wikipedia.org/wiki/H%E1%BB%95_Quy%E1%BB%81n',
        google: 'https://maps.app.goo.gl/4yqq3HUnAtbo58zN8'
    },

    "172763419": {
        title_for_panel_only: 'Imperial city\nguard HQ',
        subtitle: `This building is clearly the one most european in Hue Citadel - and perhaps the least well preserved. It was built in the early 20th century, replacing a building of Royal treasury, and served as the Imperial city guard headquarters in 1936. Today it (presumably) houses the Hue College of Arts (or Fine Arts).`
    },

    "531031540": {
        title_for_panel_only: "Tinh Minh\nLau villa",
        subtitle: `Current structure was built in 1927 as a medical clinic and in 1950 rebuilt as a private residence of the king Bao Dai.
        It's one of the few structures in the Imperial City that survived the bombings of the 1960s and '70s. In later years, however, it fell into serious disrepair until a UNESCO-guided restoration began in the late 1990s.`,
        links: [
            {
                description: 'More photos of a ruin from 1998',
                url: 'https://www.facebook.com/media/set/?set=a.1716030635284698.1073741847.1714188455468916&type=3&_rdr'
            }
        ]
    },

    239445949: {
        title: `Emperor's
        reading retreat`,
        title_side: 'north',
        subtitle: `This pavilion is named Thai Binh, meaning something like "Supreme Peace". It was designed to serve as the emperor Khai Dinh's refuge from official ceremonies and other tedious events. It's one of the few original (not restored, but remaining from colonial times) buildings of the Imperial city. Completed in 1921, Thai Binh suffered remarkably little damage during the wars.`
    },

    172657562: {
        title: `Meridian
        Gate`
    },

    531031593: {
        title: `Flag tower`
    },

    172657563: {
        title: `Royal
        theatre`
    },

    1172897446: {
        title: `An Dinh
        Palace`,
        title_side: 'north',
        subtitle: `Built in 1919 as a private residence of Emperor Khai Dinh. Being outside Hue's Imperial city and having a distinctly european architectural style, this palace was a very bold statement of Khai Dinh's separation from traditional Confucian imperial power.
        It's not included in Unesco's "Complex of Hue monuments" and it takes a brief moment to understand why is that.
        This palace is one of the most opulent structures built in Hue by the Nguyen dynasty.
        As a piece of architecture it's comparable to Khai Dinh tomb, also a very european structure and also outside the Hue Citadel - but of course european to a lesser degree.
        The borderline of being Unesco-important is perhaps a bit blurry in Hue. An Dinh Palace indeed must fall short of having an "Outstanding Universal Value", being mostly an exercise in european architecture, however successful it is, and not being sufficiently unique`,

    },

    695770492: {
        subtitle: `This building was erected from the ground up in 2022. Before that, a very modest one-storey building stood on this site. I have no information about whether the current building is a replica of something that existed in colonial times (and may have been destroyed during the war, for example). However, I bet this is a brand new building, looking at how similar it is to both lateral blocks of Hai Ba Trung school campus, - it's identical in architecture but shorter. Such uniformity seems to be a little strange for a french colonial project like this. But, regradless of its authenticity, this building in itself looks great and convincingly colonial.`
    },

    118541723: {
        subtitle: `This building, once so beautiful, was renovated in 2024 in order to shoot a scene of some vietnamese horror movie. This renovation was certainly one of the major architectural atrocities conducted in Hue.`
    },

    730227961: {
        title: 'Chapel of\nHue Seminary',
        title_side: 'north',
        subtitle: `This is a very hidden piece of architecture that I discovered by accident on the web.Otherwise, it would be quite difficult to spot, as it is situated deep within the restricted grounds of the Hue Major Seminary.Its history is also unclear.I can only say that at present it’s perhaps far from its best appearance, painted in rather dull whitish tones.A bit earlier, around 2015, the color scheme was much better, with yellow as the dominant color.At that time, it must have been a truly delightful sight.`
    },

    285990348: {
        title: 'Kien Trung\nPalace',
        subtitle: `Boldly eclectic building combining european and vietnamese principles in its overall layout and decoration.
        Built in 1921-23, used as the main residence of king Bao Dai; destroyed, almost completely, in 1947 during the First Indochina War; restored in 2019-23.
        Its today’s appearance produces a baffling impression — very new, very brightly colored and wildly ornamental. It's difficult to see the architecture behind this glittering shell. No doubt the restoration followed the colonial prototype, but still, it's difficult to believe that the palace looked like that in its early days. Perhaps some time is necessary to make it look more authentic.
        A lot of similarities can be found between this structure and [An Dinh palace](1172897446) - a more radically europian piece of architecture, built just before Kien Trung.`
    },

    242940960: {
        title: 'Thien Dinh Palace',
        title_side: 'north',
        subtitle: `This is the main structure of Khai Dinh tomb complex. It's basically a baroque palace (rather small one) with a vietnamese roof shape and ornaments - a rather audacious fusion that, in my view, works exceptionally well. Its construction took 11 years and ended in 1931. The king Khai Dinh was know for his French tendencies and was ridiculed a "paid employee of the French state", so it's no surprise that this Palace turned out so european, breaking with a long architectural tradition of vietnamese imperial tombs.
        This building is included in Unesco-protected complex of Hue monuments together with several other imperial tombs. One obvious architectural counterpart of this building is [Kien Trung Palace](285990348) of Hue Imperial city - also a european palace with vietnamese finish, although significantly larger and perhaps less ambitious in its architectural features (Its construction began almost simultaneously with Khai Dinh tomb but was completed much faster, in 1923).`,
        links: [
            {
                description: 'On Google Arts & Culture',
                url: 'https://artsandculture.google.com/story/bAWhhXL29g5ZIQ?hl=vi'
            }
        ]
    },

    242940961: {
        title: 'Stele pavilion',
        // a pavilion in the center of khai dinh
        subtitile: `This structure houses a large stele - inscribed stone tablet containing a summary of deceased emperor's life. It's a common feature of all royal tombs of Nguyen dynasty, always  standing in the center of the tomb complex. This pavilion, like the quaint palace above it, breaks many architectural traditions of vietnamese imperial tombs by including some european features: arched openings, romanesque columns and octagonal plan (instead of traditionally rectangular). Carvings depict some national motives but their style is rather western - less geometric and more ornate.`
    },


    118541901: {
        title: `House of
        culture`
    },

    695810806: {
        // title: 'Tho Chi gate'
        // great 2 pictures in borrowed album (need to choose only 1)
        // 1 img i added to highlights
    },

    695810701: {
        hint: 'Tam Toa', // (no title here, such title is displayed for a unesco area)
        year: 1903
    },

    1075014561: {
        title: `Temple of
        martial arts`,
        title_side: 'north'
    },

    1379612602: {
        title: `Chapel of\nKim Long orphanage (?)`,
        subtitle: `This gorgeous building is currently part of a hospital compound, serving — I'm guessing — as a warehouse. Unreliable sources on the web suggest that it once belonged to a Christian orphanage that operated until 1975. (The orphanage was recently restored, but at a different nearby location.)

        I also think it could be somehow related to the Saint-Sulpice "major" seminary, built during colonial times about 300 meters to the east along the Perfume River. My reason for thinking so is based on old photographs of a strikingly similar chapel that once stood (but no longer does) in the nearby city of Quang Tri and served as the chapel of a "minor" seminary.

        Thanks to its ambiguous status, this building is perhaps the only church in Hue that has escaped the modern Disney-style renovations and wasn't painted in some nasty colors. Instead, it's delightfully half-ruined, and the choice of paint feels quite appropriate for a colonial-era structure.

        There are also many visual similarities between this building and the chapel of the adjacent Carmelite monastery — but the meaning of those similarities is another mystery.`,
    },

    1388509039: {
        title: 'Kim Long Church',
        subtitle: `Construction of this building took more than 20 years and was finished in 1940. This is one of the largest colonial churches in Hue, and a curious eclectic piece of architecture. In 2025, it's badly painted in some pinkish kindergarten-style color and lacks much visual interest (similarly to most colonial churches in Hue)`
    },

    695775615: {
        hint: 'a building of some academy of music or something',
        subtitle: `This building, from what I understand, is an awkward tribute to Ecole Pellerin — a Catholic school for boys that was founded on this site in 1904 and closed in 1975. Current building is part of the Hue Academy of Music. I believe it must be a replica of the original Ecole building — very similar in its proportions, but lacking any colonial feel.`
    },

    1388473478: {
        title: 'Chapel of a\nCarmelite\nmonastery'
    },

    730227939: {
        subtitle: `This chapel belongs to the grounds of the Congregation of Immaculate Conception of Hue (monastery of some kind)`,
        doubt: true
    },

    3231165: {
        title: 'Saigon Hotel',
        title_side: 'center',
        subtitle: `This hotel, according to many sources, is a very old one, having celebrated its 120+ birthday. That may be true in some sense, but as a piece of architecture, it's difficult to regard it as colonial — based on how it looks today and also on its history (which is a bit obscure). In the early 20th century, it was a rather small building that had nothing in common with the current one, except its main spatial layout with a chamfered corner — i.e., the original hotel also made this double 45° turn at the street corner, instead of a right angle.

Before the end of the French protectorate period, it was extended several times, by 1953 having (supposedly) 72 rooms. Unfortunately, I failed to find any imagery depicting these intermediate stages of its development, so it's hard to say how it looked by the end of French rule.

During the wars and long afterward, it was in serious decline and stopped being a hotel for a while, serving instead as one of the buildings of Hue University. Then in the 1990s, it was decided to revive it as a hotel and to make it bigger and better than it ever was. Today it has 180 bedrooms and - I'm guessing - mostly new architecture that is loosely based on some colonial prototype. It looks indeed much more colonial than most other hotels in Hue, but still not quite colonial enough. I guess the oldest thing it retains today is, again, its spatial layout — an enclosed “fortress” occupying a whole block, with an extensive inner courtyard where hotel guests are well protected from the street life.`
    },

}


export const lakes_handmade_data = {
}

export const land_areas_handmade_data = {

    1443635075: {
        title: `Thiền Lâm
        pagoda`
    },
    1443636347: {
        title: `Phước Duyên
        pagoda`
    },
    1443607933: {
        title: `Huyền Không
        Sơn Thường
        pagoda`,
        area_type: AREA_TYPES.INSTITUTION
    },

    631871502: {
        title: `Từ Đàm
        pagoda`,
        area_type: AREA_TYPES.INSTITUTION
    },


    // parks along the Perfume river in the center
    240252016: {},
    35926965: {},
    217767781: {},
    217766984: {},


    1409730893: {
        title: 'School',
        area_type: AREA_TYPES.INSTITUTION
    },

    217466613: {
        title: 'Airport'
    },

    1435265548: {
        title: `Dieu De
        pagoda`
    },

    1174326145: {
        title: `Từ Hiếu
        pagoda`
    },

    436421074: {
        title: `College of
        sciences`,
        title_coords: [107.592804, 16.459754],
        area_type: AREA_TYPES.INSTITUTION
    },

    1211159963: {
        area_type: AREA_TYPES.INSTITUTION
    },

    1441813877: {
        area_type: AREA_TYPES.INSTITUTION
    },

    1441813870: {
        area_type: AREA_TYPES.INSTITUTION
    },

    1441813871: {
        area_type: AREA_TYPES.INSTITUTION
    },

    1033709968: {
        title: `Industrial
        college`,
        area_type: AREA_TYPES.INSTITUTION,
        title_coords: [107.587893, 16.457163]
    },

    695770482: {
        title: `Hai Ba Trung
        high school`,
        title_coords: [107.584708, 16.460662],
        area_type: AREA_TYPES.INSTITUTION
    },

    1033709046: {
        title: `University
        of Medicine
        and Pharmacy`,
        area_type: AREA_TYPES.INSTITUTION
    },

    1033709047: {
        title: `Medical
        college`,
        area_type: AREA_TYPES.INSTITUTION
    },

    695775622: {
        title: `High school
        for the
        gifted`,
        title_coords: [107.583487, 16.459864],
        area_type: AREA_TYPES.INSTITUTION
    },

    3229124: {
        // stadium track
    },

    10138638: {
        title: `Academy
        of music`,
        area_type: AREA_TYPES.INSTITUTION
    },

    438257497: {
        title: `Hospital`,
        title_coords: [107.587270, 16.462025],
        area_type: AREA_TYPES.INSTITUTION
    },

    1023330891: {
        title: `College
        of tourism`,
        area_type: AREA_TYPES.INSTITUTION
    },

    1084960041: {
        title: `College
        of education`,
        area_type: AREA_TYPES.INSTITUTION
    },

    695770493: {
        // other part of hospital
        area_type: AREA_TYPES.INSTITUTION
    },

    1033691531: {
        title: `University
        of education`,
        area_type: AREA_TYPES.INSTITUTION
    },

    1044435601: {
        title: `College of
        Agriculture
        and Forestry`,
        area_type: AREA_TYPES.INSTITUTION
    },

    1044435624: {
        title: `College
        of arts`,
        area_type: AREA_TYPES.INSTITUTION
    },

    217466613: {
        title: 'Phu Bai\nInternational\nAirport',
        area_type: AREA_TYPES.AIRPORT
    },

    218423471: {
        // park to the northeast of imperial
    },

    1172894104: {
        // greenish area around an dinh palace
    },

    39456101: {
        // green island
    },
    1180918087: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.592386, 16.444863]
    },


    // forests in southeast
    1176313887: {},
    588726451: {},

    1180918090: {
        area_type: AREA_TYPES.CEMETERY,
    },
    1180918092: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.597237, 16.443547]
    },

    1180743119: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery'
    },
    1180743120: {
        area_type: AREA_TYPES.CEMETERY
    },
    1181145133: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery'
    },
    1181118321: {
        area_type: AREA_TYPES.CEMETERY,
    },
    1181076366: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.600882, 16.429978]
    },
    1181246511: {
        area_type: AREA_TYPES.CEMETERY,
    },
    1181246512: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.593106, 16.424417]
    },
    590077789: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.562807, 16.446736]
    },
    589021821: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.555492, 16.446089]
    },
    205794922: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.556075, 16.433106]
    },
    211038385: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.539802, 16.455323]
    },
    1183249970: {
        area_type: AREA_TYPES.CEMETERY,
        title: 'Cemetery',
        title_coords: [107.530066, 16.460502]
    },
    1075018793: {
        title: `Hill park with
        war bunkers`,
        title_coords: [107.564143, 16.427908]
    },
    1170979640: {
        title: `Báo Quốc
        pagoda`
    }
}

export const markets_titles = {
    1: {
        title: `Đông Ba
        market`,
        title_coords: [107.588672, 16.472537]
    },
    2: {
        title: `Tây Lộc
        market`,
        title_coords: [107.567329, 16.473349]
    },
    3: {
        title: `An Cựu
        market`,
        title_coords: [107.600683, 16.457475]
    },
    4: {
        title: `Bến Ngự
        market`,
        title_coords: [107.583952, 16.4552299]
    },
    5: {
        title: `Mai
        market`,
        title_coords: [107.59655603, 16.49485456]
    },
    6: {
        title: `Cống
        market`,
        title_coords: [107.5993780, 16.47010932]
    },
    7: {
        title: `An Hòa
        market`,
        title_coords: [107.557349, 16.4814801]
    },
    8: {
        title: `Làng Chuồn
        market`,
        title_coords: [107.6337020, 16.50790098]
    },
    9: {
        title: `Tây Linh
        market`,
        title_coords: [107.570745942, 16.481324584]
    },
    10: {
        title: `Trường An
        market`,
        title_coords: [107.58472711, 16.44326869]
    },

    11: {
        title: `Cồn
        market`,
        title_coords: [107.5902333, 16.4812817]
    },

    12: {
        title: `Vĩ Dạ
        market`,
        title_coords: [107.5958124, 16.48292876]
    },
    13: {
        title: `Phú Bình
        market`,
        title_coords: [107.57825309, 16.487905232]
    },
    14: {
        title: `Tứ Hạ
        market`,
        title_coords: [107.48067694, 16.52150219]
    },
    15: {
        title: `Thông
        market`,
        title_coords: [107.5435393, 16.46380891]
    },
    16: {
        title: `Thuận Hòa
        market`,
        title_coords: [107.57421366, 16.468180268]
    },
    17: {
        title: `Phú Tân
        market`,
        title_coords: [107.63314354, 16.53756935]
    },
    18: {
        title: `Tây Ba
        market`,
        title_coords: [107.56055899, 16.536133764]
    },
    19: {
        title: `Nọ market`,
        title_coords: [107.59998640, 16.51196465]
    },
    20: {
        title: `Thần Phù
        market`,
        title_coords: [107.65645694, 16.42430584]
    },
    21: {
        title: `Quảng Vinh
        market`,
        title_coords: [107.49386941, 16.55685300]
    },
    22: {
        title: `Dinh
        market`,
        title_coords: [107.5912788, 16.491102917]
    },
    23: {
        title: `Cự Lại
        market`,
        title_coords: [107.70171319, 16.52360118]
    },
    24: {
        title: `Hôm Dạ Lê
        Chánh market`,
        title_coords: [107.62664635, 16.490474319]
    },
    25: {
        title: `Phường Đúc
        market`,
        title_coords: [107.56468772, 16.45404601]
    },
    26: {
        title: `Văn Xá
        market`,
        title_coords: [107.49726860, 16.51564318]
    },
    27: {
        title: `Thanh Toàn
        market`,
        title_coords: [107.64292888, 16.466205620]
    },
    28: {
        title: `Thuận Lộc
        market`,
        title_coords: [107.58231166, 16.47829238]
    },
    29: {
        title: `Sam
        market`,
        title_coords: [107.649291833, 16.4819327]
    },
    30: {
        title: `Phú Mậu
        market`,
        title_coords: [107.58038739, 16.51824665]
    },
    31: {
        title: `Hương Sơ
        market`,
        title_coords: [107.5663230, 16.49351372]
    },
    32: {
        title: `An Truyền
        market`,
        title_coords: [107.633702470, 16.507906660]
    },
    33: {
        title: `Kim Long
        market`,
        title_coords: [107.56010728, 16.466080119]
    },
    34: {
        title: `Tân Mỹ
        market`,
        title_coords: [107.63639183, 16.54823037]
    },
    35: {
        title: `Triều Thuỷ
        market`,
        title_coords: [107.6277281, 16.51487975]
    },
    36: {
        title: `Phước Vĩnh
        market`,
        title_coords: [107.59176775, 16.4524927]
    },
    37: {
        title: `Đình
        market`,
        title_coords: [107.52561661, 16.439077783]
    }
}


export const all_handmade_data = {
    ...buildings_handmade_data,
    ...lakes_handmade_data,
    ...land_areas_handmade_data,
    5965275021: {
        title: 'Ngu Binh\nMountain'
    }
}