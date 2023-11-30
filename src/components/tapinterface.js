const endpoint = "https://www.tmysam.top/blogger/apis/";

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};
export class TAPInterface {
    constructor() {
        this.endpoint = "https://www.tmysam.top/blogger/apis/";
    }
    postEssay(id, title, content, callback = () => {}) {
        let url = this.endpoint + "postEssayNG.php";
        let data = {
            id: id,
            title: title,
            content: content,
        };
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }).then((response) => {
            response.json().then((json) => {
                callback(json);
                console.log(json);
            });
        });
    }
    datetimeparser(timestamp) {
        let d = new Date();
        d.setTime(timestamp * 1000);
        return d.format("yyyy-MM-dd hh:mm:ss");
    }
    loadcontents(page = 1, callback, errorHandler, tags = []) {
        let curPage = page;
        let url = "";
        if (page == 1) {
            url = this.endpoint + "getContents.php?from=-1";
        } else {
            url =
                this.endpoint +
                "getContents.php?from=" +
                (10 * (page - 1)).toString();
        }
        if (tags.length > 0) {
            url += "&filter=" + tags.join(",");
        }
        fetch(url)
            .then((response) => {
                response.json().then((json) => {
                    this.parseJSONContents(json, callback);
                });
            })
            .catch((error) => {
                errorHandler(error);
            });
    }
    parseJSONContents(jsonContents, callback) {
        let contents = jsonContents;
        console.log(contents);
        let essayCards = [];
        contents.articles.forEach((element) => {
            let essayCard = new Object();
            essayCard.passageId = element.id;
            essayCard.title = element.title;
            essayCard.timeLastModified = this.datetimeparser(element.lastedit);
            essayCard.hasTags = element.hasTags;
            if (element.hasTags) {
                essayCard.tags = element.tags;
            } else {
                essayCard.tags = [];
            }
            essayCards.push(essayCard);
        });
        callback(essayCards);
    }
    getPassageEC(passageId, callback, errorHandler) {
        let url = this.endpoint + "getPassage.php?id=" + passageId;
        fetch(url)
            .then((response) => {
                response.json().then((json) => {
                    callback(json.content);
                });
            })
            .catch((error) => {
                errorHandler(error);
            });
    }
    getPassageECandTitle(passageId, callback, errorHandler) {
        let url = this.endpoint + "getPassage.php?id=" + passageId;
        fetch(url)
            .then((response) => {
                response.json().then((json) => {
                    callback(json.content, json.title);
                });
            })
            .catch((error) => {
                errorHandler(error);
            });
    }
    getTags() {
        let url = this.endpoint + "getTags.php";
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    response.json().then((json) => {
                        resolve(json);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    tagUtil(tagName, tid, operation = "new") {
        let url =
            this.endpoint +
            "tagUtil.php?operation=" +
            operation +
            "&tid=" +
            tid +
            "&tagName=" +
            tagName;
        return new Promise((resolve, reject) => {
            fetch(url, {
                credentials: "include",
            })
                .then((response) => {
                    response.json().then((json) => {
                        resolve(json);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
