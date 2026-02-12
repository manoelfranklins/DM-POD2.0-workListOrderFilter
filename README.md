# Order Filter for Work List - POD 2.0 Extension

A custom POD 2.0 widget that adds an Order filter capability to filter work list items in SAP Digital Manufacturing.

## Overview

This extension provides an "Order Filter for Work List" widget that can be placed alongside the standard WorkListTable widget in your POD. It allows operators to filter work list items by Order number.

## Features

- **Order Filter Input**: Text input field to enter Order number
- **Filter Button**: Apply filter with a single click
- **Clear Button**: Clear the filter and show all items
- **Filter on Enter**: Press Enter to apply filter
- **Configurable Properties**: Show/hide filter, filter on type vs enter

## Installation

### 1. Create the Extension Package

Create a ZIP file containing:
```
extension.json
widget/
    WorkListTableExtension.js
```

### 2. Upload to SAP Digital Manufacturing

1. Navigate to **Manage PODs 2.0** app
2. Go to **Extensions** tab
3. Click **Create**
4. Fill in:
   - **Name**: OrderFilterWorkList (or your preferred name)
   - **Namespace**: `custom/worklistext`
   - **Source Code**: Upload the ZIP file
5. Click **Create**

### 3. Add Widget to POD

1. Open your POD in Design Mode
2. Find **"Order Filter for Work List"** in the plugin palette under **Custom Widgets** category
3. Drag and drop it onto your POD layout (place it near your WorkListTable widget)
4. Save the POD

## Configuration

| Property | Description | Default |
|----------|-------------|---------|
| Order Filter Visible | Shows or hides the Order filter | true |
| Filter on Enter Only | If true, filter only when Enter is pressed. If false, filter as you type | true |

## Usage

1. Enter an Order number (or partial number) in the filter input
2. Click **Filter** button or press **Enter**
3. The WorkListTable will show only items matching the Order
4. Click **Clear** to remove the filter and show all items

## Technical Details

- **Module Path**: `custom/worklistext/widget/WorkListTableExtension`
- **Type**: `custom.worklistext.widget.WorkListTableExtension`
- **Base Class**: `sap/dm/dme/pod2/widget/Widget`
- **Category**: Custom Widgets

## File Structure

```
├── extension.json          # Extension configuration
├── README.md               # This file
└── widget/
    └── WorkListTableExtension.js   # Widget implementation
```

## Dependencies

- SAP Digital Manufacturing POD 2.0
- SAPUI5 libraries (included in DM)

## Notes

- The filter applies to all tables found in the POD
- Searches across multiple order-related field names: `order`, `shopOrder`, `ORDER`, `SHOP_ORDER`
- Uses "Contains" operator for flexible matching

## Version

1.0.0

## License

This extension is provided as-is for SAP Digital Manufacturing customization.