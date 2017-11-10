$(function () {
	// yes i know this is far from ideal but it's just a prototype!
	// we can webpack ourselves silly later on

	$('[data-btnrole="addrow"]').on('click', function (e) {
		e.preventDefault();
		console.log('yeah');
		var t = $(this).parents('form').find('[data-template-addrow]').last();
		if (!t) return;
		var $newLine = $(t).clone();
		$('input', $newLine).val('');
		$('.input-group-addon', $newLine).text(Number($('.input-group-addon', $newLine).text())+1);
		$newLine.insertAfter(t);
		// to do - add 'remove' button
	});

});
