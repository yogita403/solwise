<?php

/**
 * @file
 * Contains Drupal\solwise_import\Form\ImportForm.
 */

namespace Drupal\solwise_import\Form;


use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;


/**
 * Implements the ImportForm form controller.
 *
 * This example demonstrates a simple form with a singe text input element. We
 * extend FormBase which is the simplest form base class used in Drupal.
 *
 * @see \Drupal\Core\Form\FormBase
 */
class ImportForm extends FormBase {
	/**
	 * fields of the content type
	 * @var $fields
	 */
	public $default_fields;
	
	public $fields;
	/**
	 * HTMLComment end 
	 * @var $comment_end
	 */
	public $comment_end;
	
	/**
	 * fields format as full_html
	 * @var fullHTML
	 */
	public $fullHTML;
	
	/**
	 * 
	 * @var Solwise_url
	 */
	public $solwise_url;

	function __construct() {
		$this->solwise_url = 'https://www.solwise.co.uk/';
		//set default fields
		$this->default_fields = array(
		'field_scrape_accessories' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="accessories" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_content' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="content" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_documents' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="documents" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_downloads' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="downloads" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_head' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="head" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_imageviewer' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="imageViewer" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_keyaccessories' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="keyAccessories" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_menumember' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="menuMember" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_overview' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="overview" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_pageconfig' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="pageConfig" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_reviews' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="reviews" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_specifications' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="specifications" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_title' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="title" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'field_scrape_videos' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="videos" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'parent_page_name' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="menuMember" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'title' => array(
				'start_marker' => '<!-- InstanceBeginEditable name="title" -->',
				'end_marker' => '<!-- InstanceEndEditable -->'),
		'doctitle' => array(
			  'start_marker' => '<!-- InstanceBeginEditable name="doctitle" -->',
			  'end_marker' => '<!-- InstanceEndEditable -->'),
		);
		
		
		$this->comment_end = '<!-- InstanceEndEditable -->';
		
		$this->fullHTML = array(
				'field_scrape_content',
				'field_scrape_documents',
				'field_scrape_downloads',
				'field_scrape_imageviewer',
				'field_scrape_overview',
				'field_scrape_reviews',
				'field_scrape_specifications',
				'field_scrape_videos'
		);
	}
  /**
   * Build the simple form.
   *
   * A build form method constructs an array that defines how markup and
   * other form elements are included in an HTML form.
   *
   * @param array $form
   *   Default form array structure.
   * @param FormStateInterface $form_state
   *   Object containing current form state.
   *
   * @return array
   *   The render array defining the elements of the form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
  	$options = array();
  	//get all node types
  	$type_options = \Drupal::entityTypeManager()->getStorage('node_type')->loadMultiple();
  	
  	foreach ($type_options as $type => $type_entity) {
  		$options[$type_entity->get('type')] = $type_entity->get('name');
  	}
  	$form['type'] = array(
  		'#type' => 'select',
  			'#options' => $options,
  			'#title' => 'Content Type',
  			'#required' => true,
  	);
  	$form['dir_path'] = [
	  	'#type' => 'textfield',
	  	'#title' => $this->t('Absolute path'),
	  	'#attributes' => array('placeholder' => 'Ex. /var/www/html/solwise-HTML'),
	  	'#description' => $this->t('An absolute path to the directory, containing HTML files. (Ex. /var/www/html/solwise-HTML)'),
  	];

    $form['url'] = [
      '#type' => 'url',
      '#title' => $this->t('Url'),
      '#description' => $this->t('URL must be start with http://, https://'),
    ];
    $form['file'] = [
	    '#type' => 'file',
	    '#title' => $this->t('File'),
    ];
    
    $form['actions'] = [
      '#type' => 'actions',
    ];

    // Add a submit button that handles the submission of the form.
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return $form;
  }

  /**
   * Getter method for Form ID.
   *
   * The form ID is used in implementations of hook_form_alter() to allow other
   * modules to alter the render array built by this form controller.  it must
   * be unique site wide. It normally starts with the providing module's name.
   *
   * @return string
   *   The unique ID of the form defined by this class.
   */
  public function getFormId() {
    return 'solwise_import_import_form';
  }

