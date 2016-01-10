///<reference path='../typings/knockout/knockout.d.ts' />
///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='../typings/jqueryui/jqueryui.d.ts' />
///<reference path='../typings/googlemaps/google.maps.d.ts' />
///<reference path='../typings/highcharts/highcharts.d.ts' />
///<reference path='../typings/sprintf/sprintf.d.ts' />
var models;
(function (models) {
    var MainModel = (function () {
        function MainModel(host) {
            this.bubbles = [];
            this.windows = [];
            this.ctaLayer = null;
            this.kmlValue = ko.observable('');
            this.indicatorStyleValue = ko.observable('bubble');
            this.chartIndicatorValue = ko.observable('account');
            this.bubbleIndicatorValue = ko.observable('19');
            this.isChartSelectorVisible = ko.observable(false);
            this.isLegendVisible = ko.observable(false);
            //countries: KnockoutObservableArray<any> = ko.observableArray([]);
            this.countriesAndRegions = ko.observableArray([]);
            this.isExpanded = ko.observable(true);
            this.selectedValues = ko.observableArray();
            this.summaryType = ko.observable('summary');
            this.linkText = ko.observable('Show link to this page');
            this.isLinkVisible = ko.observable(false);
            var _this = this;

            _this.host = host;
            var countryParams = [_this.getUrlParameter('country1'), _this.getUrlParameter('country2'), _this.getUrlParameter('country3')];

            var mapOptions = {
                zoom: 2,
                center: new google.maps.LatLng(45.58329, 12.980347),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                panControl: false,
                zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
                mapTypeControl: false,
                scrollwheel: false,
                minZoom: 1
            };

            _this.map = new google.maps.Map($('#map-canvas')[0], mapOptions);

            google.maps.event.addListener(_this.map, 'zoom_changed', function () {
                _this.zoomChanged(_this.map);
            });

            _this.getKml();
            _this.initiateBubbles(_this);
            _this.showBubbles(this.map.getZoom(), this.map);

            _this.countriesAndRegions.push(new models.SummaryItem(models.MsmeDevelopingData.rows, models.CountryIndicatorData.developmentCountries, 'development'));
            var regionRows = models.MsmeRegionData.rows;
            regionRows.sort(function (left, right) {
                return left[0] == right[0] ? 0 : (left[0] < right[0] ? -1 : 1);
            });
            for (var i = 0; i < regionRows.length; i++) {
                var c = new models.SummaryItem(regionRows[i], models.CountryIndicatorData.regionRows[regionRows[i][0]], 'region');
                _this.countriesAndRegions.push(c);
            }

            var countryRows = models.MsmeData.rows;
            countryRows.sort(function (left, right) {
                return left[0] == right[0] ? 0 : (left[0] < right[0] ? -1 : 1);
            });
            for (var i = 0; i < countryRows.length; i++) {
                var c = new models.SummaryItem(countryRows[i], models.CountryIndicatorData.rows[countryRows[i][1]], 'country');

                //_this.countries.push(c);
                _this.countriesAndRegions.push(c);
            }

            //_this.countries.sort(function (left, right) { return left.Name == right.Name ? 0 : (left.Name < right.Name ? -1 : 1) });
            //_this.countriesAndRegions.sort(function (left, right) { return left.Name == right.Name ? 0 : (left.Name < right.Name ? -1 : 1) });
            $('#scrollablePart').height($(window).height() - 110);
            _this.summaryDialog = $('#summary').dialog({
                autoOpen: false,
                modal: true,
                height: $(window).height() - 50,
                width: 1000,
                dialogClass: 'noTitleDialog'
            });

            _this.createCharts(_this);

            for (var i = 0; i < 3; i++) {
                this.selectedValues.push(ko.observable(new models.SummaryItem(null, null, 'empty')));
            }

            if (countryParams[0] != "null") {
                _this.showInitSummaryDialog(_this, null, countryParams[0], countryParams[1], countryParams[2]);
            }

            _this.shortPanelText = ko.computed(function () {
                var b = _this.bubbleIndicatorValue();
                var c = _this.chartIndicatorValue();
                var k = _this.kmlValue();
                return '<strong>Layer:</strong> ' + $('#colorIndicator option:selected').text() + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Indicator:</strong>' + (!_this.isChartSelectorVisible() ? $('#bubbleIndicator option:selected').text() : $('#chartIndicator option:selected').text());
            });

            _this.link = ko.computed(function () {
                return _this.host + '?country1=' + encodeURIComponent(_this.selectedValues()[0]().Name) + '&country2=' + encodeURIComponent(_this.selectedValues()[1]().Name) + '&country3=' + encodeURIComponent(_this.selectedValues()[2]().Name);
            });
        }
        MainModel.prototype.getUrlParameter = function (name) {
            return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
        };

        MainModel.prototype.showLink = function (data) {
            if (data.isLinkVisible()) {
                data.linkText('Show link to this page');
            } else {
                data.linkText('Hide');
            }
            data.isLinkVisible(!data.isLinkVisible());
        };

        MainModel.prototype.closeSummary = function (data) {
            data.summaryDialog.dialog('close');
        };

        MainModel.prototype.createCharts = function (data) {
            $('#accountChart').highcharts({
                chart: { type: 'column' },
                //colors: ['#762A83', '#9970AB', '#C2A5CF'],
                title: { text: 'Access' },
                xAxis: {
                    categories: ['Have Checking', 'Have Overdraft', 'Have Loan', 'Have Access to Credit'],
                    labels: {
                        staggerLines: 5
                    }
                },
                yAxis: { title: { text: "%" }, max: 100 },
                series: [{ name: "item1", data: [] }, { name: "item2", data: [] }, { name: "item3", data: [] }],
                credits: { enabled: false },
                tooltip: { valueSuffix: "%" }
            });

            data.accChart = $('#accountChart').highcharts();

            $('#serviceChart').highcharts({
                chart: { type: 'column' },
                //colors: ['#762A83', '#9970AB', '#C2A5CF'],
                title: { text: 'How well served?' },
                xAxis: {
                    categories: ['Does not need credit', 'Unserved', 'Underserved', 'Well served'],
                    labels: {
                        staggerLines: 5
                    }
                },
                yAxis: { title: { text: "%" }, max: 100 },
                series: [{ name: "item1", data: [] }, { name: "item2", data: [] }, { name: "item3", data: [] }],
                credits: { enabled: false },
                tooltip: { valueSuffix: "%" }
            });

            data.srvChart = $('#serviceChart').highcharts();

            $('#sourceChart').highcharts({
                chart: { type: 'column' },
                //colors: ['#762A83', '#9970AB', '#C2A5CF'],
                title: { text: 'Source of Financing' },
                xAxis: {
                    categories: ['Private Commercial Bank', 'State-owned Bank and/or Govt. Agency', 'Non-bank Financial Institution', 'Other'],
                    labels: {
                        staggerLines: 5
                    }
                },
                yAxis: { title: { text: "%" }, max: 100 },
                series: [{ name: "item1", data: [] }, { name: "item2", data: [] }, { name: "item3", data: [] }],
                credits: { enabled: false },
                tooltip: { valueSuffix: "%" }
            });

            data.srcChart = $('#sourceChart').highcharts();
        };

        MainModel.prototype.changeSelectedCountry = function (data, event) {
            data.selectedValues()[0]().updateCharts(data.accChart.series[0], data.srvChart.series[0], data.srcChart.series[0]);
            data.selectedValues()[1]().updateCharts(data.accChart.series[1], data.srvChart.series[1], data.srcChart.series[1]);
            data.selectedValues()[2]().updateCharts(data.accChart.series[2], data.srvChart.series[2], data.srcChart.series[2]);
            data.accChart.redraw();
            data.srvChart.redraw();
            data.srcChart.redraw();
        };

        MainModel.prototype.onCountryChange = function (data, event) {
            if (data.summaryType() == 'summary') {
                var c = null, d = null;
                var regionName = models.CountryRegionMap.map[data.selectedValues()[0]().Name];
                for (var i = 0; i < data.countriesAndRegions().length; i++) {
                    var r = data.countriesAndRegions()[i];
                    if (r.Name == regionName) {
                        data.selectedValues()[1](r);
                    }
                    if (r.Name == 'Developing Countries') {
                        data.selectedValues()[2](r);
                    }
                    //if (r.type == 'region' || r.type == 'development') {
                    //    data.countries.remove(r);
                    //}
                }
            } else {
                //for (var i = 0; i < data.countriesAndRegions().length; i++) {
                //    var r = data.countriesAndRegions()[i];
                //    if (r.type == 'region' || r.type == 'development') {
                //        data.countries.push(r);
                //    }
                //}
            }

            data.changeSelectedCountry(data, event);
            return true;
        };

        MainModel.prototype.showSummaryDialog = function (data, event, country) {
            if (country != undefined) {
                var c = $.grep(data.countriesAndRegions(), function (e, i) {
                    return e.Name == country;
                });
                if (c.length > 0) {
                    data.selectedValues()[0](c[0]);
                }
            } else {
                var c = $.grep(data.countriesAndRegions(), function (e, i) {
                    return e.Name == 'Afghanistan';
                });
                if (c.length > 0) {
                    data.selectedValues()[0](c[0]);
                }
            }
            data.summaryType('summary');
            data.onCountryChange(data, event);
            data.summaryDialog.dialog("open");
        };

        MainModel.prototype.showInitSummaryDialog = function (data, event, country1, country2, country3) {
            var c1 = $.grep(data.countriesAndRegions(), function (e, i) {
                return e.Name == country1;
            });
            var c2 = $.grep(data.countriesAndRegions(), function (e, i) {
                return e.Name == country2;
            });
            var c3 = $.grep(data.countriesAndRegions(), function (e, i) {
                return e.Name == country3;
            });
            data.selectedValues()[0](c1[0]);
            data.selectedValues()[1](c2[0]);
            data.selectedValues()[2](c3[0]);
            data.summaryType('compare');
            data.onCountryChange(data, event);
            data.summaryDialog.dialog("open");
        };

        MainModel.prototype.showSelectors = function () {
            this.isChartSelectorVisible(this.indicatorStyleValue() == "chart");

            //if (this.map.getZoom() > 3) {
            this.showBubbles(this.map.getZoom(), this.map);
            //}
        };

        MainModel.prototype.showLegend = function () {
            $('div[id*="legend"]').hide();
            var val = this.chartIndicatorValue();
            $('div[id="legend' + val + '"]').show();
        };

        MainModel.prototype.expandMenu = function (data) {
            data.isExpanded(!data.isExpanded());
        };

        MainModel.prototype.showBubbles = function (zoom, map) {
            //var selector = $('#bubbleIndicator');
            var _this = this;
            var selectedText = $('#bubbleIndicator option:selected').text();
            var isCountry = (zoom > 3);
            var id = this.bubbleIndicatorValue();
            var isBubble = (this.indicatorStyleValue() == "bubble");
            var chartData = this.chartIndicatorValue();
            var alpha = {};
            var betta = {};
            var scaledZoom = isCountry ? zoom - 3 : zoom;
            if (isCountry) {
                switch (id) {
                    case "gap":
                        alpha.index = 19;
                        alpha.value = 50 / 1000000000000;
                        break;
                    case "enterprise":
                        alpha.index = 5;
                        alpha.value = 50 / 100000000;
                        break;
                    case "unserved":
                        alpha.index = 12;
                        alpha.value = 50 / 200;
                        break;
                    case "underserved":
                        alpha.index = 13;
                        alpha.value = 50 / 200;
                        break;
                }

                switch (chartData) {
                    case "account":
                        betta.index = 21;
                        betta.categories = ['Have Checking', 'Have Overdraft', 'Have Loan', 'Have Access to Credit'];
                        betta.indexes = [6, 7, 8, 9];
                        break;
                    case "served":
                        betta.index = 23;
                        betta.categories = ['Does not need credit', 'Unserved', 'Underserved', 'Well served'];
                        betta.indexes = [10, 11, 12, 13];
                        break;
                    case "source":
                        betta.index = 25;
                        betta.categories = ['Private Commercial Bank', 'State-owned Bank and/or Govt. Agency', 'Non-bank Financial Institution', 'Other'];
                        betta.indexes = [14, 15, 16, 17];
                        break;
                }
            } else {
                switch (id) {
                    case "gap":
                        alpha.index = 25;
                        alpha.value = 50 / 5000000000000;
                        break;
                    case "enterprise":
                        alpha.index = 5;
                        alpha.value = 50 / 100000000;
                        break;
                    case "unserved":
                        alpha.index = 12;
                        alpha.value = 50 / 200;
                        break;
                    case "underserved":
                        alpha.index = 13;
                        alpha.value = 50 / 100;
                        break;
                }

                switch (chartData) {
                    case "account":
                        betta.index = 30;
                        betta.categories = ['Have Checking', 'Have Overdraft', 'Have Loan', 'Have Access to Credit'];
                        betta.indexes = [6, 7, 8, 9];
                        break;
                    case "served":
                        betta.index = 32;
                        betta.categories = ['Does not need credit', 'Unserved', 'Underserved', 'Well served'];
                        betta.indexes = [10, 11, 12, 13];
                        break;
                    case "source":
                        betta.index = 34;
                        betta.categories = ['Private Commercial Bank', 'State-owned Bank and/or Govt. Agency', 'Non-bank Financial Institution', 'Other'];
                        betta.indexes = [18, 19, 20, 21];
                        break;
                }
            }

            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[i];
                if ((bubble.bubbleType != "country" && isCountry) || (bubble.bubbleType != "region" && !isCountry)) {
                    continue;
                }
                if (isBubble) {
                    bubble.setIcon({
                        path: google.maps.SymbolPath.CIRCLE,
                        fillOpacity: 1,
                        fillColor: '#E6550D',
                        strokeOpacity: 0,
                        scale: alpha.value * parseInt(bubble.data[alpha.index]) + scaledZoom * 4
                    });
                    if (alpha.index != undefined && bubble.data != undefined) {
                        bubble.setTitle(selectedText + ": " + _this.numberWithCommas(bubble.data[alpha.index]));
                    }
                } else {
                    bubble.setIcon({
                        url: this.host + "images/" + chartData + "/" + bubble.data[1] + ".png",
                        scaledSize: new google.maps.Size(bubble.data[betta.index - 1] / 4 * scaledZoom, bubble.data[betta.index] / 4 * scaledZoom)
                    });
                    bubble.setTitle(sprintf('%s: %s%%\n%s: %s%%\n%s: %s%%\n%s: %s%%\n', betta.categories[3], bubble.data[betta.indexes[3]], betta.categories[2], bubble.data[betta.indexes[2]], betta.categories[1], bubble.data[betta.indexes[1]], betta.categories[0], bubble.data[betta.indexes[0]]));
                }

                bubble.setMap(map);
            }
        };

        MainModel.prototype.hideBubbles = function () {
            for (var i = 0; i < this.bubbles.length; i++) {
                var bubble = this.bubbles[i];
                bubble.setMap(null);
            }
        };

        MainModel.prototype.zoomChanged = function (map) {
            var zoomLevel = map.getZoom();
            this.hideBubbles();
            this.showBubbles(zoomLevel, map);
        };

        MainModel.prototype.getKml = function () {
            if (this.ctaLayer != null) {
                this.ctaLayer.setMap(null);
            }

            if (this.kmlValue() != '') {
                this.ctaLayer = new google.maps.KmlLayer(this.host + "indicators/" + this.kmlValue(), {
                    preserveViewport: true,
                    screenOverlays: this.isLegendVisible()
                });
                this.ctaLayer.setMap(this.map);
            }

            return true;
        };

        MainModel.prototype.numberWithCommas = function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        MainModel.prototype.getCountryInfo = function (info) {
            var str = "<h2>" + info[0] + "</h2><a href='#' id='link" + info[1] + "' data-bind='click : function(data, event) { showSummaryDialog(data, event, \"" + info[0] + "\") }'>Show Summary</a><table>";

            //console.log(info[0] + ":" + models.CountryRegionMap.map[info[0]]);
            var rowNum = 1;
            if (info[5] != null) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td><strong>#MSMEs</strong></td><td style='text-align:right'>" + this.numberWithCommas(info[5]) + "</td></tr>";
            }
            if (info[10] != null) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td><strong>Access to finance as major/severe barrier</strong></td><td style='text-align:right'>" + this.numberWithCommas(info[10]) + "%</td></tr>";
            }
            if ((info[6] != null) || (info[7] != null) || (info[8] != null) || (info[9] != null)) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td colspan=2><strong>Access</strong></td></tr>";
                if (info[6] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Checking</strong></td><td style='text-align:right'>" + info[6] + "%</td></tr>";
                }
                if (info[7] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Overdraft</strong></td><td style='text-align:right'>" + info[7] + "%</td></tr>";
                }
                if (info[8] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Loan</strong></td><td style='text-align:right'>" + info[8] + "%</td></tr>";
                }
                if (info[9] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Access to Credit</strong></td><td style='text-align:right'>" + info[9] + "%</td></tr>";
                }
            }
            if ((info[11] != null) || (info[12] != null) || (info[13] != null) || (info[14] != null)) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td colspan=2><strong>How well served?</strong></td></tr>";
                if (info[11] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Does not need credit</strong></td><td style='text-align:right'>" + info[11] + "%</td></tr>";
                }
                if (info[12] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Unserved</strong></td><td style='text-align:right'>" + info[12] + "%</td></tr>";
                }
                if (info[13] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Underserved</strong></td><td style='text-align:right'>" + info[13] + "%</td></tr>";
                }
                if (info[14] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Well served</strong></td><td style='text-align:right'>" + info[14] + "%</td></tr>";
                }
            }
            if ((info[15] != null) || (info[16] != null) || (info[17] != null) || (info[18] != null)) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td colspan=2><strong>Source of Financing</strong></td></tr>";
                if (info[15] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Private Commercial Bank as Source of Financing</strong></td><td style='text-align:right'>" + info[15] + "%</td></tr>";
                }
                if (info[16] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>State-owned Bank and/or Govt. Agency as Source of Financing</strong></td><td style='text-align:right'>" + info[16] + "%</td></tr>";
                }
                if (info[17] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Non-bank Financial Institution as Source of Financing</strong></td><td style='text-align:right'>" + info[17] + "%</td></tr>";
                }
                if (info[18] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Other Source of Financing</strong></td><td style='text-align:right'>" + info[18] + "%</td></tr>";
                }
            }
            str += "</table>";

            return str;
        };

        MainModel.prototype.getRegionInfo = function (info) {
            var str = "<h2>" + info[0] + "</h2><a href='#' id='link" + info[1] + "' data-bind='click : function(data, event) { showSummaryDialog(data, event, \"" + info[0] + "\") }'>Show Summary</a><table>";

            //console.log(info[0] + ":" + models.CountryRegionMap.map[info[0]]);
            var rowNum = 1;
            if (info[5] != null) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td><strong>#MSMEs</strong></td><td style='text-align:right'>" + this.numberWithCommas(info[5]) + "</td></tr>";
            }
            if (info[10] != null) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td><strong>Access to finance as major/severe barrier</strong></td><td style='text-align:right'>" + this.numberWithCommas(info[10]) + "%</td></tr>";
            }
            if ((info[6] != null) || (info[7] != null) || (info[8] != null) || (info[9] != null)) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td colspan=2><strong>Access</strong></td></tr>";
                if (info[6] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Checking</strong></td><td style='text-align:right'>" + info[6] + "%</td></tr>";
                }
                if (info[7] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Overdraft</strong></td><td style='text-align:right'>" + info[7] + "%</td></tr>";
                }
                if (info[8] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Loan</strong></td><td style='text-align:right'>" + info[8] + "%</td></tr>";
                }
                if (info[9] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Have Access to Credit</strong></td><td style='text-align:right'>" + info[9] + "%</td></tr>";
                }
            }
            if ((info[11] != null) || (info[12] != null) || (info[13] != null) || (info[14] != null)) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td colspan=2><strong>How well served?</strong></td></tr>";
                if (info[11] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Does not need credit</strong></td><td style='text-align:right'>" + info[11] + "%</td></tr>";
                }
                if (info[12] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Unserved</strong></td><td style='text-align:right'>" + info[12] + "%</td></tr>";
                }
                if (info[13] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Underserved</strong></td><td style='text-align:right'>" + info[13] + "%</td></tr>";
                }
                if (info[14] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Well served</strong></td><td style='text-align:right'>" + info[14] + "%</td></tr>";
                }
            }
            if ((info[18] != null) || (info[19] != null) || (info[20] != null) || (info[21] != null)) {
                str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td colspan=2><strong>Source of Financing</strong></td></tr>";
                if (info[18] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Private Commercial Bank as Source of Financing</strong></td><td style='text-align:right'>" + info[18] + "%</td></tr>";
                }
                if (info[19] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>State-owned Bank and/or Govt. Agency as Source of Financing</strong></td><td style='text-align:right'>" + info[19] + "%</td></tr>";
                }
                if (info[20] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Non-bank Financial Institution as Source of Financing</strong></td><td style='text-align:right'>" + info[20] + "%</td></tr>";
                }
                if (info[21] != null) {
                    str += "<tr class='" + ((rowNum++) % 2 == 1 ? "odd" : "even") + "' ><td class='shift'><strong>Other Source of Financing</strong></td><td style='text-align:right'>" + info[21] + "%</td></tr>";
                }
            }
            str += "</table>";
            if (info[1] != 'LAAM') {
                str = "<div style='height: 200px'>" + str + "</div>";
            }
            return str;
        };

        MainModel.prototype.initiateBubbles = function (main) {
            if (this.bubbles.length == 0) {
                for (var i = 0; i < models.MsmeData.rows.length + models.MsmeRegionData.rows.length; i++) {
                    (function (i) {
                        var isCountry = (i < models.MsmeData.rows.length);
                        var info = isCountry ? models.MsmeData.rows[i] : models.MsmeRegionData.rows[i - models.MsmeData.rows.length];
                        var bubble = new google.maps.Marker({
                            position: isCountry ? (new google.maps.LatLng(info[2], info[3])) : (new google.maps.LatLng(info[27], info[28])),
                            bubbleType: isCountry ? "country" : "region",
                            data: info
                        });

                        var infowindow = new google.maps.InfoWindow({
                            content: isCountry ? main.getCountryInfo(info) : main.getRegionInfo(info)
                        });

                        google.maps.event.addListener(bubble, 'click', function () {
                            for (var j = 0; j < main.windows.length; j++) {
                                main.windows[j].close();
                            }
                            main.windows[i].open(main.map, main.bubbles[i]);
                        });

                        google.maps.event.addListener(infowindow, 'domready', function () {
                            ko.applyBindings(main, $("#link" + info[1])[0]);
                        });

                        main.bubbles.push(bubble);
                        main.windows.push(infowindow);
                    })(i);
                }
            }
        };
        return MainModel;
    })();
    models.MainModel = MainModel;
})(models || (models = {}));
