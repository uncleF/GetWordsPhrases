$(document).ready(function() {

	var html = $('#html');
	var resultsP = $('#resultsP');

	$('#get').on('click', function(event) {
		var languageString;
		var list = [];
		var csv = '';
		event.preventDefault();
		languageString = $(html.val()).find('.ill-kyoto').text();
		$(html.val()).find('.ill-wlv__block-d, .ill-wlv__block-i').each(function() {
			var element = $(this);
			var data = {
				audio: '"' + element.find('.ill-onebuttonplayer').attr('data-url') + '"',
				spelling: '"' + element.find('.ill-wlv__section-b__target').text().toLowerCase().replace(/\.$/g, '') + '"',
				translation: '"' + element.find('.ill-wlv__section-b__english.ill-oita').text().toLowerCase().replace(/\.$/g, '') + '"'
			};
			list.push(data);
		});
		html.add(this).remove();
		list = list.sort(function(item, nextItem) {
			if (item.spelling > nextItem.spelling) {
			  return 1;
		  }
		  if (item.spelling < nextItem.spelling) {
		    return -1;
		  }
		  return 0;
		});
		for (var index = 0, length = list.length; index < (length - 1); index += 1) {
	    if (list[index].spelling === list[index + 1].spelling) {
	        list.splice((index + 1), 1);
	        length -= 1;
	    }
		}
		$.each(list, function(index, item) {
			csv += item.audio + ', ' + item.spelling + ', ' + item.translation + '<br>';
		});
		resultsP.html(csv);
	});

	$('#copy').on('click', function(event) {
		var range = document.createRange();
		event.preventDefault();
    range.selectNode(resultsP[0]);
    window.getSelection().addRange(range);
    document.execCommand('copy');
	});

});
