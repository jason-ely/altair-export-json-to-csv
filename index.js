
class ActionButtonExportToCSV {
	constructor(props) {}

	// Called to retrieve the render information for the button.
	// Currently only the text of the button is required.
	async render(props) {
		return {
		  text: 'Export CSV'
		};
	}

	// Called when the action button is clicked
	async execute(props) {
	  
		const json = props.queryResponse;

		if (typeof json !== 'object') {
			alert ( "Export JSON error. Was expecting the Altair query response to " 
			+ "be a JSOn object but it wasn't. If you think that this error is erroneous, " 
			+ "please contact the plugin developers wih your sample response from Altair "
			+ "so that a fix may be implemented." );
        }else{
			var JsonString = await this.obj2csv (json , {});
			const blob = new Blob([JsonString], { type: "text/csv;charset=utf-8" });
			saveAs(blob, 'export_json.csv');
		}
	}

	// Perform cleanups in this function
	async destroy(props) {}
  
	 /**
	 * Function takes an object and flattens it to create a csv format.
	 * Csv formatting rules are guided by parameter conversion options.
	 * 
	 * It should be noted that CSV is a 2 dimentional data format that 
	 * accomodates rows and columns but this doesn't translate well when 
	 * trying to convert  json. Hence the following rules will be applied in 
	 * the conversion:
	 * 
	 *  1. Every leaf in the inputted object is converted to a csv column 
	 *  2. By default, every index in an array is converted to a row in the outputted csv.
	 *      Nested arrays will also get there own row. 
	 *  3. In instances where we have nested arrays, it is inevitable that 
	 *    certain 'cells' on the CSV will have a value of 'undefined'. In such cases,
	 *    these undefined cells are populated with the values from the previous cell's (in the same column)
	 *    contents.
	 * 
	 * @param {*} objectToConvert the (json) object that you want to convert. If parameter is not an object, 
	 *                            null will be returned
	 * @param {*} conversionOptions an options object that drives the conversion process. If null, default options are used.
	 * @author Jason Ely
	 */
	async obj2csv(objectToConvert, conversionOptions) {
         if (typeof objectToConvert !== 'object') {
          return null;
        }
        conversionOptions = conversionOptions || {};
        var jsonPathSeparator = conversionOptions.scopechar || '/';
        var csvOutputColumnDelimeter = conversionOptions.delimeter || ',';
        var shouldBackFill = conversionOptions.backFill || true;
        if (Array.isArray(objectToConvert) === false) {
          objectToConvert = [objectToConvert];
        }
       
        var cursor, name, currentRowNumberToIterate, key, queue, values = [], headers = {}, headerArray = [];

        for (currentRowNumberToIterate = 0; currentRowNumberToIterate < objectToConvert.length; currentRowNumberToIterate++) {
            queue = [objectToConvert[currentRowNumberToIterate], ''];

            while (queue.length > 0) {
                name = queue.pop();
                cursor = queue.pop();
                if (cursor !== null && typeof cursor === 'object') {
                    for (key in cursor) {
                        if (cursor.hasOwnProperty(key)) {
                            queue.push(cursor[key]);
                            queue.push(name + (name ? jsonPathSeparator : '') + key);
                        }
                    }
                } else {
                    if (headers[name] === undefined) {
                      var reg = /\/(\d+)($|\/)/g;   
                      var colName = name;
                      var calculatedRow = currentRowNumberToIterate + 1;
                      var result;
                      while((result = reg.exec(name)) !== null) {
                        calculatedRow = calculatedRow * (parseInt(result[1]) + 1);
                        if (result[2] === ""){
                          colName = colName.replace(result[0], "");
                        }else{
                          colName = colName.replace(result[0], jsonPathSeparator);
                        }
                       
                      }

                      headers[name] = {
                        rowNumber: calculatedRow,
                        columnName: colName,
                        value: cursor,
                        path: name
                      };
                    }
                }
            }
        }

        //get some numbers so we can size the 2D array
        var maxRows = 0;
        for (key in headers) {
          var header = headers[key];
          var indexOfColumnName = headerArray.indexOf(header.columnName);

          if (indexOfColumnName < 0){
            indexOfColumnName = headerArray.push(header.columnName);
          }

          if (header.rowNumber > maxRows){
            maxRows = header.rowNumber;
          }
        }


        var values = [];
        while(values.push([]) < maxRows);
        // populate the values
        for (key in headers) {
            if (headers.hasOwnProperty(key)) {
                var header = headers[key];
                var indexOfColumnName = headerArray.indexOf(header.columnName);           
                values[header.rowNumber - 1][indexOfColumnName] = header.value;
            }
        }


        if (shouldBackFill){
          var lastValue;
          for (var j = 0; j < headerArray.length; j++){
            for (var k = 0; k < values.length; k++){
              if (values[k][j] !== undefined){
                lastValue = values[k][j] ;
              }

              if (values[k][j] === undefined){
                if (lastValue !== undefined){
                  values[k][j] = lastValue
                }
              }
            }    
          }
        }

        return '"' + headerArray.join('"' + csvOutputColumnDelimeter + '"') + '"\n' + values.join('\n');
    }
}

// Add the class to the Altair plugins object
window.AltairGraphQL.plugins.ActionButtonExportToCSV = ActionButtonExportToCSV;
