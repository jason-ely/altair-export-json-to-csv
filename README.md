# About altair-export-json-to-csv
A custom built plugin for the [Altair](https://github.com/imolorhe/altair) application that provides a custom button on the graphql response frame  which converts the query response to csv and then saves it to file

# Altair usage

To enable the plugin in Altair, enable the plugins feature and then select plugin __altair-export-json-to-csv__. After restarting the application, the __export csv__ button should become available.

# File save format

The CSV file format is a 2 dimensional data format that accommodates rows and columns but this doesn't translate well when trying to convert json to csv. Hence the following rules will be applied in  the conversion:

 1. Every leaf in the inputted object is converted to a csv column
 2. By default, every index in an array is converted to a row in the outputted csv. Nested arrays will also get there own row.
 3. In instances where we have nested arrays, it is inevitable that certain 'cells' on the CSV will have a value of 'undefined'. In such cases, these undefined cells are populated with the values from the previous cell's (in the same column) contents.

# NPM

This plugin can be found on NPM. Click [here](https://www.npmjs.com/package/altair-graphql-plugin-export-to-csv)

