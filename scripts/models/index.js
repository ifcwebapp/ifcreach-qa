var mapDashboard = null;
var detailsDashboard = null;
var allRegionsDashboard = null;
var activeDashboard = null;
var workbook, activeSheet;
function switchDashboard(selectedId, hideOnLoad, changeMap) {

    if (selectedId[0] != "None") {
        //$("#detailsNoSelection").hide();
        $("#detailsDashboard").show();
        $("#allRegionsDashboard").hide();
        activeDashboard = detailsDashboard;
        resetActiveDashboard();
        //$("#regionSelector").show();
        var title = {};
        for (var i = 0; i < selectedId.length; i++) {
            title[selectedId[i]] = 1;
        }
        var headerArr = [];
        var header = "";
        for (var propertyName in title) {
            headerArr.push(propertyName);
            //header += (header.length == 0 ? "" : ", ") + propertyName;
        }
        headerArr.sort(function (a, b) { return a == b ? 0 : (a > b ? 1 : -1); });
        for (var i = 0; i < headerArr.length; i++) {
            header += (header.length == 0 ? "" : ", ") + headerArr[i];
        }
        $("#detailsTitle").text(header);
    } else {
        //$("#detailsNoSelection").show();
        $("#detailsDashboard").hide();
        $("#allRegionsDashboard").show();
        $("#detailsTitle").text("All Regions");
        activeDashboard = allRegionsDashboard;
        resetActiveDashboard();
        //$("#regionSelector").hide();
    }

    if (selectedId[0] != "None") {
        var worksheets = detailsDashboard.getWorkbook().getActiveSheet().getWorksheets();
        for (var i = 0; i < worksheets.length; i++) {
            var ws = worksheets[i];
            var name = ws.getName();
            if (name != "Sheet 6" && name != "Sheet 7" && name != "Sheet 8" && name != "Sheet 9") {
                ws.applyFilterAsync("Region", selectedId, tableauSoftware.FilterUpdateType.REPLACE);
            }
        }
    }

    


}

function onSelectRegionChange(selectedId, hideOnLoad, changeMap) {
    if (changeMap) {
        var worksheets = mapDashboard.getWorkbook().getActiveSheet().getWorksheets();
        for (var i = 0; i < worksheets.length; i++) {
            var ws = worksheets[i];
            //var name = ws.getName();
            //if (name != "Sheet 6" && name != "Sheet 7" && name != "Sheet 8" && name != "Sheet 9") {
            ws.selectMarksAsync("Region", selectedId, tableauSoftware.FilterUpdateType.REPLACE);
            //}
        }
    }
}

function onMarksSelection(marksEvent) {
    //debugger;
    return marksEvent.getMarksAsync().then(reportSelectedMarks);
}

var doNotSkipEvent = true;
var firstMarks = null;
function reportSelectedMarks(marks) {
    doNotSkipEvent = !doNotSkipEvent;
    if (!doNotSkipEvent) {
        firstMarks = marks;
    } else {
        if (firstMarks.length == 0 && marks.length == 0) {
            $("#regionSelectorCtrl").val('None');
            switchDashboard(["None"]);
        } else {
            if (firstMarks.length != 0) {
                marks = firstMarks;
            }
            var selectedRegion = [];
            for (var markIndex = 0; markIndex < marks.length; markIndex++) {
                var pairs = marks[markIndex].getPairs();

                for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                    var pair = pairs[pairIndex];
                    if (pair.fieldName == "Region") {
                        selectedRegion.push(pair.formattedValue);
                    }

                }

            }
            $("#regionSelectorCtrl").val(selectedRegion[0]);
            switchDashboard(selectedRegion);
            firstMarks = null;
        }
    }
}

var currentFilters = ['Corporate', 'Medium', 'Small', 'Micro', 'Retail'];
function loanSizeParameterChanged(cbx) {
    var cb = $(cbx);
    var val = cb.val();
    var checked = cb.prop("checked");

    switch (val) {
        case "All":
            $("[id^='cbxLoan']").prop("checked", checked);
            break;
        case "Sme":
            $("#cbxLoanSmall, #cbxLoanMedium").prop("checked", checked);
            break;
        case "Small":
        case "Medium":
            if ($("#cbxLoanSmall").prop("checked") && $("#cbxLoanMedium").prop("checked")) {
                $("#cbxLoanSme").prop("checked", true);
            } else {
                $("#cbxLoanSme").prop("checked", false);
            }
            break;
    }
    if ($("#cbxLoanSmall").prop("checked") && $("#cbxLoanMedium").prop("checked") && $("#cbxLoanRetail").prop("checked")
        && $("#cbxLoanCorporate").prop("checked") && $("#cbxLoanMicro").prop("checked")) {
        $("#cbxLoanAll").prop("checked", true);
    } else {
        $("#cbxLoanAll").prop("checked", false);
    }

    var filter = [];
    $("[id^='cbxLoan']:checked").each(function (index) {
        filter[index] = $(this).val();
    });
    //var vizs = tableauSoftware.VizManager.getVizs();
    //for (var i = 0; i < vizs.length; i++) {
    //    var viz = $(vizs[i].getParentElement());
    //    if (viz.attr('id') == "detailsDashboard") {
    //        detailsDashboard = vizs[i];
    //        break;
    //    }
    //}
    currentFilters = filter;
    applyLoanSizeFilter(filter);
    //var worksheets = allRegionsDashboard.getWorkbook().getActiveSheet().getWorksheets();
    //for (var i = 0; i < worksheets.length; i++) {
    //    var ws = worksheets[i];
    //    ws.applyFilterAsync("Loan Size", filter, tableauSoftware.FilterUpdateType.REPLACE);

    //}
}

