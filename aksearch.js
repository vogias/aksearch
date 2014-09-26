jQuery(document).ready(function () {
	
	var newJq = true;
	if(parseFloat(jQuery.fn.jquery.substring(0,jQuery.fn.jquery.lastIndexOf("."))) < 1.6)
		newJq = false;

	//Insert buttons with jQuery

	jQuery('label[for="edit-aksearch-facets"]').append('<div id="selectAllsets" class="facets"><button class="akbutton">Select all</button><button class="aktoggle">Toggle</button></div>');
	jQuery('label[for="edit-aksearch-facets-f"]').append('<div id="selectAllfacets" class="facets-f"><button class="akbutton">Select all</button><button class="aktoggle">Toggle</button></div>');
	
	//function to execute after ajax requests to set the checkboxes
	var checkAction = function(data){
		newJq ? jQuery('input:checkbox').prop('checked',false) : jQuery('input:checkbox').removeAttr('checked');
		jQuery.each(data['limit_facets']['set'], function( index, value ) {
			newJq ? jQuery('input:checkbox[value="'+value+'"]').prop('checked',true) : jQuery('input:checkbox[value="'+value+'"]').attr('checked','checked');
			});
		jQuery.each(data['facets'], function( index, value ) {
			newJq ? jQuery('input:checkbox[value="'+value+'"]').prop('checked',true) : jQuery('input:checkbox[value="'+value+'"]').attr('checked','checked');
			});
	}
		//Set current selected node checkboxes
		jQuery.ajax({
			type: 'GET', // Use the GET method.
			url: ak_conf_url,
			dataType: 'json',
			success: checkAction,
			data: { n:jQuery('select[name="ak_node_id"] option:selected').val() }
			});

		jQuery('select[name="ak_node_id"]').change(function(){
			jQuery.ajax({
			type: 'GET', // Use the GET method.
			url: ak_conf_url,
			dataType: 'json',
			success: checkAction,
			data: { n:jQuery(this).val() }
			});
		});
		
		//select buttons
		jQuery( ".akbutton" ).toggle(function() {
			newJq ? jQuery('#edit-aksearch-'+ jQuery(this).parent().attr('class') +' input:checkbox').prop('checked',true) : jQuery('#edit-aksearch-'+ jQuery(this).parent().attr('class') +' input:checkbox').attr('checked','checked');
			jQuery(this).html('Unselect all');
			}, function() {
			newJq ? jQuery('#edit-aksearch-'+ jQuery(this).parent().attr('class')  +' input:checkbox').prop('checked',false) : jQuery('#edit-aksearch-'+ jQuery(this).parent().attr('class')  +' input:checkbox').removeAttr('checked');
			jQuery(this).html('Select all');
		});
		//toggle buttons
		jQuery(".aktoggle").click(function(){
			var checkboxes = jQuery('#edit-aksearch-'+ jQuery(this).parent().attr('class') +' input:checkbox');
			checkboxes.each(function(){
				newJq ? jQuery(this).prop('checked',!jQuery(this).prop('checked')) : jQuery(this).attr('checked',!jQuery(this).attr('checked'));
			});
			return false;
		});
});
