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
Array.prototype.swap = function (a, b) {
    var tmp = this[a];
    this[a] = this[b];
    this[b] = tmp;
};

function g_insert(array, begin, end, v) {
    while(begin + 1 < end && array[begin+1] < v) {
        array.swap(begin, begin + 1);
        ++begin;
    }
    array[begin] = v;
}

/* 
 * merge sort implementation 
 * 
 * data: an array of Objects
 * on_field: the field to sort on in Objects
 * order: 0 ascending, 1 descending
 */

function g_msort(array, on_field, order)
{
    if(array.length < 2)
        return array;
    var middle = Math.ceil(array.length/2);
    return g_merge(g_msort(array.slice(0, middle), on_field, order),
            g_msort(array.slice(middle), on_field, order),
            on_field, order);
}

function g_sort_val(obj, on_field) {
    return obj.computed[on_field] === undefined ?
            obj[on_field] : obj.computed[on_field];
}

function g_merge(left, right, on_field, order)
{
    var result = [];
    var val, val_r, obj, obj_r;


    while((left.length > 0) && (right.length > 0))
    {
        obj = left[0];
        obj_r = right[0];

        val = obj.computed[on_field] === undefined ?
                obj[on_field] : obj.computed[on_field];
        val_r = obj_r.computed[on_field] === undefined ?
                obj_r[on_field] : obj_r.computed[on_field];

        if(order ? val < val_r : val > val_r)
            result.push(left.shift());
        else
            result.push(right.shift());
    }
    while(left.length > 0)
        result.push(left.shift());
    while(right.length > 0)
        result.push(right.shift());
    return result;
}

function g_sort(array, on_field, order) {
    return g_msort(array, on_field, order);
}


/* data index */
jgblue.index = jgblue.index || {};

/* ----------------------------------
 * Tooltips
 * ----------------------------------
 */
jgblue.tooltip = jgblue.tooltip || {};

/* ----------------------------------
 * Forms
 * ----------------------------------
 */

jgblue.forms = jgblue.forms || {};

jgblue.forms.screenshot_upload = function (formid) {

    

}


/* ----------------------------------
 *  Listview control
 * ----------------------------------
 */

jgblue.listview = jgblue.listview || {};

jgblue.listview.create = function(options, data) {
    return new jgblue.listview.Listview(options, data);
}

jgblue.listview.Listview = function (options, data) {

    this.template = jgblue.listview.templates[options.template];
    this.cols = this.template.columns;
    this.count = data.items.length;
    this.parent_str = options.parent;
    this.parent = $(options.parent);
    this.data = data.items;
    this.per_page = 50;
    this.cur_page = 1;
    this.arrows = {};

    this.last_page = Math.ceil(data.items.length / this.per_page);
    if ( this.last_page === 0 )
        this.last_page = 1;

    this.note = $(".lv-bar-note", this.parent);
    this.page_txt = $(".lv-page-txt", this.parent);

    this.compute_sort_vals(this.data);
    this.register_events();
    this.build_table();
    this.body = $(".lv-body", this.parent);

};

jgblue.listview.Listview.prototype.get_col = function (id) {
    for (var i=0; i < this.cols.length; ++i)
        if (this.cols[i].id == id)
            return this.cols[i];
    return undefined;
}

/* register events */
jgblue.listview.Listview.prototype.register_events = function () {
    
    var selector = $(this.parent_str + " tr");

    /* listview row highlight */
    selector.live("mouseover", function() {
        $(this).toggleClass("lv-row-highlight", true);
    });
    selector.live("mouseout", function() {
        $(this).toggleClass("lv-row-highlight", false);
    });

    /* column headers */
    var lv = this;
    $(this.parent_str + " th").live("click", function() {
        var col, col_id, saved_asc;

        col_id = $(this).attr("id").slice(4);
        col = lv.get_col(col_id);

        if ( col.asc === undefined )
            col.asc == true;
        if ( col.cur_asc === undefined )
            col.cur_asc = col.asc;

        lv.sort(col_id, col.cur_asc);
        saved_asc = col.cur_asc;
        lv.reset_sort_orders();
        col.cur_asc = !saved_asc;
    });

    /* one time only bindings */
    this.arrows.fastleft = $(".lv-page .sprite-fastleft", this.parent);
    this.arrows.left = $(".lv-page .sprite-left", this.parent);
    this.arrows.right = $(".lv-page .sprite-right", this.parent);
    this.arrows.fastright = $(".lv-page .sprite-fastright", this.parent);
    this.arrows.all = $(".lv-page .sprites", this.parent);
    this.arrows.hasarrows = true;

    this.arrows.all.css("cursor", "pointer");

    this.arrows.fastleft.hover(function() {
        $(this).attr("class","sprites sprite-fastleft-hl");
    }, function () {
        $(this).attr("class","sprites sprite-fastleft");
    });

    this.arrows.left.hover(function() {
        $(this).attr("class","sprites sprite-left-hl");
    }, function () {
        $(this).attr("class","sprites sprite-left");
    });

    this.arrows.right.hover(function() {
        $(this).attr("class","sprites sprite-right-hl");
    }, function () {
        $(this).attr("class","sprites sprite-right");
    });

    this.arrows.fastright.hover(function() {
        $(this).attr("class","sprites sprite-fastright-hl");
    }, function () {
        $(this).attr("class","sprites sprite-fastright");
    });

    this.arrows.left.bind("click", function() {
        lv.switch_page(-1);
    });

    this.arrows.right.bind("click", function() {
        lv.switch_page(1);
    });

    this.arrows.fastright.bind("click", function() {
        lv.switch_page(2);
    });

    this.arrows.fastleft.bind("click", function() {
        lv.switch_page(-2);
    });
}

