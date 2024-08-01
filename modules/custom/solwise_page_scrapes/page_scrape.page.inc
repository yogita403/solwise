<?php

/**
 * @file
 * Contains page_scrape.page.inc.
 *
 * Page callback for Page scrape entities.
 */

use Drupal\Core\Render\Element;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Prepares variables for Page scrape templates.
 *
 * Default template: page_scrape.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_page_scrape(array &$variables) {
  // Fetch PageScrape Entity Object.
  $page_scrape = $variables['elements']['#page_scrape'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}

/**
* Prepares variables for a custom entity type creation list templates.
*
* Default template: page_scrape-content-add-list.html.twig.
*
* @param array $variables
*   An associative array containing:
*   - content: An array of page_scrape-types.
*
* @see block_content_add_page()
*/
function template_preprocess_page_scrape_content_add_list(&$variables) {
  $variables['types'] = array();
  $query = \Drupal::request()->query->all();
  foreach ($variables['content'] as $type) {
    $variables['types'][$type->id()] = array(
      'link' => Link::fromTextAndUrl($type->label(), new Url('entity.page_scrape.add_form', array(
        'page_scrape_type' => $type->id()
      ), array('query' => $query))),
      'description' => array(
      '#markup' => $type->label(),
      ),
      'title' => $type->label(),
      'localized_options' => array(
      'query' => $query,
      ),
    );
  }
}
