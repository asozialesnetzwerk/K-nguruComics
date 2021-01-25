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
        comics.push(generateComicLink(date));
        dateIncreaseByDays(date, 1);
    }
}

const currentImgHeader = document.getElementById("current_comic_header");
const currentImg = document.getElementById("current-img");
function onLoad() {
    const today = getToday();
    setCurrentComic(today)
    currentImg.onerror = (event) => {
        dateIncreaseByDays(today, -1);
        setCurrentComic(today);

        if (loaded < comicCountToLoadOnCLick) {
            loaded++;
        }
    };
    currentImg.onclick = () => {
        currentImg.style.width = "100%";
    }
    currentImg.onmouseleave = () => {
        currentImg.style.width = "60%";
    }
}

function setCurrentComic(date) {
    let link = generateComicLink(date);
    currentImg.src = link;
    currentImgHeader.innerText = "Aktueller " + getDateString(date);
    currentImgHeader.href = link;
}

function getDateString(date) {
    return "Comic von "
        + getDayName(date) + ", dem "
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

const relativeLinkRegex = /img\/(\d{4})-(\d{1,2})-(\d{1,2})\.jpg/;

function getDateFromLink(link) {
    let arr = link.toLowerCase().match(newLinkRegex);
    if (arr && arr.length > 3) {
        return getDateBy(arr[1], arr[2], arr[3]);
    }
    arr = link.toLowerCase().match(relativeLinkRegex);
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
    return new Date(year, month - 1, dayOfMonth, 6, 0, 0, 0);

}

function getToday() {
    const date = new Date();
    return getDateBy(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

const comicCountToLoadOnCLick = 7;
const loadButton = document.getElementById("load_button");
const list = document.getElementById("old_comics_list");
let loaded = 0;
function loadMoreComics() {
    for (let i = 0; i < comicCountToLoadOnCLick; i++) {
        loaded++;
        const c = comics.length - loaded;
        if (c < 0) break;

        const link = comics[c];
        const listItem = document.createElement("li");
        const header = document.createElement("a");
        header.innerText = getDateString(getDateFromLink(link));
        header.href = link;
        header.style.fontSize = "25px";
        listItem.appendChild(header);
        listItem.appendChild(document.createElement("br"));
        const image = document.createElement("img");
        image.src = link;
        image.alt = getDateString(getDateFromLink(link));
        image.style.width = "40%";
        image.style.height = "auto";
        image.style.maxHeight = "100%";
        image.onmouseover = () => {
            image.style.width = "60%";
        }
        image.onclick = () => {
            image.style.width = "100%";
        }
        image.onmouseleave = () => {
            image.style.width = "40%";
        }
        image.onerror = () => {
            list.removeChild(listItem);
        }
        listItem.appendChild(image);
        list.appendChild(listItem);
    }

    if (loaded >= comics.length) {
        loadButton.style.opacity = "0";
        loadButton.style.visibility = "invisible";
    }
}