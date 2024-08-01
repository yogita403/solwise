<?php

namespace Drupal\solwise_page_scrapes\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\solwise_page_scrapes\PageScrapeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Page scrape entity.
 *
 * @ingroup solwise_page_scrapes
 *
 * @ContentEntityType(
 *   id = "page_scrape",
 *   label = @Translation("Page scrape"),
 *   bundle_label = @Translation("Page scrape type"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\solwise_page_scrapes\PageScrapeListBuilder",
 *     "views_data" = "Drupal\solwise_page_scrapes\Entity\PageScrapeViewsData",
 *
 *     "form" = {
 *       "default" = "Drupal\solwise_page_scrapes\Form\PageScrapeForm",
 *       "add" = "Drupal\solwise_page_scrapes\Form\PageScrapeForm",
 *       "edit" = "Drupal\solwise_page_scrapes\Form\PageScrapeForm",
 *       "delete" = "Drupal\solwise_page_scrapes\Form\PageScrapeDeleteForm",
 *     },
 *     "access" = "Drupal\solwise_page_scrapes\PageScrapeAccessControlHandler",
 *     "route_provider" = {
 *       "html" = "Drupal\solwise_page_scrapes\PageScrapeHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "page_scrape",
 *   admin_permission = "administer page scrape entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "bundle" = "type",
 *     "label" = "title",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "status" = "publish_status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/page_scrape/{page_scrape}",
 *     "add-form" = "/admin/structure/page_scrape/add/{page_scrape_type}",
 *     "edit-form" = "/admin/structure/page_scrape/{page_scrape}/edit",
 *     "delete-form" = "/admin/structure/page_scrape/{page_scrape}/delete",
 *     "collection" = "/admin/structure/page_scrape",
 *   },
 *   bundle_entity_type = "page_scrape_type",
 *   field_ui_base_route = "entity.page_scrape_type.edit_form"
 * )
 */
class PageScrape extends ContentEntityBase implements PageScrapeInterface {
  use EntityChangedTrait;
  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values) {
    parent::preCreate($storage_controller, $values);
    $values += array(
      'user_id' => \Drupal::currentUser()->id(),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getType() {
    return $this->bundle();
  }

  /**
   * {@inheritdoc}
   */
  public function getTitle() {
    return $this->get('title')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setTitle($title) {
    $this->set('title', $title);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime() {
    return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp) {
    $this->set('created', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    $this->set('user_id', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function isPublished() {
    return (bool) $this->getEntityKey('publish_status');
  }

  /**
   * {@inheritdoc}
   */
  public function setPublished($published) {
    $this->set('publish_status', $published ? NODE_PUBLISHED : NODE_NOT_PUBLISHED);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields['id'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('ID'))
      ->setDescription(t('The ID of the Page scrape entity.'))
      ->setReadOnly(TRUE);
    $fields['type'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Type'))
      ->setDescription(t('The Page scrape type/bundle.'))
      ->setSetting('target_type', 'page_scrape_type')
      ->setRequired(TRUE);
    $fields['uuid'] = BaseFieldDefinition::create('uuid')
      ->setLabel(t('UUID'))
      ->setDescription(t('The UUID of the Page scrape entity.'))
      ->setReadOnly(TRUE);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the Page scrape entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setDefaultValueCallback('Drupal\node\Entity\Node::getCurrentUserId')
      ->setTranslatable(TRUE)
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'entity_reference_autocomplete',
        'weight' => 5,
        'settings' => array(
          'match_operator' => 'CONTAINS',
          'size' => '60',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ),
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    // Content fields

    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Title'))
      ->setDescription(t('The title of the Page scrape entity.'))
      ->setSettings(array(
        'max_length' => 255,
        'text_processing' => 0,
      ))
      ->setRequired(true)
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'string',
        'weight' => -4,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'string_textfield',
        'weight' => -4,
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['html_source'] = BaseFieldDefinition::create('html_scrape_source')
      ->setLabel(t('Original page source'))
      ->setDescription(t('The HTML of the original page'))
      ->setDisplayOptions('form', [
        'type' => 'html_scrape_source_w',
        'weight' => -3,
      ])
      ->setDisplayConfigurable('form', true);

    $fields['old_page_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Original page name'))
      ->setDescription(t('The filename of the original page'))
      ->setSettings([
        'max_length' => 255,
        'text_processing' => 0,
      ])
      ->setRequired(true)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'string',
        'weight' => -1,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -1,
      ])
      ->setDisplayConfigurable('form', true)
      ->setDisplayConfigurable('view', false);

    $fields['old_url'] = BaseFieldDefinition::create('uri')
      ->setLabel(t('Original page URL'))
      ->setDescription(t('The URL of the original page'))
      ->setRequired(true)
      ->setDisplayOptions('form', [
        'weight' => -1,
      ])
      ->setDisplayConfigurable('form', true);

    $fields['associated_stockcode'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Associated stock code'))
      ->setDescription(t('The code of the stock item this page is associated with (if applicable)'))
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -1,
      ])
      ->setDisplayConfigurable('form', true);

    $fields['parent_page_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Page belongs to'))
      ->setDescription(t('The page name of the page that this page belongs to (optional)'))
      ->setSettings([
        'max_length' => 255,
        'text_processing' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -1,
      ])
      ->setDisplayConfigurable('form', true);



    // todo: section_head : HTML

    // todo: section_flash_banner : HTML


    // Meta fields

    $fields['publish_status'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Publishing status'))
      ->setDescription(t('A boolean indicating whether the Page scrape is published.'))
      ->setDefaultValue(TRUE);

    $fields['langcode'] = BaseFieldDefinition::create('language')
      ->setLabel(t('Language code'))
      ->setDescription(t('The language code for the Page scrape entity.'))
      ->setDisplayOptions('form', array(
        'type' => 'language_select',
        'weight' => 10,
      ))
      ->setDisplayConfigurable('form', TRUE);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    return $fields;
  }

}