function onFilterChange(ev) {
    //alert(ev);
}

function applyLoanSizeFilter(filter) {
    var worksheets = activeDashboard.getWorkbook().getActiveSheet().getWorksheets();
    for (var i = 0; i < worksheets.length; i++) {
        var ws = worksheets[i];
        var name = ws.getName();
        if (name != "Sheet 6" && name != "Sheet 7" && name != "Sheet 8" && name != "Sheet 9") {
            ws.applyFilterAsync("Loan Size", filter, tableauSoftware.FilterUpdateType.REPLACE);
        }

    }
}


function initializeDashboard(divId, url, height, width, isDetails, initDetails) {
    var placeholderDiv = document.getElementById(divId);
    var options = {
        width: width != undefined && width != null ? width : placeholderDiv.offsetWidth,
        height: height,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function (ev) {
            var v = ev.getViz();
            if (!isDetails) {
                v.addEventListener(tableauSoftware.TableauEventName.MARKS_SELECTION, onMarksSelection);
                initializeDashboard("allRegionsDashboard", "http://public.tableau.com/views/AllRegionsDashboard-Reachdata/PortfolioComposition", 850, 1004, true, false);


            } else {

                v.addEventListener(tableauSoftware.TableauEventName.FILTER_CHANGE, onFilterChange);
                if (!initDetails) {
                    if (navigator.userAgent.search("Firefox") >= 0) {
                        $("#detailsDashboard").css("display", "block");
                        setTimeout(function () {
                            $("#detailsDashboard").css("display", "none");
                        }, 3000);
                    }
                    initializeDashboard("detailsDashboard", "http://public.tableau.com/views/RegionDashboard-Reachdata/Tab3", 850, 1004, true, true);

                }
            }
        }

    };

    var viz = new tableauSoftware.Viz(placeholderDiv, url, options);
    if (isDetails) {
        if (initDetails) {
            detailsDashboard = viz;
            //activeDashboard = detailsDashboard;
            //alert(1);
        } else {
            allRegionsDashboard = viz;
            activeDashboard = allRegionsDashboard;
            //alert(2);
        }

    } else {
        mapDashboard = viz;

    }
    return viz;
}



var currentTab = {
    tabId: "ap",
    tabIndex: 0
};



function resetActiveDashboard() {
    selectTab(currentTab.tabId);
    $("#tabs").tabs("option", "active", currentTab.tabIndex);
    //if ($("#regionSelectorCtrl").) {
    
    //}

    //selectTab("ap", true);
    //$("#tabs").tabs("option", "active", 0);
    applyLoanSizeFilter(currentFilters);
    
}

function applyRegionFilter() {
    var val = $("#regionSelectorCtrl").val();
    if (val != "None" ) {
        var worksheets = detailsDashboard.getWorkbook().getActiveSheet().getWorksheets();
        
        for (var i = 0; i < worksheets.length; i++) {
            var ws = worksheets[i];
            
            var name = ws.getName();
            
            if (name != "Sheet 7" && name != "Sheet 8" && name != "Sheet 9") {
                ws.applyFilterAsync("Region", [val], tableauSoftware.FilterUpdateType.REPLACE);
            }
            /*else {
                ws.applyFilterAsync("Regions", ["All"], tableauSoftware.FilterUpdateType.REPLACE);
            }*/
        }
    }
}

function selectTab(id, updateRegionFilter) {
    updateRegionFilter = true;
    switch (id) {
        case "ag":
            activeDashboard.getWorkbook().activateSheetAsync("Growth trends").then(function () {
               applyRegionFilter();
            });
            currentTab = {
                tabId: id,
                tabIndex: 1
            };
            $("#loanSelector").hide();
            break;
        case "ap":
            activeDashboard.getWorkbook().activateSheetAsync("Portfolio Composition").then(function () {
               applyRegionFilter();
            });
            currentTab = {
                tabId: id,
                tabIndex: 0
            };
            $("#loanSelector").show();
            break;
        case "tab3":
            activeDashboard.getWorkbook().activateSheetAsync("Tab 1").then(function () {
               applyRegionFilter();
            });
            currentTab = {
                tabId: id,
                tabIndex: 2
            };
            $("#loanSelector").hide();
            break;
        case "tab4":
            activeDashboard.getWorkbook().activateSheetAsync("Tab 2").then(function () {
                applyRegionFilter();
            });
            currentTab = {
                tabId: id,
                tabIndex: 3
            };
            $("#loanSelector").hide();
            break;
        case "tab5":
            activeDashboard.getWorkbook().activateSheetAsync("Tab 3");
            currentTab = {
                tabId: id,
                tabIndex: 4
            };
            $("#loanSelector").hide();
            break;
    }
}
