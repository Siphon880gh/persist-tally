/**
 * FormulaViewSystem
 *
 * Saved views for formula rows, like ClickUp views.
 * - The original rows (DOM order inside #formulas-wrapper) never move, so
 *   getResult(X) and saving keep using the original indices.
 * - A view is only a display order: { id, name, order: [formulaId, ...] }.
 *   It is applied with the CSS flexbox "order" property.
 * - Rows added after a view was saved show at the end of the view.
 *   Deleted rows are dropped from the view.
 */
var FormulaViewSystem = class {
        globalize() {
            window.FormulaViews = this;
        }

        constructor() {
                this.views = [];
                this.activeId = ""; // "" means Original
                this.globalize();
                this.hooks();
            } // constructor

        newId(prefix = "f") {
            return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }

        // Make sure every formula row has a stable id
        ensureFormulaIds() {
            $("#formulas-wrapper .formula").each((i, el) => {
                if (!$(el).attr("data-fid")) $(el).attr("data-fid", this.newId());
            });
        }

        formulaIds() {
            this.ensureFormulaIds();
            return $("#formulas-wrapper .formula").map((i, el) => $(el).attr("data-fid")).get();
        }

        activeView() {
            return this.views.find(v => v.id === this.activeId) || null;
        }

        // View order + new rows appended at end, deleted rows dropped
        resolvedOrder(view) {
            let ids = this.formulaIds();
            if (!view) return ids;
            let order = (view.order || []).filter(id => ids.indexOf(id) >= 0);
            ids.forEach(id => { if (order.indexOf(id) < 0) order.push(id); });
            return order;
        }

        // From saved file data (backward compatible when missing)
        load(views, activeId) {
                this.views = (Array.isArray(views) ? views : []).filter(v => v && v.id).map(v => ({
                    id: String(v.id),
                    name: String(v.name || "Untitled view"),
                    order: Array.isArray(v.order) ? v.order.map(String) : []
                }));
                activeId = String(activeId || "");
                this.activeId = this.views.some(v => v.id === activeId) ? activeId : "";
                this.exitRearrange();
                this.render();
            } // load

        // For save(): prune deleted rows out of saved views
        serialize() {
            let ids = this.formulaIds();
            return {
                formulaViews: this.views.map(v => ({
                    id: v.id,
                    name: v.name,
                    order: v.order.filter(id => ids.indexOf(id) >= 0)
                })),
                activeFormulaView: this.activeId
            };
        }

        // Re-apply display order, index badges and toolbar
        render() {
                this.ensureFormulaIds();

                // Index badges show the original getResult(X) index
                $("#formulas-wrapper .formula").each((i, el) => {
                    let $formula = $(el),
                        $index = $formula.find(".formula-index");
                    if (!$index.length) {
                        $index = $(`<span class="formula-index" title="Use getResult(X) with this index"></span>`);
                        $formula.find(".desc").before($index);
                    }
                    $index.text(`[${i}]`);
                });

                // Display order
                let view = this.activeView();
                let order = view ? this.resolvedOrder(view) : [];
                $("#formulas-wrapper .formula").each((i, el) => {
                    let pos = view ? order.indexOf($(el).attr("data-fid")) : -1;
                    el.style.order = pos >= 0 ? pos : "";
                });

                // View selector
                let $select = $("#formula-view-select");
                $select.html(`<option value="">Original</option>`);
                this.views.forEach(v => {
                    $select.append($("<option/>").attr("value", v.id).text(v.name));
                });
                $select.val(this.activeId);
                $("#formula-view-rename, #formula-view-delete").toggleClass("hide", !view);
                $("#formula-views-bar").toggleClass("hide", $("#formulas-wrapper .formula").length === 0 && this.views.length === 0);
            } // render

        hooks() {
                $("#formula-view-select").on("change", (ev) => {
                    this.activeId = ev.target.value;
                    this.exitRearrange();
                    this.render();
                    save();
                });

                $("#formula-view-rearrange").on("click", () => this.enterRearrange());
                $("#formula-view-cancel").on("click", () => this.exitRearrange());
                $("#formula-view-save").on("click", () => this.saveRearrange());

                $("#formula-view-rename").on("click", () => {
                    let view = this.activeView();
                    if (!view) return;
                    let name = prompt("Rename view:", view.name);
                    if (name === null || !name.trim().length) return;
                    view.name = name.trim();
                    this.render();
                    save();
                });

                $("#formula-view-delete").on("click", () => {
                    let view = this.activeView();
                    if (!view) return;
                    if (!confirm(`Delete view "${view.name}"? Formulas are not deleted.`)) return;
                    this.views = this.views.filter(v => v.id !== view.id);
                    this.activeId = "";
                    this.render();
                    save();
                });

                // Up/down arrows in rearrange list (fallback when dragging is not available)
                $("#formula-view-list").on("click", ".move-up, .move-down", (ev) => {
                    let $item = $(ev.target).closest(".fv-item");
                    if ($(ev.currentTarget).hasClass("move-up")) $item.insertBefore($item.prev());
                    else $item.insertAfter($item.next());
                });
            } // hooks

        enterRearrange() {
                let order = this.resolvedOrder(this.activeView());
                let $list = $("#formula-view-list").html("");

                order.forEach(id => {
                    let $formula = $(`#formulas-wrapper .formula[data-fid="${id}"]`),
                        index = $("#formulas-wrapper .formula").index($formula),
                        desc = $formula.find(".desc").text() || "Untitled formula",
                        result = $formula.find(".result").text();

                    let $item = $(`<div class="fv-item">
                        <span class="fa fa-bars fv-grip"></span>
                        <span class="formula-index"></span>
                        <span class="fv-desc"></span>
                        <span class="fv-result"></span>
                        <span class="fv-arrows">
                          <a class="move-up" href="javascript:void(0);"><span class="fa fa-arrow-up bookmark-btn"></span></a>
                          <a class="move-down" href="javascript:void(0);"><span class="fa fa-arrow-down bookmark-btn"></span></a>
                        </span>
                      </div>`);
                    $item.attr("data-fid", id);
                    $item.find(".formula-index").text(`[${index}]`);
                    $item.find(".fv-desc").text(desc);
                    $item.find(".fv-result").text(result.length ? `= ${result}` : "");
                    $list.append($item);
                });

                // jQuery UI sortable (+ touch punch) is already loaded at the bottom of index.php
                if ($.fn.sortable) {
                    if ($list.data("ui-sortable")) $list.sortable("destroy");
                    $list.sortable({ axis: "y", handle: ".fv-grip", items: ".fv-item", tolerance: "pointer" });
                }

                $("#formulas-wrapper").addClass("hide");
                $("#formula-view-rearranging").removeClass("hide");
                $("#formula-view-normal").addClass("hide");
            } // enterRearrange

        exitRearrange() {
                let $list = $("#formula-view-list");
                if ($.fn.sortable && $list.data("ui-sortable")) $list.sortable("destroy");
                $list.html("");
                $("#formulas-wrapper").removeClass("hide");
                $("#formula-view-rearranging").addClass("hide");
                $("#formula-view-normal").removeClass("hide");
            } // exitRearrange

        saveRearrange() {
                let order = $("#formula-view-list .fv-item").map((i, el) => $(el).attr("data-fid")).get();
                let current = this.activeView();
                let name = prompt(`Save this arrangement as a view.\nKeep the name to update it, or type a new name to make a new view:`, current ? current.name : "My view");
                if (name === null || !name.trim().length) return; // stay in rearrange mode
                name = name.trim();

                let view = this.views.find(v => v.name === name);
                if (view) {
                    view.order = order;
                } else {
                    view = { id: this.newId("v"), name, order };
                    this.views.push(view);
                }
                this.activeId = view.id;
                this.exitRearrange();
                this.render();
                save();
            } // saveRearrange

    } // FormulaViewSystem
