<?php

namespace Drupal\solwise_page_scrapes\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'html_scrape_source_f' formatter.
 *
 * @FieldFormatter(
 *   id = "html_scrape_source_f",
 *   label = @Translation("HTML scrapes source - Formatter"),
 *   field_types = {
 *     "html_scrape_source"
 *   }
 * )
 */
class HtmlScrapeSourceFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach($items as $delta => $item) {
      $elements[$delta] = ['value' => ['#markup' => $item->value]];
    }

    /*foreach ($items as $delta => $item) {
      $elements[$delta] = ['#markup' => $this->viewValue($item)];
    }*/

    return $elements;
  }

  /**
   * Generate the output appropriate for one field item.
   *
   * @param \Drupal\Core\Field\FieldItemInterface $item
   *   One field item.
   *
   * @return string
   *   The textual output generated.
   */
  protected function viewValue(FieldItemInterface $item) {
    // The text value has no text format assigned to it, so the user input
    // should equal the output, including newlines.
    return nl2br(Html::escape($item->value));
  }

}
