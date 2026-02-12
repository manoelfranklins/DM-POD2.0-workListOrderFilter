sap.ui.define([
    "sap/dm/dme/pod2/widget/Widget",
    "sap/dm/dme/pod2/widget/metadata/WidgetProperty",
    "sap/dm/dme/pod2/propertyeditor/BooleanPropertyEditor",
    "sap/dm/dme/pod2/propertyeditor/PropertyCategory",
    "sap/dm/dme/pod2/context/PodContext",
    "sap/dm/dme/pod2/context/ModelPath",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/ToolbarSpacer",
    "sap/m/Button",
    "sap/m/HBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
(
    Widget,
    WidgetProperty,
    BooleanPropertyEditor,
    PropertyCategory,
    PodContext,
    ModelPath,
    Input,
    Label,
    ToolbarSpacer,
    Button,
    HBox,
    Filter,
    FilterOperator
) => {
    "use strict";

    console.log("=== WorkListTableExtension MODULE LOADING ===");

    /**
     * @class WorkListTableExtension
     * @extends sap.dm.dme.pod2.widget.Widget
     * 
     * This widget adds an Order filter bar that filters the existing WorkListTable widget
     * in the POD. It subscribes to work list data and applies filters.
     */
    class WorkListTableExtension extends Widget {

        static getDisplayName() {
            return "Order Filter for Work List";
        }

        static getDescription() {
            return "Adds an Order filter that filters the Work List Table widget.";
        }

        static getIcon() {
            return "sap-icon://filter";
        }

        static getCategory() {
            return "Custom Widgets";
        }

        static getDefaultConfig() {
            return {
                properties: {
                    orderFilterVisible: true,
                    filterOnEnter: true
                }
            };
        }

        _createView() {
            console.log("=== WorkListTableExtension _createView called ===");
            
            this._sCurrentOrderFilter = "";
            
            // Create the Order filter input
            this._oOrderFilterInput = new Input({
                placeholder: "Enter Order number to filter...",
                width: "250px",
                liveChange: (oEvent) => {
                    this._sCurrentOrderFilter = oEvent.getParameter("value") || "";
                    if (!this.getPropertyValue("filterOnEnter")) {
                        this._applyOrderFilter();
                    }
                },
                submit: (oEvent) => {
                    console.log("Order filter submitted:", this._sCurrentOrderFilter);
                    this._applyOrderFilter();
                }
            });

            this._oOrderFilterLabel = new Label({
                text: "Order Filter:",
                labelFor: this._oOrderFilterInput
            });

            // Create filter button
            this._oFilterButton = new Button({
                text: "Filter",
                type: "Emphasized",
                press: () => {
                    this._applyOrderFilter();
                }
            });

            // Create clear button
            this._oClearButton = new Button({
                text: "Clear",
                press: () => {
                    this._sCurrentOrderFilter = "";
                    this._oOrderFilterInput.setValue("");
                    this._applyOrderFilter();
                }
            });

            // Create container
            const oContainer = new HBox(this.getId(), {
                items: [
                    this._oOrderFilterLabel,
                    this._oOrderFilterInput,
                    this._oFilterButton,
                    this._oClearButton
                ],
                alignItems: "Center"
            });
            oContainer.addStyleClass("sapUiSmallMargin");

            console.log("=== WorkListTableExtension view created ===");
            return oContainer;
        }

        _applyOrderFilter() {
            console.log("=== Applying Order filter ===");
            const sOrderValue = (this._sCurrentOrderFilter || "").trim();
            console.log("Filter value:", sOrderValue);
            
            // Store filter value in POD Context for other widgets to use
            PodContext.set("/custom/worklistext/orderFilter", sOrderValue);
            
            // Get work list data from POD Context
            const oWorkList = PodContext.get("/workList");
            console.log("Current work list:", oWorkList);
            
            if (!oWorkList) {
                console.warn("No work list found in POD Context");
                return;
            }

            // Try to apply filter to the work list
            // The work list widget should react to filter changes
            if (typeof oWorkList.filter === 'function') {
                if (sOrderValue) {
                    const oFilter = new Filter({
                        filters: [
                            new Filter({ path: "order", operator: FilterOperator.Contains, value1: sOrderValue }),
                            new Filter({ path: "shopOrder", operator: FilterOperator.Contains, value1: sOrderValue })
                        ],
                        and: false
                    });
                    oWorkList.filter([oFilter]);
                } else {
                    oWorkList.filter([]);
                }
                console.log("Filter applied to work list");
            } else {
                // Try to find and filter the work list table directly
                this._filterWorkListTable(sOrderValue);
            }
        }

        _filterWorkListTable(sOrderValue) {
            console.log("=== Trying to filter work list table directly ===");
            
            // Try to find the WorkListTable widget in the POD
            // Look for it in the DOM and get its controller
            const aWorkListTables = document.querySelectorAll('[class*="workList"], [class*="WorkList"]');
            console.log("Found potential work list elements:", aWorkListTables.length);

            // Try to get the table via UI5 Core
            try {
                const oCore = sap.ui.getCore();
                const aControls = oCore.byFieldGroupId ? oCore.byFieldGroupId("workList") : [];
                console.log("Found controls by field group:", aControls);
                
                // Try to find tables in the current view
                const aTables = [];
                oCore.byId && document.querySelectorAll('[id*="Table"], [id*="table"]').forEach(el => {
                    const oControl = oCore.byId(el.id);
                    if (oControl && oControl.isA && (oControl.isA("sap.m.Table") || oControl.isA("sap.ui.table.Table"))) {
                        aTables.push(oControl);
                    }
                });
                
                console.log("Found tables:", aTables.length);
                
                // Apply filter to each table found
                aTables.forEach(oTable => {
                    const oBinding = oTable.getBinding("items") || oTable.getBinding("rows");
                    if (oBinding) {
                        if (sOrderValue) {
                            const oFilter = new Filter({
                                filters: [
                                    new Filter({ path: "order", operator: FilterOperator.Contains, value1: sOrderValue }),
                                    new Filter({ path: "shopOrder", operator: FilterOperator.Contains, value1: sOrderValue }),
                                    new Filter({ path: "ORDER", operator: FilterOperator.Contains, value1: sOrderValue }),
                                    new Filter({ path: "SHOP_ORDER", operator: FilterOperator.Contains, value1: sOrderValue })
                                ],
                                and: false
                            });
                            oBinding.filter([oFilter]);
                            console.log("Filter applied to table:", oTable.getId());
                        } else {
                            oBinding.filter([]);
                            console.log("Filter cleared on table:", oTable.getId());
                        }
                    }
                });
            } catch (e) {
                console.error("Error filtering tables:", e);
            }
        }

        getProperties() {
            return [
                new WidgetProperty({
                    displayName: "Order Filter Visible",
                    description: "Shows or hides the Order filter.",
                    category: PropertyCategory.Main,
                    propertyEditor: new BooleanPropertyEditor(this, "orderFilterVisible")
                }),
                new WidgetProperty({
                    displayName: "Filter on Enter Only",
                    description: "If true, filter only when Enter is pressed. If false, filter as you type.",
                    category: PropertyCategory.Main,
                    propertyEditor: new BooleanPropertyEditor(this, "filterOnEnter")
                })
            ];
        }

        getPropertyValue(sName) {
            const vValue = super.getPropertyValue(sName);
            
            switch (sName) {
                case "orderFilterVisible":
                    return vValue !== false;
                case "filterOnEnter":
                    return vValue !== false;
            }
            
            return vValue;
        }

        setPropertyValue(sName, vValue) {
            if (sName === "orderFilterVisible") {
                if (this._oOrderFilterInput) {
                    this._oOrderFilterInput.setVisible(vValue);
                }
                if (this._oOrderFilterLabel) {
                    this._oOrderFilterLabel.setVisible(vValue);
                }
                if (this._oFilterButton) {
                    this._oFilterButton.setVisible(vValue);
                }
                if (this._oClearButton) {
                    this._oClearButton.setVisible(vValue);
                }
            }
            
            super.setPropertyValue(sName, vValue);
        }

        onExit() {
            PodContext.unsubscribeAll(this);
            
            if (this._oOrderFilterInput) {
                this._oOrderFilterInput.destroy();
                this._oOrderFilterInput = null;
            }
            if (this._oOrderFilterLabel) {
                this._oOrderFilterLabel.destroy();
                this._oOrderFilterLabel = null;
            }
            if (this._oFilterButton) {
                this._oFilterButton.destroy();
                this._oFilterButton = null;
            }
            if (this._oClearButton) {
                this._oClearButton.destroy();
                this._oClearButton = null;
            }
            
            super.onExit && super.onExit();
        }
    }

    console.log("=== WorkListTableExtension MODULE LOADED ===");

    return WorkListTableExtension;
});