/*
 @license

 dhtmlxGantt v.4.0.0 Professional Evaluation
 This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

 (c) Dinamenta, UAB.
 */
Gantt.plugin(function (t) {
  t._markers || (t._markers = {}), t.config.show_markers = !0, t.attachEvent("onClear", function () {
    t._markers = {}
  }), t.attachEvent("onGanttReady", function () {
    function e(e) {
      if (!t.config.show_markers) return !1;
      if (!e.start_date) return !1;
      var i = t.getState();
      if (!(+e.start_date > +i.max_date || +e.end_date && +e.end_date < +i.min_date || +e.start_date < +i.min_date)) {
        var n = document.createElement("div");
        n.setAttribute("marker_id", e.id);
        var a = "gantt_marker";
        t.templates.marker_class && (a += " " + t.templates.marker_class(e)),
        e.css && (a += " " + e.css), e.title && (n.title = e.title), n.className = a;
        var s = t.posFromDate(e.start_date);

        var height = Math.max(t._y_from_ind(t._order.length), 0);
        if (e.pauseAcuHeight) height = e.pauseAcuHeight;
        if (n.style.left = s + "px", n.style.height = height + "px", e.end_date) {
          var r = t.posFromDate(e.end_date);
          n.style.width = Math.max(r - s, 0) + "px"
        }

        if (e.pausePosTop && e.pauseAcuHeight) {
          n.style.top = e.pausePosTop + "px";
        }

        var pauseDom = "";
        var puseEndDom = "";
        if (e.pauseWidth) {
          n.style.width = e.pauseWidth + 'px';
          if (e.pauseEndContent) {
            puseEndDom = "<div class='gantt_marker_content pause-end'>" + e.pauseEndContent + "</div>";
          }

          var top = null;
          var domStyle = "'height: " + e.pauseHeight + "px; width: " + e.pauseWidth + "px;'";
          if (e.pauseAcuHeight) {
            domStyle = "'height: " + e.pauseHeight + "px; width: " + e.pauseWidth + "px;top: 0; z-index: 1'";
          }

          pauseDom = "<div class='gantt-pause-bg' style=" + domStyle + "></div>";
        }
        return e.text && (n.innerHTML = "<div class='gantt_marker_content' >" + e.text + "</div>" + pauseDom + puseEndDom), n
      }
    }

    var i = document.createElement("div");
    i.className = "gantt_marker_area", t.$task.appendChild(i), t.$marker_area = i, t._markerRenderer = t._task_renderer("markers", e, t.$marker_area, null);
  }), t.attachEvent("onDataRender", function () {
    t.renderMarkers()
  }), t.getMarker = function (t) {
    return this._markers ? this._markers[t] : null
  }, t.addMarker = function (e) {
    return e.id = e.id || t.uid(), this._markers[e.id] = e, e.id
  }, t.deleteMarker = function (t) {
    return this._markers && this._markers[t] ? (delete this._markers[t], !0) : !1
  }, t.updateMarker = function (t) {
    this._markerRenderer && this._markerRenderer.render_item(t)
  }, t.renderMarkers = function () {
    if (!this._markers) return !1;
    if (!this._markerRenderer) return !1;
    var t = [];
    for (var e in this._markers) t.push(this._markers[e]);
    return this._markerRenderer.render_items(t), !0
  }
});
//# sourceMappingURL=../sources/ext/dhtmlxgantt_marker.js.map