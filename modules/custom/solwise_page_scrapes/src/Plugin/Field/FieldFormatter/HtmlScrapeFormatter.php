<?php

namespace Drupal\solwise_page_scrapes\Plugin\Field\FieldFormatter;

use Drupal\Core\Annotation\Translation;
use Drupal\Core\Field\Annotation\FieldFormatter;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;


/**
 * @FieldFormatter(
 *   id = "html_scrape_f",
 *   label = @Translation("Html Scrape - Formatter"),
 *   description = @Translation("HTML Scrape - Formatter"),
 *   field_types = {
 *     "html_scrape"
 *   }
 * )
 */
class HtmlScrapeFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elems = [];

    foreach($items as $delta => $item) {
      $elems[$delta] = ['html' => ['#markup' => $item->html]];
    }
    return $elems;
  }
}