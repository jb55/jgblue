// JGBlue.com
var jgblue = {};

/* -------------------------------
 *  Global functions
 * -------------------------------
 */

/*
 * Compute data
 *
 * template - the current template
 * item - the full item record
 * field - the field name
 * value - the value of the field (equiv to item[field])
 */
function g_compute_link(data) {
    return ["<a href=\"/",data.template.id,"/",data.item.id,"\">",data.value,"</a>"].join("");
};

function g_compute_class(data) {
    return ["<div class=\"item_class\">", jgblue.enums.item_class[data.value],"</div>"].join("");
};

function g_compute_enum(data) {
    return jgblue.enums[data.field][data.value];
};

/* data index */
jgblue.index = {};

jgblue.tooltip = function (options) {
};

/* ----------------------------------
 *  Listview control
 * ----------------------------------
 */
jgblue.listview = function (options) {

    /* register events */
    function register_events() {
        var selector = $(_parent + " tr");

        /* listview row highlight */
        selector.live("mouseover", function() {
            $(this).toggleClass("lv-row-highlight", true);
        });
        selector.live("mouseout", function() {
            $(this).toggleClass("lv-row-highlight", false);
        });
        $(_parent+" th").live("click", function() {
            sort();
        });
    }

    function sort(column_id, order) {
        var tbody = $("#lv-body"),
            body = [];
        tbody.empty();
        _data.reverse();
        build_body(_data, body);
        tbody.append(body.join(""));
    }

    function build_body(items, tab, order) {
        var i, j, item, col, val,
            num_cols = _cols.length,
            num_items = items.length;

        /* load all items and put their data into their respective columns */
        for(i=0, item=items[0]; i < num_items; ++i, item=items[i]) {
            jgblue.index[item.id] = item;
            tab.push("<tr>");
            for(j=0, col=_cols[0]; j < num_cols; ++j, col=_cols[j]) {
                val = col.compute == undefined ? item[col.id] : 
                    col.compute({template: _template, item:item, field: col.id, value: item[col.id]});
                tab.push("<td style=\"text-align:",col.align,"\">", val, "</td>");
            }
            tab.push("</tr>");
        }

    }

    /* 
     * The template specifies what columns are needed and what information needs to be in each
     * column. The column ids match with item property names, so we should never desync information
     * as long as the template is correct
     */
    function build_table() {
        var num_cols = _cols.length,
            tab = ["<table width=\"100%\"><thead><tr>"],
            col = _cols[0],
            url = ["http://dev.jgblue.com/",_template.id,"/?json=1"].join("");
            i=0,j=0;
        
        /* build column headers from the template */
        for(i=0; i < num_cols; ++i, col=_cols[i]) {
            tab.push("<th style=\"width:", col.width,";text-align:", 
                        col.align,";\">", col.name,"</th>");
        }
        tab.push("</tr></thead><tbody id=\"lv-body\">");
        
        /* our super-cool web 2.0 json XMLHttpRequest, also known as ajax to all the cool kids */
        $.getJSON(url, function(data) {                             
            var num_items = data.items.length,
                items = data.items,
                val,
                item,
                i=0,j=0;

            _data = items;
            build_body(items, tab)
            
            tab.push("</tbody></table>");
            $(_parent).append(tab.join(""));
            /* I'm done here --Snake */
        });
        
        /* continue loading page, getJSON is async 
         * so we can't assume it's done at this point 
         */
    };
    
    var _template = jgblue.listview.templates[options.template],
        _cols = _template.columns,
        _parent = options.parent,
        _data;

    build_table();
    register_events();
};

jgblue.listview.templates = {
    // --------------------------------
    // Item listview template
    // --------------------------------
    items: {
        id: "item",
        columns: [
            {id: "name", name: "Name", type: "text", align: "left", width: "60%", compute:g_compute_link},
            {id: "level", name: "Level", type: "number", align: "center", width: "10%" }, 
            {id: "item_class", name: "Class", type: "number", align: "center", width: "30%", compute:g_compute_class}
        ]
    }
};

jgblue.enums = {
    item_class: {0:"Gun", 1:"Missile", 2:"Shield", 3:"Power Plant", 4:"Armor", 5:"Radar", 6:"Engine", 
                 7:"Mining", 8:"Mod"},
    item_subclass: {0:{0:"Electron Gun"}}
};

/**
 * Global instructions
 */

/* intelligent tooltips */
$("a").live("mouseover", function() {
    var type, id, tooltip,
        re = /^\/(item|medal)\/(\d+)/.exec($(this).attr("href"));

    if(!re)
        return;
    if(re.length != 3)
        return;

    type = re[1];
    id = re[2];

    item = jgblue.index[id];
    console.log(type + " link (" + item.name + ")");

    switch(type) {
    case "item":
        break;
    case "medal":
        break;
    }
});
