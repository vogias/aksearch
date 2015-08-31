<?php
global $base_url;
global $base_root;
global $language ;

$lang_name = $language->language ;
$root = drupal_get_path('module', 'aksearch')."/default";
$app = drupal_get_path('module', 'aksearch')."/default/app";
$assets = drupal_get_path('module', 'aksearch')."/default/assets";
$config = drupal_get_path('module', 'aksearch')."/default/config";
$css = drupal_get_path('module', 'aksearch')."/default/css";
$finder = drupal_get_path('module', 'aksearch')."/default/finder";
$lib = drupal_get_path('module', 'aksearch')."/default/lib";
$searchurl = url('node/'.variable_get('aksearch_spage'));
//identify with a meta tag if viewing aaksearch type node in order to remove canonical meta tag
$element = array(
  '#tag' => 'meta', // The #tag is the html tag 
  '#attributes' => array( // Set up an array of attributes inside the tag
    'name' => 'abstract', 
    'content' => 'aksearch',
  ),
);
drupal_add_html_head($element, 'meta_aksearch_page');
?>
<!-- search page -->
<?php
if(variable_get('ak_enable_jquery', '0'))
{
drupal_add_js('//code.jquery.com/jquery-1.11.0.min.js', 'external');
}
drupal_add_js('var drupalVariables = {"base":"'.$base_url.'","root":"'.$base_url.'/'.$root.'","nodeid":"' . $nif . '"}', 'inline');
drupal_add_css('http://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300', array('group' => CSS_THEME,'preprocess' => FALSE, 'type'=>'external'));
?>
<link rel="stylesheet/less" type="text/css" href="<?php echo $base_url.'/'.$css.'/style.less'; ?>" />
<link rel="stylesheet" type="text/css" href="<?php echo $base_url.'/'.$css.'/bootstrap.css'; ?>" />
<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,400,700&subset=latin,greek-ext,latin-ext' rel='stylesheet' type='text/css'>

<?php
drupal_add_js($lib.'/angular.min.js',array('type'=>'file','scope'=>'footer','weight'=>100));
drupal_add_js($lib.'/angular-route.min.js',array('type'=>'file','scope'=>'footer','weight'=>101));
drupal_add_js($lib.'/less-1.5.0.min.js',array('type'=>'file','scope'=>'footer','weight'=>101));
drupal_add_js($lib.'/ui-bootstrap-0.10.0.min.js',array('type'=>'file','scope'=>'footer','weight'=>102));
drupal_add_js($app.'/app.js',array('type'=>'file','scope'=>'footer','weight'=>102));
drupal_add_js($app.'/controllers/mainController.js',array('type'=>'file','scope'=>'footer','weight'=>103));
drupal_add_js($app.'/controllers/search/listingController.js',array('type'=>'file','scope'=>'footer','weight'=>104));
drupal_add_js($app.'/controllers/search/paginationController.js',array('type'=>'file','scope'=>'footer','weight'=>105));
drupal_add_js($app.'/controllers/search/facetsController.js',array('type'=>'file','scope'=>'footer','weight'=>106));
drupal_add_js($app.'/controllers/view_item/viewItemController.js',array('type'=>'file','scope'=>'footer','weight'=>107));
drupal_add_js($lib.'/angular-socialshare/angular-socialshare.js',array('type'=>'file','scope'=>'footer','weight'=>109));
//drupal_add_css($lib.'/angular-socialshare/angular-socialshare.css',array('type'=>'file','scope'=>'footer','weight'=>110));
drupal_add_css($lib.'/angular-socialshare/socialbuttons.css',array('type'=>'file','scope'=>'footer','weight'=>110));
?>
<!--<script src="http://platform.twitter.com/widgets.js"></script>-->
<!--
<script>
      document.write('<base href="' + document.location + '" />');
</script>
-->
<div class="field-type-text-with-summary">
<?php print isset($cont['und']['0']['safe_summary']) ? $cont['und']['0']['safe_summary'] : ''; ?>
<?php print isset($cont['und']['0']['safe_value']) ? $cont['und']['0']['safe_value'] : ''; ?>
</div>
 <div id="akListing" ng-app="akListing" ng-controller="mainController" ng-init="init_finder('akif','educational');"  class="col-xs-12 col-sm-12 col-md-12"  ng-cloak>
 		<!-- Language
		 <div class="languages_block">
			 <a href="javascript:;" ng-click="change_language('el')"><img src="<?php echo $assets ?>/images/flag_gr_round.png" ></a>
			 <a href="javascript:;" ng-click="change_language('en')"><img src="<?php echo $assets ?>/images/flag_en_round.png" ></a>
		 </div>
		<!-- / Language -->

			<div id="akListing" ng-init="app_init('<?php echo $lang_name ?>')" class="col-xs-12 col-sm-12 col-md-12"> <!-- class="col-xs-12 col-sm-12 col-md-12" -->
		        <div ng-view>
				</div>
			</div>

</div>
<script type="text/javascript">
// Tiny object for getting counts
var socialGetter = (function() {
	/* just a utility to do the script injection */
	function injectScript(url) {
		var script = document.createElement('script');
		script.async = true;
		script.src = url;
		document.body.appendChild(script);
	}

	return {
		getTwitterCount: function(url, callbackName) {
			injectScript('http://urls.api.twitter.com/1/urls/count.json?url=' + url.replace(/#/g,'%23') + '&callback=' + callbackName);
		}
	};
})();
// Callbacks to do something with the result
function twitterCallback(result) {
	jQuery('#twitterCount').text(result.count);
}
function tweetPopup(el) {
    var height = ((window.outerHeight) /2) - 150;
    var width = ((window.outerWidth)/2)  - 250;
    window.open('http://twitter.com/intent/tweet?text='+jQuery(el).attr('data-text')+'&url='+jQuery(el).attr('data-url').replace(/#/,'%23') + '&via=' + jQuery(el).attr('data-via'), 'twitter', 'height=300,width=500,resizable=1,scrollbars=yes,top='+ height +',left='+width);
    return false;
}
</script>