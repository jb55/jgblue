// JGBlue.com
var jgblue = {};

jgblue.listview = function (options, data) {

	function buildTable() {
		var len = _cols.length;
		var tab = ["<table><tr>"];
		var col = _cols[0];
		for(var i=0; i < len; ++i, col=_cols[i]) {
			tab.push("<th>", col.name,"</th>");
		}
		tab.push("</tr></table>");
		$(_parent).append(tab.join(""));
	};
	
	var _templates = jgblue.listview.templates;
	var _template = _templates[options.template];
	var _cols = _template.columns;
	var _parent = options.parent;
	var _data = data;

	
	buildTable();
};

jgblue.listview.templates = {
	// --------------------------------
	// Item listview template
	// --------------------------------
	items: {
		columns: [
			{id: "name", name: "Name", type: "text", align: "left", width: "40%"},
			{id: "level", name: "Level", type: "number", align: "left", width: "10%"},
			{id: "rank", name: "Rank", type: "number", align: "left", width: "10%"},
			{id: "item_class", name: "Class", type: "number", align: "left", width: "30%"},
		],
	},
};