#target bridge

if (BridgeTalk.appName == 'bridge')

/*
Terms and Conditions of Use:
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Change these to make the scprit yours
var projectName1 = "Custom Metadata" // human friendly
var projectName2 = "Custom_Metadata" // computer friendly.  filenames - don't use spaces, use camelCase or _ or -
var plgnVers = "1.0";
var codeVers = "2020-01-28"
// added .hide() to all palette .close(), fixed Mapping display; changed export file name to current foler+dateYMD; replaced type with xmpType; replaced header with label
// changed field arr to new style; using indexOf to remove prefix from XMP_Property for read/write; fixed fieldList.add to use dropdown field text
// added new build properties; added populate fields list based on lastViewedHeadersPanel; register namespaces from lastViewedHeadersPanel
// added try catch to loadCustom.but1.onClick
// added originalLastViewedHeadersPanel and originalCustomFileText so original values can be restored when custom fields window Cancel is clicked
// added set load standard schema dropdown to "" when Clear is clicked
// moved var exportSaveLocation within export function
// added var customFileArr = customFileText.split("\n") to import function
// changed the way images folder location is determined and displayed - added expImp_thumbSelected as eventHandler, delete this handler on window close
// added basicFieldsArr; added; if(textFile[textFile.length-1].length == 0) to if "Match on filename" is selected check that column B has a value, else show alert
// added to loadSchema.dd1.onChange: if(schemaArr[Lls].Schema_Field != "File-Name") to avoid double File-Name properties
// changed fieldsArr item Field: to Schema_Field:
// fieldsWindow.close(); // causes fieldsWindow to not re-open after Cancel, so MOVED to mainWindow.onClose()
// changed "Add" button function so new field is inserted below currently selected filed in the list
// function saveCustomHeaders(){ - added mainWindow.enabled = true;
// saveCustomHeaders(){ - moved change custom fields label on main window within if(enterCustomNameName.text){
// var pos = 0 - added condition based on number of items in list
// 2019-12-01 addBtn.onClick=function(){ - added var itemSelectedIndex = fieldList.items.length-1; set selected item to new added field
// experimenting with multi-column fields fieldList. See addMoveDelteBtns.but1.onClick
// changed pluginPrefs to projectName2
// changed var fieldList2 to var fieldList
// testing github


{ // brace 1 open

//Create a menu option within Adobe Bridge
var findProjectMenu = MenuElement.find (projectName2);
if (findProjectMenu == null){
	 var projectMenu = new MenuElement ('menu', projectName1, 'before Help', projectName2);
	}
var projectName2ExpImp = new MenuElement ('command', "Metadata Export-Import", 'at the beginning of '+projectName2);
projectName2ExpImp.onSelect = function()

	{ // brace 2 open
     // Load the XMP Script library
     if( xmpLib == undefined ){
          if( Folder.fs == "Windows" ){
               var pathToXMPLib = Folder.startup.fsName + "/AdobeXMPScript.dll";
			}
          else{
               var pathToXMPLib = Folder.startup.fsName + "/AdobeXMPScript.framework";
			}
          var libfile = new File( pathToXMPLib );
          var xmpLib = new ExternalObject("lib:" + pathToXMPLib );
		}
// !!! IN PROGRESS different way to identify user prefs folder
var userF = Folder.userData; //User library
var scriptf = File($.fileName); //script name (only works when you run from StartupScripts, not debuggung in ESTK))
var scriptfo = scriptf.parent; //parent folder of script
var loc = scriptfo + '/images/'; //images folder
var UPprefsPath = ''; //path to preferences file
var UPprefsVersion = '2.0.9'; //always increment with preference file changes
  
// $.writeln(scriptf)
// $.writeln(scriptfo)     
        
	// variables  used throughout the code
    // Don't change these unless you really don't like them
	var plgnName = ""+projectName1+" Metadata Export-Import";
	var appDataFwdSlash = Folder.userData;
	var plgnPrefs = "/"+projectName2+"_Import_Export";
	var plgnSet = "/settings.txt";
	var hardDriveCheck = hardDrive;
	var plgnOpt = "/Options";
	var exportChoice = "folder";
    var plgnHeaders = "/Import-Export_Fields";
    var enteredCustomName = "Custom_Fields_01";
    var originalLastViewedHeadersPanel = "";
    var lastViewedHeadersPanel = "";
    var loadedDefineHeadersText = "";
    var originalCustomFileText = "";
    var customFileText = "{Schema_Field:'File-Name', Label:'File Name', Namespace:'file', XMP_Property:'file', XMP_Type:'file'}";
	var fieldsArr = [];  // array of objects for export and import functions.  this is populated by user saved text file or set  by the user in the build properties window
    
	// today's date
	var dateTime = new XMPDateTime(new Date()); // now
	var dateYMD = dateTime.toString().slice(0, -19);
	var un = undefined;
	//	var currentField = {}
      var arrowLeft = "←";
      var arrowRight = "→";
	//Tool tips
	var clickInstrucTT = "Click for instructions";
        
	var imageFolderPath = "Folder containing image files"
	var imageFolderBrowse = "Locate the path to your folder of images.";
	
	var textFilePath = ".txt file of metadata to be imported"
	var textFileBrowse = "Locate the path to your .txt file";
	
	var dateWhyTT = 
	"This is useful if you will be importing the metadata to Excel.\n\n" +
	"XMP Date values must use the YYYY/MM/DD format.  Adding a '_' character at the beginning of the Date will prevent Excel from automatically changing it to a format XMP cannot understand.\n\n" +
	"The '_' character will be removed when you import the data back into the image file(s)."
			   
	var lineFeedWhyTT = 
	"This is useful if you will be importing the metadata to Excel.\n\n" +
	"When selected, line breaks (line feed and carriage return) will be replaced by a semi-colon and a space ('; ').\n\n"+
	"When not selected, line breaks will be retained but converted to plain text place holders ('LF'), ('CR') so that they are not changed by Excel.  When the data is imported back to an image, the codes will be changed to the proper XMP encoding."	
	
	var replaceDataTT = 
	"Completely replaces any existing metadata\n" +
	"in the image file(s) with the metadata in the\n"+
    "tab-delimited import file.\n" +
	"   • Overwrites all fields except camera and\n"+
    "      software fields."
		  
	var appendDataTT = 
	"Applies the tab-delimited import metadata\n"+
    "where no metadata value or property currently\n" +
	"exists in the file.\n" +
	"   • Does not overwrite existing data.\n" +
	"   • Data will only be imported to blank fields."
	
	var createTemplateTT = 
	"Creates a text file which, when opened in Excel, contains the proper column field names for the "+projectName1+" import function.\nYou can then paste your own data in the appropriate columns for import.";
	
	var IgnoreExtCbTT = 
	"When selected, metadata will be imported to all matching media with matching file names regardless of the file extension.\n" +
	"This allows you to import matching metadata to all versions of the same media file, e.g., .tif, .jpg. .png.";
	
	var addLabelTT = 
	"When selected, each image that has metadata successfully imported will have its label set to: '"+projectName1+" metadata imported' and the label color will be changed to white.\n" +
	"Warning: Existing labels will be lost.";

     // If the current file system is Windows, create directory location variables
     if (Folder.fs == 'Windows'){
		var spot = "•";
		var hardDrive = "C:\\";
		var appDataPlgnSetBkSlash = Folder (File.decode (Folder.userData)).toString().split ("/").join ("\\"); // User preferences file	
		}
     // If the current file system is Mac, create directory location variables
     else{
          var spot = "•";
      //    var userData = "//";
          var hardDrive = "//";
          var appDataPlgnSetBkSlash = Folder (File.decode (Folder.userData)).toString();
          while (appDataPlgnSetBkSlash.split ("/.").length > 1) var appDataPlgnSetBkSlash = appDataPlgnSetBkSlash.split ("/.").join ("/");
          while (appDataPlgnSetBkSlash.split ("./").length > 1) var appDataPlgnSetBkSlash = appDataPlgnSetBkSlash.split ("./").join ("/");
          var pathFirstChar = "/";
          if (appDataPlgnSetBkSlash.substring (0,1) == "~") var pathFirstChar = "~";
          var appDataPlgnSetBkSlash = appDataPlgnSetBkSlash.split ("~").join ("");
          while (appDataPlgnSetBkSlash.split ("//").length > 1) var appDataPlgnSetBkSlash = appDataPlgnSetBkSlash.split ("//").join ("/");
		}
   
    // desktop
    if (Folder.fs == "Windows"){
		var desktop = "~\\Desktop\\";
		}
	else{
		var desktop = "~/Desktop/";
		}
  /*  
    // default location for export text file
    // NOTE: first instance of file - folder in a folder is not useful
    var currentPath = app.document.visibleThumbnails[0].spec.toString()
    var currentPathToArray = app.document.visibleThumbnails[0].spec.toString().split("/")
    var currentFolder = currentPathToArray[currentPathToArray.length-2].split("%20").join("_")
    if (Folder.fs == "Windows"){
         // var exportSaveLocation = desktop+"embedded_metadata_"+dateYMD+".txt";
        var exportSaveLocation = "~\\Desktop\\"+currentFolder+"_METADATA_"+dateYMD+".txt"; //   dateTime  OR dateYMD
        // var exportSaveLocation = currentPath+"_METADATA_"+dateYMD+".txt"; // let user select save location, filename based on current folder
        }
    else{
        // var exportSaveLocation = desktop+"embedded_metadata_"+dateYMD+".txt";
        var exportSaveLocation = "~/Desktop/"+currentFolder+"_METADATA_"+dateYMD+".txt"; // dateTime OR dateYMD
        // var exportSaveLocation = currentFolder+"_METADATA_"+dateYMD+".txt"; // let user select save location, filename based on current folder
        }
  //  var currentPathSaveFile = currentPath+"_"+dateYMD+".txt";  save to same folder as images being exported, filename based on current folder
  */
    var mode = "export"
	 // preferredSize for UI objects
     var hidden = [0,0]
     var panelSize = [700,600]
    // preferredSize for UI objects
    if (Folder.fs == "Windows"){
        var buttonSize1 = [20,20];
        var buttonSize3 = [80,20]
        var textSize1 = [550,20]
        var spcr1=[0,0,40,20];
        var dim1=[0,0,80,25];
var dim2=[0,0,100,25];
var dim3=[0,0,200,25];
var dim4=[0,0,300,25];
var dim5=[0,0,500,25];
var dimC=[0,0,100,200];
var dimL = [0,0,1080,450];
        }
    else{
        var buttonSize1 = [34,34];
        var buttonSize3 = [100,34]
        var textSize1 = [560,20]
        var dim1=[0,0,80,25];
var dim2=[0,0,100,25];
var dim3=[0,0,200,25];
var dim4=[0,0,300,25];
var dim5=[0,0,500,25];
var dimC=[0,0,100,200];
var dimL = [0,0,1000,450];
        }

	var exportImageFolderOK = false;
	var exportTextFolderOK = false;
	var exportTextFileOK = false;	
	var importImageFolderOK = false;
	var importTextFolderOK = false;
	var importTextFileOK = false;
          
     // if it doesn't already exist, create folder: C:\Users\[user name]\AppData\Roaming\IPTC_CH_Import_Export\Options
     if (Folder (appDataFwdSlash + plgnPrefs).exists == false){
          new Folder (appDataFwdSlash + plgnPrefs).create();
          //removed code here that writes 'appDataFwdSlash' to desktop if writing to appDataFwdSlash failed
		}    	
    // if it doesn't already exist, create folder 'userData/"+projectName2+"_Import_Export/Options'
     if (Folder (appDataFwdSlash + plgnPrefs + plgnOpt).exists == false) new Folder (appDataFwdSlash + plgnPrefs + plgnOpt).create();
   
