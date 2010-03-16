/*jslint nomen:true, evil:false, browser:true, laxbreak:true, passfail:true, undef:true */
// JGBlue.com
var jgblue = jgblue || {};

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

function g_link(template, item) {
  return "/" + template.id + "/" + item.id;
}

function g_compute_link(data, sort_val) {
  return ["<a href=\"", g_link(data.template, data.item), "\">", data.value, "</a>"].join("");
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

function g_insert(array, begin, end, v) {
  while (begin + 1 < end && array[begin + 1] < v) {
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

function g_msort(array, on_field, order) {
  if (array.length < 2) {
    return array;
  }
  var middle = Math.ceil(array.length/2);
  return g_merge(g_msort(array.slice(0, middle), on_field, order),
      g_msort(array.slice(middle), on_field, order),
      on_field, order);
}

function g_sort_val(obj, on_field) {
  return obj.computed[on_field] === undefined ?
      obj[on_field] : obj.computed[on_field];
}

function g_sort(array, on_field, order) {
  return g_msort(array, on_field, order);
}


jgblue.j3d = jgblue.j3d || {};

jgblue.j3d.loadModule = function (fn) {
  $.getScript("http://dstatic.jgblue.com/js/jgblue3d.js", fn);
};


/* data index */
jgblue.index = jgblue.index || {};

// -----------------------------------
// JGBlue Homepage
// Suggestions, etc
// -----------------------------------
jgblue.home = jgblue.home || {};

jgblue.home.init = function () {
  var search = $("#search");
  var suggestions = $("#suggestions");
  var home = this;
  this.cancel = false;
  this.timer = 0;
  this.delay = 500;
  this.search = search;
  this.suggestions = suggestions;

  search.keyup( function () {
    var query = search.val();
    if (query.length > 0) {
      home.cancel = false;
      home.prefetch_suggestions("/?q=" + query + "&os");
    } else {
      home.cancel = true;
      suggestions.empty();
    }
  });
};

jgblue.home.prefetch_suggestions = function (url) {
  if (this.timer > 0) {
    clearTimeout(this.timer);
    this.timer = 0;
  }

  this.timer = setTimeout(this.fetch_suggestions.bind(jgblue.home, url), this.delay);
};

jgblue.home.fetch_suggestions = function (url) {
  var home = this;
  if (this.cancel) {
    this.cancel = false;
    return;
  }
  
  function onJson(data) {
    if (home.cancel) {
      home.cancel = false;
      return;
    }
    home.build_suggestions(data);
  }

  $.getJSON(url, onJson);
};

// Clears and builds the suggestion box from the
// ajax request data
jgblue.home.build_suggestions = function (data) {
  var content = [];
  var i = 0;
  var query = data[0];
  var names = data[1];
  this.suggestions.empty();
  
  content.push("<ul>");
  for (i = 0; i < names.length; ++i) {
    var name = names[i];
    content.push("<li>", name, "</li>");  
  }
  content.push("</ul>");
  this.suggestions.append(content.join(""));
};

/* ----------------------------------
 * Tooltips
 * ----------------------------------
 */
jgblue.tooltip = jgblue.tooltip || {};


/* ----------------------------------
 *  Tabs
 * ----------------------------------
 */

jgblue.tabs = jgblue.tabs || {};

jgblue.tabs.Tabs = function (options) {
  this.tabs = [];
  this.tabmap = {};
  this.hl_class = options.hl_class ? options.hl_class : "tab-hl";
}


jgblue.tabs.Tabs.prototype.add_tab = function (options) {
  var tab = new jgblue.tabs.Tab(options, this);
  this.tabmap[options.label] = tab;
  this.tabs.push(tab);
};

jgblue.tabs.Tabs.prototype.get_tab = function (label) {
  return this.tabmap[label];
};

jgblue.tabs.Tabs.prototype.unhighlight_tabs = function () {
  for (var i = 0; i < this.tabs.length; ++i) {
    this.tabs[i].unhighlight();
  }
};

jgblue.tabs.create = function (options, tabs) {
  var tabControl = new jgblue.tabs.Tabs(options);

  if (tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      tabControl.add_tab(tabs[i]);     
    }

    tabControl.unhighlight_tabs();
    tabControl.current_tab = tabControl.tabs[0];
    tabControl.current_tab.show();
  }
};

jgblue.tabs.Tabs.prototype.tab_click = function (tab) {
  if (this.current_tab) {
    this.current_tab.hide();
  }

  tab.show();
  this.current_tab = tab;

  if ( tab.click ) {
    tab.click()
  }
}

/*
 * Tab options:
 *  label - The label on the tab
 *  tabpage - the div which holds the tab page (optional - only if exists)
 *  tab - the li which holds the actual tab (optional - only if exists) 
 */
jgblue.tabs.Tab = function (options, parent) {
  
  this.parent = parent;
  this.tabpage = $(options.tabpage);
  this.click = options.click;
  this.hl_class = options.hl_class ? options.hl_class : parent.hl_class;
  this.li = $(options.tab);
  this.tab = $("div", this.li);
  this.link = $("a", this.li);
  this.label = options.label || this.tab.text();
  this.is_selected = false;
  
  var that = this;
  this.link.click( function () {
    that.parent.tab_click(that);
  });

  this.link.hover( function () {
    if (!that.is_selected) {
      that.tab.attr("class", "tab-hover");
    }
  }, function () {
    if (!that.is_selected) {
      that.tab.attr("class", "");
    }
  });
};

jgblue.tabs.Tab.prototype.show = function () {
  this.is_selected = true;
  this.highlight();
  this.tabpage.show();
};

jgblue.tabs.Tab.prototype.hide = function () {
  this.is_selected = false;
  this.unhighlight();
  this.tabpage.hide();
};

jgblue.tabs.Tab.prototype.unhighlight = function () {
  this.tab.attr("class", "");
};

jgblue.tabs.Tab.prototype.highlight = function () {
  this.tab.attr("class", this.hl_class);
};

/* ----------------------------------
 *  Listview control
 * ----------------------------------
 */

jgblue.listview = jgblue.listview || {};

jgblue.listview.create = function(options, data) {
  return new jgblue.listview.Listview(options, data);
};

jgblue.listview.screen_root = "http://dev.jgblue.com/s3/img/items/";

jgblue.listview.compute_screenshot = function (data, sort_val) {
  var content = ["<div class=\"grid-cell\"><img src=\"", jgblue.listview.screen_root, data.item.thumb_uuid, "\"/>"];
  content.push("<p>", data.item.description, "</p></div>");
  return content.join("");
};

jgblue.listview.screenshot_link = function (template, item) {
  return jgblue.listview.screen_root + item.uuid;
};

jgblue.listview.Listview = function (options, data) {
  this.template = jgblue.listview.templates[options.template];
  this.cols = this.template.columns;
  this.count = data.items.length;
  this.is_grid = !!this.template.grid;
  this.item_node = this.is_grid ? "td" : "tr";
  this.parent_str = options.parent;
  this.parent = $(options.parent);
  var target = $(".lv-target", this.parent);
  this.lv_target = target.length ? target : this.parent;
  this.data = data.items;
  this.displayed = data._displayed;
  this.total = data._total;
  this.per_page = this.template.per_page || 50;
  this.cur_page = 1;
  this.arrows = {};
  this.sort_orders = [];

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
};

/* register events */
jgblue.listview.Listview.prototype.register_events = function () {
  
  var selector = $(this.parent_str + " " + this.item_node);

  /* listview row highlight */
  selector.live("mouseover", function() {
    $(this).toggleClass("lv-row-highlight", true);
  });
  selector.live("mouseout", function() {
    $(this).toggleClass("lv-row-highlight", false);
  });

  /* column headers */
  var lv = this;
  if (!this.is_grid ) {
    $(this.parent_str + " th").live("click", function() {
      var col, col_id, saved_asc;

      col_id = $(this).attr("id").slice(4);
      col = lv.get_col(col_id);

      if ( col.asc === undefined ) {
        col.asc == true;
      }
      if ( col.cur_asc === undefined ) {
        col.cur_asc = col.asc;
      }

      lv.sort(col_id, col.cur_asc);
      saved_asc = col.cur_asc;
      lv.reset_sort_orders();
      col.cur_asc = !saved_asc;

    });
  }

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

  /* pre-div */
  if (this.template.pre_div_toggler) {
    var pre_div = $(this.template.pre_div);
    var show = true;

    if (this.template.pre_div_auto_search) {
      show = window.location.search.contains(this.template.pre_div_auto_search);
    } else if (this.template.pre_div_auto_hash) {
      show = window.location.hash.contains(this.template.pre_div_auto_hash);
    }

    if (show) {
      pre_div.show();
    } else {
      pre_div.hide();
    }

    $(this.template.pre_div_toggler).click( function () {
      pre_div.toggle();  
    });
  }
};

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
};

jgblue.listview.Listview.prototype.rebuild_body = function () {
  var body = [];
  this.body.empty();
  this.build_body(this.data, body);
  this.body.append(body.join(""));
};


jgblue.listview.Listview.prototype.reset_sort_orders = function () {
  for (var i=0; i < this.cols.length; ++i)
    this.cols[i].cur_asc = this.cols[i].asc;
};

jgblue.listview.Listview.prototype.sort = function (col_id, order) {
  var body = [];
  this.body.empty();
  this.data = g_sort(this.data, col_id, order);
  this.build_body(this.data, body);
  this.body.append(body.join(""));
};

/** 
 * builds computed sort values so sort will work on computed fields
 * this function indexes items in the jgblue.index as well
 * XXX: this is kind of hacky considering that dynamic sorting
 * fields will not work as expected.
 *
 * So basically:
 * - sort the entire list (200?)
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
  
};

jgblue.listview.Listview.prototype.build_body = function (items, tab, order) {
  var i, j, item, col, val, link, sort_val, link_fn,
    num_cols = this.cols.length,
    num_items = items.length;

  this.update_labels();

  /* update note label once */
  var displayed_str = "<b>" + this.displayed + "</b> displayed.";
  this.note.html("<b>" + this.total + "</b> found. " +
    (this.total == this.displayed ? "" : displayed_str));

  sort_val = { val: undefined };

  /* load all items and put their data into their respective columns */
  i = (this.cur_page-1) * this.per_page;
  item = items[i];

  /* for each item on this page */
  for (k = 0; i < num_items && i < (this.cur_page*this.per_page); ++i, ++k, item=items[i]) {

    /* grid items row */
    if (this.is_grid && k == 0) {
      tab.push("<tr>");
    }
  
    link_fn = this.template.link || g_link;
    link = link_fn(this.template, item);
    tab.push("<", this.item_node, " onclick=\"", "window.location.href='", link, "'\">");

    for (j=0, col=this.cols[0]; j < num_cols; ++j, col=this.cols[j]) {
      if (col.compute)
        val = col.compute({template: this.template, item:item, field: col.id, value: item[col.id]}, sort_val);
      else
        val = item[col.id];
      
      if (!this.is_grid) {
        tab.push("<td style=\"text-align:", col.align,"\">", val, "</td>");
      } else {
        tab.push(val);
      }
    }

    tab.push("</", this.item_node, ">");

    if (this.is_grid && k == this.template.grid-1) {
      tab.push("</tr>");
      k = -1;
    }
  }

};

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

};