  /**
   * Implements form validation.
   *
   * The validateForm method is the default method called to validate input on
   * a form.
   *
   * @param array $form
   *   The render array of the currently built form.
   * @param FormStateInterface $form_state
   *   Object describing the current state of the form.
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
  	$type = $form_state->getValue('type');
    $url = $form_state->getValue('url');
    $file = $form_state->getValues('file');
    $dir_path = $form_state->getValue('dir_path');
    if($type == '') {
    		// Set an error for the form element with a key of "title".
    		$form_state->setErrorByName('type', $this->t('The Content Type required field.'));
    	
    }
    if($url != '') {
	    if (strpos($url, 'solwise.co.uk') === false) {
	      // Set an error for the form element with a key of "title".
	      $form_state->setErrorByName('url', $this->t('The URL must be of solwise.co.uk.'));
	    }
    }
    if($dir_path != '') {
    	if(substr($dir_path, 0,1) != '/') {
    		$form_state->setErrorByName('dir_path', $this->t('The Absolute path must be start with "/".'));
    	}
    }
  }

  /**
   * Implements a form submit handler.
   *
   * The submitForm method is the default method called for any submit elements.
   *
   * @param array $form
   *   The render array of the currently built form.
   * @param FormStateInterface $form_state
   *   Object describing the current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  	$type = $form_state->getValue('type');
  	$this->_set_fields($type);
  	
  	$dir_path = $form_state->getValue('dir_path');
  	$counter = 0;
  	if($dir_path == '') {
  		$validators = ['file_validate_extensions' => ['htm html']];
  		if ($file = file_save_upload('file', $validators, FALSE, 0)) {
  			$url = $file->getFilename();
  			$content = file_get_contents($file->getFileUri());
  		} else {
  			$url = $form_state->getValue('url');
  			$content = $this->getUrlContents($url);
  		}
	  	$file = basename($url);
	  	$old_url = "{$this->solwise_url}{$file}";
	  	$data = $this->checkDuplicate($old_url, $type);
	  	
	  	if(empty($data)) {
	  		$nid = $this->saveHTMLtoProduct($content, $file, $type);
	  		$counter++;
	  		// Redirect to the node edit page
	  		$options = [];
	  		$url = Url::fromRoute('entity.node.edit_form', ['node' => $nid], $options);
	  		$form_state->setRedirectUrl($url);
	  	}	  	
  	}
  	else {
  		$files = array();
  		if ($handle = opendir($dir_path)) {// opendir('/var/www/html/solwise-HTML'))
  			while (false !== ($entry = readdir($handle))) {
  				if ($entry != "." && $entry != ".." && strpos($entry, '.htm') !== false) {//filter only .html or .htm types of file from selected dir
  					$files[] = $entry;
  				}
  			}
  			closedir($handle);
  		}
  		
  		foreach ($files as $key => $file) {
  			$old_url = $this->solwise_url . $file;
  			$data = $this->checkDuplicate($old_url, $type);
  		
  			if(empty($data)) {
  				//break for testing
  				//if ($key > 5) break;  				
  				$url = $old_url;
  				$content = file_get_contents($dir_path . '/' . $file);//$this->getUrlContents($url);
  				$this->saveHTMLtoProduct($content, $file, $type);
 					$counter++;
  			}
  		}
  	}
  	drupal_set_message(t('%total record(s) imported successully.', ['%total' => $counter]));
  }
  
  /**
   * 
   * @param unknown $content
   * @param unknown $file
   */
  function saveHTMLtoProduct($content, $file, $type) {
  	$field_content = array();
  	
  	foreach ($this->fields as $field => $comment) {
  		$comment_content = $this->getContentBetweenHTMLComment($content, $comment['start_marker'], $comment['end_marker']);
  		$arr__script_content = $this->getContentBetweenSCRIPT($comment_content);
  		$i = 0;
  		if (!empty($arr__script_content) && isset($arr__script_content[1])) {
  			foreach ($arr__script_content[0] as $org_script) {
  				$replace_script_content = $arr__script_content[1][$i];
  				//remove JS comments
  				$replace_script_content = $this->removeJSComments($replace_script_content);
  				$comment_content = str_replace($org_script, '[start_script]' . $replace_script_content. '[end_script]', $comment_content);
  				$i++;
  			}
  		}
  		// set field value
  		$field_content[$field] = $comment_content;
  	}
  	//$this->_pre($field_content, 1);exit;
  	$field_content['field_old_html_source'] = $content;  	 
  	$field_content['field_old_url'] = $this->solwise_url . $file;
  	$field_content['user_id'] = 1;
  	$field_content['status'] = true;
  	$field_content['type'] = $type;
  	
  	//get title tag ane remove title tag from string
  	$comment_content = $this->getContentBetweenHTMLComment($content, $this->default_fields['title']['start_marker'], $this->default_fields['title']['end_marker']);
  	$field_content['title'] = strip_tags($comment_content);
  	if (empty($field_content['title'])) {
  		$comment_content = $this->getContentBetweenHTMLComment($content, $this->default_fields['doctitle']['start_marker'], $this->default_fields['doctitle']['end_marker']);
  		$field_content['title'] = strip_tags($comment_content);
  	}
  
  	$values = $field_content;
  	
  	$entity_type = 'node';
  	$entity = \Drupal::entityManager()
  	->getStorage($entity_type)
  	->create($values);
  	
  	$entity->save();
  	return $entity->id();
  }
  
