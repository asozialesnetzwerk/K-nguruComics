const comics = [];
fetch("links.txt").then(x => x.text()).then(links => {
    comics.push.apply(comics, links.split("\n")); //first 50 comics 29.11.2020 - 17.01.21
    addLinksToComics();
    onLoad();
});

function addLinksToComics() {
    const today = getToday();
    const date = new Date(firstDateWithNewLink.getTime());
    while (date.getTime() < today.getTime()) {
        console.log(date);
        if (!isSunday()) {
            comics.push(generateComicLink(date));
            console.log(generateComicLink(date));
        }
        dateIncreaseByDays(date, 1);
    }
}

const currentImgHeader = document.getElementById("current_comic_header");
const currentImg = document.getElementById("current-img");
function onLoad() {
    const today = getToday();
    if (isSunday(today)) dateIncreaseByDays(today, -1);
    setCurrentComic(today)
    currentImg.onerror = (event) => {
        dateIncreaseByDays(today, -1);
        setCurrentComic(today);
    };
}

function setCurrentComic(date) {
    currentImg.src = generateComicLink(date);
    currentImgHeader.innerText = "Aktueller " + getDateString(date);
}

function getDateString(date) {
    return "Comic von "
        + getDayName(date) +" dem "
        + date.getDate() + ". "
        + getMonthName(date) + " "
        + date.getFullYear() + ".";
}

function getDayName(date) {
    switch (date.getDay()) {
        case 0:
            return "Sonntag";
        case 1:
            return "Montag";
        case 2:
            return "Dienstag";
        case 3:
            return "Mittwoch";
        case 4:
            return "Donnerstag";
        case 5:
            return "Freitag";
        case 6:
            return "Samstag";
    }
}

function getMonthName(date) {

    switch (date.getMonth()) {
        case 0:
            return "Januar";
        case 1:
            return "Februar";
        case 2:
            return "März";
        case 3:
            return "April";
        case 4:
            return "Mai";
        case 5:
            return "Juni";
        case 6:
            return "Juli";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "Oktober";
        case 10:
            return "November";
        case 11:
            return "Dezember";
    }
}

const firstDateWithOldLink = getDateBy(2020, 12, 3);
const oldLinkRegex =/https?:\/\/img\.zeit\.de\/administratives\/kaenguru-comics\/kaenguru-(\d{2,3})(?:-2)?\/original\/?/;

const firstDateWithNewLink = getDateBy(2021, 1, 19);
const newLinkRegex = /https?:\/\/img\.zeit\.de\/administratives\/kaenguru-comics\/(\d{4})-(\d{2})\/(\d{2})\/original\/?/;

function getDateFromLink(link) {
    let arr = link.toLowerCase().match(newLinkRegex);
    if (arr && arr.length > 3) {
        return getDateBy(arr[1], arr[2], arr[3]);
    }
    arr = link.toLowerCase().match(oldLinkRegex);
    if (arr && arr.length > 1) {
        const num = arr[1] - 5;
        let date = new Date(firstDateWithOldLink.getTime());
        for (let i = 0; i < num; i++) {
            date.setTime(dateIncreaseByDays(date, isSunday(date) ? 2 : 1));
        }
        return isSunday(date)
            ? dateIncreaseByDays(date, 1)
            : date;
    }

    switch(link.toLowerCase().trim()) {
        case "https://img.zeit.de/administratives/kaenguru-comics/pilot-kaenguru/original":
            return getDateBy(2020, 11, 29);
        case "https://img.zeit.de/administratives/kaenguru-comics/pow-kaenguru/original":
            return getDateBy(2020, 11, 30);
        case "https://img.zeit.de/static/img/kaenguru-announcement/original":
            return getDateBy(2020, 11, 30);
        case "https://img.zeit.de/administratives/kaenguru-comics/der-baum-kaenguru/original":
            return getDateBy(2020, 12, 1);
        case "https://img.zeit.de/administratives/kaenguru-comics/warnung-kaenguru/original":
            return getDateBy(2020, 12, 2);
        case "https://img.zeit.de/administratives/2020-12/kaenguru-comics-kaenguru-019/original":
            return getDateBy(2020, 12, 19);
    }
}

const linkFormat = "https://img.zeit.de/administratives/kaenguru-comics/%y-%m/%d/original"
function generateComicLink(date) {
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    return linkFormat.replace("%y", date.getFullYear().toString())
        .replace("%m", month.length === 2 ? month : "0" + month)
        .replace("%d", day.length === 2 ? day : "0" + day);
}

function isSunday(date) {
    return date
        && date.getDay() === 0
        && !dateEquals(date,2020, 12, 20);
}

function dateEquals(date, year, month, dayOfMonth) {
    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === dayOfMonth;
}

const millisOfOneDay = 1000 * 60 * 60 * 24;
function dateIncreaseByDays(date, days) {
    date.setTime(date.getTime() + (days * millisOfOneDay));
    return date;
}

function getDateBy(year, month, dayOfMonth) {
    return new Date(year, month - 1, dayOfMonth, 0, 0, 0, 0);

}

function getToday() {
    const date = new Date();
    return getDateBy(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

const list = document.getElementById("old_comics_list");
let loaded = 0;
function loadMoreComics() {
    if (loaded >= comics.length) {
        alert("Keine Comics mehr da.");
    }

    for (let i = 0; i < 10; i++) {
        loaded++;
        const c = comics.length - loaded;
        if (c < 0) break;

        const link = comics[c];
        const listItem = document.createElement("li");
        const header = document.createElement("h2");
        header.innerText = getDateString(getDateFromLink(link));
        listItem.appendChild(header);
        const image = document.createElement("img");
        image.src = link;
        image.alt = getDateString(getDateFromLink(link));
        image.style.width = "40%";
        image.style.height = "auto";
        listItem.appendChild(image);
        list.appendChild(listItem);
    }
}