/* 
 * The template specifies what columns are needed and what information needs to be in each
 * column. The column ids match with item property names, so we should never desync information
 * as long as the template is correct
 */
jgblue.listview.Listview.prototype.build_table = function () {
  var num_cols = this.cols.length,
    tab = ["<table width=\"100%\">"],
    col = this.cols[0],
    i=0;

  if (!this.template.skip_head) {
    tab.push("<thead><tr>"); 
    /* build column headers from the template */
    for (i=0; i < num_cols; ++i, col=this.cols[i]) {
      tab.push("<th style=\"width:", col.width,";text-align:", 
            col.align,";\" id=\"col-",col.id,"\"><a href=\"javascript:return false;\">", col.name,"</a></th>");
    }
    tab.push("</tr></thead>");
  } else {
    tab.push("<thead/>");
  }

  tab.push("<tbody class=\"lv-body\">");
  this.build_body(this.data, tab);
  tab.push("</tbody></table>");
  
  this.lv_target.append(tab.join(""));
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
  },
  screenshots: {
    id: "screenshot",
    skip_head: true,
    pre_div: "#screenshot-form",
    pre_div_toggler: "#screen-form-toggler",
    pre_div_auto_hash: "uploaded",
    link: jgblue.listview.screenshot_link,
    grid: 4,
    per_page: 16,
    columns: [
      {id: "screenshot", name: "Screenshot", type: "custom", align: "center", width: "25%", 
       compute:jgblue.listview.compute_screenshot} 
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
$(function () {
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

    switch (type) {
    case "item":
      break;
    case "medal":
      break;
    }
  });
});
