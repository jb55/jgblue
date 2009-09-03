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

function g_link(template, id) {
    return "/" + template.id + "/" + id;
}

function g_compute_link(data, sort_val) {
    return ["<a href=\"", g_link(data.template, data.item.id), "\">", data.value, "</a>"].join("");
}

function g_subclass_name(item_class, item_subclass) {
    var subclass = jgblue.enums.item_subclass;
    if ((subclass = subclass[item_class]) !== undefined) {
        subclass = subclass[item_subclass];
    }
    
    if (subclass === undefined) {
        subclass = "Unknown Subclass (" + item_subclass + ")";
    }

    return subclass;
}

function g_compute_subclass(data, sort_val) {
    var subclass = g_subclass_name(data.item.item_class, data.value);
    sort_val.val = subclass;
    return ["<div class=\"item_class\">", "<a href=\"/items/", data.item.item_class, ".", data.item.item_subclass,
            "\">", subclass, "</a></div>"].join("");
}

function g_compute_enum(data, sort_val) {
    return jgblue.enums[data.field][data.value];
}

/* add swap to array */
Array.prototype.swap = function (a, b)
{
    var tmp = this[a];
    this[a] = this[b];
    this[b] = tmp;
};


/*
 * partition, used in the quicksort algorithm
 */
function g_partition(array, begin, end, pivot, on_field, order)
{
    var piv = array[pivot].computed[on_field] === undefined ?
                array[pivot][on_field] : array[pivot].computed[on_field],
        store = begin,
        val, ix;

    array.swap(pivot, end - 1);
    for (ix = begin; ix < end - 1; ++ix) {
        /* if the field has been computed, sort on that instead */
        val = array[ix].computed[on_field] === undefined ? 
                array[ix][on_field] : array[ix].computed[on_field];
        if (order ? val <= piv : val >= piv) {
            array.swap(store, ix);
            ++store;
        }
    }
    array.swap(end - 1, store);
    return store;
}

/* 
 * quicksort implementation 
 * 
 * data: an array of Objects
 * on_field: the field to sort on in Objects
 * order: 0 ascending, 1 descending
 */
