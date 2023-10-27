const essayCodeParserVersion = "1.5.2";
const essayCodeVersion = "1.1";
const lastfontstyle = "";

export class essayCodeParser {
    countFormula;
    countCode;
    countInlineCode;
    Formulas;
    Codes;
    CodesLang;
    inlineCodes;
    ci;
    defaultfontstyle = new Array();
    dargs;
    lastpstyle = "text-align:justify;";
    inlabelstyle = "";
    curLang = "";
    constructor() {
        this.defaultfontstyle[0] = "15px";
        this.defaultfontstyle[1] = "normal";
        this.defaultfontstyle[2] = "#000000";
        this.defaultfontstyle[3] = "justify";
        this.defaultfontstyle[4] = "none";
        this.defaultfontstyle[5] =
            "-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif";
    }
    setfontstyle(t) {
        t = t.replace(/[\(\)]/g, "");
        let args = t.split(",");
        if (args.length < 4 || args[3] != this.dargs[3]) {
            this.dargs = new Array();
            this.dargs[0] = this.defaultfontstyle[0];
            this.dargs[1] = this.defaultfontstyle[1];
            this.dargs[2] = this.defaultfontstyle[2];
            this.dargs[3] = this.defaultfontstyle[3];
            this.dargs[4] = this.defaultfontstyle[4];
            this.dargs[5] = this.defaultfontstyle[5];
            for (let i = 0; i < 6; i++) {
                if (i >= args.length) {
                    break;
                }
                if (args[i] === "") {
                    continue;
                } else {
                    this.dargs[i] = args[i];
                }
            }
            this.lastpstyle = "text-align:" + this.dargs[3] + ";";
            let lastfontstyle =
                "font-size:" +
                this.dargs[0] +
                ";font-weight:" +
                this.dargs[1] +
                ";color:" +
                this.dargs[2] +
                ";text-decoration:" +
                this.dargs[4] +
                ";font-family:" +
                this.dargs[5] +
                ";";
            this.inlabelstyle = lastfontstyle
                .replace(/%/, ",")
                .replace(/"/, "&quot;");
            return (
                '</span></p><p style="' +
                this.lastpstyle +
                '"><span style="' +
                this.inlabelstyle +
                '">'
            );
        }
        this.dargs = new Array();
        this.dargs[0] = this.defaultfontstyle[0];
        this.dargs[1] = this.defaultfontstyle[1];
        this.dargs[2] = this.defaultfontstyle[2];
        this.dargs[3] = this.defaultfontstyle[3];
        this.dargs[4] = this.defaultfontstyle[4];
        this.dargs[5] = this.defaultfontstyle[5];
        for (let i = 0; i < 6; i++) {
            if (i >= args.length) {
                break;
            }
            if (args[i] === "") {
                continue;
            } else {
                this.dargs[i] = args[i];
            }
        }
        let lastfontstyle =
            "font-size:" +
            this.dargs[0] +
            ";font-weight:" +
            this.dargs[1] +
            ";color:" +
            this.dargs[2] +
            ";text-decoration:" +
            this.dargs[4] +
            ";font-family:" +
            this.dargs[5] +
            ";";
        this.inlabelstyle = lastfontstyle
            .replace(/%/, ",")
            .replace(/"/, "&quot;");
        return '</span><span style="' + this.inlabelstyle + '">';
    }
    image_parser(t) {
        t = t.replace(/[\(\)]/g, "");
        if (t == "") {
            return "Argument wrong Exception";
        }
        let args = t.split(",");
        if (args.length > 3) {
            return "Argument wrong Exception";
        }
        if (args.length == 1) {
            return '<img src="' + args[0] + '" width="100%" alt="image">';
        } else if (args.length == 2) {
            return (
                '<img src="' +
                args[0] +
                '" width="' +
                args[1] +
                '" alt="image">'
            );
        }
        return (
            '<img src="' +
            args[0] +
            '" width="' +
            args[1] +
            '" alt="' +
            args[2] +
            '">'
        );
    }
    title_parser(t) {
        t = t.replace(/[\(\)]/g, "");
        let title = "";
        if (t == "") {
            title = "sample";
        } else {
            title = t;
        }
        return (
            "</span></p><center><h1>" +
            title +
            '</h1></center><p style="' +
            this.lastpstyle +
            '"><span style="' +
            this.inlabelstyle +
            '">'
        );
    }
    smalltitle_parser(t) {
        t = t.replace(/[\(\)]/g, "");
        let title = "";
        if (t == "") {
            title = "sample";
        } else {
            title = t;
        }
        return (
            "</span></p><center><h3>" +
            title +
            '</h3></center><p style="' +
            this.lastpstyle +
            '"><span style="' +
            this.inlabelstyle +
            '">'
        );
    }
    beginbox_parser(t) {
        t = t.replace(/[\(\)]/g, "");
        if (t == "") {
            return '</span></p><div><p style="' + this.lastpstyle + '"><span>';
        }
        let args = t.split(",");
        this.dargs = new Array();
        this.dargs[0] = "100%";
        this.dargs[1] = "center";
        this.dargs[2] = "transparent";
        for (let i = 0; i < 3; i++) {
            if (i >= args.length) {
                break;
            }
            if (args[i] === "") {
                continue;
            }
            this.dargs[i] = args[i];
        }
        if (this.dargs[1] != "center" && this.dargs[1] != "default") {
            return "PARSE ERROR";
        }
        let arg =
            "width:" +
            this.dargs[0] +
            ";" +
            (this.dargs[1] == "center" ? "margin:0 auto 0 auto;" : "") +
            "background-color:" +
            this.dargs[2] +
            ";";
        return (
            '</span></p><div style="' +
            arg +
            '"><p style="' +
            this.lastpstyle +
            '"><span style="' +
            this.inlabelstyle +
            '">'
        );
    }
    exp(code) {
        code = code.replace(/ /g, "");
        if (code == "\\\\") {
            return "<br>";
        } else if (code == "\\par") {
            return (
                '</span></p><p style="text-indent:2em;' +
                this.lastpstyle +
                '"><span style="' +
                this.inlabelstyle +
                '">'
            );
        } else if (code == "\\backslash") {
            return "\\";
        } else if (code == "\\backquote") {
            return "`";
        } else if (code == "\\dollar") {
            return "$";
        } else if (code == "\\endbox()") {
            return (
                '</span></p></div><p style="' +
                this.lastpstyle +
                '"><span style="' +
                this.inlabelstyle +
                '">'
            );
        } else if (code.substr(0, 6) == "\\image") {
            return (
                "</span>" +
                this.image_parser(code.substr(6, code.length)) +
                '<span style="' +
                this.inlabelstyle +
                '">'
            );
        } else if (code.substr(0, 6) == "\\title") {
            return this.title_parser(code.substr(6, code.length));
        } else if (code.substr(0, 8) == "\\setfont") {
            return this.setfontstyle(code.substr(8, code.length));
        } else if (code.substr(0, 8) == "\\setlang") {
            return this.setlanguage(code.substr(8, code.length));
        } else if (code.substr(0, 9) == "\\beginbox") {
            return this.beginbox_parser(code.substr(9, code.length));
        } else if (code.substr(0, 11) == "\\smalltitle") {
            return this.smalltitle_parser(code.substr(11, code.length));
        }
    }
    htmlEncode(html) {
        var temp = document.createElement("div");
        temp.textContent != undefined
            ? (temp.textContent = html)
            : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        //output=output.replace(/ /g,"&nbsp;");
        return output;
    }
    formulaprocessor(str) {
        this.Formulas[this.countFormula] = str;
        this.countFormula++;
        return (
            "EFSOSRAMYUCLOADEPARSERSERIALNO" +
            (this.countFormula - 1).toString() +
            "ENDPPPVF"
        );
    }

    langprocessor(str) {
        if (str.replace(/\\CODE/g, "").replace(/[\(\)]/g, "") != "") {
            this.CodesLang[this.ci] = str
                .replace(/\\CODE/g, "")
                .replace(/[\(\)]/g, "");
            // remove \n at start
            this.CodesLang[this.ci] = this.CodesLang[this.ci].replace(
                /^\n+/,
                ""
            );
        }
        return "";
    }
    codeprocessor(str) {
        this.ci = this.countCode;
        this.CodesLang[this.ci] = "";
        this.Codes[this.countCode] = this.htmlEncode(
            str.replace(/\\CODE(\([\s\S]*?\))?/g, (str) =>
                this.langprocessor(str)
            )
        );
        this.countCode++;
        return (
            "ECSOSDAEYCODEPARSERSERIALNO" +
            (this.countCode - 1).toString() +
            "ENDPPPVF"
        );
    }
    inlineprocessor(str) {
        this.inlineCodes[this.countInlineCode] = this.htmlEncode(
            str.replace(/`/g, "")
        );
        this.countInlineCode++;
        return (
            "ECSOSDAEYICNOLDIENPEARSERSERIALNO" +
            (this.countInlineCode - 1).toString() +
            "ENDPPPVF"
        );
    }
    formulaback(str) {
        for (let i = 0; i < this.countFormula; i++) {
            str = str.replace(
                "EFSOSRAMYUCLOADEPARSERSERIALNO" + i.toString() + "ENDPPPVF",
                (
                    "</span> " +
                    this.Formulas[i] +
                    ' <span style="' +
                    this.inlabelstyle +
                    '">'
                ).replace(/\$/g, "$$$$")
            );
        }
        return str;
    }
    trim(str) {
        return str.replace(/^\n+|\n+$/g, "");
    }
    codeback(str) {
        for (let i = 0; i < this.countCode; i++) {
            str = str.replace(
                "ECSOSDAEYCODEPARSERSERIALNO" + i.toString() + "ENDPPPVF",
                (
                    '</span></p><pre style="width:100%;overflow-x:auto;"><code class="language-' +
                    this.CodesLang[i] +
                    '">' +
                    this.trim(this.Codes[i]) +
                    '</code></pre><p style="' +
                    this.lastpstyle +
                    '"><span style="' +
                    this.inlabelstyle +
                    '">'
                ).replace(/\$/g, "$$$$")
            );
        }
        return str;
    }
    inlinecodeback(str) {
        for (let i = 0; i < this.countInlineCode; i++) {
            str = str.replace(
                "ECSOSDAEYICNOLDIENPEARSERSERIALNO" + i.toString() + "ENDPPPVF",
                (
                    '</span><span style="display:inline-block;background-color:#eeeeee;color:#020202;border:1px solid black;font-family:Consolas,Courier New;text-indent:0;">' +
                    this.inlineCodes[i] +
                    '</span><span style="' +
                    this.inlabelstyle +
                    '">'
                ).replace(/\$/g, "$$$$")
            );
        }
        return str;
    }
    parse(str) {
        this.Formulas = new Array();
        this.Codes = new Array();
        this.CodesLang = new Array();
        this.inlineCodes = new Array();
        this.countFormula = 0;
        this.countCode = 0;
        this.countInlineCode = 0;
        this.dargs = new Array();
        this.dargs[0] = this.defaultfontstyle[0];
        this.dargs[1] = this.defaultfontstyle[1];
        this.dargs[2] = this.defaultfontstyle[2];
        this.dargs[3] = this.defaultfontstyle[3];
        this.dargs[4] = this.defaultfontstyle[4];
        this.dargs[5] = this.defaultfontstyle[5];
        let lastfontstyle =
            "font-size:" +
            this.dargs[0] +
            ";font-weight:" +
            this.dargs[1] +
            ";color:" +
            this.dargs[2] +
            ";text-decoration:" +
            this.dargs[4] +
            ";font-family:" +
            this.dargs[5] +
            ";";
        this.inlabelstyle = lastfontstyle.replace(/"/, "&quot;");
        //protects formulas and codes
        //str = str.replace(/`[\s\S]*?`/g, this.inlineprocessor);
        // this will be undefined
        str = str.replace(/`[\s\S]*?`/g, (str) => this.inlineprocessor(str));
        //str = str.replace(/\\CODE[\s\S]*?\\CODE/g, this.codeprocessor);
        //str = str.replace(/\$\$[\s\S]*?\$\$/g, this.formulaprocessor);
        //str = str.replace(/\$[\s\S]*?\$/g, this.formulaprocessor);
        str = str.replace(/\\CODE[\s\S]*?\\CODE/g, (str) =>
            this.codeprocessor(str)
        );
        str = str.replace(/\$\$[\s\S]*?\$\$/g, (str) =>
            this.formulaprocessor(str)
        );
        str = str.replace(/\$[\s\S]*?\$/g, (str) => this.formulaprocessor(str));
        let end =
            '<p style="' +
            this.lastpstyle +
            '"><span style="' +
            this.inlabelstyle +
            '">' +
            str.replace(/\\[a-zA-Z-\\]+(\([\s\S]*?\))?/g, (str) =>
                this.exp(str)
            ) +
            "</span></p>";
        end = this.formulaback(end);
        end = this.inlinecodeback(end);
        end = this.codeback(end);
        return end;
    }
}
