const comics = [];
fetch("links.txt").then(x => x.text()).then(links => {
    comics.push.apply(comics, links.split("\n")); //first 50 comics 29.11.2020 - 17.01.21
    addLinksToComics();
    onLoad();
});

function addLinksToComics() {
    const today = getToday();
    const date = copyDate(firstDateWithNewLink);
    while (date.getTime() <= today.getTime()) {
        comics.push(generateComicLink(date));
        dateIncreaseByDays(date, 1);
    }
}

const currentImgHeader = document.getElementById("current-comic-header");
const currentImg = document.getElementById("current-img");
function onLoad() {
    const today = dateIncreaseByDays(getToday(), 1);
    setCurrentComic(today)
    currentImg.onerror = (event) => {
        dateIncreaseByDays(today, -1);
        setCurrentComic(today);

        if (loaded < comicCountToLoadOnCLick) {
            loaded++;
        }
    };
}

//const currentImgContainer = document.getElementById("current-img-container");
function setCurrentComic(date) {
    let link = generateComicLink(date);
    currentImg.src = link;
    currentImgHeader.innerText = "Aktueller " + getDateString(date) + ":";
    currentImgHeader.href = link;
    //TODO:
    //currentImg.onclick = () => {
    //    createImgPopup(currentImg, currentImgContainer);
    //}
}

function getDateString(date) {
    return "Comic von "
        + getDayName(date) + ", dem "
        + date.getDate() + ". "
        + getMonthName(date) + " "
        + date.getFullYear();
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
        case comic_25_5_2021:
            return date_25_5_2021;
    }
}

// date with special link format:
const comic_25_5_2021 = "https://img.zeit.de/administratives/kaenguru-comics/25/original/";
const date_25_5_2021 = getDateBy(2021, 5, 25);

const linkFormat = "https://img.zeit.de/administratives/kaenguru-comics/%y-%m/%d/original"
function generateComicLink(date) {
    if (datesEqual(date, date_25_5_2021)) {
        return comic_25_5_2021;
    }

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

function datesEqual(date1, date2) {
    return dateEquals(date1, date2.getFullYear(), date2.getMonth() + 1, date2.getDate());
}

function dateEquals(date, year, month, dayOfMonth) {
    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === dayOfMonth;
}

const millisOfOneDay = 1000 * 60 * 60 * 24;
function dateIncreaseByDays(date, days) {
    date.setTime(date.getTime() + (days * millisOfOneDay));
    date.setHours(6); // to compensate errors through daylight savings time
    return date;
}

function copyDate(date) {
    return getDateBy(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function getDateBy(year, month, dayOfMonth) {
    return new Date(year, month - 1, dayOfMonth, 6, 0, 0, 0);

}

function getToday() {
    return copyDate(new Date());
}
const comicCountToLoadOnCLick = 7;
const loadButton = document.getElementById("load-button");
const list = document.getElementById("old-comics-list");
let loaded = 0;
function loadMoreComics() {
    for (let i = 0; i < comicCountToLoadOnCLick; i++) {
        loaded++;
        const c = comics.length - loaded;
        if (c < 0) break;

        const link = comics[c];
        const date = getDateFromLink(link);

        const listItem = document.createElement("li");
        const header = document.createElement("a") ;
        header.innerText = getDateString(date) + ":";
        header.href = link;
        header.style.fontSize = "25px";
        listItem.appendChild(header);
        listItem.appendChild(document.createElement("br"));
        const image = document.createElement("img");
        image.classList.add("normal-img")
        image.src = link;
        image.alt = getDateString(date);
        image.onclick = () => {
            createImgPopup(image);
        }
        image.onerror = () => {
            if (isSunday(date)) {
                list.removeChild(listItem);
            } else {
                listItem.append(" konnte nicht geladen werden.");
            }
        }
        listItem.appendChild(image);
        list.appendChild(listItem);
    }

    if (loaded >= comics.length) {
        loadButton.style.opacity = "0";
        loadButton.style.visibility = "invisible";
    }
}

function removeAllPopups() {
    for (let node of document.getElementsByClassName("popup-container")) {
        node.remove();
    }
}

function createImgPopup(image) {
    removeAllPopups();

    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
    popupContainer.onmouseleave = () => {
        popupContainer.remove();
    }
    popupContainer.onclick = () => {
        removeAllPopups();
    }

    const clone = image.cloneNode(true);
    clone.classList.remove("normal-img");
    clone.classList.add("popup-img");


    const closeButton = document.createElement("img");
    closeButton.classList.add("close-button");
    closeButton.src = "img/close.svg";

    popupContainer.appendChild(clone);
    popupContainer.appendChild(closeButton);
    image.parentNode.appendChild(popupContainer);
}