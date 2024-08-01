<?php

namespace Drupal\solwise_page_scrapes\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'html_scrape_source_w' widget.
 *
 * @FieldWidget(
 *   id = "html_scrape_source_w",
 *   label = @Translation("HTML scrapes source - Widget"),
 *   field_types = {
 *     "html_scrape_source"
 *   },
 *   multiple_values = false,
 * )
 */
class HtmlScrapeSourceWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = [];

    $element['value'] = $element + array(
      '#type' => 'textarea',
      '#default_value' => isset($items[$delta]->value) ? $items[$delta]->value : NULL,
      '#rows' => 8,
      '#title' => t('HTML scrape source'),
      '#placeholder' => 'The whole HTML document of the original page',
    );

    return $element;
  }

}