function g_quicksort(array, begin, end, on_field, order) {

    if (end - 1 > begin) {
        var pivot = begin + Math.floor(Math.random() * (end - begin));

        pivot = g_partition(array, begin, end, pivot, on_field, order);

        g_quicksort(array, begin, pivot, on_field, order);
        g_quicksort(array, pivot + 1, end, on_field, order);
    }
}

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
        
        var selector = $(_parent_str + " tr");

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
            if( col.asc === undefined )
                col.asc == true;
            if( col.cur_asc === undefined )
                col.cur_asc = col.asc;
            sort(col_id, col.cur_asc);
            saved_asc = col.cur_asc;
            reset_sort_orders();
            col.cur_asc = !saved_asc;
        });

        /* one time only bindings */
        _arrows.fastleft = $("#lv-page .sprite-fastleft");
        _arrows.left = $("#lv-page .sprite-left");
        _arrows.right = $("#lv-page .sprite-right");
        _arrows.fastright = $("#lv-page .sprite-fastright");
        _arrows.all = $("#lv-page .sprites");
        _arrows.hasarrows = true;

        _arrows.all.css("cursor", "pointer");

        _arrows.fastleft.hover(function() {
            $(this).attr("class","sprites sprite-fastleft-hl");
        }, function () {
            $(this).attr("class","sprites sprite-fastleft");
        });

        _arrows.left.hover(function() {
            $(this).attr("class","sprites sprite-left-hl");
        }, function () {
            $(this).attr("class","sprites sprite-left");
        });

        _arrows.right.hover(function() {
            $(this).attr("class","sprites sprite-right-hl");
        }, function () {
            $(this).attr("class","sprites sprite-right");
        });

        _arrows.fastright.hover(function() {
            $(this).attr("class","sprites sprite-fastright-hl");
        }, function () {
            $(this).attr("class","sprites sprite-fastright");
        });

        _arrows.left.bind("click", function() {
            switch_page(-1);
        });

        _arrows.right.bind("click", function() {
            switch_page(1);
        });

        _arrows.fastright.bind("click", function() {
            switch_page(2);
        });

        _arrows.fastleft.bind("click", function() {
            switch_page(-2);
        });
    }

    function switch_page(where){
        switch(where) {
        case 1:
            if( _cur_page + 1 > _last_page )
                return;
            _cur_page++;
            break;
        case -1:
            if( _cur_page - 1 < 1 )
                return;
            _cur_page--;
            break;
        case 2:
            _cur_page = _last_page;
            break;
        case -2:
            _cur_page = 1;
            break;
        }

        rebuild_body();
    }

    function rebuild_body() {
        var body = [];
        _body.empty();
        build_body(_data, body);
        _body.append(body.join(""));
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
        var body = [];
        _body.empty();
        g_quicksort(_data, 0, _data.length, column_id, order);
        build_body(_data, body);
        _body.append(body.join(""));
    }

    /** 
     * builds computed sort values so sort will work on computed fields
     * this function indexes items in the jgblue.index as well
     * XXX: this is kind of hacky considering that dynamic sorting
     * fields will not work as expected.
     *
     * So basically:
     * - Quicksort the entire list (200?)
     * - Only compute the first _per_page(50) fields (thanks to this fn),
     *   otherwise we'd have to compute 200 fields every time. got it?
     */
    function compute_sort_vals(items) {
        var i, j, item, col, link, sort_val,
            num_cols = _cols.length,
            num_items = items.length;

        for(i=0, item=items[0]; i < num_items; ++i, item=items[i]) {
            item.computed = {};
            jgblue.index[item.id] = item;
            for(j=0, col=_cols[0]; j < num_cols; ++j, col=_cols[j]) {
                if(col.compute != undefined) {
                    sort_val = {val: undefined};
                    col.compute({template: _template, item:item, field: col.id, value: item[col.id]}, sort_val);

                    /* store the computed value in each item so it can be sorted on later */
                    if( sort_val.val != undefined ) {
                       item.computed[col.id] = sort_val.val;
                    }
                }
            }
        }
        
    }

    function build_body(items, tab, order) {
        var i, j, item, col, val, link, sort_val,
            num_cols = _cols.length,
            num_items = items.length;

        update_labels();

        sort_val = { val: undefined };
        /* load all items and put their data into their respective columns */
        i = (_cur_page-1) * _per_page;
        item = items[i];
        for(; i < num_items && i < (_cur_page*_per_page); ++i, item=items[i]) {
            link = g_link(_template, item.id);
            tab.push("<tr onclick=\"","window.location.href='",link,"'\">");
            for(j=0, col=_cols[0]; j < num_cols; ++j, col=_cols[j]) {
                if(col.compute != undefined)
                    val = col.compute({template: _template, item:item, field: col.id, value: item[col.id]}, sort_val);
                else
                    val = item[col.id];
                
                tab.push("<td style=\"text-align:",col.align,"\">", val, "</td>");
            }
            tab.push("</tr>");
        }

    }

    function update_labels() {
        var len = _count,
            first, last;

        first = (_per_page*(_cur_page-1)) + 1;
        last = _per_page * _cur_page;
        if( last > _count )
            last = _count;

        _page_txt.text(first + " - " + last + " of " + len);

        _arrows.all.css("display", "inline");

        if( _cur_page == 1 ) {
            _arrows.left.css("display", "none");
            _arrows.fastleft.css("display", "none");
        }
        if( _cur_page == _last_page ) {
            _arrows.right.css("display", "none");
            _arrows.fastright.css("display", "none");
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
            url = window.location.href + "?json=1",
            i=0;
        

        /* build column headers from the template */
        for(i=0; i < num_cols; ++i, col=_cols[i]) {
            tab.push("<th style=\"width:", col.width,";text-align:", 
                        col.align,";\" id=\"col-",col.id,"\">", col.name,"</th>");
        }
        tab.push("</tr></thead><tbody id=\"lv-body\">");
        
        build_body(_data, tab)
        
        tab.push("</tbody></table>");
        _parent.append(tab.join(""));
    }
    
    var _template = jgblue.listview.templates[options.template],
        _cols = _template.columns,
        _count = data.items.length,
        _parent_str = options.parent,
        _parent = $(options.parent),
        _data = data.items,
        _per_page = 50,
        _cur_page = 1,
        _last_page, 
        _note,
        _body,
        _page_txt,
        _arrows = {};

    _last_page = Math.ceil(data.items.length / _per_page);
    if( _last_page === 0 )
        _last_page = 1;

    _note = $("#lv-bar-note");
    _page_txt = $("#lv-page-txt");

    compute_sort_vals(_data);
    register_events();
    build_table();
    _body = $("#lv-body");
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
