# Customizable Metadata Export-Import Plugin for Adobe Bridge
JavaScript plugin for Adobe Bridge CS5 and higher that allows the user to export and import embedded XMP metadata from media files.

Supported file types: ai, avi, bmp, dng, flv, gif, indd, indt, jpg, mp2, mp3, mp4, mov, pdf, png, psd, swf, tiff, wav, wma, wmv

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
 4. In this folder, copy the the downloaded file "user_customizable_export_import.jsx"
 5. Close the folder
 6. Quit Bridge
 7. Start Bridge
 8. When prompted, confirm the installation of "user_customizable_export_import"

## Open the plugin in Adobe Bridge
  1. Locate the menu "VRA Core Metadata at the top of the Bridge window (to the right of "Help")
  2. Click "Metadata Export-Import" on the dropdown


## Terms and Conditions
The MIT License (MIT)  

Copyright (c) 2020-present Greg Reser

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
