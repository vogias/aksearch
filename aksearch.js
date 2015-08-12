jQuery(document).ready(function () {
	
	/*
        check if jQuery is older than 1.6
    */
	var newJq = true;
        var version = jQuery.fn.jquery;
        version = version.substring(0,version.lastIndexOf("."));
        version = version.split('.');
	if(parseInt(version[0],10) <= 1) {
            if(parseInt(version[1],10) <= 6)
                newJq = false;
    }
    console.log(newJq);
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
        var selectednode = jQuery('select[name="ak_node_id"] option:selected').val();
		jQuery.ajax({
			type: 'GET', // Use the GET method.
			url: Drupal.settings.basePath + 'akconf/' + selectednode,
			dataType: 'json',
			success: checkAction
                    });

		jQuery('select[name="ak_node_id"]').change(function(){
			jQuery.ajax({
			type: 'GET', // Use the GET method.
			url: Drupal.settings.basePath + 'akconf/' + jQuery(this).val() ,
			dataType: 'json',
			success: checkAction
			});
		});
		
		//select buttons
		jQuery( ".akbutton" ).click(function() {
                    
	        var $this = jQuery(this);
	        $this.toggleClass('active');
	        if($this.hasClass('active')) {
			newJq ? $this.closest('.form-item').find('input:checkbox').prop('checked',true) : $this.closest('.form-item').find('input:checkbox').attr('checked','checked');
			$this.html('Unselect all');
	        } else {
	        newJq ? $this.closest('.form-item').find('input:checkbox').prop('checked',false) : $this.closest('.form-item').find('input:checkbox').removeAttr('checked');
			$this.html('Select all');  
	        }
	        return false;
			
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
