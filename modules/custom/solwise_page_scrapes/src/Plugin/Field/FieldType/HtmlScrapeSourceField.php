<?php

namespace Drupal\solwise_page_scrapes\Plugin\Field\FieldType;

use Drupal\Component\Utility\Random;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'html_scrape_source' field type.
 *
 * @FieldType(
 *   id = "html_scrape_source",
 *   label = @Translation("HTML scrapes source document"),
 *   description = @Translation("Source HTML document from which HTML scrapes are extracted"),
 *   default_widget = "html_scrape_source_w",
 *   default_formatter = "html_scrape_source_f"
 * )
 */
class HtmlScrapeSourceField extends FieldItemBase {

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['value'] = DataDefinition::create('string')
      ->setLabel(t('Source HTML document'))
      ->setRequired(true);

    $properties['created'] = DataDefinition::create('timestamp')
      ->setLabel(t('Created Time'))
      ->setDescription(t('The time that the entry was created'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $cols = [
      'value' => [
        'description' => 'The entire source document HTML',
        'type' => 'text',
        'size' => 'big',
      ],
      'created' => [
        'description' => 'A timestamp of when this entry was created.',
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
    $value = $this->get('value')->getValue();
    return empty($value);
  }

}
