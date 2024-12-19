const meta =  {
    "361692216": {
        "images": [
            "IMG_0279~2.jpg"
        ]
    },
    "361851888": {
        "descr": "Built in 1935 . female students from wealthy families in Dalat and southern Vietnam were educated between 1940 and 1975. Queen Nam Phuong was reportedly a student of this school as well.\n        I entered the campus without a problem. The building stands next to an old pine grove."
    },
    "515193507": {
        "images": [
            "IMG_0601~3.jpg"
        ]
    },
    "515288591": {
        "title": "National archives center"
    },
    "777432545": {
        "images": [
            "IMG_0160~3.jpg"
        ]
    },
    "777432585": {
        "images": [
            "IMG_0167~2.jpg"
        ]
    },
    "777432595": {
        "descr": "This is where the iconic Cafe de la Poste used to be. Bank replaced it in 2020 or so."
    },
    "777438288": {
        "images": [
            "IMG_0102~2.JPG"
        ]
    },
    "777438290": {
        "images": [
            "IMG_0074~4.JPG"
        ]
    },
    "777438901": {
        "descr": "One of the 3 palaces of king Bao Dai. (All 3 in Dalat).\nThis on was built in 1933-1937.\nNow it's possibly used as an event space by some bosses of Lam Dong province.\nThe building is massive and rather clumsy and bureaucratic to my taste. One explanation of this is that Palace II was designed as headquarters of the French ruling apparatus in Indochina. (Though this fact comes from a dubious source in the web).\nHowever clumsiness is redeemed by the setting: a vast pine forest on the very top of the hill. A really tranquil and enigmatic place.\nThe palace is well maintained but still shows a bit of historical shabbiness which is nice. At the time of my visit the surrounding area was completely deserted.\nAccess seems to be unrestricted, I just walked through the entrance from the south. (Not from main street)."
    },
    "971545940": {
        "images": [
            "IMG_1431~4.jpg",
            "IMG_1438~2.jpg"
        ]
    },
    "971558874": {
        "images": [
            "IMG_0596~3.jpg",
            "IMG_0613.jpg"
        ]
    },
    "971558885": {
        "images": [
            "424.jpg",
            "IMG_0550~2.jpg"
        ]
    },
    "971563667": {
        "images": [
            "IMG_0429~3.jpg"
        ]
    },
    "971568008": {
        "images": [
            "16_1.jpg"
        ]
    },
    "1243929950": {
        "images": [
            "IMG_0769~2.jpg",
            "IMG_0800~2.jpg"
        ]
    },
    "1303825521": {
        "images": [
            "IMG_0724~2.jpg"
        ]
    },
    "1304217001": {
        "images": [
            "IMG_0360~3.jpg",
            "IMG_0379~2.jpg"
        ]
    },
    "1304439964": {
        "images": [
            "IMG_0255~3.jpg"
        ]
    },
    "1305230699": {},
    "1307264372": {
        "images": [
            "IMG_1282~3.jpg"
        ]
    },
    "1307493477": {
        "images": [
            "IMG_1684.jpg"
        ]
    },
    "1307526065": {
        "images": [
            "IMG_0235~2.jpg"
        ]
    },
    "1307526069": {
        "images": [
            "426.jpg",
            "IMG_0210~2.jpg"
        ]
    },
    "1307704573": {
        "images": [
            "13~~4.jpg",
            "IMG_0017~2.jpg"
        ]
    },
    "1307704574": {
        "images": [
            "IMG_0007~2.jpg"
        ]
    },
    "1308413673": {
        "images": [
            "429.jpg"
        ]
    },
    "1343678316": {
        "images": [
            "IMG_1268~2.jpg"
        ]
    },
    "1343679057": {
        "images": [
            "IMG_1837~3.jpg"
        ]
    }
}

window.french_building_details = meta

window.merge_imgs_data_into_meta = () => {
    const ids_to_imgs = JSON.parse(localStorage.getItem('ids_to_imgs'))
    Object.entries(ids_to_imgs).forEach(([feat_id, imgs]) => {
        window.french_building_details[feat_id] = window.french_building_details[feat_id] || {}
        window.french_building_details[feat_id].images = imgs
    })
}

export default meta