// JGBlue.com
var jgblue = {};

function compute_obj_link(data) {
	return ["<a href=\"",data.template.id,"/",data.item.id,"\">",data.item[data.field],"</a>"].join('');
}

jgblue.listview = function (options, data) {




	/* 
	 * The template specifies what columns are needed and what information needs to be in each
	 * column. The column ids match with item property names, so we should never desync information
	 * as long as the template is correct
	 */
	function build_table() {
		var num_cols = _cols.length;
		var tab = ["<table width=\"100%\"><tr>"];
		var col = _cols[0];
		
		/* build column headers from the template */
		for(var i=0; i < num_cols; ++i, col=_cols[i]) {
			tab.push("<th style=\"width:", col.width,";text-align:", 
					 	col.align,";\">", col.name,"</th>");
		}
		tab.push("</tr>");

		var url = "http://dev.jgblue.com/item/?json=1";
		
		/* our super-cool web 2.0 json XMLHttpRequest, also known as ajax to all the cool kids */
		$.getJSON(url, function(data) {								
			var num_items = data.items.length;
			var items = data.items;
			
			/* load all items and put their data into their respective columns */
			for(var i=0, item=items[0]; i < num_items; ++i, item=items[i]) {
				tab.push("<tr>");
				for(var j=0, col=_cols[0]; j < num_cols; ++j, col=_cols[j]) {
					var val = col.compute == undefined ? item[col.id] : col.compute({template: _template, item:item, field: col.id});
					tab.push("<td style=\"text-align:",col.align,"\">", val, "</td>");
				}
				tab.push("</tr>");
			}
			
			tab.push("</table>");
			$(_parent).append(tab.join(""));
			/* I'm done here --Snake */
		});
		
		/* continue loading page, getJSON is async 
		 * so we can't assume it's done at this point 
		 */
	};
	
	var _template = jgblue.listview.templates[options.template];
	var _cols = _template.columns;
	var _parent = options.parent;
	var _data = data;

	
	build_table();
};

jgblue.listview.templates = {
	// --------------------------------
	// Item listview template
	// --------------------------------
	items: {
		id: "item",
		columns: [
			{id: "name", name: "Name", type: "text", align: "left", width: "40%", compute:compute_obj_link},
			{id: "level", name: "Level", type: "number", align: "center", width: "10%"},
			/*{id: "level", name: "Rank", type: "number", align: "center", width: "10%"},*/
			{id: "item_class", name: "Class", type: "number", align: "center", width: "30%"},
		],
	},
};