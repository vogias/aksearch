<?php
$n = (int)$_GET['n'];
$droot = substr(getcwd() , 0 , strpos(getcwd() , '/sites' ));
define('DRUPAL_ROOT', $droot);
require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_DATABASE);

$results = db_query('SELECT conf FROM {aksearch_conf} WHERE nid = :nid', array(':nid' => $n));
foreach ($results as $result){
	echo $result->conf ;
}
