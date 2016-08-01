$(document).ready(function(){

	// var storedSymbol = localStorage.setItem("storedSymbol", symbol)
	var a = [];
	a.push(JSON.parse(localStorage.getItem('session')));
	localStorage.setItem('session', JSON.stringify(a));

	function SaveDataToLocalStorage(data)
	{
	    var a = [];
	    // Parse the serialized data back into an aray of objects
	    a = JSON.parse(localStorage.getItem('session'));
	    // Push the new data (whether it be an object or anything else) onto the array
	    a.push(data);
	    // Alert the array value
	    console.log(a);  // Should be something like [Object array]
	    // Re-serialize the array back into a string and store it in localStorage
	    localStorage.setItem('session', JSON.stringify(a));
	}
	SaveDataToLocalStorage(symbolAdd);

	$('.add-form').submit(function(){
		
		var symbolAdd = $('#symbolAdd').val();
		localStorage.setItem("symbol", JSON.stringify(symbolAdd));
		});

		var dataBack = JSON.parse(localStorage.getItem("symbol"));
		console.log(dataBack);

		function favorites (){
			var symbol = dataBack;

			var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
			// console.log(url);

			$.getJSON(url, function(theDataJsFoundIfAny){
				// console.log(theDataJsFoundIfAny);
				var stockInfo = theDataJsFoundIfAny.query.results.quote;
				var stockCount = theDataJsFoundIfAny.query.count;
				var newHTML = '';
				if (stockCount > 1){
					for(var i=0; i<stockInfo.length; i++){
						newHTML += buildNewTable(stockInfo[i]);
					}
				}else{
					newHTML += buildNewTable(stockInfo);
				}
				$('.yahoo-body').html(newHTML);
				$('.table').DataTable();
			});

		};
		document.onload = favorites();

	// add a submit handler for our form
	$('.yahoo-form').submit(function(){
		// Stop the form from submitting when the user clicks or pushes enter
		event.preventDefault();
		// Get whatever the user put in the input field
		var symbol = $('#symbol').val();

		var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
		// console.log(url);

		$.getJSON(url, function(theDataJsFoundIfAny){
			// console.log(theDataJsFoundIfAny);
			var stockInfo = theDataJsFoundIfAny.query.results.quote;
			var stockCount = theDataJsFoundIfAny.query.count;
			var newHTML = '';
			if (stockCount > 1){
				for(var i=0; i<stockInfo.length; i++){
					newHTML += buildNewTable(stockInfo[i]);
				}
			}else{
				newHTML += buildNewTable(stockInfo);
			}
			$('.yahoo-body').html(newHTML);
			$('.table').DataTable();
		});

	});

});
		function buildNewTable(stockInfo){

			if(stockInfo.Change[0] == '+'){
				var upDown = "success";
			}else{
				var upDown = "danger";
			}

			var htmlString = '';
			htmlString = '<tr><td>' + stockInfo.Symbol + '</td>';
			htmlString += '<td>' + stockInfo.Name  + '</td>';
			htmlString += '<td>' + stockInfo.Ask + '</td>';
			htmlString += '<td>' + stockInfo.Bid + '</td>';
			htmlString += '<td class+"'+upDown+'">' + stockInfo.Change + '</td></tr>';
			return htmlString;
		}
