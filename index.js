
// ActionButtonJsonToCSV
class ActionButtonJsonToCSV {
  constructor(props) {}

  // Called to retrieve the render information for the button.
  // Currently only the text of the button is required.
  async render(props) {
    return {
      text: 'Download FNB CSV'
    };
  }

  // Called when the action button is clicked
  async execute(props) {
	  
	alert ( "starting conversion ... " );  
    console.log('===========');
    console.log(props);
    console.log('===========');

    let variables;

    // Check if variables is a valid JSON string
    try { variables = JSON.parse(props.variables) } catch (e) {}
	
	

    const emailVariableExists = variables != undefined && variables["json-csv-email"] != undefined;
    const email = emailVariableExists ? variables["json-csv-email"] : '';
    const json = props.queryResponse;
	
	
	var JsonString = await this.obj2csv (json , {});
	
	console.log ( JsonString );
    
	const blob = new Blob([JsonString], { type: "text/csv;charset=utf-8" });
	saveAs(blob, 'download.csv');
   
	
	alert ( "Ending conversion ... " );  
  }

  // Perform cleanups in this function
  async destroy(props) {}
  
  async obj2csv(obj, opt) {
        if (typeof obj !== 'object') return null;
        opt = opt || {};
        var scopechar = opt.scopechar || '/';
        var delimeter = opt.delimeter || ',';
        if (Array.isArray(obj) === false) obj = [obj];
        var curs, name, rownum, key, queue, values = [], rows = [], headers = {}, headersArr = [];
        for (rownum = 0; rownum < obj.length; rownum++) {
            queue = [obj[rownum], ''];
            rows[rownum] = {};
            while (queue.length > 0) {
                name = queue.pop();
                curs = queue.pop();
                if (curs !== null && typeof curs === 'object') {
                    for (key in curs) {
                        if (curs.hasOwnProperty(key)) {
                            queue.push(curs[key]);
                            queue.push(name + (name ? scopechar : '') + key);
                        }
                    }
                } else {
                    if (headers[name] === undefined) headers[name] = true;
                    rows[rownum][name] = curs;
                }
            }
            values[rownum] = [];
        }
        // create csv text
        for (key in headers) {
            if (headers.hasOwnProperty(key)) {
                headersArr.push(key);
                for (rownum = 0; rownum < obj.length; rownum++) {
                    values[rownum].push(rows[rownum][key] === undefined
                        ? ''
                        : JSON.stringify(rows[rownum][key]));
                }
            }
        }
        for (rownum = 0; rownum < obj.length; rownum++) {
            values[rownum] = values[rownum].join(delimeter);
        }
        return '"' + headersArr.join('"' + delimeter + '"') + '"\n' + values.join('\n');
    }

}

// Add the class to the Altair plugins object
window.AltairGraphQL.plugins.ActionButtonJsonToCSV = ActionButtonJsonToCSV;
