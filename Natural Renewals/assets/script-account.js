
// Show inputs when clicking edit buttons
$('.account-main-header').on('click', '.account-main-row:not(.row-edit-active) .account-main-col-right button', function() {
	var getInputDiv = $(this).attr('data-id');
	var getInputDivId = getInputDiv.replace('#','');
	if ($(getInputDiv).length != 0) {
		$('#CDE_edit_' + getInputDivId).click();

		$(this).parent().parent().addClass('row-edit-active');
		$(this).text('save');
	}
});

// Database query on click save button
$('.account-main-header').on('click', '.row-edit-active .account-main-col-right button', function() {

	var getInputDiv = $(this).attr('data-id');
	var getInputDivId = getInputDiv.replace('#','');

	$('#CDE_save_' + getInputDivId).click();

	$(this).parent().parent().removeClass('row-edit-active');
	$(this).text('edit');

});