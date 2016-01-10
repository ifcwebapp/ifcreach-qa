var models;
(function(models) {
    var Clients = (function () {
        function Clients(host) {
            var _this = this;
            this.clientsData = ko.observableArray([]);
            this.regions = ko.observableArray([]);
            this.imageClick = function(data) {
                if (data.link != '') window.open(data.link);
            };
            this.sortedBy = ko.observable('alphabet');
            this.sortedDirection = ko.observable('asc');
            this.anchorA = ko.observable('');
            this.anchorE = ko.observable('');
            this.anchorI = ko.observable('');
            this.anchorM = ko.observable('');
            this.anchorQ = ko.observable('');
            this.anchorU = ko.observable('');
            this.anchorMfi = ko.observable('');
            this.anchorSme = ko.observable('');
            this.anchorNonSme = ko.observable('');
            this.sort = function (sortBy, sortDirection) {
                _this.sortedBy(sortBy);
                switch (sortBy) {
                    case 'alphabet':
                        _this.clientsData.sort(function (a, b) {
                            var an = a.name + a.type;
                            var bn = b.name + b.type;
                            return an == bn ? 0 : (an > bn ? 1 : -1);
                        });
                        break;
                    case 'type':
                        _this.clientsData.sort(function (a, b) {
                            var an = a.type + a.name;
                            var bn = b.type + b.name;
                            return an == bn ? 0 : (an > bn ? 1 : -1);
                        });
                        break;
                    case 'region':
                        _this.clientsData.sort(function (a, b) {
                            var an = a.region + a.name;
                            var bn = b.region + b.name;
                            return an == bn ? 0 : (an > bn ? 1 : -1);
                        });
                        break;
                }
            }
            this.groupedClientsData = ko.observableArray([]);
            
            var parseFile = function( strData, strDelimiter ){
                // Check to see if the delimiter is defined. If not,
                // then default to comma.
                strDelimiter = (strDelimiter || ",");

                // Create a regular expression to parse the CSV values.
                var objPattern = new RegExp(
                    (
                        // Delimiters.
                        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                        // Quoted fields.
                        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                        // Standard fields.
                        "([^\"\\" + strDelimiter + "\\r\\n]*))"
                    ),
                    "gi"
                    );


                // Create an array to hold our data. Give the array
                // a default empty first row.
                var arrData = [[]];

                // Create an array to hold our individual pattern
                // matching groups.
                var arrMatches = null;


                // Keep looping over the regular expression matches
                // until we can no longer find a match.
                while (arrMatches = objPattern.exec( strData )){

                    // Get the delimiter that was found.
                    var strMatchedDelimiter = arrMatches[ 1 ];

                    // Check to see if the given delimiter has a length
                    // (is not the start of string) and if it matches
                    // field delimiter. If id does not, then we know
                    // that this delimiter is a row delimiter.
                    if (
                        strMatchedDelimiter.length &&
                        (strMatchedDelimiter != strDelimiter)
                        ){

                        // Since we have reached a new row of data,
                        // add an empty row to our data array.
                        arrData.push( [] );

                    }


                    // Now that we have our delimiter out of the way,
                    // let's check to see which kind of value we
                    // captured (quoted or unquoted).
                    if (arrMatches[ 2 ]){

                        // We found a quoted value. When we capture
                        // this value, unescape any double quotes.
                        var strMatchedValue = arrMatches[ 2 ].replace(
                            new RegExp( "\"\"", "g" ),
                            "\""
                            );

                    } else {

                        // We found a non-quoted value.
                        var strMatchedValue = arrMatches[ 3 ];

                    }


                    // Now that we have our value string, let's add
                    // it to the data array.
                    arrData[ arrData.length - 1 ].push( strMatchedValue );
                }

                // Return the parsed data.
                return( arrData );
            }
            $.get(host + 'clients.csv', function(data) {
                var arr = parseFile(data);
                
                for (var i = 1; i < arr.length; i++) {
                    if (arr[i][0] != '' && arr[i][1] != undefined) {
                        var type = arr[i][5].trim().toUpperCase();
                        var region = arr[i][3].trim();
                        var regionHref = region.replace(' ', '');
                        var typeDescr = '';
                        switch (type) {
                            case "MFI":
                                typeDescr = "Microfinance Institution";
                                break;
                            case "SME":
                                typeDescr = "SME Financial Institution";
                                break;
                            case "NON-MSME":
                                typeDescr = "Non-MSME Financial Institution";
                                break;
                        };
                        var name = arr[i][1].trim();
                        _this.clientsData.push({
                            id: arr[i][0],
                            name: name,
                            link: arr[i][2],
                            region: region,
                            logo: arr[i][4],
                            type: type,
                            typeDescr: typeDescr,
                            regionHref: regionHref
                        });
                    }

                }
                _this.sort('region', '');
                for (var i = 0; i < _this.clientsData().length; i++) {
                    var c = _this.clientsData()[i];
                    if (_this.regions.indexOf(c.region) == -1) {
                        _this.regions.push(c.region);
                    }
                }

                _this.sort('alphabet', '');
                for (var i = 0; i < _this.clientsData().length; i++) {
                    var c = _this.clientsData()[i];
                    var s = c.name.charAt(0);
                    if (_this.anchorA() == '' && (s == 'A' || s == 'B' || s == 'C' || s == 'D')) {
                        _this.anchorA('#' + s);
                    }
                    if (_this.anchorE() == '' && (s == 'E' || s == 'F' || s == 'G' || s == 'H')) {
                        _this.anchorE('#' + s);
                    }
                    if (_this.anchorI() == '' && (s == 'I' || s == 'J' || s == 'K' || s == 'L')) {
                        _this.anchorI('#' + s);
                    }
                    if (_this.anchorM() == '' && (s == 'M' || s == 'N' || s == 'O' || s == 'P')) {
                        _this.anchorM('#' + s);
                    }
                    if (_this.anchorQ() == '' && (s == 'Q' || s == 'R' || s == 'S' || s == 'T')) {
                        _this.anchorQ('#' + s);
                    }
                    if (_this.anchorU() == '' && (s == 'U' || s == 'V' || s == 'W' || s == 'X' || s == 'Y'|| s == 'Z')) {
                        _this.anchorU('#' + s);
                    }
                    

                }
            });
        }

        return Clients;
    })();
    models.Clients = Clients;
})(models || (models = {}));