  /**
   * 
   * @param unknown $old_url
   * @return \Drupal\Core\Database\An
   */
  function checkDuplicate($old_url, $type) {
  	$sel_query = db_select('node__field_old_url', 'ps');
  	$sel_query->fields('ps', array('entity_id'));
  	$sel_query->condition('ps.bundle', $type);
  	$sel_query->condition('ps.field_old_url_uri', $old_url);
  	return $sel_query->execute()->fetchAssoc();
  }
  /**
   * getUrlContents
   * @param unknown $url
   * @param string $maximumRedirections
   * @param number $currentRedirection
   * @return unknown
   */
  function getUrlContents($url, $maximumRedirections = null, $currentRedirection = 0) {
  	$result = false;
  	$contents = @file_get_contents($url);
  
  	// Check if we need to go somewhere else
  	if (isset($contents) && is_string($contents)) {
  		preg_match_all('/<[\s]*meta[\s]*http-equiv="?REFRESH"?' . '[\s]*content="?[0-9]*;[\s]*URL[\s]*=[\s]*([^>"]*)"?' . '[\s]*[\/]?[\s]*>/si', $contents, $match);
  		if (isset($match) && is_array($match) && count($match) == 2 && count($match[1]) == 1) {
  			if (!isset($maximumRedirections) || $currentRedirection < $maximumRedirections) {
  				return getUrlContents($match[1][0], $maximumRedirections, ++$currentRedirection);
  			}
  			$result = false;
  		}
  		else {
  			$result = $contents;
  		}
  	}
  
  	return $contents;
  }
  
  /**
   * getContentBetweenHTMLComment
   * @param str $content
   * @param srt $start_comment
   * @param str $end_comment
   * @return string between two html comments 
   */
  function getContentBetweenHTMLComment($content, $start_comment, $end_comment) {
  	//preg_match('/<!-- InstanceBeginEditable name="familyDescription" -->(.*?)<!-- InstanceEndEditable -->/is', $content, $matches);
  	preg_match('/'. $start_comment .'(.*?)'. $end_comment .'/is', $content, $matches);
  	//dpm($matches);
  	if (!empty($matches) && !empty($matches[1])) 
  		return $matches[1];
  	else 
  		return '';
  }
  
  /**
   * getContentBetweenSCRIPT
   * @param str $content
   * @return string/mixed between script tags
   */
  function getContentBetweenSCRIPT($content) {
  	preg_match_all('#<script[^>]*>(.*?)</script>#is', $content, $matches);
  	if (!empty($matches) && !empty($matches[1]))
  		return $matches;
  	else
  		return '';
  }
  
  /**
   * 
   * @param unknown $content
   * @return mixed
   */
  function removeJSComments($content) {
  	$pattern = '/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/';
  	$output = preg_replace($pattern, '', $content);
  	return $output;
  }
  
  /**
   * _get_page_scrape_fields_marker
   */
  function _set_fields($type = '') {
  	$bundle_fields = \Drupal::getContainer()->get('entity_field.manager')->getFieldDefinitions('node', $type);
  	
  	$field_settings = array();
  	foreach ($bundle_fields as $field_name => $field_definition) {
  		//dpm($field_name);
  		//*
  		if (strpos($field_name, 'field_') !== false) {
	  		if ($field_definition->get('field_type') == 'html_scrape') {
	  		 $field_settings[$field_name] = $field_definition->get('settings');
	  		}
  		}//*/
  	}
  	$this->fields = !empty($field_settings) ? $field_settings : $this->default_fields;
  }
  
  /**
   * _pre() a debug function just for development purpose
   */
  function _pre($ar, $exit = false) {
  	echo '<pre>';
  	print_r($ar);
  	echo '</pre>';
  	if($exit)
  		die;
  }
}