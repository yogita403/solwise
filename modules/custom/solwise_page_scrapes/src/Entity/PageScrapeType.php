<?php

namespace Drupal\solwise_page_scrapes\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBundleBase;
use Drupal\solwise_page_scrapes\PageScrapeTypeInterface;

/**
 * Defines the Page scrape type entity.
 *
 * @ConfigEntityType(
 *   id = "page_scrape_type",
 *   label = @Translation("Page scrape type"),
 *   handlers = {
 *     "list_builder" = "Drupal\solwise_page_scrapes\PageScrapeTypeListBuilder",
 *     "form" = {
 *       "add" = "Drupal\solwise_page_scrapes\Form\PageScrapeTypeForm",
 *       "edit" = "Drupal\solwise_page_scrapes\Form\PageScrapeTypeForm",
 *       "delete" = "Drupal\solwise_page_scrapes\Form\PageScrapeTypeDeleteForm"
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\solwise_page_scrapes\PageScrapeTypeHtmlRouteProvider",
 *     },
 *   },
 *   config_prefix = "page_scrape_type",
 *   admin_permission = "administer site configuration",
 *   bundle_of = "page_scrape",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *     "uuid" = "uuid"
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/page_scrape_type/{page_scrape_type}",
 *     "add-form" = "/admin/structure/page_scrape_type/add",
 *     "edit-form" = "/admin/structure/page_scrape_type/{page_scrape_type}/edit",
 *     "delete-form" = "/admin/structure/page_scrape_type/{page_scrape_type}/delete",
 *     "collection" = "/admin/structure/page_scrape_type"
 *   }
 * )
 */
class PageScrapeType extends ConfigEntityBundleBase implements PageScrapeTypeInterface {
  /**
   * The Page scrape type ID.
   *
   * @var string
   */
  protected $id;

  /**
   * The Page scrape type label.
   *
   * @var string
   */
  protected $label;

}
