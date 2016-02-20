$(document).ready(function() {

	var html = $('#html');
	var resultsP = $('#resultsP');

	$('#get').on('click', function(event) {
		var languageString;
		event.preventDefault();
		languageString = $(html.val()).find('.ill-kyoto').text();
		var listP = '';
		$(html.val()).find('.ill-wlv__block-d, .ill-wlv__block-i').each(function() {
			var element = $(this);
			listP += '<div>';
			listP += '<p>' + element.find('.ill-onebuttonplayer').attr('data-url') + '</p><br>';
			listP += '<p>' + element.find('.ill-wlv__section-b__target').text().toLowerCase() + '</p><br>';
			listP += (languageString.indexOf('English') <= -1) ? '<p>' + element.find('.ill-wlv__section-b__english.ill-oita').text().toLowerCase() + '</p><br>' : '';
			listP += '</div><br><br>';
		});
		html.add(this).remove();
		$(listP).appendTo(resultsP);
	});

	$(document).on('click', 'p', function() {
		var range = document.createRange();
    range.selectNode($(this)[0]);
    window.getSelection().addRange(range);
    document.execCommand('copy');
	});

});