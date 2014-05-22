﻿var AggrInf = { //interface, interator pattern:
    getIterator: function (dataIn) { }
};

var ItInf = { //interface, interator pattern:
    next: function () { }
};

//ListData class
function ListData() { //singleton pattern
    if (arguments.callee._singletonInstance)
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;
    this.setValue = function (dataArg) { //Dependency Injection
        this.data = dataArg;
    }
    this.data = null;
    this.it = null;
};
ListData.prototype = Object.create(AggrInf); //extend AggrInf for ListData

ListData.prototype.getIterator = function () {
    this.it = new ItList(this.data);
    if (this.data.length > 0) return true;
    else return false;
}

//ItList class
var ItList = function (dataIn) {
    this.curIndx = 0;
    this.data = dataIn;
    if (this.data.length < 1) {
        this.title = null;
        this.picture = null;
    }
    else {
        this.title = this.data[this.curIndx][1];
        this.picture = this.data[this.curIndx][3];
    }
};
ItList.prototype = Object.create(ItInf);
ItList.prototype.next = function () {
    if (this.curIndx + 1 < this.data.length) {
        this.curIndx++;
        this.title = this.data[this.curIndx][1];
        this.picture = this.data[this.curIndx][3];
        return true;
    }
    console.log("next return false.");
    return false; //signal that is the end of collection
}

//main functions:

function ParseNameToFullUrl(name) {
    var p = 'url("' + Windows.Storage.ApplicationData.current.localFolder.path;
    if (p.charAt(p.length - 1) != '\\') p += '\\';
    return p + name + '")';
}


function loadRecData(i, myData, array) {
        
    do {
        var varShortTitle;
        if (array.it.title > 19)
            varShortTitle = array.it.title.substr(0, 16) + "...";
        else
            varShortTitle = array.it.title;
        var url = ParseNameToFullUrl(array.it.picture); // zastanowić się czemu pobieranie miniatur z folderu nie działa
        var project = 'url("' + "/images/" + array.it.picture + '")';
        myData[myData.length] = { title: array.it.title, shortTitle: varShortTitle, picture: project, size: 'cover' };
        
    }
    while (array.it.next());
               
}

function loadRecipiesList(array) {
    "use strict";
    var myData = [];
    var listObj = new ListData();
    listObj.setValue(array);
    var check = listObj.getIterator(); //if false 0 obj in collection
    if (!check) return 0;
    loadRecData(check, myData, listObj)

        // Create a WinJS.Binding.List from the array. 
        var itemsList = new WinJS.Binding.List(myData);

        // Sorts the groups
        function compareGroups(leftKey, rightKey) {
            return leftKey.charCodeAt(0) - rightKey.charCodeAt(0);
        }

        // Returns the group key that an item belongs to
        function getGroupKey(dataItem) {
            return dataItem.title.toUpperCase().charAt(0);
        }

        // Returns the title for a group
        function getGroupData(dataItem) {
            return {
                title: dataItem.title.toUpperCase().charAt(0)
            };
        }

        // Create the groups for the ListView from the item data and the grouping functions
        var groupedItemsList = itemsList.createGrouped(getGroupKey, getGroupData, compareGroups);


        WinJS.Namespace.define("myData",
              {
                  groupedItemsList: groupedItemsList
              });

}




