<?php

namespace Drupal\solwise_page_scrapes\Plugin\Field\FieldWidget;

use Drupal\Core\Annotation\Translation;
use Drupal\Core\Field\Annotation\FieldWidget;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\solwise_page_scrapes\Plugin\Field\FieldType\HtmlScrapeField;

/**
 * Class HtmlScrapeWidget
 * @package Drupal\solwise_page_scrapes\Plugin\Field\FieldWidget
 *
 * @FieldWidget(
 *   id = "html_scrape_w",
 *   label = @Translation("HTML Scrape - Widget"),
 *   description = @Translation("HTML Scrape - Widget"),
 *   field_types = {
 *     "html_scrape",
 *   },
 *   multiple_values = false,
 * )
 */
class HtmlScrapeWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    if($this->getFieldSetting('format') == HtmlScrapeField::FORMAT_RAW) {
      $element['html'] = $element + [
          '#type' => 'textarea',
          '#default_value' => $items[$delta]->html ?: '',
          '#title' => t('HTML scrape'),
          '#rows' => $this->getFieldSetting('rows'),
        ];
    } else {
      $element['html'] = $element + [
          '#type' => 'text_format',
          '#base_type' => 'textarea',
          '#format' => 'full_html',
          '#allowed_formats' => ['full_html'],
          '#default_value' => $items[$delta]->html ?: '',
          '#title' => t('HTML scrape'),
          '#rows' => $this->getFieldSetting('rows'),
          '#attributes' => ['class' => ['js-text-full', 'text-full']],
        ];
    }

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    // Convert HTML formatted text array to string primitive for validation
    return array_map(function($e) {
      $e['html'] = isset($e['html']['value']) ? $e['html']['value'] : $e['html'];
      return $e;
    }, $values);
  }
}