//////////////////////////////////////////////////////////////// BEGINNING OF MAIN UI WINDOW ////////////////////////////////////////////////////////////////
		// Create the main dialog box
		var mainWindow = new Window('palette', projectName1+" Export-Import - code version: "+plgnVers+" ("+codeVers+")");
		{ //  main UI window - brace 1 open
            // header
            settingsGroup = mainWindow.add('group', un, un)
            //settingsGroup.preferredSize = [720, 20]
            settingsGroup.alignment='left';
            fieldsTxt = settingsGroup.add('statictext', dim4, "Fields: "+lastViewedHeadersPanel)
            //fieldsTxt.justify = "center";
            fieldsTxt.graphics.font = ScriptUI.newFont ("Arial", 'BOLD', 16);
            fieldsTxt.graphics.foregroundColor = fieldsTxt.graphics.newPen (mainWindow.graphics.PenType.SOLID_COLOR, [1,0.58,0], 1);
            fieldsTxt.helpTip = "List of fields to be exported/imported"; // name of the currently loaded field list
            setHeaders = settingsGroup.add('button', undefined, "Edit")
            setHeaders.preferredSize = [80,30] //buttonSize9
            //  setHeaders.alignment = 'left';
            setHeaders.helpTip = "Edit the list of fields to be exported/imported";
            setHeaders.onClick = function(){
                mainWindow.enabled = false;
                fieldsWindow.show();
                originalLastViewedHeadersPanel = lastViewedHeadersPanel;
                originalCustomFileText = customFileText;
                } //setHeadersFunc toggleNavBtns()

        navGroup = mainWindow.add('group', un, un)
        navExportBtn = navGroup.add('radiobutton', undefined, arrowLeft+"EXPORT"+arrowRight)
        navExportBtn.preferredSize = [150,20];
        navExportBtn.value = true
        navExportBtn.onClick = function(){mode = "export"; toggleNav();}
        // navSpcr1 = navGroup.add('statictext', undefined, "")
        // navSpcr1.preferredSize = [100,40];
        navImportBtn = navGroup.add('radiobutton', undefined, "import")
        navImportBtn.preferredSize = [150,20];
        navImportBtn.onClick = function(){mode = "import"; toggleNav();}

		mainWindow.row = mainWindow.add( 'group' );
		mainWindow.row.orientation = 'row';
		mainWindow.row.spacing = 0;
	  
        // Export section
        exportPanel = mainWindow.row.add('panel', undefined, "Export Metadata");
        exportPanel.margins = 5;
   //     exportPanel.alignment = 'top';
        exportPanel.alignChildren = 'center';
        exportPanel.minimumSize = [700,undefined]
        exportPanel.maximumSize = [700,undefined]
        // Export Instructions button
        exportInstButton = exportPanel.add('button', undefined, "?");
        exportInstButton.alignment = 'right';
        exportInstButton.preferredSize = buttonSize1
        exportInstButton.helpTip = clickInstrucTT;
        exportInstButton.onClick = showExportInst;

		//  Select which files to export         
		var selections = app.document.selections;
		var folder  = app.document.visibleThumbnails;

		exportWhich = exportPanel.add('panel', undefined, "Images");
		exportWhich.alignChildren = 'left';
		exportWhich.spacing = 2;
        exportWhich.margins = 5;

		// Spacer
		spacer1 = exportWhich.add( 'group' );
		spacer1.minimumSize = [100, 10]
		  var  exportWhichfieldsArrRbtext = "Selected thumbnail(s) in Bridge"
          exportWhich.fieldsArrRb = exportWhich.add('radiobutton', undefined, exportWhichfieldsArrRbtext);
          exportWhich.fieldsArrRb.onClick = function(){ 
              exportChoice = "thumbs";
              toggleExportWhich();
              }  
          
		exportWhich.folderRb = exportWhich.add('radiobutton', undefined, "Entire folder");
		exportWhich.folderRb.value = true;
		exportWhich.folderRb.onClick = function(){
			exportChoice = "folder";
			toggleExportWhich();
			} 
		
        exportWhich.subfoldersGr = exportWhich.add('group');
        exportWhich.subfoldersGr.orientation = 'column';
        exportWhich.subfoldersGr.alignChildren = 'left';
        exportWhich.subfoldersGr.indent = 20;
        exportWhich.subfoldersGr.spacing = 0;
        exportWhich.subfoldersGr.minimumSize = [700,undefined];
        
        exportWhich.folderEt = exportWhich.subfoldersGr.add('statictext', undefined, "");
		exportWhich.folderEt.preferredSize = textSize1
		exportWhich.folderEt.helpTip = imageFolderPath;

		exportWhich.subfoldersCb = exportWhich.subfoldersGr.add('checkbox', undefined, "include subfolders");		
// TODO: remove everything associated with exportWhich.folderGr
      
        // Panel for options
         exportOptionsGrp = exportPanel.add('group', un, un);
		
		exportOptions = exportOptionsGrp.add('panel', undefined, 'Options');
		exportOptions.alignChildren = 'left'; 
		exportOptions.spacing = 2;

		exportOptions.dates = exportOptions.add( 'group' );
		exportOptions.dates.orientation = 'row';
		exportOptions.datesCb = exportOptions.dates.add('checkbox', undefined, "prepend Image dates with '_'");
        exportOptions.datesCb.value = true;
		exportOptions.datesCb.minimumSize = [200, undefined];
	//	exportOptions.datesCb.helpTip = dateWhyTT;

		exportOptionsLf = exportOptions.add( 'group' );
		exportOptionsLf.orientation = 'row';
		exportOptionsLfCb = exportOptionsLf.add('checkbox', undefined, "Remove line breaks");
        exportOptionsLfCb.value = true;
		exportOptionsLfCb.minimumSize = [200, undefined];
	//	exportOptionsLfCb.helpTip = lineFeedWhyTT;

        // Export Options Instructions button
		exportOptionsButton = exportOptionsGrp.add('button', undefined, "?");
		exportOptionsButton.alignment = 'right';
		exportOptionsButton.preferredSize = buttonSize1
		exportOptionsButton.helpTip = clickInstrucTT;
		exportOptionsButton.onClick = showExportOptInst

		exportBtn = exportPanel.add('button', undefined, "Export");   
		exportBtn.preferredSize = [120, 35];
		exportBtn.enabled = false;
		exportBtn.onClick = exportToFile;

		// check to see if the folder of images specified exists
		function testExportImagesFolder(){
			var selectedFolder = Folder(exportWhich.folderEt.text.split(" ").join("%20"));			
			if (exportWhich.folderEt.text && selectedFolder.exists == false){
				exportImageFolderOK = false;
			//	exportWhich.folderEt.Alert.visible = true;
				}
			else if (exportWhich.folderEt.text && selectedFolder.exists == true){
				exportImageFolderOK = true;
			//	exportWhich.folderEt.Alert.visible = false;
				}
			toggleExportBtn();
			}

		function toggleExportBtn(){
			if (exportImageFolderOK == true){
				exportBtn.enabled = true;
				}
			else{
				 exportBtn.enabled = false;
				}
			}
        
		 // test to see if the paths entered by user exist
		exportWhich.folderEt.addEventListener('changing',function(){testExportImagesFolder()});
		
		// If user selects export to "Entire folder", show folder path box, otherwise hide it
		function toggleExportWhich(){
			if (exportChoice == "thumbs"){
				exportWhich.subfoldersGr.visible = false;
			//	exportWhich.folderGr.visible = false;
                  exportBtn.enabled = true;
				}
			else{
				exportWhich.subfoldersGr.visible = true;
				//exportWhich.folderGr.visible = true;
                  toggleExportBtn;
				}
              }
		
		// info windows  
          function showExportInst(){
               var ExportInst = new Window('palette', "Export Instructions");
                var body =
                    "    Choose which files to export\n" +
                    "          From selected files only\n" +
                    "              1. Select file(s) in Adobe Bridge\n"+
                    "              2. Under ‘Images’, choose 'Selected thumbnails in Bridge'\n" +
                    "              3. Select desired export options (see below)'\n" +
                    "              4. click 'Export'\n" +
                    "              5. Choose name and location for your export file (.txt format)'\n" +
                    "              6. Saven\n" +
                    "          From all image files in a folder\n" +
                    "              1. Select 'Entire folder'\n" +
                    "              2. Use 'browse'  to select folder you wish to use\n" +
                    "              3. If you want to export images in all subfolders check the box 'include subfolders'\n" +
                    "              4. Select desired export options (see below)\n" +
                    "              5. Click 'Export'\n" +
                    "              6. Choose name and location for your export file (.txt format)\n" +
                    "              7. Save\n\n" +
                    "     After export is complete\n" +
                    "          1. Open your .txt file in a spreadsheet using tab delimiters.\n" +
                    "          2. Because the .txt file is created as UTF-8, it is best to use the Excel import text wizard to retain\n"+
                    "              proper character encoding, e.g. ©, 작, ü\n"+
                    "                a. Use import option and select a .txt file to import\n" +
                    "                b. Text Import Wizard\n" +
                    "                    i. File origin = 65001- Unicode (UTF-8)\n" +
                    "                    ii. Delimited = Tab\n" +
                    "                    iii. Finish\n" +
                    "          3. The first row will contain the field names."
   
               ExportInstText = ExportInst.add('statictext', undefined, body, {multiline:true});
			   if (Folder.fs == "Windows"){
				ExportInstText.preferredSize = [600,450];
				}
			else{
				ExportInstText.preferredSize = [700, 550];
				}
            
            ExportInst.optionsBtn = ExportInst.add('button', undefined, 'Export options');
            ExportInst.optionsBtn.onClick = function(){showExportOptInst()}
             ExportInst.optionsBtn.alignment = 'left'         
               ExportInst.cancelBtn = ExportInst.add('button', undefined, 'Close');
			ExportInst.cancelBtn.onClick =  function(){ 
				ExportInst.hide();
                ExportInst.close();
				}
               ExportInst.show();
			}
            
            function showExportOptInst(){
               var exportOptInst = new Window('palette', "Export Options");
               var body =
                    "Export Options\n\n"+
                    "Option 1:  prepend Image dates with '_'\n"+
                    "   This is useful if you will be importing the metadata to Excel.\n"+                    
                    "   XMP Date values must use the YYYY/MM/DD format.  Adding a '_' character at the beginning of\n"+
                    "      the Date will prevent Excel from automatically changing it to a format XMP cannot understand.\n"+
                    "       (if your system is set up for another format, that will bereflected in the way Excel displays dates)\n"+
                    "     The '_' character will be removed when you import the data back into the image file(s).\n\n"+
                    "Option 2:  Remove line breaks\n"+
                    "    This is useful if you will be importing the metadata to Excel.\n"+
                    "    When selected, line breaks (line feed and carriage return) will be replaced by a semi-colon and a space ('; ').\n"+
                    "    When not selected, line breaks will be retained but converted to plain text place holders ('LF'), ('CR') so\n"+
                    "       that they are not changed by Excel.  When the data is imported back to an image, the codes will be\n"+
                    "       changed to the proper XMP encoding."
                    
               exportOptInstText = exportOptInst.add('statictext', undefined, body, {multiline:true});
			   if (Folder.fs == "Windows"){
				exportOptInstText.preferredSize = [650,250];
				}
			else{
				exportOptInstText.preferredSize = [700,350];
				}
               exportOptInst.cancelBtn = exportOptInst.add('button', undefined, 'Close');
			exportOptInst.cancelBtn.onClick =  function(){ 
				exportOptInst.hide();
                exportOptInst.close();
				}
               exportOptInst.show();
			}
 
		// Panel for Import section
		importPanel = mainWindow.row.add('panel', undefined, "Import Metadata");
		importPanel.margins = 3;
		importPanel.alignChildren = 'center';
          importPanel.minimumSize = hidden
        importPanel.maximumSize = hidden
		// Info button
		importInstButton = importPanel.add('button', undefined, '?');
		importInstButton.preferredSize = buttonSize1
     importInstButton.alignment = 'right';
		importInstButton.helpTip = clickInstrucTT;
		importInstButton.onClick = function showImportInst(){
			var ImportInst = new Window('palette', "Import Instructions"); 
			ImportInst.body = ImportInst.add('group');
			ImportInst.body.orientation = 'column';
			ImportInst.body.spacing = 5;
			   
            var text1 =
            "This script imports data from a tab delimited text file into image files with matching filenames.\n\n" +
              "      If you have already exported metadata and edited it in Excel and want to import it back in:\n" +
			"         1. Select the folder containing the target images\n" +
			"              a. If you have nested folders, check 'include subfolders'\n" +
			"         2. Select the text file to be imported\n" +
			"              a. Click 'Import' and cross your fingers\n\n" +
			"     If you are starting with external metadata (from a database, etc.)\n" +
			"         First, you need a properly formatted template.\n"+
            "           This template lists all available IPTC fields and you can import data  into any IPTC field:";

			var text2 =			 
			"             Look for this new file on your desktop\n" +
			"                1. Open the text file in Excel\n" +
			"                2. Add data to the appropriate columns\n" +
			"                3. Save as a tab-delimited text file\n\n" +
			"      To import data into image files:\n" +
			"         1. Select the folder containing the target images\n" +
			"              a. If you have nested folders, check 'include subfolders'\n" +
			"         2. Select the text file to be imported\n" +
			"         3. Click 'Import' and cross your fingers";
   
			ImportInst.text1 = ImportInst.body.add('statictext', undefined, text1, {multiline:true});
			if (Folder.fs == "Windows"){
				ImportInst.text1.preferredSize = [540,160];
				}
			else{
				ImportInst.text1.preferredSize = [620,200];
				}			
			ImportInst.templateBtn = ImportInst.body.add ('button', undefined, "Create "+projectName2+"_import_default template.txt");
			ImportInst.templateBtn.helpTip = createTemplateTT;
			ImportInst.templateBtn.alignment = 'left';
			ImportInst.templateBtn.indent = 50;
			ImportInst.templateBtn.onClick  = createTemplate; 
			ImportInst.text2 = ImportInst.body.add('statictext', undefined, text2, {multiline:true});
			if (Folder.fs == "Windows"){
				ImportInst.text2.preferredSize = [540,150];
				}
			else{
				ImportInst.text2.preferredSize = [620,170];
				}
          ImportInst.optionsBtn = ImportInst.add('button', undefined, 'Import options');
           ImportInst.optionsBtn.onClick = function(){showImportOptInst();}
             ImportInst.optionsBtn.alignment = 'left'
			ImportInst.cancelBtn = ImportInst.add('button', undefined, 'Close');
			ImportInst.cancelBtn.onClick =  function(){ 
				ImportInst.hide();
                ImportInst.close();
				}  		
			ImportInst.show();
		}
               
		function showImportOptInst(){
               var importOptInst = new Window('palette', "Import Options");
               var body =
                    "Import Options\n\n"+
                    "Option 1: Ignore file extensions\n"+
                    "   When selected, metadata will be imported to all matching media with matching file names regardless\n"+
                    "   of the file extension.\n"+
                    "   This allows you to import matching metadata to all versions of the same media file, e.g., .tif, .jpg. .png.\n\n"+             
                    "Option 2: Set Thumbnail Label\n"+	
                    "   When selected, each image that has metadata successfully imported will have its label set to:\n"+
                    "   'DC metadata imported' and the label color will be changed to white.\n"+
                    "   Warning: Existing labels will be lost"

               importOptInstText = importOptInst.add('statictext', undefined, body, {multiline:true});
			   if (Folder.fs == "Windows"){
				importOptInstText.preferredSize = [650,150];
				}
			else{
				importOptInstText.preferredSize = [650,250];
				}
               importOptInst.cancelBtn = importOptInst.add('button', undefined, 'Close');
			importOptInst.cancelBtn.onClick =  function(){ 
				importOptInst.hide();
                importOptInst.close();
				}
               importOptInst.show();
			}
        
		// Select image files location
		imageLocBox = importPanel.add('panel', undefined, "Images folder");
		imageLocBox.spacing = 2;
        imageLocBox.margins = 5;      
         // Spacer
		spacer3 = imageLocBox.add( 'group' );
		spacer3.minimumSize = [100, 10]
		imageLocLblGrp = imageLocBox.add('group');
		imageLocLblGrp.orientation = 'row';
		imageLocLblGrp.alignment = 'left';
	//	imageLocLblGrp.spacing = 100
		imageLocLblGrp.indent = 3//55;
        imageLocSubfoldersLbl = imageLocLblGrp.add('statictext', undefined, "folder location:");
        imageLocSubfoldersLbl.preferredSize = [160,20]
		imageLocSubfoldersCb = imageLocLblGrp.add('checkbox', undefined, "include subfolders");		
		imageLocSubfoldersCb.alignment = 'left';
	//	imageLocSubfoldersCb.indent = 60;
		imageLocSubfoldersCb.onClick = function toggleImportSub(){
			if (imageLocSubfoldersCb.value == true){
				dataSourceOptions.enabled = true
				IgnoreExtCb.value = false;
				IgnoreExtCb.enabled = false;
				}
			if (imageLocSubfoldersCb.value == false){
				dataSourceOptions.enabled = false;
				dataSourceOptions.Name.value = true;
				dataSourceOptions.Path.value = false;
				IgnoreExtCb.value = true;
				IgnoreExtCb.enabled = true;
				}
			}
		imageLocGroup = imageLocBox.add('group');
		imageLocGroup.orientation = 'row';
        imageLocGroup.spacing = 2;
		imageLoc = imageLocGroup.add('statictext', undefined, "");
		imageLoc.preferredSize = textSize1
		imageLoc.helpTip = imageFolderPath;
		//imageLocBrowse = imageLocGroup.add('button', undefined, "Browse");
		//imageLocBrowse.helpTip = imageFolderBrowse;
		imageLocAlert = imageLocBox.add('statictext', undefined, "? Folder not found.  Keep looking.");
		imageLocAlert.alignment = 'left';
		imageLocAlert.justify = 'left';
		imageLocAlert.indent = 20;
        imageLocAlert.preferredSize = textSize1
	imageLocAlert.visible = false
	/*  
		// opens file browser to pick the location of the image files 
		imageLocBrowse.onClick =  function(){
		var folderPath = Folder.selectDialog("Select a folder of image files to import metadata");
            if (folderPath){
                imageLoc.text = folderPath.toString().split ("%20").join (" ");
                testImportImagesFolder();
                imageLoc.helpTip = imageLoc.text+"\n\n"+imageFolderPath
                }
			}
        */
		 
		// Select the .txt  file to be imported
		dataSourceBox = importPanel.add('panel', undefined, "Metadata text file");
		dataSourceBox.spacing = 3;
		dataSourceBox.margins = 5;
		// Spacer
		spacer4 = dataSourceBox.add( 'group' );
		spacer4.minimumSize = [100, 10];
		dataSourceGrp = dataSourceBox.add('statictext', undefined, "file location:");
		dataSourceGrp.alignment = 'left';
		dataSourceGrp.indent = 3//68;
        dataSourceGrp.preferredSize = [160,20]
		dataSourceGroup = dataSourceBox.add('group');
		dataSourceGroup.orientation = 'row';      
		dataSourceGroup.spacing = 2;
		dataSource = dataSourceGroup.add('edittext', undefined, "");
		dataSource.preferredSize = textSize1
		dataSource.helpTip = textFilePath;
		dataSourceBrowse = dataSourceGroup.add('button', undefined, "Browse");
		dataSourceBrowse.helpTip = textFileBrowse;
		dataSourceFileAlert = dataSourceBox.add('statictext', undefined, "? File not found.  Keep looking.");
		dataSourceFileAlert.alignment = 'left';
		dataSourceFileAlert.justify = 'left';
        dataSourceFileAlert.preferredSize = [200,20]
		dataSourceFileAlert.indent = 20;
		dataSourceFileAlert.visible = false;
        
          // opens file browser to pick the location of the metadata text file to be imported to images
          dataSourceBrowse.onClick =  function(){
            var filePath = File.openDialog( 'Select the text file (.txt)',  "TXT  Files:*.txt" );
                if(filePath){
                dataSource.text = filePath.toString().split ("%20").join (" ");
                testTextFileExists();
                dataSource.helpTip = dataSource.text+"\n\n"+textFilePath
                }
		}
		  
		dataSourceOptions = importPanel.add('panel', undefined, "Match on");
		dataSourceOptions.Name = dataSourceOptions.add('radiobutton', undefined, "Filename");
        dataSourceOptions.Name.value = true;
		dataSourceOptions.Name.helpTip = "Example:\n 00252901.tif";
		dataSourceOptions.Path = dataSourceOptions.add('radiobutton', undefined, "Path and filename");
		dataSourceOptions.alignChildren = 'left';
		dataSourceOptions.Path.helpTip = "Example:\n C:/Architecture/Trajans_Column/Large/00252901.tif";
	     dataSourceOptions.minimumSize = [310, undefined]
		dataSourceOptions.spacing = 2;		

		writeOptions = importPanel.add('panel', undefined, "Existing Data");
		writeOptions.minimumSize = [310, undefined]
		writeOptions.spacing = 2;	
		writeOptions.overwriteRb = writeOptions.add('radiobutton', undefined, "Overwrite all fields");   
		writeOptions.overwriteRb.value = true
	//	writeOptions.overwriteRb.helpTip = replaceDataTT;
		writeOptions.appendRb = writeOptions.add('radiobutton', undefined, "Write only to empty fields");
        writeOptions.appendRb.value = true;
	//	writeOptions.appendRb.helpTip = appendDataTT;
		writeOptions.alignChildren = 'left';
		writeOptions.minimumSize = [310, undefined]
// Panel for options
     importOptionsGrp = importPanel.add('group', un, un);
		importOptions = importOptionsGrp.add('panel', undefined, "Options");	 
		importOptions.alignChildren = 'left';
		importOptions.minimumSize = [275, undefined]
		importOptions.spacing = 2;

		ignoreExt = importOptions.add('group', undefined, "");
		IgnoreExtCb = ignoreExt.add('checkbox', undefined, "Ignore file extensions");
		IgnoreExtCb.minimumSize = [200, undefined];	
	//	IgnoreExtCb.helpTip = IgnoreExtCbTT;

		addLabel = importOptions.add('group', undefined, "");
		addLabelCb = addLabel.add('checkbox', undefined, "Set Thumbnail Label");
		addLabelCb.minimumSize = [200, undefined];	
	//	addLabelCb.helpTip = addLabelTT; 
	  
	   // import Options Instructions button
		importOptionsButton = importOptionsGrp.add('button', undefined, "?");
		importOptionsButton.alignment = 'right';
		importOptionsButton.preferredSize = buttonSize1
		importOptionsButton.helpTip = clickInstrucTT;
		importOptionsButton.onClick = showImportOptInst	
				  
	// check to see if the folder of images specified exists
		function testImportImagesFolder(){
			var selectedFolder = Folder(imageLoc.text.split(" ").join("%20"));			
			if (imageLoc.text && selectedFolder.exists == false){
				importImageFolderOK = false;
				imageLocAlert.visible = true;
				}
			else if (imageLoc.text && selectedFolder.exists == true){
				importImageFolderOK = true;
				imageLocAlert.visible = false;
				}
			toggleImportBtn();
			}		
				
		// check to see if the .txt file folder specified exists
		function testTextFileExists(){
			// get just the directory
			var textFile = File(dataSource.text.split(" ").join("%20"));
			if (dataSource.text && textFile.exists == false){
				importTextFileOK = false;
				dataSourceFileAlert.visible = true;
				}
			else if (dataSource.text && textFile.exists == true){
				importTextFileOK = true;
				dataSourceFileAlert.visible = false;
				}
			toggleImportBtn();
			}

		function toggleImportBtn(){
			if (importImageFolderOK == true && importTextFileOK == true ){
				importBtn.enabled = true;
				}
			else{
				 importBtn.enabled = false;
				}
			}
		
		  // test to see if the paths entered by user exist
		 imageLoc.addEventListener('changing',function(){testImportImagesFolder()});
		 dataSource.addEventListener('changing',function(){testTextFileExists()});
		 
          // Import button
          importBtn = importPanel.add('button', undefined, "Import");
          importBtn.preferredSize = [120, 35];
          importBtn.onClick = importFromFile;
            
		// Create a text file on the desktop with only the headers.  This can be used as a template in Excel to create properly formatted text for the import function
		function createTemplate(){
			var vraTemplate = new File (desktop+""+projectName2+"_import_default template.txt")                
			vraTemplate.encoding = "UTF8";
			vraTemplate.open ("w", "TEXT", "ttxt");	
			// Loop through array of headers (properties) and write them to the .txt file
			for (var L1 = 0; L1 < fieldsArr.length; L1++) vraTemplate.write (fieldsArr[L1].Label + "\t");
			// Close the file  ""+projectName2+"_import_template.txt"
			vraTemplate.close();
			Window.alert ("A new file named:\n\n"+projectName2+"_import_default template.txt\n\nhas been created on your desktop.", "Success!")
			}
			
		// Cancel button
		cancelBtn = mainWindow.add('button', undefined, "Cancel");
		cancelBtn.minimumSize = [150, 25];
		cancelBtn.onClick = function(){
   

var appDataPlgnSet = File (appDataFwdSlash + plgnPrefs + plgnOpt + plgnSet);
        //  ~/AppData/Roaming/IPTC_CH_Import_Export/Options/settings.txt
        appDataPlgnSet.open ("w", "TEXT", "ttxt");
        appDataPlgnSet.write (exportWhich.folderRb.value  + "|");
        appDataPlgnSet.write (exportWhich.subfoldersCb.value  + "|");  
        appDataPlgnSet.write (exportWhich.fieldsArrRb.value + "|");
        appDataPlgnSet.write (exportOptions.datesCb.value + "|");
        appDataPlgnSet.write (dataSource.text + "|");
        appDataPlgnSet.write (writeOptions.appendRb.value+ "|");
        appDataPlgnSet.write (writeOptions.overwriteRb.value + "|");
        appDataPlgnSet.write (IgnoreExtCb.value+ "|");
        appDataPlgnSet.write (addLabelCb.value+ "|");
        appDataPlgnSet.write (exportOptionsLfCb.value+"|");
        appDataPlgnSet.write (exportChoice+"|");
        appDataPlgnSet.write (exportWhich.folderEt.text + "|");
        appDataPlgnSet.write (imageLoc.text+ "|");
        appDataPlgnSet.write (imageLocSubfoldersCb.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.Path.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.Name.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.enabled+ "|");
        appDataPlgnSet.write (IgnoreExtCb.enabled+ "|");
        appDataPlgnSet.write (mode+ "|");
        appDataPlgnSet.write (lastViewedHeadersPanel);
        appDataPlgnSet.close();
        // close hte main UI window   
        mainWindow.hide();
        mainWindow.close();     
			}
 
     // if file 'appDataFwdSlash/"+projectName1+"_Import_Export/Options/settings.txt' exists, read settings and apply to dialog
	 // ~/AppData/Roaming/"+projectName1+"_Import_Export/Options/settings.txt
	 // C:\Users\Computer User\AppData\Roaming\"+projectName1+"_Import_Export\Options
     var appDataPlgnSetBkSlash = File (appDataFwdSlash + plgnPrefs + plgnOpt + plgnSet);
     if (appDataPlgnSetBkSlash.exists == true){
          appDataPlgnSetBkSlash.open ('r');
          var pluginSettingsArray = appDataPlgnSetBkSlash.read().split ('|');
          appDataPlgnSetBkSlash.close();
		try{   
      if (pluginSettingsArray[0] == "folder") exportWhich.folderRb.value = true;
			if (pluginSettingsArray[1] == "true") exportWhich.subfoldersCb.value = true;  
      if (pluginSettingsArray[2] == "true") exportWhich.fieldsArrRb.value = true;
			if (pluginSettingsArray[3] == "false") exportOptions.datesCb.value = false;
			if (pluginSettingsArray[4]) dataSource.text = pluginSettingsArray[4];
			if (pluginSettingsArray[5] == "true") writeOptions.appendRb.value = true;
			if (pluginSettingsArray[6] == "true") writeOptions.overwriteRb.value = true;
			if (pluginSettingsArray[7] == "true") IgnoreExtCb.value = true; 
			if (pluginSettingsArray[8] == "true") addLabelCb.value = true;
			if (pluginSettingsArray[9] == "false") exportOptionsLfCb.value = false;
			exportChoice = pluginSettingsArray[10];         
			if (pluginSettingsArray[11]) exportWhich.folderEt.text = pluginSettingsArray[11];
			if (pluginSettingsArray[12]) imageLoc.text = pluginSettingsArray[12];
			if (pluginSettingsArray[13] == "true") imageLocSubfoldersCb.value = true;   
			if (pluginSettingsArray[14] == "true") dataSourceOptions.Path.value = true;
			if (pluginSettingsArray[15] == "true") dataSourceOptions.Name.value = true;
			if (pluginSettingsArray[16] == "false") dataSourceOptions.enabled = false;
			if (pluginSettingsArray[17] == "false") IgnoreExtCb.enabled = false;         
            if (pluginSettingsArray[18]) mode = pluginSettingsArray[18];
            if (pluginSettingsArray[19]) lastViewedHeadersPanel = pluginSettingsArray[19]; fieldsTxt.text = "Fields: "+lastViewedHeadersPanel;
			}
          catch(pluginSettingsError){
               if (appDataPlgnSetBkSlash.exists == true) appDataPlgnSetBkSlash.remove();
          }
     }
// if user prefs file contains lastViewedHeadersPanel, load custom fields
var customFilePath = File (appDataFwdSlash + plgnPrefs + plgnHeaders + "/"+lastViewedHeadersPanel + ".txt");
if (customFilePath.exists == true){ // !!! if "- Select Custom -"
customFilePath.open ('r');
customFileText = customFilePath.read()//.split ('|'); 
customFilePath.close();
fieldsTxt.text = "Fields: "+lastViewedHeadersPanel

// convert that to the fieldsArr
// TODO: problem - fieldsArr is not accessible when export import functions run so it is being re-created several times later in the code.  Is there a better way to do this?
var customFileArr = customFileText.split("\n");
fieldsArr = [];
for (var L1 = 0; L1 < customFileArr.length; L1++){
    var obj = new Object();
    obj = eval('(' + customFileArr[L1] + ')');
    fieldsArr.push(obj)
    }

// get unique values of namespace and prefix from objects in array
var found = {}; 
var out = [];
var count = 0;
for(var i = 0; i < fieldsArr.length; i++) {  
    var namespaceObject = {}
     var item = fieldsArr[i].Namespace;
     var pre = fieldsArr[i].XMP_Property;
     
    prefixArr = fieldsArr[i].XMP_Property.split(":")
    var pre2 = prefixArr[0];

     if(found[item] !== 1) {
       found[item] = 1;
       namespaceObject.namespace = item;
       namespaceObject.prefix = pre2;
       if(item.length>0){ // this function returns an empty item at the beginning, so only write to the array if it has data
        out[count++] = namespaceObject;    
         }        
        }
    }
// register namespaces
    /* Namespaces
    these default namespaces can be used without registering them:
        XMPConst.NS_DC
        XMPConst.NS_EXIF
        XMPConst.NS_IPTC_CORE
        XMPConst.NS_PHOTOSHOP
        XMPConst.NS_TIFF
        XMPConst.NS_XMP
        XMPConst.NS_XMP_RIGHTS
        XMPConst.NS_AUX
    other namespaces must be registered below 
    */
    // register w3 for writing LangAlt properties
    var NS_W3 = "http://www.w3.org/XML/1998/namespace";
    XMPMeta.registerNamespace (NS_W3, "xml");
    // PLUS prefix is problematic - might need to do this, not sure...
   // XMPMeta.registerNamespace ("http://ns.useplus.org/ldf/xmp/1.0/", "plus");
  //  var plusPrefix = XMPMeta.getNamespacePrefix ("http://ns.useplus.org/ldf/xmp/1.0/");
    //var plusCRownerName = "CopyrightOwner[1]/"+plusPrefix+"CopyrightOwnerName"
for (var L2 = 0; L2 < out.length; L2++){
    // not "file"
    if(out[L2].namespace != "file"){
        XMPMeta.registerNamespace(out[L2].namespace, out[L2].prefix);
     }
    }
}
else{
    fieldsTxt.text = "Fields: UNDEFINED,  click Edit →"
    };
  
// get current Bridge folder and file paths to automatically fill form. Not sure why, but both of the following methods are needed
        if(app.document.visibleThumbnails == true){
            var slicePathIndex = app.document.visibleThumbnails[0].spec.toString().lastIndexOf ("/")
            var path = app.document.visibleThumbnails[0].spec.toString().substr(0,slicePathIndex+1).split("%20").join(" ")
            exportWhich.folderEt.text = path
            imageLoc.text = path
            }
        
		// get current Bridge folder and file paths to automatically fill form
		if(app.document.visibleThumbnails){
			 var slicePathIndex = app.document.visibleThumbnails[0].spec.toString().lastIndexOf ("/")
			 var path = app.document.visibleThumbnails[0].spec.toString().substr(0,slicePathIndex+1).split("%20").join(" ")
			 exportWhich.folderEt.text = path
			 imageLoc.text = path		     
			}
     
		if (hardDriveCheck == null) var hardDriveCheck = hardDrive;
		toggleExportWhich();
        testExportImagesFolder();
        //   testTextFolderExists();
        //   testTextFileExtension();
        testImportImagesFolder();
        testTextFileExists();
        exportWhich.folderEt.helpTip = exportWhich.folderEt.text+"\n\n"+imageFolderPath
        imageLoc.helpTip = imageLoc.text+"\n\n"+imageFolderPath
        dataSource.helpTip = dataSource.text+"\n\n"+textFilePath
        // set panel view
        toggleNav()
		// open the window
		mainWindow.show();   
     } // main UI window - brace 1 close
