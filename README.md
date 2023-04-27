# Customizable Metadata Export-Import Plugin for Adobe Bridge

JavaScript plugin for Adobe Bridge CS5 and higher to export and import selected embedded XMP metadata from media files. An interface allows the user to define which metadata fields are used.

Supported file types: ai, avi, bmp, dng, flv, gif, indd, indt, jpe?g, mp2, mp3, mp4, mov, pdf, png, psd, swf, tiff?, wav, wma, wmv, xmp, and RAW files an XMP sidecar

This plugin is written in Adobe ScriptUI and utilizes the Adobe Bridge JavaScript object model

## Main features
 - Export-import from select file(s) or from an entire folder (with option to include all subfolders)
 - Export-import metadata in tab-delimited text files
 - User can define which fields to export-import.
   - Established schemas (IPTC, Dublin Core, VRA) are available to build a custom field list.
   - Field name for export-import can be changed (allows synchronization with local field names)
   - Custom schemas and namespaces can be used

IT IS HIGHLY RECOMMENDED THAT YOU BACKUP YOUR IMAGE FILES BEFORE USING THIS OR ANY XMP INFO PANEL INFO PANEL.	
THERE ARE NO WARRANTIES FOR LOSS OR UNINTENDED MODIFICATION OF DATA.*	

## Installation
 1. Start Adobe Bridge
 2. Go to Bridge Preferences
 
    Windows
      - Go to Edit --> Preferences --> Startup Scripts
    
    Mac:
      - Go to Adobe Bridge --> Preferences --> Startup Scripts
 3. Click "Reveal My Startup Scripts".  This will open the correct folder
 4. In this folder, copy the the downloaded file "custom_export_import.jsx"
 5. Close the folder
 6. Quit Bridge
 7. Start Bridge
 8. When prompted, confirm the installation of "user_customizable_export_import"

## Open the plugin in Adobe Bridge
  1. Locate the menu "VRA Core Metadata at the top of the Bridge window (to the right of "Help")
  2. Click "Metadata Export-Import" on the dropdown

## [User Guide and Download](https://metadatadeluxe.github.io/adobe_bridge_custom_export-import.html)

## License
[The MIT License](/LICENSE.txt)
