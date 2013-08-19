function Main() {
    this.teUrl = document.getElementById("puush-url");
    this.panel = document.getElementById("panel");
    this.fileRegExp = /([^\/]+)(?=\.\w+$)/;
    this.extensionRegExp = /\.[0-9a-z]+$/;
    this.nameRegExp = /\w*/;
}

Main.prototype = (function (prototype) {
    prototype.getUrl = function () {
        return this.teUrl.value;
    };
    prototype.setUrl = function (url) {
        this.teUrl.value = url;
    };
    prototype.decreaseName = function (name) {
        return name.substring(0, name.length - 1) + String.fromCharCode((name[name.length - 1].charCodeAt() - 1));
    };
    prototype.increaseName = function (name) {
        return name.substring(0, name.length - 1) + String.fromCharCode((name[name.length - 1].charCodeAt() + 1));
    };
    prototype.getCorrectedName = function (name) {
        return this.nameRegExp.exec(name)[0];
    };
    prototype.getName = function (url) {
        return this.fileRegExp.exec(url)[0];
    };
    prototype.getExtension = function (url) {
        return this.extensionRegExp.exec(url)[0];
    };
    prototype.getNextName = function (name) {
        var next = this.increaseName(name),
            corrected = this.getCorrectedName(next);

        if (corrected === next) {
            return next;
        }

        return name[name.length - 1] === "9" ? corrected + "a" : name[name.length - 1] === "z" ? corrected + "A" : this.getNextName(corrected) + "0";
    };
    prototype.getPreviousName = function (name) {
        var previous = this.decreaseName(name),
            corrected = this.getCorrectedName(previous);

        if (corrected === previous) {
            return previous;
        }

        return name[name.length - 1] === "A" ? corrected + "z" : name[name.length - 1] === "a" ? corrected + "9" : this.getPreviousName(corrected) + "Z";
    };
    prototype.formUrl = function (name, extension) {
        return "http://puu.sh/" + name + extension;
    };
    prototype.getNextUrl = function () {
        var url = this.getUrl();
        return this.formUrl(this.getNextName(this.getName(url)), this.getExtension(url));
    };
    prototype.getPreviousUrl = function () {
        var url = this.getUrl();
        return this.formUrl(this.getPreviousName(this.getName(url)), this.getExtension(url));
    };
    prototype.prepareImage = function () {
        var image = document.createElement("img"),
            panel = this.panel;

        image.onload = function () {
            panel.removeChild(panel.firstChild);
            panel.style.display = "block";

            var width = image.width,
                height = image.height,
                panelWidth = panel.clientWidth,
                panelHeight = panel.clientHeight - 40,
                coef = Math.min(panelWidth / width, panelHeight / height);

            if (coef < 1) {
                width *= coef; height *= coef;
                image.style.width = width + "px";
                image.style.height = height + "px";
            } else {
                image.style.width = "auto";
                image.style.height = "auto";
            }
            image.style.position = "absolute";
            image.style.left = ((panelWidth - width) / 2) + "px";
            image.style.top = ((panelHeight - height) / 2) + "px";
            panel.appendChild(image);
        };
        return image;
    };
    prototype.loadPrevious = function () {
        var image = this.prepareImage();
        image.src = this.getPreviousUrl();
        this.setUrl(image.src);
    };
    prototype.loadNext = function () {
        var image = this.prepareImage();
        image.src = this.getNextUrl();
        this.setUrl(image.src);
    };

    return prototype;
})(Main.prototype);