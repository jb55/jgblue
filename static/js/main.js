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
function g_compute_link(data, sort_val) {
    return ["<a href=\"",g_link(data.template, data.item.id),"\">",data.value,"</a>"].join("");
};

function g_link(template, id) {
    return "/"+template.id+"/"+id;
}

function g_subclass_name(item_class, item_subclass) {
    var subclass = jgblue.enums.item_subclass;
    if ((subclass = subclass[item_class]) != undefined)
        subclass = subclass[item_subclass];
    
    if (subclass == undefined)
        subclass = "Unknown Subclass (" + item_subclass + ")";

    return subclass;
}

function g_compute_subclass(data, sort_val) {
    var subclass = g_subclass_name(data.item.item_class, data.value);
    sort_val.val = subclass;
    return ["<div class=\"item_class\">","<a href=\"/items/",data.item.item_class,".",data.item.item_subclass,
            "\">", subclass,"</a></div>"].join("");
};

function g_compute_enum(data, sort_val) {
    return jgblue.enums[data.field][data.value];
};

/* add swap to array */
Array.prototype.swap=function(a, b)
{
    var tmp=this[a];
    this[a]=this[b];
    this[b]=tmp;
}

/* 
 * quicksort implementation 
 * 
 * data: an array of Objects
 * on_field: the field to sort on in Objects
 * order: 0 ascending, 1 descending
 */
function g_quicksort(array, begin, end, on_field, order) {

    if(end-1>begin) {
        var pivot=begin+Math.floor(Math.random()*(end-begin));

        pivot=g_partition(array, begin, end, pivot, on_field, order);

        g_quicksort(array, begin, pivot, on_field, order);
        g_quicksort(array, pivot+1, end, on_field, order);
    }
};

/*
 * partition, used in the quicksort algorithm
 */
function g_partition(array, begin, end, pivot, on_field, order)
{
    var piv = array[pivot].computed[on_field] == undefined ?
                array[pivot][on_field] : array[pivot].computed[on_field],
        store = begin,
        val, ix;

    array.swap(pivot, end-1);
    for(ix=begin; ix<end-1; ++ix) {
        /* if the field has been computed, sort on that instead */
        val = array[ix].computed[on_field] == undefined ? 
                array[ix][on_field] : array[ix].computed[on_field];
        if(order ? val <= piv : val >= piv) {
            array.swap(store, ix);
            ++store;
        }
    }
    array.swap(end-1, store);
    return store;
};

/* data index */
jgblue.index = {};

jgblue.tooltip = function (options) {
};

/* ----------------------------------
 *  Listview control
 * ----------------------------------
 */
jgblue.listview = function (options, data) {

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
        selector.live("click", function() {
            
        });

        /* column headers */
        $("#listview th").live("click", function() {
            var col, col_id, saved_asc;
            col_id = $(this).attr("id").slice(4);
            col = get_col(col_id);
            if( col.asc == undefined )
                col.asc == true;
            if( col.cur_asc == undefined )
                col.cur_asc = col.asc;
            sort(col_id, col.cur_asc);
            saved_asc = col.cur_asc;
            reset_sort_orders();
            col.cur_asc = !saved_asc;
        });
    }

    function get_col(id) {
        for(var i=0; i < _cols.length; ++i)
            if(_cols[i].id == id)
                return _cols[i];
        return undefined;
    }

    function reset_sort_orders() {
        for(var i=0; i < _cols.length; ++i)
            _cols[i].cur_asc = _cols[i].asc;
    }

    function sort(column_id, order) {
        var tbody = $("#lv-body"),
            body = [];
        tbody.empty();
        g_quicksort(_data, 0, _data.length, column_id, order);
        build_body(_data, body);
        tbody.append(body.join(""));
    }

    function build_body(items, tab, order) {
        var i, j, item, col, val, link, sort_val,
            num_cols = _cols.length,
            num_items = items.length;

        /* load all items and put their data into their respective columns */
        for(i=0, item=items[0]; i < num_items; ++i, item=items[i]) {
            item.computed = {};
            jgblue.index[item.id] = item;
            link = g_link(_template, item.id);
            tab.push("<tr onclick=\"","window.location.href='",link,"'\">");
            for(j=0, col=_cols[0]; j < num_cols; ++j, col=_cols[j]) {
                if(col.compute != undefined) {
                    sort_val = {val: undefined};
                    val = col.compute({template: _template, item:item, field: col.id, value: item[col.id]}, sort_val);

                    /* store the computed value in each item so it can be sorted on later */
                    if( sort_val.val != undefined ) {
                       item.computed[col.id] = sort_val.val;
                    }
                }
                else
                    val = item[col.id];
                
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
            url = window.location.href + "?json=1";
            i=0;
        
        /* build column headers from the template */
        for(i=0; i < num_cols; ++i, col=_cols[i]) {
            tab.push("<th style=\"width:", col.width,";text-align:", 
                        col.align,";\" id=\"col-",col.id,"\">", col.name,"</th>");
        }
        tab.push("</tr></thead><tbody id=\"lv-body\">");
        
        build_body(_data, tab)
        
        tab.push("</tbody></table>");
        $(_parent).append(tab.join(""));
        /* I'm done here --Snake */
    };
    
    var _template = jgblue.listview.templates[options.template],
        _cols = _template.columns,
        _parent = options.parent,
        _data = data.items;

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
            {id: "name", name: "Name", type: "text", 
             align: "left", width: "60%", compute:g_compute_link, asc: true, cur_asc: false},
            {id: "level", name: "Level", type: "number", align: "center", width: "10%", asc: false }, 
            {id: "item_subclass", name: "Type", type: "number", align: "center", width: "30%", asc: true, compute:g_compute_subclass}
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