//////////////////////////////////////////////////////////////// END OF MAIN UI WINDOW ////////////////////////////////////////////////////////////////
var basicFieldsArr = [
{Schema_Field:'File-Folder', Label:'File Folder', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'IPTC-Title', Label:'Title', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:title', XMP_Type:'langAlt'},
{Schema_Field:'IPTC-Creator', Label:'Creator', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:creator', XMP_Type:'seq'},
{Schema_Field:'IPTC-Description', Label:'Description', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:description', XMP_Type:'langAlt'},
{Schema_Field:'IPTC-Keywords', Label:'Keywords', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:subject', XMP_Type:'bag'},
{Schema_Field:'IPTC-Copyright Notice', Label:'Copyright Notice', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:rights', XMP_Type:'langAlt'}
];

var fileFieldsArr = [
{Schema_Field:'File-Name', Label:'File Name', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Folder', Label:'File Folder', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Date Created', Label:'Date File Created', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Date Modified', Label:'Date File Modified', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Date Original', Label:'Date Original', Namespace:'http://ns.adobe.com/exif/1.0/', XMP_Property:'exif:DateTimeOriginal', XMP_Type:'text'},
{Schema_Field:'File-Format', Label:'File Format', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:format', XMP_Type:'text'},
{Schema_Field:'File-Size', Label:'File Size', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Width (pixels)', Label:'Width (pixels)', Namespace:'http://ns.adobe.com/exif/1.0/', XMP_Property:'exif:PixelXDimension', XMP_Type:'text'},
{Schema_Field:'File-Height (pixels)', Label:'Height (pixels)', Namespace:'http://ns.adobe.com/exif/1.0/', XMP_Property:'exif:PixelYDimension', XMP_Type:'text'},
{Schema_Field:'File-Bit Depth', Label:'Bit Depth', Namespace:'http://ns.adobe.com/tiff/1.0/', XMP_Property:'tiff:BitsPerSample[1]', XMP_Type:'text'},
{Schema_Field:'File-Compression', Label:'Compression', Namespace:'http://ns.adobe.com/tiff/1.0/', XMP_Property:'tiff:Compression', XMP_Type:'text'},
{Schema_Field:'File-Resolution', Label:'Resolution', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Device Make', Label:'Device Make', Namespace:'http://ns.adobe.com/tiff/1.0/', XMP_Property:'tiff:Make', XMP_Type:'text'},
{Schema_Field:'File-Device Model', Label:'Device Model', Namespace:'http://ns.adobe.com/tiff/1.0/', XMP_Property:'tiff:Model', XMP_Type:'text'},
{Schema_Field:'File-Software', Label:'Software', Namespace:'http://ns.adobe.com/tiff/1.0/', XMP_Property:'tiff:Software', XMP_Type:'text'},
{Schema_Field:'File-Color Mode', Label:'Color Mode', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},
{Schema_Field:'File-Color Profile', Label:'Color Profile', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:ICCProfile', XMP_Type:'text'},
{Schema_Field:'File-Color Space', Label:'Color Space', Namespace:'file', XMP_Property:'file', XMP_Type:'file'}
];

var iptcFieldsArr = [
{Schema_Field:'IPTC-Creator', Label:'Creator', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:creator', XMP_Type:'seq'},
{Schema_Field:'IPTC-Creator-Job Title', Label:'Creator-Job Title', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:AuthorsPosition', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-Address', Label:'Creator-Address', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiAdrExtadr', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-City', Label:'Creator-City', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiAdrCity', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-State/Provice', Label:'Creator-State/Provice', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiAdrRegion', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-Postal Code', Label:'Creator-Postal Code', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiAdrPcode', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-Country', Label:'Creator-Country', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiAdrCtry', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-Email address(es)', Label:'Creator-Email address(es)', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiEmailWork', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-Phone number(s)', Label:'Creator-Phone number(s)', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiTelWork', XMP_Type:'text'},
{Schema_Field:'IPTC-Creator-Web URL(s)', Label:'Creator-Web URL(s)', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:CiUrlWork', XMP_Type:'text'},
{Schema_Field:'IPTC-Title', Label:'Title', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:title', XMP_Type:'langAlt'},
{Schema_Field:'IPTC-Headline', Label:'Headline', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Headline', XMP_Type:'text'},
{Schema_Field:'IPTC-Description', Label:'Description', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:description', XMP_Type:'langAlt'},
{Schema_Field:'IPTC-Keywords', Label:'Keywords', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:subject', XMP_Type:'bag'},
{Schema_Field:'IPTC-Subject Code', Label:'Subject Code', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:SubjectCode', XMP_Type:'bag'},
{Schema_Field:'IPTC-Description Writer', Label:'Description Writer', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:CaptionWriter', XMP_Type:'text'},
{Schema_Field:'IPTC-Date Created', Label:'Date Created', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:DateCreated', XMP_Type:'text'},
{Schema_Field:'IPTC-Intellectual Genre', Label:'Intellectual Genre', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:IntellectualGenre', XMP_Type:'text'},
{Schema_Field:'IPTC-Scene Code', Label:'Scene Code', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:Scene', XMP_Type:'bag'},
{Schema_Field:'IPTC-Sublocation', Label:'Sublocation', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:Location', XMP_Type:'text'},
{Schema_Field:'IPTC-City', Label:'City', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:City', XMP_Type:'text'},
{Schema_Field:'IPTC-Province or State', Label:'Province or State', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:State', XMP_Type:'text'},
{Schema_Field:'IPTC-Country', Label:'Country', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Country', XMP_Type:'text'},
{Schema_Field:'IPTC-Country Code', Label:'Country Code', Namespace:'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/', XMP_Property:'Iptc4xmpCore:CountryCode', XMP_Type:'text'},
{Schema_Field:'IPTC-Job Id', Label:'Job Id', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:TransmissionReference', XMP_Type:'text'},
{Schema_Field:'IPTC-Instructions', Label:'Instructions', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Instructions', XMP_Type:'text'},
{Schema_Field:'IPTC-Credit Line', Label:'Credit Line', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Credit', XMP_Type:'text'},
{Schema_Field:'IPTC-Source', Label:'Source', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Source', XMP_Type:'text'},
{Schema_Field:'IPTC-Copyright Notice', Label:'Copyright Notice', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:rights', XMP_Type:'langAlt'},
{Schema_Field:'IPTC-Rights Usage Terms', Label:'Rights Usage Terms', Namespace:'http://ns.adobe.com/xap/1.0/rights/', XMP_Property:'xmpRights:UsageTerms', XMP_Type:'langAlt'},
];

var dcFieldsArr = [
{Schema_Field:'DC-Contributor', Label:'Contributor', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:contributor', XMP_Type:'bag'},
{Schema_Field:'DC-Coverage', Label:'Coverage', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:coverage', XMP_Type:'text'},
{Schema_Field:'DC-Creator', Label:'Creator', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:creator', XMP_Type:'seq'},
{Schema_Field:'DC-Date', Label:'Date', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:date', XMP_Type:'seq'},
{Schema_Field:'DC-Description', Label:'Description', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:description', XMP_Type:'langAlt'},
{Schema_Field:'DC-Format', Label:'Format', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:format', XMP_Type:'text'},
{Schema_Field:'DC-Identifier', Label:'Identifier', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:identifier', XMP_Type:'text'},
{Schema_Field:'DC-Language', Label:'Language', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:language', XMP_Type:'bag'},
{Schema_Field:'DC-Publisher', Label:'Publisher', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:publisher', XMP_Type:'bag'},
{Schema_Field:'DC-Relation', Label:'Relation', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:relation', XMP_Type:'bag'},
{Schema_Field:'DC-Rights', Label:'Rights', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:rights', XMP_Type:'langAlt'},
{Schema_Field:'DC-Source', Label:'Source', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:source', XMP_Type:'text'},
{Schema_Field:'DC-Subject', Label:'Subject', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:subject', XMP_Type:'bag'},
{Schema_Field:'DC-Title', Label:'Title', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:title', XMP_Type:'langAlt'},
{Schema_Field:'DC-Type', Label:'Type', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:type', XMP_Type:'bag'}
];

var plusPrefix = 'plus';
var vraFieldsArr = [
{Schema_Field:'VRA-Work Agent', Label:'Work Agent', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.agent', XMP_Type:'text'},
{Schema_Field:'VRA-Work Title', Label:'Work Title', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.title', XMP_Type:'text'},
{Schema_Field:'VRA-Work Date', Label:'Work Date', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.date', XMP_Type:'text'},
{Schema_Field:'VRA-Work Style/Period', Label:'Work Style/Period', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.stylePeriod', XMP_Type:'text'},
{Schema_Field:'VRA-Work Cultural Context', Label:'Work Cultural Context', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.culturalContext', XMP_Type:'text'},
{Schema_Field:'VRA-Work Type', Label:'Work Type', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.worktype', XMP_Type:'text'},
{Schema_Field:'VRA-Work Material', Label:'Work Material', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.material', XMP_Type:'text'},
{Schema_Field:'VRA-Work Technique', Label:'Work Technique', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.technique', XMP_Type:'text'},
{Schema_Field:'VRA-Work Measurements', Label:'Work Measurements', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.measurements', XMP_Type:'text'},
{Schema_Field:'VRA-Work Location', Label:'Work Location', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.location', XMP_Type:'text'},
{Schema_Field:'VRA-Work ID', Label:'Work ID', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.refid', XMP_Type:'text'},
{Schema_Field:'VRA-Work Rights', Label:'Work Rights', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.rights', XMP_Type:'text'},
{Schema_Field:'VRA-Work Description', Label:'Work Description', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.description', XMP_Type:'text'},
{Schema_Field:'VRA-Work Inscription', Label:'Work Inscription', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.inscription', XMP_Type:'text'},
{Schema_Field:'VRA-Work State/Edition', Label:'Work State/Edition', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.stateEdition', XMP_Type:'text'},
{Schema_Field:'VRA-Work Relation', Label:'Work Relation', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.relation', XMP_Type:'text'},
{Schema_Field:'VRA-Work Text Reference', Label:'Work Text Reference', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.textref', XMP_Type:'text'},
{Schema_Field:'VRA-Work Source', Label:'Work Source', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.source', XMP_Type:'text'},
{Schema_Field:'VRA-Work Subject', Label:'Work Subject', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.subject', XMP_Type:'text'},
{Schema_Field:'VRA-Work Custom 1 Label', Label:'Work Custom 1 Label', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom1/vrae:_label', XMP_Type:'text'},
{Schema_Field:'VRA-Work Custom 1 Data', Label:'Work Custom 1 Data', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom1/vrae:data', XMP_Type:'text'},
{Schema_Field:'VRA-Work Custom 2 Label', Label:'Work Custom 2 Label', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom2/vrae:_label', XMP_Type:'text'},
{Schema_Field:'VRA-Work Custom 2 Data', Label:'Work Custom 2 Data', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom2/vrae:data', XMP_Type:'text'},
{Schema_Field:'VRA-Image Title', Label:'Image Title', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.title', XMP_Type:'text'},
{Schema_Field:'VRA-Image Agent', Label:'Image Agent', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:creator', XMP_Type:'seq'},
{Schema_Field:'VRA-Image Agent Role', Label:'Image Agent Role', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:AuthorsPosition', XMP_Type:'text'},
{Schema_Field:'VRA-Image Date', Label:'Image Date', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:DateCreated', XMP_Type:'text'},
{Schema_Field:'VRA-Image Rights', Label:'Image Rights', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:rights', XMP_Type:'langAlt'},
{Schema_Field:'VRA-Image Rights Type', Label:'Image Rights Type', Namespace:'http://ns.adobe.com/xap/1.0/rights/', XMP_Property:'xmpRights:Marked', XMP_Type:'text'},
{Schema_Field:'VRA-Image Rights Holder Name', Label:'Image Rights Holder Name', Namespace:'http://ns.useplus.org/ldf/xmp/1.0/', XMP_Property:'plus:CopyrightOwner[1]/plus:CopyrightOwnerName', XMP_Type:'text'},
{Schema_Field:'VRA-Image Rights Text', Label:'Image Rights Text', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Credit', XMP_Type:'text'},
{Schema_Field:'VRA-Image Rights URL', Label:'Image Rights URL', Namespace:'http://ns.adobe.com/xap/1.0/rights/', XMP_Property:'xmpRights:WebStatement', XMP_Type:'text'},
{Schema_Field:'VRA-Image Rights Notes', Label:'Image Rights Notes', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:Instructions', XMP_Type:'text'},
{Schema_Field:'VRA-Image CC', Label:'Image CC', Namespace:'http://creativecommons.org/ns#', XMP_Property:'cc:license', XMP_Type:'text'},
{Schema_Field:'VRA-Image Description', Label:'Image Description', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.description', XMP_Type:'text'},
{Schema_Field:'VRA-Image Inscription', Label:'Image Inscription', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.inscription', XMP_Type:'text'},
{Schema_Field:'VRA-Image Subject', Label:'Image Subject', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.subject', XMP_Type:'text'},
{Schema_Field:'VRA-Image ID', Label:'Image ID', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.refid', XMP_Type:'text'},
{Schema_Field:'VRA-Image URL', Label:'Image URL', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.href', XMP_Type:'text'},
{Schema_Field:'VRA-Image Location', Label:'Image Location', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.location', XMP_Type:'text'},
{Schema_Field:'VRA-Image Relation', Label:'Image Relation', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.relation', XMP_Type:'text'},
{Schema_Field:'VRA-Image Source', Label:'Image Source', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:image.source', XMP_Type:'text'},
{Schema_Field:'VRA-Image Custom 3 Label', Label:'Image Custom 3 Label', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom3/vrae:_label', XMP_Type:'text'},
{Schema_Field:'VRA-Image Custom 3 Data', Label:'Image Custom 3 Data', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom3/vrae:data', XMP_Type:'text'},
{Schema_Field:'VRA-Image Custom 4 Label', Label:'Image Custom 4 Label', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom4/vrae:_label', XMP_Type:'text'},
{Schema_Field:'VRA-Image Custom 4 Data', Label:'Image Custom 4 Data', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom4/vrae:data', XMP_Type:'text'},
{Schema_Field:'VRA-Admin Collection', Label:'Admin Collection', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:publisher', XMP_Type:'bag'},
{Schema_Field:'VRA-Admin Job ID', Label:'Admin Job ID', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:TransmissionReference', XMP_Type:'text'},
{Schema_Field:'VRA-Admin Cataloger', Label:'Admin Cataloger', Namespace:'http://ns.adobe.com/photoshop/1.0/', XMP_Property:'photoshop:CaptionWriter', XMP_Type:'text'},
{Schema_Field:'VRA-Admin Custom 5 Label', Label:'Admin Custom 5 Label', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom5/vrae:_label', XMP_Type:'text'},
{Schema_Field:'VRA-Admin Custom 5 Data', Label:'Admin Custom 5 Data', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom5/vrae:data', XMP_Type:'text'},
{Schema_Field:'VRA-Admin Custom 6 Label', Label:'Admin Custom 6 Label', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom6/vrae:_label', XMP_Type:'text'},
{Schema_Field:'VRA-Admin Custom 6 Data', Label:'Admin Custom 6 Data', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:custom6/vrae:data', XMP_Type:'text'}
];

var customFieldsArr = [
{Schema_Field:'Custom', Label:'Custom', Namespace:'', XMP_Property:'', XMP_Type:''},
];

//////////////////////////////////////////////////////////////// BEGIN BUILD PROPERTIES WINDOW ////////////////////////////////////////////////////////////////
//var codeVersion = "2019-07-19";
// changes
// removed Schema:; changed Defasult-Label to Label; changed Custom_Label to Label
// made field variables more consistant (f1 > et1)
// added schema dropdown and load fields based on schema. added Manage button

var fieldsWindow = new Window("palette", "Customize Fields", undefined); // , {closeButton:true} removed because it casued the script to freeze
var schemaArr = ['File','IPTC Core','Dublin Core','VRA Core','Custom'];
var xmpTypeArr = ['', 'text', 'bag', 'seq', 'langAlt', 'boolean', 'date', 'file'];  // '-Select-', 
// used to track if custom field list has been changed
var triggerEnterCustomName = false;
fieldsWindow.spacing=5;
fieldsWindow.alignChildren = 'left'
//fieldsWindow.graphics.backgroundColor = fieldsWindow.graphics.newBrush(fieldsWindow.graphics.BrushType.SOLID_COLOR,[0,0,0], 1);
//fieldsWindow.margins = [10,10,10,10];

// if it doesn't already exist, create folder 'userData/VRA_Import_Export/Options'
// if (Folder (appDataFwdSlash + plgnPrefs + plgnOpt).exists == false) new Folder (appDataFwdSlash + plgnPrefs + plgnOpt).create();  // TODO: redundant?
// if it doesn't already exist, create folder: C:\Users\[user name]\AppData\Roaming\VRA_Import_Export\Headers
if (Folder (appDataFwdSlash + plgnPrefs + plgnHeaders).exists == false) new Folder (appDataFwdSlash + plgnPrefs + plgnHeaders).create();

// Browse files to select exisitng user custom field text file
var loadCustom = fieldsWindow.add("group");
loadCustom.alignChildren = "left";
loadCustom.margins = [0,0,0,0];
loadCustom.spacing=0;
loadCustom.orientation = "column";

loadCustom.grp2 = loadCustom.add("group");
//loadCustom.st1 = loadCustom.grp2.add("statictext", dim2, "Current Fields: ");
//loadCustom.st1.minimumSize = [50,20];
//loadCustom.st1.graphics.font = ScriptUI.newFont ("Arial", 'BOLD', 14);
//loadCustom.st1.graphics.foregroundColor = loadCustom.st1.graphics.newPen (mainWindow.graphics.PenType.SOLID_COLOR, [1,0.58,0], 1);
loadCustom.et1 = loadCustom.grp2.add("statictext", dim3, "Current Fields: UNDEFINED"); //loadCustom.et1.text = "Current Fields: UNDEFINED";
loadCustom.et1.minimumSize = [300,20];
//loadCustom.et1.justify = "center";
loadCustom.et1.graphics.font = ScriptUI.newFont ("Arial", 'BOLD', 14);
loadCustom.et1.graphics.foregroundColor = loadCustom.et1.graphics.newPen (mainWindow.graphics.PenType.SOLID_COLOR, [1,0.58,0], 1);
loadCustom.et1.helpTip = "List of fields to be exported/imported";
loadCustom.but1 = loadCustom.grp2.add("button", dim1, "Change");
loadCustom.but1.helpTip = "Select and load a saved custom field list.";
loadCustom.but1.onClick = function(){ // open user prefs folder to find a saved custom fields config file
    try{
    var path = new File(appDataFwdSlash + plgnPrefs + plgnHeaders);
    var customFilePath = path.openDlg("Choose File:");
    while (customFilePath.alias) {
        customFilePath = customFilePath.resolve().openDlg("Choose File:");
        }
    // read file and parse into fieldList
    if (customFilePath.exists == true){ // !!! if "- Select Custom -"
    customFilePath.open ('r');
      customFileText = customFilePath.read();
      customFilePath.close(); 
    fieldList.removeAll(); // clear all existing items from fieldList  to be replaced with items from file
    var customFileArr = customFileText.split("\n")
    var fieldsArr = []
    for (var L1 = 0; L1 < customFileArr.length; L1++){
        var obj = new Object();
        obj = eval('(' + customFileArr[L1] + ')');
        fieldsArr.push(obj)
        }
    for(var L2 = 0; L2 < fieldsArr.length; L2++){
        var newItem = fieldList.add("item",fieldsArr[L2].Schema_Field);
        newItem.subItems[0].text = fieldsArr[L2].Label;
        newItem.subItems[1].text = fieldsArr[L2].Namespace;
        newItem.subItems[2].text = fieldsArr[L2].XMP_Property;
        newItem.subItems[3].text = fieldsArr[L2].XMP_Type;
        }
    
    var customFilePathFileName = customFilePath.toString().split (path.toString()+"/").join ("").split("%20").join(" ").split(".txt").join("");
    // change loadCustom.et1.text to selected custom fields file name
     loadCustom.et1.text = "Current Fields: "+customFilePathFileName;
     // loadCustom.but1.onClick set lastViewedHeadersPanel to customFilePath file name only
     lastViewedHeadersPanel = customFilePathFileName;
    // loadCustom.but1.onClick set custom mapping display to customFilePath file name only
    fieldsTxt.text = "Fields: "+customFilePathFileName;
     // TODO: loadCustom.but1.onClick convert .txt to fieldArr handling this in export import functions for now. change that?
triggerEnterCustomName = false;
    } // CLOSE  if (customFilePath.exists == true)
}
catch(e){}
} // CLOSE loadCustom.but1.onClick

//loadCustom.spcr1 = loadCustom.grp2.add("statictext", spcr1, "");
loadCustom.but2 = loadCustom.grp2.add("button", dim1, "Manage");
loadCustom.but2.helpTip = "Open folder containing your custom field lists so you can edit or delete them.";
loadCustom.but2.onClick =  function(){ // open user prefs folder
    Folder(appDataFwdSlash + plgnPrefs + plgnHeaders).execute()
    }

// edit fields, Browse Instructions button
loadCustom.but1Help = loadCustom.grp2.add('button', undefined, "?");
loadCustom.but1Help.alignment = 'right';
loadCustom.but1Help.preferredSize = buttonSize1
loadCustom.but1Help.helpTip = clickInstrucTT;
loadCustom.but1Help.onClick = showLoadCustomInst
function showLoadCustomInst(){
	   var loadCustomInst = new Window('palette', "Current Fields Instructions");
	   var loadCustomInstBody =
            "Orange text is the name of the currently loaded field list.\n"+
            "   'Undefined' means you have no list loaded, so you need to create one.\n"+
            "Change\n"+
			"   Select a previously saved mapping and it will be loaded (view the mapping below).\n"+
			"   Click Save to export/import using the mapping.\n"+
             "   You can edit the loaded mapping and Save (you will be prompted to name it).\n\n"+ 
			"Manage\n"+	
			"   See all of your previously saved mapping files.\n"+
			"   Mapping files are text files and can be deleted, copied, and edited.\n"+
			"   Edit a mapping in a text editor\n"+
             "   Mapping must follow the same format:\n\n"+
             "{Schema_Field:'IPTC-Creator', Label:'Creator', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:creator', XMP_Type:'seq'},"

	   loadCustomInstText = loadCustomInst.add('statictext', undefined, loadCustomInstBody, {multiline:true});
	   if (Folder.fs == "Windows"){
		loadCustomInstText.preferredSize = [550,250];
		}
	else{
		loadCustomInstText.preferredSize = [550,350];
		}
    
listFormatHelp = loadCustomInst.add('button', undefined, "Required mapping format");
listFormatHelp.preferredSize = buttonSize1
listFormatHelp.helpTip = clickInstrucTT;
listFormatHelp.onClick = showListFormatHelp
    function showListFormatHelp (){
var ListFormatInst = new Window('palette', "Field List Format");
var ListFormatInstBody =
	"Each field in a custom list .txt file is defined by a formatted text string containing the necessary elements to produce a valid XMP property. \n\n"+
	"   Required Format\n"+
	"      {Schema_Field:' ', Label:' ', Namespace:' ', XMP_Property:' ', XMP_Type:' '},\n\n"+
	"   Required Format Definitions\n"+
	"      Schema_Field: The schema and field name (supplied by this tool) or 'Custom'\n"+
	"      Label: Your label for the field (call the field anything you like)\n"+
	"      Namespace: URL representing the schema (see schema specification or define your own for Custom).\n"+
	"         Must end in '/' or '#'. Does not have to resolve to an actual web page.\n"+
	"      XMP_Property: namespace prefix : property name (see schema specification or define your own for Custom)\n"+
	"      XMP_Type: property type\n"+
	"         text = Plain text string (e.g., single character, word, phrase, sentence, or paragraph)\n"+
	"         bag = Unordered array of text strings (e.g., keywords in no particular order)\n"+
	"         seq = Ordered array of text strings (e.g., list of authors in order of importance)\n"+
	"         langAlt = Array of text strings in different languages using xml:lang qualifiers such as 'en-us'. 'x-default' is used when the language is undefined.\n"+
	"         boolean = 'True' or 'False'\n"+
	"         date = YYYY-MM-DD, YYYY-MM, YYYY\n\n"+
	"   Examples\n"+
	"   {Schema_Field:'File-Name', Label:'File Name', Namespace:'file', XMP_Property:'file', XMP_Type:'file'},\n"+
	"   {Schema_Field:'IPTC-Creator', Label:'Creator', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:creator', XMP_Type:'seq'},\n"+
	"   {Schema_Field:'DC-Publisher', Label:'Publisher', Namespace:'http://purl.org/dc/elements/1.1/', XMP_Property:'dc:publisher', XMP_Type:'bag'},\n"+
	"   {Schema_Field:'VRA-Work Agent', Label:'Work Agent', Namespace:'http://www.vraweb.org/vracore/4.0/essential/', XMP_Property:'vrae:work.agent', XMP_Type:'text'},\n"+
	"   {Schema_Field:'Custom', Label:'Classification, Namespace:'http://www.myschema.net/', XMP_Property:'my:class', XMP_Type:'text'},\n"+
	"\n\n"+
	"For more information on XMP properties, see the XMP Specification, https://www.adobe.com/devnet/xmp.html"

	   ListFormatInstText = ListFormatInst.add('statictext', undefined, ListFormatInstBody, {multiline:true});
	   if (Folder.fs == "Windows"){
		ListFormatInstText.preferredSize = [950,450];
		}
	else{
		ListFormatInstText.preferredSize = [950,550];
		}
	   ListFormatInst.cancelBtn = ListFormatInst.add('button', undefined, 'Close');
	ListFormatInst.cancelBtn.onClick =  function(){ 
		ListFormatInst.hide();
		ListFormatInst.close();
		}
	   ListFormatInst.show();
    }
	   loadCustomInst.cancelBtn = loadCustomInst.add('button', undefined, 'Close');
	loadCustomInst.cancelBtn.onClick =  function(){ 
		loadCustomInst.hide();
		loadCustomInst.close();
		}
	   loadCustomInst.show();
	}

var spcr1 = fieldsWindow.add ("statictext", dim4, "");

var fieldInput = fieldsWindow.add("group");
fieldInput.alignChildren = "left";
fieldInput.orientation = "column";
fieldInput.spacing = 0;
// where the user selects and customizes  fields
var fieldInputLabelGrp = fieldInput.add("group");
var fieldInputLabel = fieldInputLabelGrp.add("statictext", dim2, "Edit Fields");
fieldInputLabel.alignment = "left";
fieldInputLabel.graphics.font = ScriptUI.newFont ("Arial", 'BOLD', 14)

editCustomHelp = fieldInputLabelGrp.add('button', undefined, "?");
//editCustomHelp.alignment = 'right';
editCustomHelp.preferredSize = buttonSize1
editCustomHelp.helpTip = clickInstrucTT;
editCustomHelp.onClick = showEditCustomHelp
function showEditCustomHelp (){
var editCustomInst = new Window('palette', "Edit Fields Instructions");
var editCustomInstBody =
        "To load fields from a standard schema (File, IPTC Core, Dublin Core, VRA Core:\n"+
        "   Select a schema to add all its fields to your list\n"+
        "      You can edit your list after it loads\n\n"+
        "Add a field to your list\n"+
        "   Schema: select one (File, IPTC Core, Dublin Core, VRA Core, Custom)\n"+
        "   Field: select a field from the schema\n"+
        "      Change the Label (optional)\n"+
        "      Click 'Add' to insert the field to the end of your list\n"+
        "      Click 'Move Up' or 'Move Down' to change the order of your field list\n"+
        "   To add a Custom schema field\n"+
        "      Select Schema: Custom\n"+
        "      Enter the Label (any label you want)\n"+
        "      Enter the Namespace (must be a URL ending in '#' or '/')\n"+
        "      Enter the XMP_Property (namespace prefix:name)\n"+
        "      Select the XMP_Type ('text', 'bag', 'seq', 'langAlt', 'boolean', 'date')\n\n"+
        "Edit your list\n"+
        "   Select a field\n"+
        "      Click 'Move Up' or 'Move Down' to change the order of your field list\n"+
        "      Click 'Delete' to remove a field from your list\n\n"+
        "Save your list\n"+
        "   Name your list"

	   editCustomInstText = editCustomInst.add('statictext', undefined, editCustomInstBody, {multiline:true});
	   if (Folder.fs == "Windows"){
		editCustomInstText.preferredSize = [450,350];
		}
	else{
		editCustomInstText.preferredSize = [450,450];
		}
	   editCustomInst.cancelBtn = editCustomInst.add('button', undefined, 'Close');
	editCustomInst.cancelBtn.onClick =  function(){ 
		editCustomInst.hide();
		editCustomInst.close();
		}
	   editCustomInst.show();
    }

// dropdown to load schema fields
var loadSchema = fieldInput.add("group");
loadSchema.alignChildren = "left";
loadSchema.margins = [0,0,0,0];
loadSchema.spacing=0;
loadSchema.orientation = "column";
loadSchema.st1 = loadSchema.add("statictext", dim2, "Load standard schema fields")
loadSchema.st1.minimumSize = [300,20];
loadSchema.grp1 = loadSchema.add("group");
loadSchema.dd1 = loadSchema.grp1.add("dropdownlist", dim3, ["","File","Basic","IPTC Core","Dublin Core","VRA Core"]);

loadSchema.dd1.onChange=function(){
  var fileNameRegex = /File-Name/;
    if(loadSchema.dd1.selection.text != "File" && !(fileNameRegex.test(fieldList.items[0]))){
        var newItem = fieldList.add("item", 'File-Name');
        newItem.subItems[0].text = 'File Name';
        newItem.subItems[1].text = 'file';
        newItem.subItems[2].text = 'file';
        newItem.subItems[3].text = 'file';
        fieldList.items[0].selected = true;
        };
    if(loadSchema.dd1.selection.text == "") var schemaArr = []; // TODO clearing dropdown need to test consequences of var schemaArr = []
        if(loadSchema.dd1.selection.text == "File") var schemaArr = fileFieldsArr;
        if(loadSchema.dd1.selection.text == "Basic") var schemaArr = basicFieldsArr;
        if(loadSchema.dd1.selection.text == "IPTC Core") var schemaArr = iptcFieldsArr;
        if(loadSchema.dd1.selection.text == "Dublin Core") var schemaArr = dcFieldsArr;
        if(loadSchema.dd1.selection.text == "VRA Core") var schemaArr = vraFieldsArr;
    for(var Lls = 0; Lls < schemaArr.length; Lls++) {
        if(schemaArr[Lls].Schema_Field != "File-Name"){
        var newItem = fieldList.add("item",schemaArr[Lls].Schema_Field);
        newItem.subItems[0].text = schemaArr[Lls].Label;
        newItem.subItems[1].text = schemaArr[Lls].Namespace;
        newItem.subItems[2].text = schemaArr[Lls].XMP_Property;
        newItem.subItems[3].text = schemaArr[Lls].XMP_Type;
       }
            };
    lastViewedHeadersPanel = loadSchema.dd1.selection.text;
    triggerEnterCustomName = true;
    };
//spacerX = fieldInput.add("statictext", dim2, "");
addFieldsLbl = fieldInput.add("statictext", dim2, "Add a field");
addFieldsLbl.margins = [0,0,0,0];
var fieldLabels =fieldInput.add("group");
fieldLabels.spacing=5;
fieldLabels.margins = [0,0,0,0];
fieldLabels.lbl1 = fieldLabels.add("statictext", dim2, "Schema");
fieldLabels.lbl1.helpTip = "Pre-defined schema field name (not editable)";
fieldLabels.lbl2 = fieldLabels.add("statictext", dim3, "Field");
fieldLabels.lbl2.helpTip = "Do not change for pre-defined schemas, set your own for custom property";
fieldLabels.lbl3 = fieldLabels.add("statictext", dim3, "My Label");
fieldLabels.lbl3.helpTip = "The label you want to use for the field";
fieldLabels.lbl4 = fieldLabels.add("statictext", dim4, "Namespace");
fieldLabels.lbl4.helpTip = "namespace URL, EXAMPLE: http://purl.org/dc/elements/1.1/";
fieldLabels.lbl5 = fieldLabels.add("statictext", dim3, "XMP_Property");
fieldLabels.lbl5.helpTip = "namespace prefix:property name, EXAMPLE: dc:title";
fieldLabels.lbl6 = fieldLabels.add("statictext", dim1, "XMP_Type");
fieldLabels.lbl6.helpTip = "XMP property type. Consult schema documentation, or set for your custom property";
//fieldLabels.graphics.backgroundColor = fieldsWindow.graphics.newBrush(fieldsWindow.graphics.BrushType.SOLID_COLOR,[0.7,0.7,0.7], 1);
//for(var i = 0; i < fieldLabels.children.length; i++)
//fieldLabels.children[i].graphics.font = ScriptUI.newFont ("Arial", 'BOLD', 12)

var inputs =fieldInput.add("group"); inputs.spacing=5;
//inputs.margins = [0,0,0,0];
inputs.spacing=5;
inputs.ddl10 = inputs.add("dropdownlist", dim2, schemaArr) // Schema
//inputs.ddl10.selection = 0
inputs.ddl1 = inputs.add("dropdownlist", dim3, []) // Field
inputs.et1 = inputs.add("edittext", dim3, '') // Label
inputs.et2 = inputs.add("edittext", dim4, '') // Namespace
inputs.et3 = inputs.add("edittext", dim3, '') // XMP_Property
inputs.ddl2 = inputs.add("dropdownlist", dim1, xmpTypeArr) // XMP_Type

if (typeof Array.prototype.indexOf != "function") {  
    Array.prototype.indexOf = function (el) {  
        for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
        return -1;  
        }
    }

// clear values from all grp2 fields and enable them
resetGrp2 = function(){
    for(var i = 0; i < inputs.children.length; i++)
        inputs.children[i].enabled = true;
        inputs.et1.text = "";    
        inputs.et2.text = "";  
        inputs.et3.text = "";
        inputs.ddl1.selection = 0;
        inputs.ddl2.selection = 0;
        }
var handleFieldOnClick = true; 
var selectedFieldsArr = [];
var selectedSchema = fileFieldsArr;
 // when a selection is made in the Schema dropdown, populate Fields dropdown with appropriate values
inputs.ddl10.onChange=function(){
    lastViewedHeadersPanel = inputs.ddl10.selection.text;
    handleFieldOnClick = false;
    inputs.ddl1.removeAll();
    if (inputs.ddl10.selection.text == "File") selectedSchema = fileFieldsArr;
    if (inputs.ddl10.selection.text == "Basic") selectedSchema = basicFieldsArr;
    if (inputs.ddl10.selection.text == "IPTC Core") selectedSchema = iptcFieldsArr;
    if (inputs.ddl10.selection.text == "Dublin Core") selectedSchema = dcFieldsArr;
    if (inputs.ddl10.selection.text == "VRA Core") selectedSchema = vraFieldsArr;
    if (inputs.ddl10.selection.text == "Custom") selectedSchema = customFieldsArr; resetGrp2();
    selectedFieldsArr = [];
for(var L1 = 0; L1 < selectedSchema.length; L1++){
            newObject = {Schema_Field:selectedSchema[L1].Schema_Field, Label:selectedSchema[L1].Label, Namespace:selectedSchema[L1].Namespace, XMP_Property:selectedSchema[L1].XMP_Property, XMP_Type:selectedSchema[L1].XMP_Type};
            selectedFieldsArr.push(newObject)
            inputs.ddl1.add("item", selectedSchema[L1].Schema_Field)
        }
        if (inputs.ddl10.selection.text == "Custom")  inputs.ddl1.selection = 0;
    handleFieldOnClick = true;
    }

// when a selection is made in the Field dropdown
inputs.ddl1.onChange=function(){
    if(handleFieldOnClick==true){
    var selectedIndex = inputs.ddl1.selection.index
    // if  any pre-defined field is selected
    if(inputs.ddl1.selection.text!='Custom'){
     //   for(var L2 = 0; L2 < fieldsArr.length; L2++)
        inputs.et2.enabled = false;
        inputs.et3.enabled = false;
        inputs.ddl2.enabled = false;
        inputs.et1.text = selectedFieldsArr[selectedIndex].Label;
        inputs.et2.text = selectedFieldsArr[selectedIndex].Namespace;
        inputs.et3.text = selectedFieldsArr[selectedIndex].XMP_Property;  
        inputs.ddl2.selection = xmpTypeArr.indexOf(selectedFieldsArr[selectedIndex].XMP_Type); 
        }
    // if Custom is selected
    else{
        resetGrp2();
        }
      }
    }

if (typeof Array.prototype.indexOf != "function") {  
    Array.prototype.indexOf = function (el) {  
        for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
        return -1;  
        }
    }

// add field from entered values
addBtn = fieldsWindow.add('button', [0,0,200,25], "Add") //dim1 [0,0,80,25]
addBtn.alignment = 'left';
addBtn.indent = 110;
addBtn.enabled = false;

addMoveDelteBtns =fieldsWindow.add('group');
addMoveDelteBtns.orientation = "row";
addMoveDelteBtns.indent = 110;
addMoveDelteBtns.but1 = addMoveDelteBtns.add('button',undefined,"Move Up");

addMoveDelteBtns.but1.enabled = false;
addMoveDelteBtns.but2 = addMoveDelteBtns.add('button',undefined,"Move Down");
addMoveDelteBtns.but2.enabled = false;
addMoveDelteBtns.but3 = addMoveDelteBtns.add('button',undefined,"Delete");
addMoveDelteBtns.but3.enabled = false;
addMoveDelteBtns.but4 = addMoveDelteBtns.add('button',undefined,"Clear All");
addMoveDelteBtns.but4.enabled = true; //false

message1 = fieldsWindow.add('group');
message1.f1 = message1.add('statictext', undefined, "");
message1.f1.preferredSize = [500,20];
message1.f1.graphics.font = ScriptUI.newFont ("Arial", "Bold", 12);
message1.f1.graphics.foregroundColor = message1.f1.graphics.newPen (message1.f1.graphics.PenType.SOLID_COLOR, [1, 0, 0], 1);

// if all fields have data, enable Add button
inputs.addEventListener ("change", function(){
    if(inputs.et1.text.length > 0 && inputs.et2.text.length > 0 && inputs.et3.text.length > 0 && inputs.ddl2.selection >0){
        addBtn.enabled = true;
            addMoveDelteBtns.but1.enabled = false;
    addMoveDelteBtns.but2.enabled = false;
    addMoveDelteBtns.but3.enabled = false;
    addMoveDelteBtns.but4.enabled = true; //false
        }
    else{addBtn.enabled = false;}
    }
);

// when addMoveDelteBtns.but1 is clicked, move selected field up one position
addMoveDelteBtns.but1.onClick = function(){
if(fieldList.selection == null) return;
var itemNames = fieldList.selection;
var pos =itemNames.index-1;
if(pos>-1){
    // record that a change has been made to the custom field list
    triggerEnterCustomName = true;
    footerBtns.but1.enabled = true;
    loadCustom.et1.text = "Current Fields: New (click Save or Cancel)"
    var currentVals = [itemNames.text];
    for (var La = 0; La < 4; La++){
        currentVals.push(fieldList.selection.subItems[La].text)
        }
    fieldList.remove(itemNames.index);
    // put the current values in the new position
    var newItem = fieldList.add("item",currentVals[0],pos);
        for (var Lb = 0; Lb < 4; Lb++){
        newItem.subItems[Lb].text = currentVals[Lb+1];
        }
    fieldList.selection=pos; 
    }
}

// when addMoveDelteBtns.but2 is clicked, move selected field down one position
addMoveDelteBtns.but2.onClick = function(){
if(fieldList.selection == null) return;
var itemNames = fieldList.selection;
var pos =itemNames.index+1;
if(pos<fieldList.items.length){
    // record that a change has been made to the custom field list
    triggerEnterCustomName = true;
    footerBtns.but1.enabled = true;
    loadCustom.et1.text = "Current Fields: New (click Save or Cancel)"
    var currentVals = [itemNames.text];
    for (var La = 0; La < 4; La++){
        currentVals.push(fieldList.selection.subItems[La].text)
        }
    fieldList.remove(itemNames.index);
    // put the current values in the new position
    var newItem = fieldList.add("item",currentVals[0],pos);
        for (var Lb = 0; Lb < 4; Lb++){
        newItem.subItems[Lb].text = currentVals[Lb+1];
        }
    fieldList.selection=pos; 
    }
}

// when Delete button is clicked, delete selected field
addMoveDelteBtns.but3.onClick = function(){
if(fieldList.selection == null) return;
fieldList.remove(fieldList.selection);
// record that a change has been made to the custom field list
triggerEnterCustomName = true;
footerBtns.but1.enabled = true;
loadCustom.et1.text = "Current Fields: New (click Save or Cancel)"
/* HERE !!! need this?
if(fieldList.selection > 0){
footerBtns.but1.enabled = true;
loadCustom.st1.text = "New (click Save)"
}
else{footerBtns.but1.enabled = false;}
*/
}

// when addMoveDelteBtns.but4 is clicked, delete all items from fieldList
addMoveDelteBtns.but4.onClick = function(){
    fieldList.removeAll();
    loadSchema.dd1.selection = 0;
    loadCustom.et1.text = "Current Fields: New (click Save or Cancel)";
    // record that a change has been made to the custom field list
    triggerEnterCustomName = true;
    }

//var columns = fieldsWindow.add("group"); columns.spacing=0;
//var fieldList = columns.add ("listbox", dimL, []);
//fieldList.graphics.backgroundColor = fieldList.graphics.newBrush(fieldList.graphics.BrushType.SOLID_COLOR,[0,0,0], 1);
// fieldList.helpTip="First field in the input file must be the filename only!";
    
addBtn.onClick=function(){
        // do all field have data?
     if(inputs.et1.text.length > 0 && inputs.et2.text.length > 0 && inputs.et3.text.length > 0 && inputs.ddl2.selection >0){
     // record that a change has been made to the custom field list
     triggerEnterCustomName = true;
     // add new field below current list selection
     var itemSelectedIndex = fieldList.items.length-1; //fieldList.selection;
    // if no item is selected, set itemSelectedIndex as last item
    for (var L3 = 0; L3 < fieldList.items.length; L3++){
    if(fieldList.items[L3].selected == true){
        itemSelectedIndex = L3 //fieldList.selection.index;
        }
    }    
    var pos = 0
    if(fieldList.items == 0){
        pos = 0;
        }
    else{
        pos = itemSelectedIndex+1;
        } 
        var newItem = fieldList.add("item",inputs.ddl1.selection.text, pos);
        newItem.subItems[0].text = inputs.et1.text;
        newItem.subItems[1].text = inputs.et2.text;
        newItem.subItems[2].text = inputs.et3.text;
        newItem.subItems[3].text = inputs.ddl2.selection.text;
        fieldList.items[itemSelectedIndex+1].selected = true; // set selected item to new added field
    // is first field 'File Name?
var fileNameRegex = /File-Name/;
if(!(fileNameRegex.test(fieldList.items[0]))){       
       message1.f1.text = "ALERT! 'File Name' must be first"
       // footerBtns.but1.text = "First field in the input file must be File Name"
       footerBtns.msg1.text = "ALERT! 'File Name' must be first in the list field"
        footerBtns.but1.enabled = false;
        }
    else{
        message1.f1.text = "";
        footerBtns.msg1.text = "";
        footerBtns.but1.enabled = true;
        }
    }
else{alert("All field boxes must be filled in")}
//okToAdd==false
} // CLOSE 

// dimL = [0,0,1100,450]  [0, 0, 1080, 450]
// create list box with five titled columns for the field components
var fieldList =fieldsWindow.add ('ListBox', [0,0,1000,450], 'Fields',
{numberOfColumns: 5, showHeaders: true,
columnTitles: ['Field', 'My Label', 'Namespace', 'XMP_Property', 'XMP_Type'], columnWidths: [200,200,300,200,80]});
//fieldList.alignment = 'right';
fieldList.indent = 110;
// when an item in col1 is selected, enable move up, down, delete buttons
fieldList.addEventListener ("change", function(){
    if(fieldList.selection == null) return;
    addBtn.enabled = false;
    addMoveDelteBtns.but1.enabled = true;
    addMoveDelteBtns.but2.enabled = true;
    addMoveDelteBtns.but3.enabled = true;
    addMoveDelteBtns.but4.enabled = true;
    // is first field 'File Name?
var fileNameRegex = /File-Name/;
if(!(fileNameRegex.test(fieldList.items[0].text))){      
       //alert("First field in the input file must be File Name")  
       message1.f1.text = "ALERT! 'File Name' must be first"
       // footerBtns.but1.text = "First field in the input file must be File Name"
       footerBtns.msg1.text = "ALERT! 'File Name' must be first in the list field"
        footerBtns.but1.enabled = false;
        }
    else{
        message1.f1.text = "";
        footerBtns.msg1.text = "";
        footerBtns.but1.enabled = true;
        }
});
// if lastViewedHeadersPanel exists, loadCustom.et1.text = lastViewedHeadersPanel; and load into list
if (lastViewedHeadersPanel.length > 0){
    loadCustom.et1.text = "Current Fields: "+lastViewedHeadersPanel
    // open the file
    var customFilePath = new File(appDataFwdSlash + plgnPrefs + plgnHeaders + "/" + lastViewedHeadersPanel + ".txt");
    // read file and parse into fieldList  
    if (customFilePath.exists == true){
      customFilePath.open ('r');
      customFileText = customFilePath.read();
      customFilePath.close();   
      fieldList.removeAll(); // clear all existing items from fieldList  to be replaced with items from file
        var customFileArr = customFileText.split("\n")
        fieldsArr = []
        for (var L1 = 0; L1 < customFileArr.length; L1++){
            var obj = new Object();
            obj = eval('(' + customFileArr[L1] + ')');
            fieldsArr.push(obj)
            }
        for(var L2 = 0; L2 < fieldsArr.length; L2++){
            var newItem = fieldList.add("item",fieldsArr[L2].Schema_Field);
            newItem.subItems[0].text = fieldsArr[L2].Label;
            newItem.subItems[1].text = fieldsArr[L2].Namespace;
            newItem.subItems[2].text = fieldsArr[L2].XMP_Property;
            newItem.subItems[3].text = fieldsArr[L2].XMP_Type;
        }
     }
    else{
        loadCustom.et1.text = "Current Fields: UNDEFINED";
        customFileText = "{Schema_Field:'File-Name', Label:'File Name', Namespace:'file', XMP_Property:'file', XMP_Type:'file'}";
        }
    };

// HERE!!! finish this
// when list item is clicked, Load it into the edit fields
fieldList.onDoubleClick = function(){
   var sel = fieldList.selection.index
   var which = [fieldList.items[sel].text, fieldList.items[sel].subItems[0].text, fieldList.items[sel].subItems[1].text, fieldList.items[sel].subItems[2].text, fieldList.items[sel].subItems[3].text];
// place the double clicked selection values to the 'Add' fields 
/*
    inputs.ddl1.removeAll()
    inputs.ddl1.add ('item', fieldList.items[sel].text) 
    inputs.ddl1.selection = 0; 
    inputs.ddl1.enabled = false;
    inputs.et1.text = fieldList.items[sel].subItems[0].text // HERE !!! Undefined inputs.ddl1.onChange line1500 inputs.et1.text = selectedFieldsArr[selectedIndex].Label;
    inputs.et1.enabled = true;
    inputs.et2.text = fieldList.items[sel].subItems[1].text
    inputs.et2.enabled = false;
    inputs.et3.text = fieldList.items[sel].subItems[2].text
    inputs.et3.enabled = false;
    for (var L3 = 0; L3 < xmpTypeArr.length; L3++){
        if(fieldList.items[sel].subItems[3].text == xmpTypeArr[L3]){
            var typeIndex= L3;
            }
        }
    inputs.ddl2.selection = [typeIndex];
    inputs.ddl2.enabled = false;
*/
// open a new window with the My Label value so it can be edited
editFieldListItem = new Window('palette', "Edit Field Label");
editFieldListItemLabel = editFieldListItem.add('statictext', undefined, "Enter a new Label")
editFieldListItemLabel.alignment = 'left';
editFieldListItemLabel.et = editFieldListItem.add('edittext', undefined, which[1])
editFieldListItemLabel.et.alignment = 'left';
editFieldListItemLabel.et.preferredSize = [200,22]
editFieldListItemButtons = editFieldListItem.add('group', undefined);
editFieldListItemButtons.orientation = 'row';
editFieldListItemButtons.margins = [20,20,20,20];
editFieldListItemButtons.but1 = editFieldListItemButtons.add('button',undefined,"Save");
editFieldListItemButtons.but1.preferredSize=[100,40];
editFieldListItemButtons.but2 = editFieldListItemButtons.add('button',undefined,"Cancel");
editFieldListItemButtons.but2.preferredSize=[100,40];

editFieldListItemButtons.but1.onClick = function(){
//whichOneObj.Label = editFieldListItemLabel.et.text
//fieldList.add("item", "{Schema_Field:'"+whichOneObj.Schema_Field+"', Label:'"+editFieldListItemLabel.et.text+"', Namespace:'"+whichOneObj.Namespace+"', XMP_Property:'"+whichOneObj.XMP_Property+"', XMP_Type:'"+whichOneObj.XMP_Type+"'}", fieldList.selection.index+1);
        var newItem = fieldList.add("item",which[0],sel+1);
        newItem.subItems[0].text = editFieldListItemLabel.et.text;
        newItem.subItems[1].text = which[2];
        newItem.subItems[2].text = which[3];
        newItem.subItems[3].text = which[4];
fieldList.remove(fieldList.selection.index);
editFieldListItem.hide();
editFieldListItem.close();
} // CLOSE editFieldListItemButtons.but1.onClick 

editFieldListItemButtons.but2.onClick = function(){
    editFieldListItem.hide(); editFieldListItem.close();
    }

editFieldListItem.show();
} // CLOSE fieldList.onDoubleClick

// footer buttons
footerBtns = fieldsWindow.add('group');
footerBtns.alignment = "right";
footerBtns.spacing=20;
footerBtns.orientation = "row";
footerBtns.msg1 = footerBtns.add('statictext',undefined, "");
footerBtns.msg1.justify = 'right';
footerBtns.msg1.preferredSize=[600,20];
footerBtns.msg1.graphics.font = ScriptUI.newFont ("Arial", "Bold", 12);
footerBtns.msg1.graphics.foregroundColor = footerBtns.msg1.graphics.newPen (footerBtns.msg1.graphics.PenType.SOLID_COLOR, [1, 0, 0], 1);
footerBtns.but1 = footerBtns.add('button',undefined,"Save");
footerBtns.but1.preferredSize=[100,40];
footerBtns.but2 = footerBtns.add('button',undefined,"Cancel");
footerBtns.but2.preferredSize=[100,40];
footerBtns.but2.onClick = function(){
    // because Cancel was clicked, revert fields to original values
    lastViewedHeadersPanel = originalLastViewedHeadersPanel;
    fieldsTxt.text = "Fields: "+originalLastViewedHeadersPanel;
    loadCustom.et1.text = "Current Fields: "+originalLastViewedHeadersPanel;
    customFileText = originalCustomFileText;
    // clear all existing items from fieldList  to be replaced with items from originalCustomFileText
    fieldList.removeAll(); 
     var fieldsArrOrig = customFileText.split("\n") 
        //var fieldsArrOrig = customFileText.split("\n")
    var fieldsArr = []
    for (var L3 = 0; L3 < fieldsArrOrig.length; L3++){
        var obj = new Object();
        obj = eval('(' + fieldsArrOrig[L3] + ')');
        fieldsArr.push(obj)
        }
    for(var L4 = 0; L4 < fieldsArr.length; L4++){
        var newItem = fieldList.add("item",fieldsArr[L4].Schema_Field);
        newItem.subItems[0].text = fieldsArr[L4].Label;
        newItem.subItems[1].text = fieldsArr[L4].Namespace;
        newItem.subItems[2].text = fieldsArr[L4].XMP_Property;
        newItem.subItems[3].text = fieldsArr[L4].XMP_Type;
        }
    // close edit fields window and enable main window
    fieldsWindow.hide();
  // fieldsWindow.close(); // causes fieldsWindow to not re-open after Cancel, so MOVED to mainWindow.onClose()
    mainWindow.enabled = true;
    }

function saveCustomHeaders(){
// if list has been changed, require Name, else, don't require name
if (triggerEnterCustomName == false){ 
    // change custom fields labels
    fieldsTxt.text = "Fields: "+lastViewedHeadersPanel;
    loadCustom.et1.text = "Current Fields: "+lastViewedHeadersPanel;
    fieldsWindow.hide();
  //  fieldsWindow.close(); // causes fieldsWindow to not re-open after Cancel, so MOVED to mainWindow.onClose()
   mainWindow.enabled = true;
    };
else{
var enterCustomName = new Window('dialog', "Save Custom Fields");
    enterCustomNameTitle = enterCustomName.add('statictext', undefined, "Enter the name of your custom fields")
    enterCustomNameTitle.alignment = 'center'
    enterCustomNameTitle.preferredSize = [280,22]
    enterCustomNameName = enterCustomName.add('edittext', undefined, "")
    enterCustomNameName.preferredSize = [200,22]
   // enterCustomNameName.text = lastViewedHeadersPanel;
    enterCustomNameButtons = enterCustomName.add('group', undefined)
    enterCustomNameOK = enterCustomNameButtons.add('button', undefined, "Save")
    enterCustomNameOK.preferredSize = [80,30]
    enterCustomNameCancel = enterCustomNameButtons.add('button', undefined, "Cancel")
    enterCustomNameCancel.preferredSize = [80,20]

  enterCustomNameOK.onClick = function(){
    if(enterCustomNameName.text){
        enteredCustomName = enterCustomNameName.text;
        lastViewedHeadersPanel = enteredCustomName;
        enterCustomName.close();
        writeCustomHeadersToFile();
        // change custom fields label on main window
        fieldsTxt.text = "Fields: "+lastViewedHeadersPanel;
        loadCustom.et1.text = "Current Fields: "+lastViewedHeadersPanel;
        fieldsWindow.hide();
        mainWindow.enabled = true;
        // fieldsWindow.close(); // causes fieldsWindow to not re-open after Cancel, so MOVED to mainWindow.onClose()    
        }
    else{alert("Give this custom field list a unique name so you ca find it later")}
        }
    enterCustomNameCancel.onClick = function(){enterCustomName.close()}
    enterCustomName.show();  
    }
};

function writeCustomHeadersToFile(){
     // write custom fields to text file
    var appDataCustomHeaders = File (appDataFwdSlash + plgnPrefs + plgnHeaders + "/"+enteredCustomName+".txt");
     appDataCustomHeaders.open ("w", "TEXT", "ttxt");
    var cstmFieldsArr = [];
        for(var L3 = 0; L3 < fieldList.items.length; L3++) {
          //  cstmFieldsArr.push(fieldList.items[L3].text);
             cstmFieldsArr.push("{Schema_Field:'"+fieldList.items[L3].text+"', Label:'"+fieldList.items[L3].subItems[0].text+"', Namespace:'"+fieldList.items[L3].subItems[1].text+"', XMP_Property:'"+fieldList.items[L3].subItems[2].text+"', XMP_Type:'"+fieldList.items[L3].subItems[3].text+"'}");
            }
        appDataCustomHeaders.write (cstmFieldsArr.join("\n"));
        appDataCustomHeaders.close()
        customFileText = cstmFieldsArr.join("\n")      
    }

footerBtns.but1.onClick = function(){
    saveCustomHeaders();
    }
fieldsWindow.onClose = function(){mainWindow.enabled = true;}
//////////////////////////////////////////////////////////////// END BUILD PROPERTIES WINDOW ////////////////////////////////////////////////////////////////

// BEGIN FUNCTIONS
 function toggleNav(){
    if(mode == "import"){
      navExportBtn.value = false
      navImportBtn.value = true 
      navExportBtn.text = "export"
      exportPanel.minimumSize = hidden
      exportPanel.maximumSize = hidden
      navImportBtn.text = arrowRight+"IMPORT"+arrowLeft
      importPanel.minimumSize = panelSize
      importPanel.maximumSize = panelSize
      mainWindow.layout.layout (true)
        }
    else{
      navExportBtn.value = true
      navImportBtn.value = false 
      navExportBtn.text = arrowLeft+"EXPORT"+arrowRight
      exportPanel.minimumSize = panelSize
      exportPanel.maximumSize = panelSize
      navImportBtn.text = "import"
      importPanel.minimumSize = hidden
      importPanel.maximumSize = hidden
      mainWindow.layout.layout (true)
        }
    }

    // when thumbnails are selected, refresh display
    expImp_thumbSelected = function(event) { // expImp_thumbSelected 
        if (event.object instanceof Document && event.type == "selectionsChanged" ) {
       // alert(app.document.presentationPath)
           // TODO: test on Mac
    if (Folder.fs == "Windows"){
		var slash = "\\";
		}
	else{
		var slash = "/";
		}
        exportWhich.folderEt.text = app.document.presentationPath.split(slash).join("/")+"/";
        imageLoc.text = app.document.presentationPath.split(slash).join("/")+"/";
        // stops expImp_thumbSelected eventHandler
        return {handled:true}
        }
    }

 mainWindow.onClose = function(event){
// remove our thumbnail selectionsChanged event handler so it does not add repeat instances every time the script is run
// TODO: is this this a good method? 
     var patt1=new RegExp("// expImp_thumbSelected"); 	 
     for (var i = 0; i < app.eventHandlers.length; i++){         
        if (patt1.test(app.eventHandlers[i].handler.toString()) == true){	
            app.eventHandlers.splice((i), 1); 
            } 
        }
    fieldsWindow.close();
 }
////////////////////////// END FUNCTIONS ////////////////////////////////  
////////////////////////// BEGIN EVENT HANDLERS ////////////////////////
// when thumbnail selected, refresh data values
app.eventHandlers.push( {handler:expImp_thumbSelected} );

//////////////////////////////////////////////////////////////// BEGINNING OF EXPORT FUNCTIONS ////////////////////////////////////////////////////////////////
	// check for valid file type i.e. jpg, jpeg, tif, etc.
    function testFileExtension(file) {
       return file instanceof File &&
          file.name.match(/\.(ai|avi|bmp|dng|flv|gif|indd|indt|jpe?g|mp2|mp3|mp4|mov|pdf|png|psd|swf|tiff?|wav|wma|wmv|xmp)$/i) != null;
        }  
	// check that filename does not begin with "."
	function testFilePrefix(file) {
       return file instanceof File &&
          file.name.substring(0, 1) != "." == true;
        }

	// Progress bar for locating files
	var locateFilesProgress = new Window ('palette', "Exporting Metadata");
	locateFilesProgress.body = locateFilesProgress.add('group', undefined);
	locateFilesProgress.preferredSize = [300,100];
	locateFilesProgress.alignChildren = 'center';
	locateFilesProgress.message = locateFilesProgress.add('statictext', undefined, "Locating Files...");
   
   // Beginning of data Export Function
     // Extract and write metadata to a .txt. file
     function exportToFile(){      
    // default location for export text file
    // get folder name and path from Bridge workspace if (myFile instanceof File // get currentPath of first file found (not a folder)
      //  var currentPath = app.document.visibleThumbnails[0].spec.toString()
  //  var currentPathToArray = app.document.visibleThumbnails[0].spec.toString().split("/")
  //  var currentFolder = currentPathToArray[currentPathToArray.length-2].split("%20").join("_")
    for (var L1x = 0; L1x < app.document.visibleThumbnails.length; L1x++) {
        if (app.document.visibleThumbnails[L1x].spec instanceof File){
        var currentPath = app.document.visibleThumbnails[L1x].spec.toString()
        var currentPathToArray = app.document.visibleThumbnails[L1x].spec.toString().split("/")
        var currentFolder = currentPathToArray[currentPathToArray.length-2].split("%20").join("_")
        // index of last "/" 		
        var splicePathIndex1 = currentPath.lastIndexOf ("/")
        // just the file directory
        var currentFolderPath = currentPath.substr(0,splicePathIndex1+1).split(" ").join("%20");          
        break;     
          }
        }
/* old method based on Browse return path
// get folder name and path from exportWhich.folderEt.text (which the user selected by browsing
var currentPathToArray = exportWhich.folderEt.text.split("/")
var currentFolder = currentPathToArray[currentPathToArray.length-2].split("%20").join("_")
// index of last "/" 		
var splicePathIndex1 = exportWhich.folderEt.text.lastIndexOf ("/")
// just the file directory
var currentFolderPath = exportWhich.folderEt.text.substr(0,splicePathIndex1+1).split(" ").join("%20");    
*/
    if (Folder.fs == "Windows"){
         // var exportSaveLocation = desktop+"embedded_metadata_"+dateYMD+".txt";
        var exportSaveLocation = "~\\Desktop\\"+currentFolder+"_METADATA_"+dateYMD+".txt"; //   dateTime  OR dateYMD
        // var exportSaveLocation = currentPath+"_METADATA_"+dateYMD+".txt"; // let user select save location, filename based on current folder
        }
    else{
        // var exportSaveLocation = desktop+"embedded_metadata_"+dateYMD+".txt";
        var exportSaveLocation = "~/Desktop/"+currentFolder+"_METADATA_"+dateYMD+".txt"; // dateTime OR dateYMD
        // var exportSaveLocation = currentFolder+"_METADATA_"+dateYMD+".txt"; // let user select save location, filename based on current folder
        }
  //  var currentPathSaveFile = currentPath+"_"+dateYMD+".txt";  save to same folder as images being exported, filename based on current folder
        { // export brace 1 open
		   if(exportWhich.fieldsArrRb.value == true && app.document.selections.length == 0){
			 app.beep();
			 Window.alert("You must select at least one thumbnail");
			}
		   else{
			// Open the Save dialog to choose a file name and directory for the export file
              caption = projectName2+" panel metadata export" 
            var dataExportName = new File(exportSaveLocation)  // path+"md_export_"+dateYMD+".txt"  path = current thumbs folder path or exportSaveLocation
            var dataExport = dataExportName.saveDlg( caption, "Tab-delimited (Excel):*.txt,Tab-delimited (Not Excel):*.csv" );		
            dataExport.encoding = "UTF16";
            dataExport.open ("w", "TEXT", "ttxt") //('w', 'XLS', 'XCEL');             		
			// Create empty objects to store pass/fail data during export
			var filePass = 0;
			var fileFail = 0;
			var fileFailArr = [];
			var couldNotOpen = [];
			var propFail = 0;
       if (dataExport){  
        var allFiles = [];
        var selectedFolder = Folder(currentFolderPath) // Folder(exportWhich.folderEt.text.split(" ").join("%20")); 
        var appDataPlgnSet = File (appDataFwdSlash + plgnPrefs + plgnOpt + plgnSet);
        appDataPlgnSet.open ("w", "TEXT", "ttxt");
        appDataPlgnSet.write (exportWhich.folderRb.value  + "|");
        appDataPlgnSet.write (exportWhich.subfoldersCb.value  + "|");  
        appDataPlgnSet.write (exportWhich.fieldsArrRb.value + "|");
        appDataPlgnSet.write (exportOptions.datesCb.value + "|");
        appDataPlgnSet.write (dataSource.text + "|");
        appDataPlgnSet.write (writeOptions.appendRb.value+ "|");
        appDataPlgnSet.write(writeOptions.overwriteRb.value + "|");
        appDataPlgnSet.write (IgnoreExtCb.value+ "|");    
        appDataPlgnSet.write (addLabelCb.value+ "|");
        appDataPlgnSet.write (exportOptionsLfCb.value+"|");
        appDataPlgnSet.write (exportChoice+"|");
        appDataPlgnSet.write (exportWhich.folderEt.text + "|");
        appDataPlgnSet.write (imageLoc.text+ "|");
        appDataPlgnSet.write (imageLocSubfoldersCb.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.Path.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.Name.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.enabled+ "|");
        appDataPlgnSet.write (IgnoreExtCb.enabled+ "|");
        appDataPlgnSet.write (mode+ "|");
        appDataPlgnSet.write (lastViewedHeadersPanel);
        appDataPlgnSet.close();
        // close the main user interface window before running the export
        mainWindow.hide();	
        mainWindow.close();

	// open selectedFolder add the path of every file found to the 'allFiles' array. this will be the list of files to be exported
	function getFolder(selectedFolder) {
		var allFilesList = selectedFolder.getFiles();
		for (var L1 = 0; L1 < allFilesList.length; L1++) {
			var myFile = allFilesList[L1];
				if (myFile instanceof File && testFileExtension(myFile) == true && testFilePrefix(myFile) == true) {
				allFiles.push(myFile); 
				}
			}
		}

	// open selectedFolder and all subfolders an add the path of every file found to the 'allFiles' array. this will be the list of files to be exported
	function getSubFolders(selectedFolder) {
		 var allFilesList = selectedFolder.getFiles();
		 for (var L1 = 0; L1 < allFilesList.length; L1++) {		 	 
			  var myFile = allFilesList[L1];
			  if (myFile instanceof Folder){
				   getSubFolders(myFile);
			  }
			  else if (myFile instanceof File && testFileExtension(myFile) == true && testFilePrefix(myFile) == true) {
				   allFiles.push(myFile); 
				  }
			 }  
		}

	// if "Include subfolders" is not checked, only read the files in the selected folder
	if (exportWhich.subfoldersCb.value == false){
		locateFilesProgress.show();
		getFolder(selectedFolder);
		locateFilesProgress.hide();
        locateFilesProgress.close();
		}

	// if "Include subfolders" is checked, read all the files in the selected folder and its subfolders
	if (exportWhich.subfoldersCb.value == true){
		locateFilesProgress.show();
		getSubFolders(selectedFolder);
		locateFilesProgress.hide();
        locateFilesProgress.close();
		}

	  if (exportWhich.folderRb.value == true) var Thumb = allFiles;
	  if (exportWhich.fieldsArrRb.value == true) var Thumb = app.document.selections;
			// progress bar window to show files are exporting
			var exportProgress = new Window ("palette {text: ' " + plgnName + "  " + spot + "  (Exporting "+projectName2+" Data)', bounds: [0,0,500,30], X: Progressbar {bounds: [0,0,500,30]}};");
      // write UTF-8 BOM
      dataExport.write ("\uFEFF")
 
 // convert fieldsArr item to object
 // TODO: reading from customFileText - is there a better way to do it?  if not, make sure customFileText is updated when loading a saved list or saving a new one (already working)
var customFileArr = customFileText.split("\n")
fieldsArr = []
for (var L1 = 0; L1 < customFileArr.length; L1++){
    var obj = new Object();
    obj = eval('(' + customFileArr[L1] + ')');
    fieldsArr.push(obj)
    }
            // write filename to .txt file
          //dataExport.write (fieldsArr2[0].Label + "\t")               
			// begin exporting data to the text file
			// loop through array of headers (properties) and write them to the .txt file
			for (var L1 = 0; L1 < fieldsArr.length; L1++){  // chaged L1 = 1 becasue filename was being exported twice
                dataExport.write (fieldsArr[L1].Label + "\t");
                }
			// loop through files, read XMP property data and write it to "^"+projectName1+"_Data.txt"
			for (var L2 = 0; L2 < Thumb.length; L2++){
            // Display exorting progress bar if there are more than 50 images
			  if (Thumb.length > 50){
				   exportProgress.X.value = (L2 / Thumb.length) * 100;
				   exportProgress.center();
				   exportProgress.show();
				}
			if (Thumb[L2]){
             // get just the file name from allFiles so we can compare it to the file name in the text file
			 var splicePathIndex = allFiles[L2].toString().lastIndexOf ("/")
			 /* // TODO: disabled becasue Mac requires ".lastIndexOf ("/")" the same as Windows - use new doubled version below?
				 if (Folder.fs == 'Windows'){
					var splicePathIndex = Thumb[L2].toString().lastIndexOf ("/")
					}
				else{  
					var splicePathIndex = Thumb[L2].toString().lastIndexOf ("\\")
                       var splicePathIndex = Thumb[L2].toString().lastIndexOf ("/")
					}
				*/
				// just the file directory
				var spliceDirectory = allFiles[L2].toString().substr(0,splicePathIndex+1).split("%20").join(" ");   
				// just the file name
				if (exportWhich.folderRb.value == true) var spliceName = Thumb[L2].toString().slice(splicePathIndex+1).split("%20").join(" ");
                  if (exportWhich.fieldsArrRb.value == true) var spliceName = Thumb[L2].name.split ("%20").join (' ');

				// overall try/catch for each image. If read passes, 1 is added to filePass variable. If read fails, catch error adds 1 to fileFail variable  and file name to fileFailArr
				try
				{		
				  // Get the file
				  if (exportWhich.folderRb.value == true) var singleFile = Thumb[L2];
				  if (exportWhich.fieldsArrRb.value == true) var  singleFile = Thumb[L2].spec;
                  // Create an XMPFile
                  // try to open file. if it fails, save file path in error log
                    try{
                    // if file is an .xmp sidecar - read the xmp directly to an XMPMeta Object
                    if( singleFile.name.match(/\.xmp/i) != null){
                        var xmpFile = Folder (File(singleFile.fsName)); 
                        xmpFile.open('r')
					xmpFile.encoding = "UTF8";	
                        var xmpData = new XMPMeta(xmpFile.read()); 									
                        xmpFile.close()
                        }
                    else{
                        // if file is not an .xmp sidecar pull XMP from file
                        var xmpFile = new XMPFile(singleFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
					 xmpFile.encoding = "UTF8 BOM";
                        // convert to xmp
                        var xmpData = xmpFile.getXMP();
                        }
                    }
                    catch(couldNotOpenError){}
                    /*
					// Create an XMPFile
					try{
						var xmpFile = new XMPFile(singleFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_READ);
						xmpFile.encoding = "UTF8 BOM";
						// Get the XMP data
						var xmpData = xmpFile.getXMP();					
						}
				  catch(couldNotOpenError){couldNotOpen.push(imageFile.fsName)}
				*/
				// write return to start file properties
				dataExport.write ('\r');
				// Export image file name
				dataExport.write (spliceName);
				// Export file directory  MOVED DOWN
              //  dataExport.write ('\t' + spliceDirectory);
               
// Run export functions based on XMP_Type
for (var L1 = 0; L1 < fieldsArr.length; L1++){
    // if File-Folder is included in custom fields list, export file directory TODO: test when folder isn't included and subfolder import
    if(fieldsArr[L1].Schema_Field == 'File-Folder'){
        try{   
            dataExport.write ('\t' + spliceDirectory);
            } // end try
        catch(propFail){propFail++}
        }
	if(fieldsArr[L1].XMP_Type == 'text' || fieldsArr[L1].XMP_Type == 'boolean'){
		try{   
//var firstColonIndex = fieldsArr[L1].XMP_Property.indexOf(":")
var path = fieldsArr[L1].XMP_Property.slice(fieldsArr[L1].XMP_Property.indexOf(":")+1)
                    prop = xmpData.getProperty(fieldsArr[L1].Namespace, path); //fieldsArr[L1].Namespace, path
                    if (prop){
                        if (exportOptionsLfCb.value == true){
                            dataExport.write ("\t" + prop.toString().split("\n").join("; ").split("\r").join("; ").split("\t").join("; "));
                            }
                        else{
                            dataExport.write ("\t" + prop.toString().split("\n").join("(LF)").split("\r").join("(CR)").split("\t").join("(HT)"));
                            }
                        }
                    else{
                        dataExport.write ("\t");
                        }
            } // end try
			catch(propFail){propFail++}
			}

	if(fieldsArr[L1].XMP_Type == 'date'){
		try{
//var firstColonIndex = fieldsArr[L1].XMP_Property.indexOf(":")
var path = fieldsArr[L1].XMP_Property.slice(fieldsArr[L1].XMP_Property.indexOf(":")+1)
            prop = xmpData.getProperty (fieldsArr[L1].Namespace, path);
			if (prop){
				if (exportOptions.datesCb .value == true) var prop = "_" + prop;                                      
				dataExport.write ('\t' + prop);
				}
			else{
				dataExport.write ('\t');
				}
			}
          catch(propFail){propFail++}    
		}

	if(fieldsArr[L1].XMP_Type == 'seq' || fieldsArr[L1].XMP_Type == 'bag' || fieldsArr[L1].XMP_Type == 'langAlt'){
		try{
//var firstColonIndex = fieldsArr[L1].XMP_Property.indexOf(":")
//var path = fieldsArr[L1].XMP_Property.slice(firstColonIndex+1)
var path = fieldsArr[L1].XMP_Property.slice(fieldsArr[L1].XMP_Property.indexOf(":")+1)
                var count = xmpData.countArrayItems(fieldsArr[L1].Namespace, path);
                    var arString = "";
                     if(count > 0){   
                        for(var L1a = 1;L1a <= count;L1a++){
                            try{
                                arString += xmpData.getArrayItem(fieldsArr[L1].Namespace, path, L1a);
                                if(L1a < count) arString += '; ';
                                }
                            catch(propFail){
                                var arString = "";
                                }
                            }
                        }
                        if (exportOptionsLfCb.value == true){
                            dataExport.write ("\t" + arString.split("\n").join("; ").split("\r").join("; ").split("\t").join("; "));
                            }
                        else{
                            dataExport.write ("\t" + arString.split("\n").join("(LF)").split("\r").join("(CR)").split("\t").join("(HT)"));
                            }
                        }	
			catch(propFail){propFail++}          
			}	
// File properties 
    // Image File Created Date
    if(fieldsArr[L1].Schema_Field == 'File-Date Created'){
        try{
        prop = singleFile.created;   							
        var fullDate = new Date (prop);
        var month = fullDate.getMonth() + 1;
        if (month.toString().length < 2)
        {
        month = "0"+month;
        } 
        var day = fullDate.getDate();
        if (day.toString().length < 2)
        {
        day = "0"+day;
        }
        var year = fullDate.getFullYear();
        var time = fullDate.toTimeString().split(" GMT").join("");
        time= time.substr(0,10) + ":" + time.substr(10)
        var display = year+"-"+month+"-"+day+"T"+time                 
        dataExport.write ("\t" + display); 
        }
        catch(propFail){propFail++}
        }
    // File Modified Date
    if(fieldsArr[L1].Schema_Field == 'File-Date Modified'){
	try{
        prop = singleFile.modified;                       
        var fullDate = new Date (prop);
         var month = fullDate.getMonth() + 1;
         if (month.toString().length < 2)
        {
            month = "0"+month;
        } 
         var day = fullDate.getDate();
           if (day.toString().length < 2)
        {
            day = "0"+day;
        }
        var year = fullDate.getFullYear();
        var time = fullDate.toTimeString().split(" GMT").join("");
        time= time.substr(0,10) + ":" + time.substr(10)
        var display = year+"-"+month+"-"+day+"T"+time                 
        dataExport.write ("\t" + display);   
          }
	catch(propFail){propFail++}
	}
   // File-Date Original
        // TODO: find way to read directly from file  
    // File-Format
        // TODO: find way to read directly from file
    // File-Size
      if(fieldsArr[L1].Schema_Field == 'File-Size'){
        try {
           prop =  singleFile.length;                                
            var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            var i = parseInt(Math.floor(Math.log(prop) / Math.log(1024)));
            if (i == 0){
                prop = prop + " " + sizes[i];
                }
            else{
                prop = (prop / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
                }
               dataExport.write ("\t" + prop);
           }
        catch(propFail){propFail++}
        }
    // File-Width (pixels)
        // TODO: find way to read directly from file
    // File-Height (pixels)
        // TODO: find way to read directly from file
    // File-Bit Depth
        // TODO: find way to read directly from file
    if(fieldsArr[L1].Schema_Field == 'File-Bit Depth'){
        try {
      //  prop =  xmpData.countArrayItems('http://ns.adobe.com/tiff/1.0/', "BitsPerSample")
     //   prop =  xmpData.getArrayItem('http://ns.adobe.com/tiff/1.0/', "BitsPerSample", 1) 
    //   prop =  xmpData.getArrayItem('http://ns.adobe.com/exif/1.0/', "ISOSpeedRatings", 1)
       prop = xmpData.getProperty('http://ns.adobe.com/tiff/1.0/', "BitsPerSample[1]")
    //  prop =  xmpData.getProperty('http://ns.adobe.com/tiff/1.0/', "BitsPerSample[1]")
        }
        catch(propFail){propFail++}
	}
    // File-Compression
        // TODO: find way to read directly from file
    // File-Resolution
      if(fieldsArr[L1].Schema_Field == 'File-Resolution'){
        try  {
            Res = xmpData.getProperty( 'http://ns.adobe.com/tiff/1.0/', "XResolution") // TODO: find way to read directly from file
            // separate the value before the "/" from the value after it to do division
            var forwardSlashIndex = Res.toString().lastIndexOf ("/")
            // value before the "/"
            var pixels = Res.toString().substr(0,forwardSlashIndex);
            // value after the "/"
            var perInch = Res.toString().slice(forwardSlashIndex+1);
            // divide pixels by perInch and round to nearest integer
            prop = Math.round (pixels/perInch)

            if (prop){
                dataExport.write ("\t" + prop+" ppi");
                }
            else{
                dataExport.write ("\t");
                }
            }
        catch(propFail){propFail++}
        }
    // File-Device Make
        //exportText (XMPConst.NS_TIFF, "Make");
    // File-Device Model
        //exportText (XMPConst.NS_TIFF, "Model");
    // File-Software
        //exportText (XMPConst.NS_TIFF, "Software");
    // File-Color Mode
    if(fieldsArr[L1].Schema_Field == 'File-Color Mode'){
        try {
            prop = xmpData.getProperty ("http://ns.adobe.com/photoshop/1.0/", "ColorMode") // TODO: find way to read directly from file
            var mode = ["Bitmap", "Gray scale", "Indexed colour", "RGB colour", "CMYK colour", "Multi-channel", "Duotone", "LAB colour"];               
            if (prop){
                dataExport.write ("\t" + mode[prop]);
                }
            else{
                dataExport.write ("\t");
                }     
            }
        catch(propFail){propFail++}
        }
    // File-Color Profile
        //exportText (XMPConst.NS_PHOTOSHOP, "ICCProfile"); // TODO: find way to read directly from file
    // File-Color Space
    if(fieldsArr[L1].Schema_Field == 'File-Color Space'){
    try  {
        prop = xmpDataxmpData.getProperty ('http://ns.adobe.com/exif/1.0/', "ColorSpace");
        var spec = ["1", "FFFF.H", "65535", "Other"]; 
        var label = ["sRGB", "Uncalibrated", "Uncalibrated", "reserved"];
        if (prop){
            for (var L2 = 0; L2 < spec.length; L2++){
                if (prop == spec[L2]){                                      
                    dataExport.write ("\t" + label[L2]);
                    }
                }
            }        
        else{
            dataExport.write ("\t");
            }
        }
    catch(propFail){propFail++}
	}

	} // end
// File properties     
 // exportText (XMPConst.NS_DC, "format");   // TODO: find way to read directly from file
        /*
                function exportText (namespace,path){
					try{
						prop = xmpData.getProperty (namespace,path);
						if (prop){
							dataExport.write ('\t' + prop);
							}
						else{
							dataExport.write ('\t');
							}
						}
					catch(propFail){propFail++}
					}	               		
							  
				// Export PHOTOSHOP ICCProfile (Color Profile)
				exportText (XMPConst.NS_PHOTOSHOP, "ICCProfile"); // TODO: find way to read directly from file

				// Export EXIF ColorSpace
				{

          */
					// fail check  
				  if (propFail == 0)
						{
							filePass++;
						}
					} // End of overall try/catch for each image
				
				// outer fail check
				catch(fileFailArrError){
					fileFailArr.push(Thumb[L2].name.split ("%20").join (" "));
					} 
				} // end of  loop: if (Thumb[L2]){...
			}  // end of loop: for (var L2 = 0; L2 < Thumb.length; L2++){...

			// TODO: is this ever used?  where is "var W" used after it is created here?
            /*
            var W = "";
            if (hardDriveCheck != hardDrive){
                if (Folder.fs == "Windows"){
                    var X = hardDriveCheck.split ("/").join ("\\");
                    var Y = X.substring (2);
                    if (X.split ("\\")[0] == "~") var Z = "~\\";
                    else var Z = X.substring (1,2).toUpperCase() + ":";
                    }
                else {
                    var X = hardDriveCheck;
                    var Y = X.substring (1);
                    if (X.split ("/")[0] == "~") var Z = "~";
                    else var Z = "/";
                    }
                var W = "\n" + spot + "  Current Folder:\n" + spot + "  " + Z + Y;
                }
            */
          
            } // end of 'Create and open the export file so it can recieve data'
        } // close brace 1 end of  if(exportWhich.fieldsArrRb.value == true && app.document.selections.length == 0)
	
		//  Hide exorting progress bar
		exportProgress.hide(); 
        exportProgress.close(); 
		// Show report that extraction is complete with directory path of .txt file
		var textFilePath = dataExport.toString().split ("%20").join (" ").split("/").join ("\\");
		var complete = new Window("dialog", "Export Complete");
        complete.spacing = 3;
		complete.alignChildren = 'center';		
		complete.header = complete.add('statictext', undefined, "Success!");
        complete.header .alignment = 'fill'
        complete.header .justify = 'center'
		complete.msg1 = complete.add('statictext', undefined, "Data has been Exported from "+filePass+" images and saved to:");
		complete.msg1.preferredSize = [400, 20]
		complete.msg1.justify = 'center';
		complete.msg2= complete.add('statictext', undefined, textFilePath, {multiline:true});
		complete.msg2.preferredSize = [400,100];
		complete.msg2.justify = 'center';
		// begin problems
		complete.problem = complete.add('group');
		complete.problem.orientation = 'column';	
		complete.problem.maximumSize = [0, 0];
		complete.problem.header = complete.problem.add('statictext', undefined, "But...");
		complete.problem.msg = complete.problem.add('statictext', undefined, "There was a problem exporting data from "+fileFailArr.length+" images.");
		complete.problem.btn=  complete.problem.add('button', undefined, "Which files?");
		complete.problem.btn.onClick = showProblems;
		complete.problem.msg2 = complete.problem.add('statictext', undefined, "The metadata structure may be invalid. Try opening and saving the file(s) in Photoshop and exporting again.", {multiline:true});
		complete.problem.msg2.minimumSize = [350, 40];
        complete.problem.msg2.maximumSize = [350, 40];

		function showProblems (){
			var problems = new Window('dialog', "Problems");
			complete.problem.files = problems.add('statictext', undefined, fileFailArr.join("\n"), {multiline:true});
			complete.problem.files.minimumSize = [300, 40];
             complete.problem.files.maximumSize = [300, 40];

			complete.okBtn = problems.add('button', undefined, "Continue");
			complete.okBtn.onClick =  function(){ 
				problems.hide();
				}
			problems.show();
			}
		// Continue button
		complete.okBtn = complete.add('button', undefined, "Continue");
		complete.okBtn.onClick =  function(){ 
			complete.hide();
			}
			} // close export brace 1
		complete.show();		
		// Close the exported .txt file
		dataExport.close();
		}  // close "function exportToFile(){"
    

//////////////////////////////////////////////////////////////// END OF EXPORT FUNCTIONS ////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////// BEGINNING OF IMPORT FUNCTIONS ////////////////////////////////////////////////////////////////
function importFromFile(){
        var appDataPlgnSet = File (appDataFwdSlash + plgnPrefs + plgnOpt + plgnSet);
        appDataPlgnSet.open ("w", "TEXT", "ttxt");
        appDataPlgnSet.write (exportWhich.folderRb.value  + "|");
        appDataPlgnSet.write (exportWhich.subfoldersCb.value  + "|");  
        appDataPlgnSet.write (exportWhich.fieldsArrRb.value + "|");
        appDataPlgnSet.write (exportOptions.datesCb.value + "|");
        appDataPlgnSet.write (dataSource.text + "|");
        appDataPlgnSet.write (writeOptions.appendRb.value+ "|");
        appDataPlgnSet.write (writeOptions.overwriteRb.value + "|");
        appDataPlgnSet.write (IgnoreExtCb.value+ "|");    
        appDataPlgnSet.write (addLabelCb.value+ "|");
        appDataPlgnSet.write (exportOptionsLfCb.value+"|");
        appDataPlgnSet.write (exportChoice+"|");
        appDataPlgnSet.write (exportWhich.folderEt.text + "|");
        appDataPlgnSet.write (imageLoc.text+ "|");
        appDataPlgnSet.write (imageLocSubfoldersCb.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.Path.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.Name.value+ "|");
        appDataPlgnSet.write (dataSourceOptions.enabled+ "|");
        appDataPlgnSet.write (IgnoreExtCb.enabled+ "|");
        appDataPlgnSet.write (mode+ "|");
        appDataPlgnSet.write (lastViewedHeadersPanel);
        appDataPlgnSet.close();

		if (!imageLoc.text){
			app.beep();                  
			Window.alert ("ERROR: \nPlease select a folder of images");
			return false;
			}
	 
		 if (!dataSource.text){
			app.beep();                  
			Window.alert ("ERROR: \nPlease select a text file");
			return false;
			}

		// data source text file
		var textFileLoad = File (dataSource.text.split (" ").join ("%20"));
		// open the data text file
		var textFileLoad = File (textFileLoad);
		textFileLoad.open ('r');
		var textFile = textFileLoad.read().split ('\n');
		textFileLoad.close(); 
		var textFileHeaders = textFile[0].split ("\t");
	// changed to use current based on selected thunbnail this can be deleted	var selectedFolder = Folder(imageLoc.text.split (" ").join ("%20"));
		var allFiles = [];
		
        // get currentPath

    for (var L1x = 0; L1x < app.document.visibleThumbnails.length; L1x++) {
        if (app.document.visibleThumbnails[L1x].spec instanceof File){
        var currentPath = app.document.visibleThumbnails[L1x].spec.toString()
        var currentPathToArray = app.document.visibleThumbnails[L1x].spec.toString().split("/")
        var currentFolder = currentPathToArray[currentPathToArray.length-2].split("%20").join("_")
// index of last "/" 		
var splicePathIndex1 = currentPath.lastIndexOf ("/")
// just the file directory
var currentFolderPath = currentPath.substr(0,splicePathIndex1+1).split(" ").join("%20");          
        break;     
          }
        }
    var selectedFolder = Folder(currentFolderPath);
/*TEST - show window with list of all file names in the import text file
var textFileNameArr = [];
            for (var L1 = 0; L1 < textFile.length; L1++) {
				 var textFileRead = textFile[L1].split ("\t")
				// if  there is a filename value, push each file name to an array to check for dupes
				if(textFileRead[0]){
				 textFileNameArr.push(textFileRead[0]);  
					}
				}
		textFileNameArr.push("END"); 
		// test info window	
		var testWindow = new Window('palette', "File names in import text file");
		var testMessage = testWindow.add('edittext', undefined, "",{multiline:true});
		testMessage.preferredSize = [300,500];
		testMessage.text = textFileNameArr.join('\n')
		testWindow.show()
*/	
		
		//  TODO: create report on which fields were and were not in the text file
		// open selectedFolder add the path of every file found to the 'allFiles' array. this will be the list of files to be exported
		function getFolder(selectedFolder) {
			var allFilesList = selectedFolder.getFiles();	 
			for (var L1 = 0; L1 < allFilesList.length; L1++) {
				var myFile = allFilesList[L1];
				if (myFile instanceof File && testFileExtension(myFile) == true && testFilePrefix(myFile) == true) {
					allFiles.push(myFile); 
					}
				}
			}
	
		// open selectedFolder and all subfolders and add the path of every file found to the 'allFiles' array. this will be the list of files to be exported
		function getSubFolders(selectedFolder) {
			 var allFilesList = selectedFolder.getFiles();		 
			 for (var L1 = 0; L1 < allFilesList.length; L1++) {
				  var myFile = allFilesList[L1];
				  if (myFile instanceof Folder){
					   getSubFolders(myFile);
				  }
				  if (myFile instanceof File && testFileExtension(myFile) == true && testFilePrefix(myFile) == true) {
					   allFiles.push(myFile); 
				  }
			 }	
		}
				
		// if "Include subfolders" is not checked, only read the files in the selected folder
		if (imageLocSubfoldersCb.value == false){
			locateFilesProgress.show();
			getFolder(selectedFolder);
			locateFilesProgress.hide();
             locateFilesProgress.close();
			}

		// if "Include subfolders" is checked, read all the files in the selected folder and its subfolders 
		if (imageLocSubfoldersCb.value == true){
			locateFilesProgress.show();
			getSubFolders(selectedFolder);
			locateFilesProgress.hide();
             locateFilesProgress.close();
			}
        
        //  if "Match on filename" is selected check that column B has a value, else show alert
      var textFileTested = 0;
        if(textFile[textFile.length-1].length == 0) // if last item in textFile has no data (has an extra line break at the end caused by Excel save) reduce textFile.length -1 so alert below is not triggered (extra line will just be ignored)
        { 
            textFileTested = textFile.length-1
            }
        
        if (dataSourceOptions.Path.value == true){
            // check for existence of directory in text file column B
            var textFilePathBlank = 0;
            for (var L1 = 0; L1 < textFileTested; L1++) {
                var textFileRead = textFile[L1].split ('\t')
                if(!textFileRead[1]){
                    textFilePathBlank++;
                    }
                }          
            if (textFilePathBlank > 0){  // textFile[textFile.length-1].length means: 
                app.beep()
                Window.alert("Some items in your text file do not have a file path.\n\n"+
                "Your options are:\n"+
                " •  Check column 'B'  in your spreadsheet and\n"+
                "     add the missing path.\n"+
                " •  Use 'Match on Filename'.");
                return false;
                }
            }
	
        // if "include subfolders" is not selected, check .txt file for duplicate file names and, if any are found, display a list of them. 
        if(imageLocSubfoldersCb.value == false){
            var textFileNameArr = [];
            for (var L1 = 0; L1 < textFile.length; L1++) {
				 var textFileRead = textFile[L1].split ("\t")
				// if  there is a filename value, push each file name to an array to check for dupes
				if(textFileRead[0]){
				 textFileNameArr.push(textFileRead[0]);  
					}
				} 
      //      var length = textFileNameArr.length,
            txtFileNameDupes=[],
            counts={};
            for (var L1=0; L1 < textFileNameArr.length; L1++) {
                var item = textFileNameArr[L1];
                var count = counts[item];			
			//	if(counts[item].length>0){
                counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
			//	}
                }
            for (var item in counts) {
                if(counts[item] > 1)
                  txtFileNameDupes.push(item);
                }          
            if(txtFileNameDupes.length > 0){          
                app.beep();     
                var duplicatesFound = new Window('dialog', "Duplicates"); 
                duplicatesFound.alignChildren = 'left';
                var duplicatesFoundHeaderValue = "Duplicate filenames have been found, preventing the import from running."
                textDuplicatesHeader = duplicatesFound.add('statictext', [0, 0, 500, 20], duplicatesFoundHeaderValue);
		// test info window	
	//	var testMessage = duplicatesFound.add('edittext', [0,0,300,500], "",{multiline:true});
                // list of duplicates in text file
                textDuplicates = duplicatesFound.add('panel', undefined, "Duplicates in selected text file");
                textDuplicates.alignChildren = 'left';
                textDuplicates.spacing = 3;
                textFilePath = textDuplicates.add('statictext', [0,0,800,20], dataSource.text);
                textDuplicatesBtn = textDuplicates.add('button', undefined, "Save list of duplicates to desktop");
                textDuplicatesBtn.onClick = function(){
                    // Create a text file on the desktop with only the headers.  This can be used as a template in Excel to create properly formatted text for the import function
                    var dupesInText = "dupes_in_text_"+dateYMD+".txt"
                    // Create and open the file so it can recieve data
                    var duplicateImages = new File (desktop+dupesInText)                
                    duplicateImages.encoding = "UTF8";
                    duplicateImages.open ("w", "TEXT", "ttxt");   
                    // write .txt file path
                    duplicateImages.write ("DUPLICATES FOUND IN: "+dataSource.text+"\n\n");
                    // write paths and filenames to the .txt file
                    duplicateImages.write (txtFileNameDupes.join("\n"));
                    // Close the file
                    duplicateImages.close();
                    Window.alert ("A new file named:\n\n"+dupesInText+"\n\nhas been created on your desktop.", "Success!")						
                    };
                var duplicatesOptionsValue = 
                "Your options are:\n"+
                "  •  Remove or change the duplicate filenames\n"+
                "  •  If your text file contains paths in column' A', select 'Match on path and filename'\n"+
                "  •  De-select the subfolders option\n"+
                "  •  Select a subfolder that has no duplicates\n"+
                "  •  Move duplicates so they are not in subfolders of the selected parent folder\n"+
                "  •  Rename duplicates";
                duplicatesOptions = duplicatesFound.add('statictext', [0, 0, 800, 120], duplicatesOptionsValue, {multiline:true});
                
            // Close button
            duplicatesFound.cancelBtn = duplicatesFound.add('button', undefined, "Close");
            duplicatesFound.cancelBtn.alignment = 'center';
            duplicatesFound.cancelBtn.onClick =  function(){ 
                duplicatesFound.hide();
                }
                duplicatesFound.show();
                return false; 
                }
            } // END dulplicates test 
        
		// if "include subfolders" "Match on filename" are selected, check .txt file for duplicate file names and, if any are found, display a list of them. 
		if(imageLocSubfoldersCb.value == true && dataSourceOptions.Name.value == true){
			//  check filenames in text file column B for duplicate filenames
			var textFileNameArr = [];
            var textFilePathArr = [];
            var textFilePathBlank = 0;
			 for (var L1 = 0; L1 < textFile.length; L1++) {
				 var textFileRead = textFile[L1].split ("\t")
				// if  there is a filename value, push each file name to an array to check for dupes
				if(textFileRead[0]){
					 textFileNameArr.push(textFileRead[0]);  
					 }
				}  
		// run find duplicates against text file filenames array
		var length = textFileNameArr.length,
		txtFileNameDupes=[],
		counts={};
		for (var L1=0; L1 < length; L1++) {
			var item = textFileNameArr[L1];
			var count = counts[item];
			counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
			}
		for (var item in counts) {
			if(counts[item] > 1)
			  txtFileNameDupes.push(item);
			}	
		// check filenames in selected directory include subfolders for duplicate filenames
		// get just the file name from allFiles so we can compare it to the file name in the text file
		var fileNameArr = [];
		for (var L2 = 0; L2 < allFiles.length; L2++) {
		  if (Folder.fs == 'Windows'){
			var splicePathIndex = allFiles[L2].toString().lastIndexOf ("/")
			}
		else{
			var splicePathIndex = allFiles[L2].toString().lastIndexOf ("\\")
            var splicePathIndex = allFiles[L2].toString().lastIndexOf ("/")
			}
		var filenameOnly = allFiles[L2].toString().slice(splicePathIndex+1).split("%20").join(" ");
		fileNameArr.push(filenameOnly)
		}
      
		// run find duplicates against filenames array			 
		var len=fileNameArr.length,
		out=[],
		counts={};
		for (var L1=0;L1<len;L1++) {
			var item = fileNameArr[L1];
			var count = counts[item];
			counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
			}

		for (var item in counts) {
			if(counts[item] > 1)
			  out.push(item);
			}

        if(out.length > 0 || txtFileNameDupes.length > 0){    
			var duplicatesWithPath = [];
			 for (var L1 = 0; L1 < out.length; L1++){ 
				for (var L2 = 0; L2 < allFiles.length; L2++){   
				  if(allFiles[L2].toString().match(RegExp (out[L1])) != null){
				     duplicatesWithPath.push(allFiles[L2]);	  
					}
				   }	  
				}   
            app.beep();
            var duplicatesFound = new Window('dialog', "Duplicates"); 
            duplicatesFound.alignChildren = 'left';
            var duplicatesFoundHeaderValue = "Duplicate filenames have been found, preventing the import from running."
            textDuplicatesHeader = duplicatesFound.add('statictext', [0, 0, 500, 20], duplicatesFoundHeaderValue);
// test info window	
		//var testMessage = duplicatesFound.add('edittext', [0,0,300,500], "",{multiline:true});
            // list of duplicates in text file
            if(txtFileNameDupes.length > 0){ 	
                textDuplicates = duplicatesFound.add('panel', undefined, "Duplicates in selected text file");
                textDuplicates.alignChildren = 'left';
                textDuplicates.spacing = 3;
                textFilePath = textDuplicates.add('statictext', [0,0,800,20], dataSource.text);
             //   textDuplicatesList = textDuplicates.add ('ListBox', [0, 0, 800, 150], txtFileNameDupes);
           //     textDuplicatesList = textDuplicates.add ('edittext', [0, 0, 800, 150], txtFileNameDupes.join("\n"), {multiline:true});
                textDuplicatesBtn = textDuplicates.add('button', undefined, "Save list of duplicates to desktop");
            textDuplicatesBtn.onClick = function(){
            // Create a text file on the desktop with only the headers.  This can be used as a template in Excel to create properly formatted text for the import function
            var dupesInText = "dupes_in_text_"+dateYMD+".txt"
            // Create and open the file so it can recieve data
            var duplicateImages = new File (desktop+dupesInText)                
            duplicateImages.encoding = "UTF8";
            duplicateImages.open ('w', 'XLS', 'XCEL');   
            // write .txt file path
            duplicateImages.write ("DUPLICATES FOUND IN: "+dataSource.text+"\n\n");
            // write paths ans filenames to the .txt file
            duplicateImages.write (txtFileNameDupes.join("\n"));
            // Close the file
            duplicateImages.close();
            Window.alert ("A new file named:\n\n"+dupesInText+"\n\nhas been created on your desktop.", "Success!")						
            };
        
     /*           var textDuplicatesOptionsValue = 
                "Your options are:\n"+
                "  •  Remove the duplicate filenames from your text file\n"+
                "  •  If your text file contains paths in column' A', select 'Match on path and filename'\n"+
                "  •  De-select the subfolders option\n"+
                "  •  Select a subfolder that has no duplicates\n"+
                "  •  Move duplicates so they are not in subfolders of the selected parent folder\n"+
                "  •  Rename duplicates";
                textDuplicatesOptions = textDuplicates.add('statictext', [0, 0, 800, 120], textDuplicatesOptionsValue, {multiline:true});
                */
                }
            // list of duplicates in folder include subfolders
            if(out.length > 0){	
                folderDuplicates = duplicatesFound.add('panel', undefined, "Duplicates in selected folder of image files");
                folderDuplicates.spacing = 3;
                folderDuplicates.alignChildren = 'left';
                folderPath = folderDuplicates.add('statictext', [0,0,800,20], imageLoc.text+" ... and subfolders");
            //    folderDuplicatesList = folderDuplicates.add ('ListBox', [0, 0, 800, 150], duplicatesWithPath);
                folderDuplicatesBtn = folderDuplicates.add('button', undefined, "Save list of duplicates to desktop");
                folderDuplicatesBtn.onClick = function(){
                // Create a text file on the desktop with only the headers.  This can be used as a template in Excel to create properly formatted text for the import function    
                var dupesInFolder = "dupes_in_folders_"+dateYMD+".txt"
                // Create and open the file so it can recieve data
                var duplicateImages = new File (desktop+dupesInFolder)                
                duplicateImages.encoding = "UTF8";
                duplicateImages.open ("w", "TEXT", "ttxt");
                
                // write paths ans filenames to the .txt file
                duplicateImages.write (duplicatesWithPath.join("\n"));
                // Close the file
                duplicateImages.close();
                Window.alert ("A new file named:\n\n"+dupesInFolder+"\n\nhas been created on your desktop.", "Success!")						
                };

             /*   var folderDuplicatesOptionsValue = 
                "Your options are:\n"+
                "  •  If your text file contains paths in column' A', select 'Match on path and filename'\n"+
                "  •  De-select the subfolders option\n"+
                "  •  Select a subfolder that has no duplicates\n"+
                "  •  Move duplicates so they are not in subfolders of the selected parent folder\n"+
                "  •  Rename duplicates";
                folderDuplicatesOptions = folderDuplicates.add('statictext', [0, 0, 800, 100], folderDuplicatesOptionsValue, {multiline:true});
                }*/
            var duplicatesOptionsValue = 
                "Your options are:\n"+
                "  •  Remove or change the duplicate filenames\n"+
                "  •  If your text file contains paths in column' A', select 'Match on path and filename'\n"+
                "  •  De-select the subfolders option\n"+
                "  •  Select a subfolder that has no duplicates\n"+
                "  •  Move duplicates so they are not in subfolders of the selected parent folder\n"+
                "  •  Rename duplicates";
                duplicatesOptions = duplicatesFound.add('statictext', [0, 0, 800, 120], duplicatesOptionsValue, {multiline:true});
                }
            // Close button
            duplicatesFound.cancelBtn = duplicatesFound.add('button', undefined, "Close");
            duplicatesFound.cancelBtn.alignment = 'center';
            duplicatesFound.cancelBtn.onClick =  function(){ 
                duplicatesFound.hide();
                }
             duplicatesFound.show();
             return false; 
             } // close if(out.length > 0 || txtFileNameDupes.length > 0)
         
        } // close if(imageLocSubfoldersCb.value == true)
	// Close the main UI window before running the import
	mainWindow.hide()
     // begin reading data from file
     { 	
	// Variables used for collecting pass/fail data for report
	var filePass = 0;
	var fileFail = 0;
	var fileFailArr = [];
	var couldNotOpen = [];
    var couldNotClose = [];
	var propFail = 0;
    var propFailName = [];
	var noMatch = [];
	var propPass = [];

		// Progress bar window to show files are importing
		var importingProgress =  new Window ('palette', "Importing Metadata");
        importingProgress.alignChildren = 'center';
		importingProgress.preferredSize = [400,80];
		importingProgress.count = importingProgress.add('statictext', undefined, allFiles.length+" image files to proccess");
		importingProgress.progBar = importingProgress.add('progressbar', [0,20,390,40]);
	
    {
        for (var L3 = 0; L3 < allFiles.length; L3++){
			if ( allFiles.length > 50){
				importingProgress.progBar.value = Math.round ((L3 / allFiles.length) * 100);  
				  importingProgress.center();
				  importingProgress.show();
			 }

      //   if (allFiles[L3].hasMetadata)       
		 if (allFiles[L3]){         
		// Get the selected file
        var imageFile = allFiles[L3];
        try{
 // try to open file. if it fails, save file path in error log
try{
    // if file is an .xmp sidecar - read the xmp directly to an XMPMeta Object
    if(imageFile.name.match(/\.xmp/i) != null){
        var xmpFile = Folder (File(imageFile.fsName)); 
        xmpFile.open('r');  
        var xmpData = new XMPMeta(xmpFile.read());  
          xmpFile.close();  
        }
    else{
        // if file is not an .xmp sidecar pull XMP from file
        var xmpFile = new XMPFile(imageFile.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
        // convert to xmp
        var xmpData = xmpFile.getXMP();
        }
    }
catch(couldNotOpenError){}       
 // convert fieldsArr item to object
 // TODO: reading from customFileText - is there a better way to do it?  if not, make sure customFileText is updated when loading a saved list or saving a new one (already working)
var customFileArr = customFileText.split("\n")
fieldsArr = []
for (var L1 = 0; L1 < customFileArr.length; L1++){
    var obj = new Object();
    obj = eval('(' + customFileArr[L1] + ')');
    fieldsArr.push(obj)
    }
				// delete label before import begins  Data imported
				var prop = xmpData.getProperty (XMPConst.NS_XMP, "Label");		
				var patt1=new RegExp(""+projectName1+" metadata imported"); 	
			
				if (patt1.test(prop) == true){				
					xmpData.deleteProperty (XMPConst.NS_XMP, 'Label');	
					} 
				// get just the file name from allFiles so we can compare it to the file name in the text file
				 if (Folder.fs == 'Windows'){
					var splicePathIndex = allFiles[L3].toString().lastIndexOf ("/")
					}
				else{
					var splicePathIndex = allFiles[L3].toString().lastIndexOf ("\\")
                       var splicePathIndex = allFiles[L3].toString().lastIndexOf ("/")
					}
				
				// get just the file directory
				var spliceDirectory = allFiles[L3].toString().slice(splicePathIndex+1).split("%20").join(" ");
				// get just the file name
				var spliceName = allFiles[L3].toString().slice(splicePathIndex+1).split("%20").join(" ");
	   
                    // read the tab delimited file
                for (var L4 = 1; L4 < textFile.length; L4++){                      
                    var textFileValue = textFile[L4].split ('\t');
                    if (IgnoreExtCb.value == true){		
                        var thumbName = spliceName.split ('.');						
                        thumbName.pop();
                        var thumbName = thumbName.join ('.');
                        var impFileName = textFileValue[0].split ('.');
                        impFileName.pop();
                        var impFileName = impFileName.join ('.');	
                        }         					 
                // if image file name matches the filename in the the first position of the text file array
                else{
                    var thumbName= spliceName;
                    var impFileName = textFileValue[0];
                    }       
             
    if(dataSourceOptions.Path.value == true){  
        var thumbName = allFiles[L3];
        var impFileName = textFileValue[1].split(" ").join("%20")+textFileValue[0].split(" ").join("%20");
        }         
// TODO: is .toLowerCase() neccessary for a match?
                 if (thumbName == impFileName){						 
	        	// get the array index of the specified header string
			if (typeof Array.prototype.indexOf != "function") {  
				Array.prototype.indexOf = function (el) {  
					for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
					return -1;  
					}  
                }
	  
 // remove extra " from CSV formatting
 function parseCSV(str) {  // TODO: needed?
    var arr = [];
    var quote = false;  // true means we're inside a quoted field
    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary
        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  
        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }
        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }
        // If it's a newline and we're not in a quoted field, move on to the next
        // row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
  val = arr
   // return arr; 
}

 // import text
  for (var L12 = 0; L12 < fieldsArr.length; L12++){   
      var textHeader = "";
      if(fieldsArr[L12].XMP_Type == 'text'){
          try{		
              textHeader = fieldsArr[L12].Label	
              // run the import
              var path = fieldsArr[L12].XMP_Property.slice(fieldsArr[L12].XMP_Property.indexOf(":")+1)
              if(textHeader.length > 0){	// add else with alert 'No matching headers
                  var prop = xmpData.getProperty(fieldsArr[L12].Namespace, path);  							
                  var index = textFileHeaders.indexOf(textHeader)
                 if(index > 0){
                  if (writeOptions.overwriteRb.value == true){                                  
        //    xmpData.deleteProperty(fieldsArr[L12].Namespace, path);         
                  //    if (textFileValue[index].length > 0){        
 // 	xmpData.setProperty (fieldsArr[L12].Namespace, path, "XXX");
// !!!              
var val = ""             
// remove extra " from CSV formatting
parseCSV(textFileValue[index])
// convert linefeed, carriage returns, and tab 
var val = val.toString().split("(LF)").join("\n").split("(CR)").join("\r").split("(HT)").join("\t") 

							 if(!textFileValue[index]){val =" "}
                                 xmpData.setProperty (fieldsArr[L12].Namespace, path, val);
                                   //     }
                                    }
                                else if (prop == undefined && textFileValue[index].length > 0){
                                   xmpData.setProperty (fieldsArr[L12].Namespace, path, val);
                                    } 						
								// for simple text propos only, delete prop if value == " "
                                if(fieldsArr[L12].XMP_Type == 'text' && val == " "){
                                     xmpData.deleteProperty(fieldsArr[L12].Namespace, path);
                                    }
								propPass.push(textHeader)
                            } // close if(textHeader.length > 0)
                        }        
                                } // close try
                                catch(propFail){propFail++, propFailName.push(path)}
                        }	// close if(fieldsArr[L12].XMP_Type == 'complexStruct')
                    } // close import text

                    // import date	
                    for (var L6 = 0; L6 < fieldsArr.length; L6++){    
                        var dateHeader = "";
                        if(fieldsArr[L6].XMP_Type == 'date'){
                            try{            
                                  dateHeader = fieldsArr[L6].Label		
                                // run the import
                                var path = fieldsArr[L6].XMP_Property.slice(fieldsArr[L6].XMP_Property.indexOf(":")+1)
                                if(dateHeader.length > 0){	// add else with alert 'No matching headers found		
                                    var index = textFileHeaders.indexOf(dateHeader)	             
                                       if(index > 0){
                                        if (writeOptions.overwriteRb.value == true){
                                            xmpData.deleteProperty(fieldsArr[L6].Namespace, path);
                                            if (textFileValue[index].length > 0){
                                                xmpData.setProperty (fieldsArr[L6].Namespace, path, textFileValue[index].split ('_').join (""));
                                                }
                                            }
                                        else if (prop == undefined && textFileValue[index].length > 0){
                                            xmpData.setProperty (fieldsArr[L6].Namespace, path, textFileValue[index].split ('_').join (""));
                                            }
										propPass.push(dateHeader)   
                                    } // close if(dateHeader.length > 0)
                                }                                             
                                } // close try
                                    catch(propFail){propFail++, propFailName.push(path)}
                            }	// close if(fieldsArr[L6].XMP_Type == 'date')
                        } // close import date
                                        
					// import langAlt array
					for (var L7 = 0; L7 < fieldsArr.length; L7++){    
						var langAltHeader = "";
						if(fieldsArr[L7].XMP_Type == 'langAlt'){
							try{            
								langAltHeader = fieldsArr[L7].Label	
								// run the import
                                 var path = fieldsArr[L7].XMP_Property.slice(fieldsArr[L7].XMP_Property.indexOf(":")+1)
								if(langAltHeader.length > 0){	// add else with alert 'No matching headers found		
									var index = textFileHeaders.indexOf(langAltHeader)	
									var count = xmpData.countArrayItems(fieldsArr[L7].Namespace, path);
											//	var prop = textFileValue[index].split('\"').join("");	
// !!!   
// remove extra " from CSV formatting and return it to val
var val = ""             
parseCSV(textFileValue[index])
// !!! convert on export too
var val = val.toString().split("(LF)").join("\n").split("(CR)").join("\r").split("(HT)").join("\t")
											
                          if(index > 0){
                              
												if (writeOptions.overwriteRb.value == true){
													 xmpData.deleteProperty(fieldsArr[L7].Namespace, path);  
													 if (textFileValue[index].length > 0){
													 xmpData.appendArrayItem (fieldsArr[L7].Namespace, path, val, 0, XMPConst.ALIAS_TO_ALT_TEXT);
													xmpData.setQualifier    (fieldsArr[L7].Namespace, path + '[1]', NS_W3, "lang", "x-default");
													}
												}
												else
													 if (count == 0 && textFileValue[index].length > 0){
														  xmpData.appendArrayItem (fieldsArr[L7].Namespace, path, val, 0, XMPConst.ALIAS_TO_ALT_TEXT);
														  xmpData.setQualifier (fieldsArr[L7].Namespace, path + '[1]', NS_W3, "lang", "x-default");
													 }
									if (writeOptions.overwriteRb.value == true){
											}
										propPass.push(langAltHeader)
									} // close if(langAltHeader.length > 0)
								}						
								} // close try
									catch(propFail){propFail++, propFailName.push(path)}
							}	// close if(fieldsArr[L7].XMP_Type == 'langAlt')
						} // close import langAlt arrays

                        // import bag arrays	
                        for (var L8 = 0; L8 < fieldsArr.length; L8++){    
                            var bagHeader = "";
                            if(fieldsArr[L8].XMP_Type == 'bag'){
                                try{         
                                    bagHeader = fieldsArr[L8].Label
                                    // run the import
                                    var path = fieldsArr[L8].XMP_Property.slice(fieldsArr[L8].XMP_Property.indexOf(":")+1)
                                    if(bagHeader.length > 0){	// add else with alert 'No matching headers found		
                                        var index = textFileHeaders.indexOf(bagHeader)
                                         if(index > 0){
                                        if (writeOptions.overwriteRb.value == true){
                                                var count = xmpData.countArrayItems (fieldsArr[L8].Namespace, path); 
                                                if (writeOptions.overwriteRb.value == true){
                                                    xmpData.deleteProperty(fieldsArr[L8].Namespace, path);   
                                                    if (textFileValue[index].length > 0){
                                                        xmpData.setProperty (fieldsArr[L8].Namespace, path, "", XMPConst.ARRAY_IS_UNORDERED);
                                                        var prop = textFileValue[index].split ('"').join ("").split('; ').join(';').split (';');
                                                        for (var L1 = 1; L1 < (prop.length + 1); L1++)
                                                        xmpData.setProperty (fieldsArr[L8].Namespace, path + '[' + L1 + ']', prop[L1 - 1]);
                                                        }
                                                    }
                                                else
                                                if (count == 0 && textFileValue[index].length > 0){
                                                        xmpData.setProperty (fieldsArr[L8].Namespace, path, "", XMPConst.ARRAY_IS_UNORDERED);
                                                        var prop = textFileValue[index].split ('"').join ("").split('; ').join(';').split (';');
                                                        for (var L1 = 1; L1 < (prop.length + 1); L1++)
                                                        xmpData.setProperty (fieldsArr[L8].Namespace, path + '[' + L1 + ']', prop[L1 - 1]);
                                                        }
                                                    } 
                                            propPass.push(bagHeader)	
                                        } // close if(bagHeader.length > 0)
                                    }
                                
                                    } // close try
                                        catch(propFail){propFail++, propFailName.push(path)}
                                }	// close if(fieldsArr[L8].XMP_Type == 'bag')
                            } // close import bag arrays

// import seq arrays	
for (var L9 = 0; L9 < fieldsArr.length; L9++){    
	var seqHeader = "";
	if(fieldsArr[L9].XMP_Type == 'seq'){
		try{           
			seqHeader = fieldsArr[L9].Label		
			// run the import
            var path = fieldsArr[L9].XMP_Property.slice(fieldsArr[L9].XMP_Property.indexOf(":")+1)
			if(seqHeader.length > 0){	// add else with alert 'No matching headers found		
				var index = textFileHeaders.indexOf(seqHeader)
				 if(index > 0){
				if (writeOptions.overwriteRb.value == true){
					if (writeOptions.overwriteRb.value == true){
									xmpData.deleteProperty(fieldsArr[L9].Namespace, path);       
									if (textFileValue[index].length > 0){
										xmpData.setProperty (fieldsArr[L9].Namespace, path, "", XMPConst.ARRAY_IS_ORDERED);
										var prop = textFileValue[index].split ('"').join ("").split('; ').join(';').split (';');
										for (var L1 = 1; L1 < (prop.length + 1); L1++)
										xmpData.setProperty (fieldsArr[L9].Namespace, path + '[' + L1 + ']', prop[L1 - 1]);
										}
									}
								else
								if (count == 0 && textFileValue[index].length > 0){
									xmpData.setProperty (fieldsArr[L9].Namespace, path, "", XMPConst.ARRAY_IS_ORDERED);
									var prop = textFileValue[index].split ('"').join ("").split('; ').join(';').split (';');
									for (var L1 = 1; L1 < (prop.length + 1); L1++)
									xmpData.setProperty (fieldsArr[L9].Namespace, path + '[' + L1 + ']', prop[L1 - 1]);
									}
					}
				propPass.push(seqHeader)
				} // close if(seqHeader.length > 0)
			}		
			} // close try
				catch(propFail){propFail++, propFailName.push(path)}
		}	// close if(fieldsArr[L9].XMP_Type == 'seq')
	} // close import seq arrays

   // Set white label to indicate data was imported
  var prop = xmpData.getProperty (XMPConst.NS_XMP, "Label");
  try{
      if (addLabelCb.value == true){
          xmpData.setProperty (XMPConst.NS_XMP, "Label", projectName1+" metadata imported");	 		
          }
     }
        catch(propFail){propFail++, propFailName.push(path)}
  // if any property failed to import, add the filename to the fileFailArr so it can be reported at the end
  if(propPass.length == 0){
     fileFailArr.push(allFiles[L3]);
      }
  else{
      filePass++;
      }
     
// Write save file and close	
try{
// todo - write .xmp differently
// if file is an .xmp sidecar - read the xmp directly to an XMPMeta Object
if(imageFile.name.match(/\.xmp/i) != null){
  /*
xmpFile.open('w'); 
xmpFile.close()
*/
xmpFile.open('w')
xmpFile.write(xmpData.serialize(XMPConst.SERIALIZE_OMIT_PACKET_WRAPPER));
xmpFile.close()
    }
else{     
    if (xmpFile.canPutXMP(xmpData)) {
        xmpFile.putXMP(xmpData);
        }
    xmpFile.closeFile(XMPConst.CLOSE_UPDATE_SAFELY);	
    }
}
catch(couldNotCloseError){couldNotClose.push(allFiles[L3])}             
                    }		
                 } // close the loop: for (var L4 = 1; L4 < textFile.length; L4++)   
            } // also tried on line 1392

		catch(couldNotOpenError){couldNotOpen.push(imageFile.fsName)}    
               } // close the loop: if (allFiles[L3])	
             } // close the loop: for (var L3 = 0; L3 < allFiles.length; L3++) 

		    // hide the progress bar
            importingProgress.hide();    
            importingProgress.close();  
			// Show results of Import
			  if (filePass == 0){
				   app.beep()
					   Window.alert("Problem importing metadata")
                }
			else{     
                    // Show report that import is complete
                    var complete = new Window("dialog", "Import Complete"); 
                //    complete.preferredSize = [400,400];
                    complete.spacing = 3;
                    complete.alignChildren = 'center';
                    complete.header = complete.add('statictext', undefined, "Success!");
                    complete.msg1= complete.add('statictext', undefined, "Data has been successfully imported for " + filePass + " files.");
                    complete.msg1.preferredSize = [400,40];
                     complete.msg1.justify = 'center';
                    // List of files that could not be opened to write metadata
                    complete.problem1 = complete.add('group');
                    complete.problem1.orientation = 'column';	
                    complete.problem1.maximumSize = [0,0];
                    complete.problem1.header = complete.problem1.add('statictext', undefined, "But...");
                    complete.problem1.header.graphics.font = ScriptUI.newFont ('Arial', 'BOLD', 16);
                    complete.problem1.msg1 = complete.problem1.add('statictext', undefined, "These files could not be opened for import.\nThey might be corrupted or have an incompatable data structure.");
                    complete.problem1.list = complete.problem1.add ('edittext', [0, 0, 500, 150], couldNotOpen.join("\n"), {multiline:true});

				// If there are files that couln't be opened, make problem1 visible		
                    if (fileFailArr.length > 0){
					complete.problem1.maximumSize = [500,400];
					}
                    complete.okBtn = complete.add('button', undefined, 'Close');
                    complete.okBtn.onClick =  function(){ 
					complete.hide();
					}
                complete.show();		
			}
        }  
    } // close function importFromFile()
	} // close 
//////////////////////////////////////////////////////////////// END OF IMPORT FUNCTIONS ////////////////////////////////////////////////////////////////
	} // brace 2 close 'if( xmpLib == undefined ){'
}  // brace 1 close entire script - starting at : //Create a menu option within Adobe Bridge


