<?php

namespace Drupal\solwise_page_scrapes\Plugin\Field\FieldType;

use Drupal\Core\Annotation\Translation;
use Drupal\Core\Field\Annotation\FieldType;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\TypedData\DataDefinition;


/**
 * Class HtmlScrapeField
 * @package Drupal\solwise_page_scrapes\Plugin\Field\FieldType
 *
 * @FieldType(
 *   id = "html_scrape",
 *   label = @Translation("HTML Scrape"),
 *   description = @Translation("This field stores raw HTML scraped from an existing web page."),
 *   default_widget = "html_scrape_w",
 *   default_formatter = "html_scrape_f",
 * )
 */
class HtmlScrapeField extends FieldItemBase {

  const FORMAT_WYSIWYG = 0;
  const FORMAT_RAW = 1;

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $fieldDefinition) {
    $props['html'] = DataDefinition::create('string')
      ->setLabel(t('Raw HTML'))
      ->setRequired(true);

    $props['created'] = DataDefinition::create('timestamp')
      ->setLabel(t('Created Time'))
      ->setDescription(t('The time that the entry was created'));

    return $props;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $fieldDefinition) {
    $cols = [
      'html' => [
        'description' => 'The raw HTML of the page scrape.',
        'type' => 'text',
        'size' => 'big',
      ],
      'created' => [
        'description' => 'A timestamp of when this entry has been created.',
        'type' => 'int',
      ],
    ];

    $schema = [
      'columns' => $cols,
      'indexes' => [],
      'foreign keys' => [],
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $html = $this->get('html')->getValue();
    return empty($html);
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultStorageSettings() {
    return [
      'format' => self::FORMAT_WYSIWYG,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function storageSettingsForm(array &$form, FormStateInterface $form_state, $has_data) {
    $elements = [];

    $elements['format'] = [
      '#title'         => t('Field editor format'),
      '#type'          => 'radios',
      '#default_value' => $this->getSetting('format'),
      '#options' => [self::FORMAT_WYSIWYG => t('WYSIWYG editor'), self::FORMAT_RAW => 'Raw'],
      '#description'   => t('Which HTML field editor is appropriate? Use Raw if scrape is of non-display elements (e.g., script and title elems)'),
      '#required'      => TRUE,
    ];

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultFieldSettings() {
    return [
      'start_marker' => '<!-- InstanceBeginEditable name="" -->',
      'end_marker' => '<!-- InstanceEndEditable -->',
      'rows' => 8
    ] + parent::defaultFieldSettings();
  }

  public function fieldSettingsForm(array $form, FormStateInterface $form_state) {
    $elements = [];

    $elements['start_marker'] = [
      '#title'         => t('Start marker'),
      '#type'          => 'textfield',
      '#default_value' => $this->getSetting('start_marker'),
      '#description'   => t('The HTML string that denotes the beginning of the scrape section in the HTML document.'),
      '#required'      => TRUE,
    ];
    $elements['end_marker'] = [
      '#title'         => t('End marker'),
      '#type'          => 'textfield',
      '#default_value' => $this->getSetting('end_marker'),
      '#description'   => t('The HTML string that denotes the end of the scrape section in the HTML document.'),
      '#required'      => TRUE,
    ];
    $elements['rows'] = [
      '#title'         => t('Rows'),
      '#type'          => 'number',
      '#default_value' => $this->getSetting('rows'),
      '#required'      => TRUE,
      '#min'           => 1,
    ];

    return $elements;
  }
}