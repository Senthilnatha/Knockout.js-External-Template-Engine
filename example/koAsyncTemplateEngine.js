// Knockout Asynchronous jQuery Template Engine
// Author: Jim Cowart (primarily tweaking Steve Sanderson's original template engine)
// License: Ms-Pl (http://www.opensource.org/licenses/ms-pl.html)
// Version 1.0
(function (window, undefined) {
    if (typeof ko == "undefined") throw "You must reference Knockout.js in order for the ko.asyncjQueryTemplateEngine to work.";
    else ko.c = function () {
        this.a = function () {
            if (typeof jQuery == "undefined" || !jQuery.tmpl) return 0;
            if (jQuery.tmpl.tag) {
                if (jQuery.tmpl.tag.tmpl && jQuery.tmpl.tag.tmpl.open && jQuery.tmpl.tag.tmpl.open.toString().indexOf("__") >= 0) return 3;
                return 2
            }
            return 1
        }();
        var e = RegExp("__ko_apos__", "g");
        this.templateUrl = "";
        this.templateSuffix = ".html";
        this.templatePrefix = "";
        this.useDefaultErrorTemplate = !0;
        this.defaultErrorTemplateHtml = "<div style='font-style: italic;'>The template could not be loaded.  HTTP Status code: {STATUSCODE}.</div>";
        this.getTemplateNode = function (a, b) {
            var c = document.getElementById(a);
            if (c == null) {
                var d = null;
                $.ajax({
                    url: b,
                    async: !1,
                    dataType: "html",
                    type: "GET",
                    success: function (a) {
                        d = a
                    },
                    error: function (a) {
                        this.useDefaultErrorTemplate && (d = this.defaultErrorTemplateHtml.replace("{STATUSCODE}", a.status))
                    }.bind(this)
                });
                if (d === null) throw Error("Cannot find template with ID=" + a);
                c = document.createElement("script");
                c.setAttribute("type", "text/html");
                c.setAttribute("id", a);
                c.text = d;
                document.body.appendChild(c)
            }
            return c
        };
        this.b = function (a) {
            a = this.templatePrefix + a + this.templateSuffix;
            return this.templateUrl == void 0 || this.templateUrl == "" ? a : this.templateUrl + "/" + a
        };
        this.renderTemplate = function (a, b, c) {
            c = c || {};
            if (this.a == 0) throw Error("jquery.tmpl not detected.\nTo use KO's default template engine, reference jQuery and jquery.tmpl. See Knockout installation documentation for more details.");
            if (this.a == 1) return a = '<script type="text/html">' + this.getTemplateNode(a, this.b(a)).text + "<\/script>", b = jQuery.tmpl(a, b)[0].text.replace(e, "'"), jQuery.clean([b], document);
            if (!(a in jQuery.template)) {
                var d = this.getTemplateNode(a, this.b(a)).text;
                jQuery.template(a, d)
            }
            b = [b];
            b = jQuery.tmpl(a, b, c.templateOptions);
            b.appendTo(document.createElement("div"));
            jQuery.fragments = {};
            return b
        };
        this.isTemplateRewritten = function (a) {
            if (a in jQuery.template) return !0;
            return this.getTemplateNode(a, this.b(a)).d === !0
        };
        this.rewriteTemplate = function (a, b) {
            var c = this.getTemplateNode(a, this.b(a)),
                d = b(c.text);
            this.a == 1 && (d = ko.f.e(d), d = d.replace(/([\s\S]*?)(\${[\s\S]*?}|{{[\=a-z][\s\S]*?}}|$)/g, function (a, b, c) {
                return b.replace(/\'/g, "__ko_apos__") + c
            }));
            c.text = d;
            c.d = !0
        };
        this.createJavaScriptEvaluatorBlock = function (a) {
            if (this.a == 1) return "{{= " + a + "}}";
            return "{{ko_code ((function() { return " + a + " })()) }}"
        };
        this.addTemplate = function (a, b) {
            document.write("<script type='text/html' id='" + a + "'>" + b + "<\/script>")
        };
        this.a > 1 && (jQuery.tmpl.tag.ko_code = {
            open: (this.a < 3 ? "_" : "__") + ".push($1 || '');"
        })
    };
    ko.c.prototype = new ko.templateEngine;
    asyncjQueryTemplateEngine = new ko.c;
    ko.setTemplateEngine(asyncjQueryTemplateEngine);
})(window);