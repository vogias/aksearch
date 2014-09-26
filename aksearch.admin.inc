<?php
/**
* @file
* Administration page callbacks for the aksearch module.
*/
/**
* Form builder. Configure aksearch.
*
* @ingroup forms
* @see system_settings_form().
*/
function aksearch_admin_settings() {
	global $base_url;
	$s = $base_url . '/' . drupal_get_path('module', 'aksearch') .'/default/config/';
//drupal_add_js('//code.jquery.com/jquery-1.11.0.min.js', 'external');
drupal_add_js('var ak_conf_url = "'. $s .'";', 'inline');
drupal_add_js(drupal_get_path('module', 'aksearch') .'/aksearch.js');
drupal_add_css(drupal_get_path('module', 'aksearch') .'/aksearch.css');

//Getting aksearch type node ids
$sql = 'SELECT nid FROM {node} n WHERE n.type = :type';
$result = db_query($sql, array(':type' => 'aksearch'));
//array to hold the nids
$nids = array();
foreach ($result as $row) {
	$nids[$row->nid] = $row->nid;
	}
	
reset($nids);

$facets_url = 'http://api.greenlearningnetwork.com/search-api/v1/akif/?q=*&facets=set&facet_size=100';
$result = drupal_http_request($facets_url);
//human and nachine names json file
$mappings = drupal_get_path('module','aksearch').'/default/config/facets_mappings.json';
$mappingsJson = file_get_contents($mappings);
//decode json file and get the 'set' element
$mappingsData = drupal_json_decode($mappingsJson);
$mappingsData = $mappingsData['set'];
//create mapings array with machine name as key and human name as value
$mapArr = array();
foreach ($mappingsData as $value) {
	$mapArr[$value['machine']] = $value['human'] ;
}

//get the facet terms from decoded json
$terms = drupal_json_decode($result->data);
$terms = $terms['facets']['set']['terms'];
//if there is human name, save human name as value instead of machine name
foreach ($terms as $term) {
	if(array_key_exists($term['term'], $mapArr))
	$options[$term['term']] = $mapArr[$term['term']] . '(' . $term['count'] . ')';
	else
	$options[$term['term']] = $term['term']. '(' . $term['count'] . ')';
}
$form['ak_enable_jquery'] = array(
		'#type' => 'select',
		'#title' => t('Include jQuery in search pages'),
		'#options' => array('0' => 'No' , '1' => 'Yes' ),
		'#default_value' => variable_get('ak_enable_jquery', '0'),
		'#description' => t('If already using jQuery version >= 1.7 set this option to "No"'),
);

//building the admin form from previous created arrays nids[],options[]
$form['ak_node_id'] = array(
		'#type' => 'select',
		'#title' => t('Select the node for which you want to configure'),
		'#options' => $nids,
		'#default_value' => variable_get('ak_node_id', key($nids)),
		'#description' => t('Select the node id to save the configuration.'),
);

$form['aksearch_facets'] = array(
'#type' => 'checkboxes',
'#title' => t('Users may search using these facets collections'),
'#options' => $options,
'#default_value' => variable_get('aksearch_facets', array('aglrgfsp')),
'#description' => t('Please select the desired facets collections'),
);
//hardcoded values as options(no json config file)
$form['aksearch_facets_f'] = array(
		'#type' => 'checkboxes',
		'#title' => t('Users may search using these facets'),
		'#options' => array('set' => 'set', 'language' => 'language' , 'contexts' => 'contexts' , 'learningResourceTypes' => 'learningResourceTypes' , 'endUserRoles' => 'endUserRoles' ),
		'#default_value' => variable_get('aksearch_facets_f', array('language')),
		'#description' => t('Please select the desired facets'),
);

$form['#submit'][] = 'aksearch_admin_settings_submit';
return system_settings_form($form);
}

function aksearch_admin_settings_submit($form, $form_state) {
	$enabled = array();
	$enabled2 = array();
// Loop through each of the checkboxes shown on the form.
foreach ($form_state['values']['aksearch_facets'] as $key => $value) {
		if($value){
			$enabled[] = $key;
		}
	} // End foreach loop.
foreach ($form_state['values']['aksearch_facets_f'] as $key => $value) {
		if($value){
			$enabled2[] = $key;
		}
	} // End foreach loop.

	$conf = drupal_get_path('module', 'aksearch').'/default/config/conf.json';
	//getting original conf file and set the new data.. but instead of writing back to disk save configuration in database for a node - config relationship
	$jsonString = file_get_contents($conf);
	$data = json_decode($jsonString);

	$data->facets = $enabled2;
	$data->limit_facets->set = $enabled;
	//save data as json
	$newData = drupal_json_encode($data);

	$num_updated = db_update('aksearch_conf')
	->fields(array(
			'conf' => $newData,
	))
	->condition('nid', $form_state['values']['ak_node_id'], '=')
	->execute();
	
}