$(document).ready(function() {

	var MASCULINE = '';
	var FEMENINE = '';

	var html = $('#html');
	var resultsN = $('#resultsN');
	var resultsA = $('#resultsA');
	var resultsV = $('#resultsV');
	var resultsR = $('#resultsR');

	$('#get').on('click', function(event) {
		var listN = '';
		var listA = '';
		var listV = '';
		var listR = '';
		var languageString;
		event.preventDefault();
		languageString = $(html.val()).find('.logoLnk img').attr('src');
		if (languageString.indexOf('french') > -1) {
			MASCULINE = 'un';
			FEMENINE = 'une';
		} else if (languageString.indexOf('portuguese') > -1) {
			MASCULINE = 'um';
			FEMENINE = 'uma';
		}
		$(html.val()).find('.ill-wlv__section-d').each(function() {
			var element = $(this);
			var part = element.find('.ill-wlv__block-c .ill-wlv__section-b__part-of-speech').text();
			var list = '';
			var genderArticle = '';
			var word;
			var translation;
			if (languageString.indexOf('English') <= -1) {
				translation = element.find('.ill-wlv__block-c .ill-wlv__section-b__english').text();
			}
			if (part === '(n)') {
				var gender = element.find('.ill-wlv__block-c .ill-wlv__section-b__gender').text();
				if (gender === 'masc') {
					genderArticle = MASCULINE;
				} else if (gender === 'fem') {
					genderArticle = FEMENINE;
				}
			}
			wordElement = element.find('.ill-wlv__block-c .ill-wlv__section-b__target .ill-direction-wrapper');
			if (wordElement.size() <= 0) {
				wordElement = element.find('.ill-wlv__block-c .ill-wlv__section-b__target').find('*').remove().end();
			}
			word = wordElement.text();
			list += '<div>';
			list += '<img src="' + element.find('.ill-wlv__section-a__image').attr('data-original') + '"><br>';
			list += '<p class="image">' + element.find('.ill-wlv__section-a__image').attr('data-double') + '</p><br>';
			list += '<p class="mp3">' + element.find('.ill-onebuttonplayer').attr('data-url') + '</p><br>';
			list += ('<p class="word">' + word + '</p><br>').replace(/\s*(<\/p>)/, '$1');
			list += part === '(n)' && genderArticle !== '' ? '<p class="gender">' + genderArticle + '</p><br>' : '';
			list += translation ? '<p class="translation">' + translation + '</p><br>' : '';
			list += '</div><br><br>';
			if (part === '(n)') {
				listN += list;
			} else if (part === '(adj)') {
				listA += list;
			} else if (part === '(v)') {
				listV += list;
			} else {
				listR += list;
			}
		});
		html.add(this).remove();
		$(listN).appendTo(resultsN);
		$(listA).appendTo(resultsA);
		$(listV).appendTo(resultsV);
		$(listR).appendTo(resultsR);
	});

	$(document).on('click', 'p', function() {
		var range = document.createRange();
    range.selectNode($(this)[0]);
    window.getSelection().addRange(range);
    document.execCommand('copy');
	});

});