jgblue.listview.Listview.prototype.switch_page = function (where) {
    switch (where) {
    case 1:
        if ( this.cur_page + 1 > this.last_page )
            return;
        this.cur_page++;
        break;
    case -1:
        if ( this.cur_page - 1 < 1 )
            return;
        this.cur_page--;
        break;
    case 2:
        this.cur_page = this.last_page;
        break;
    case -2:
        this.cur_page = 1;
        break;
    }

    this.rebuild_body();
}

jgblue.listview.Listview.prototype.rebuild_body = function () {
    var body = [];
    this.body.empty();
    this.build_body(this.data, body);
    this.body.append(body.join(""));
}


jgblue.listview.Listview.prototype.reset_sort_orders = function () {
    for (var i=0; i < this.cols.length; ++i)
        this.cols[i].cur_asc = this.cols[i].asc;
}

jgblue.listview.Listview.prototype.sort = function (column_id, order) {
    var body = [];
    this.body.empty();
    this.data = g_sort(this.data, column_id, order);
    this.build_body(this.data, body);
    this.body.append(body.join(""));
}

/** 
 * builds computed sort values so sort will work on computed fields
 * this function indexes items in the jgblue.index as well
 * XXX: this is kind of hacky considering that dynamic sorting
 * fields will not work as expected.
 *
 * So basically:
 * - Quicksort the entire list (200?)
 * - Only compute the first this.per_page(50) fields (thanks to this fn),
 *   otherwise we'd have to compute 200 fields every time. got it?
 */
jgblue.listview.Listview.prototype.compute_sort_vals = function (items) {
    var i, j, item, col, link, sort_val,
        num_cols = this.cols.length,
        num_items = items.length;

    for (i=0, item=items[0]; i < num_items; ++i, item=items[i]) {
        item.computed = {};
        jgblue.index[item.id] = item;
        for (j=0, col=this.cols[0]; j < num_cols; ++j, col=this.cols[j]) {
            if (col.compute != undefined) {
                sort_val = {val: undefined};
                col.compute({template: this.template, item:item, field: col.id, value: item[col.id]}, sort_val);

                /* store the computed value in each item so it can be sorted on later */
                if ( sort_val.val != undefined ) {
                   item.computed[col.id] = sort_val.val;
                }
            }
        }
    }
    
}

jgblue.listview.Listview.prototype.build_body = function (items, tab, order) {
    var i, j, item, col, val, link, sort_val,
        num_cols = this.cols.length,
        num_items = items.length;

    this.update_labels();

    sort_val = { val: undefined };
    /* load all items and put their data into their respective columns */
    i = (this.cur_page-1) * this.per_page;
    item = items[i];

    for (; i < num_items && i < (this.cur_page*this.per_page); ++i, item=items[i]) {
        link = g_link(this.template, item.id);
        tab.push("<tr onclick=\"","window.location.href='",link,"'\">");

        for (j=0, col=this.cols[0]; j < num_cols; ++j, col=this.cols[j]) {
            if (col.compute != undefined)
                val = col.compute({template: this.template, item:item, field: col.id, value: item[col.id]}, sort_val);
            else
                val = item[col.id];
            
            tab.push("<td style=\"text-align:",col.align,"\">", val, "</td>");
        }
        tab.push("</tr>");
    }

}

jgblue.listview.Listview.prototype.update_labels = function () {
    var len = this.count,
        first, last;

    first = (this.per_page * (this.cur_page - 1)) + 1;
    last = this.per_page * this.cur_page;
    if ( last > this.count )
        last = this.count;

    this.page_txt.text(first + " - " + last + " of " + len);
    this.arrows.all.css("display", "inline");

    if ( this.cur_page == 1 ) {
        this.arrows.left.css("display", "none");
        this.arrows.fastleft.css("display", "none");
    }
    if ( this.cur_page == this.last_page ) {
        this.arrows.right.css("display", "none");
        this.arrows.fastright.css("display", "none");
    }

}

/* 
 * The template specifies what columns are needed and what information needs to be in each
 * column. The column ids match with item property names, so we should never desync information
 * as long as the template is correct
 */
jgblue.listview.Listview.prototype.build_table = function () {
    var num_cols = this.cols.length,
        tab = ["<table width=\"100%\"><thead><tr>"],
        col = this.cols[0],
        url = window.location.href + "?json=1",
        i=0;
    

    /* build column headers from the template */
    for (i=0; i < num_cols; ++i, col=this.cols[i]) {
        tab.push("<th style=\"width:", col.width,";text-align:", 
                    col.align,";\" id=\"col-",col.id,"\">", col.name,"</th>");
    }
    tab.push("</tr></thead><tbody class=\"lv-body\">");
    
    this.build_body(this.data, tab)
    
    tab.push("</tbody></table>");
    this.parent.append(tab.join(""));
}
    

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

    if (!re)
        return;
    if (re.length != 3)
        return;

    type = re[1];
    id = re[2];

    item = jgblue.index[id];
    console.log(type + " link (" + item.name + ")");

    switch (type) {
    case "item":
        break;
    case "medal":
        break;
    }
});
