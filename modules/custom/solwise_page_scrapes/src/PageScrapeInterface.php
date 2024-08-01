<?php

namespace Drupal\solwise_page_scrapes;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Page scrape entities.
 *
 * @ingroup solwise_page_scrapes
 */
interface PageScrapeInterface extends ContentEntityInterface, EntityChangedInterface, EntityOwnerInterface {
  // Add get/set methods for your configuration properties here.
  /**
   * Gets the Page scrape type.
   *
   * @return string
   *   The Page scrape type.
   */
  public function getType();

  /**
   * Gets the Page scrape title.
   *
   * @return string
   *   Title of the Page scrape.
   */
  public function getTitle();

  /**
   * Sets the Page scrape title.
   *
   * @param string $title
   *   The Page scrape title.
   *
   * @return \Drupal\solwise_page_scrapes\PageScrapeInterface
   *   The called Page scrape entity.
   */
  public function setTitle($title);

  /**
   * Gets the Page scrape creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Page scrape.
   */
  public function getCreatedTime();

  /**
   * Sets the Page scrape creation timestamp.
   *
   * @param int $timestamp
   *   The Page scrape creation timestamp.
   *
   * @return \Drupal\solwise_page_scrapes\PageScrapeInterface
   *   The called Page scrape entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Returns the Page scrape published status indicator.
   *
   * Unpublished Page scrape are only visible to restricted users.
   *
   * @return bool
   *   TRUE if the Page scrape is published.
   */
  public function isPublished();

  /**
   * Sets the published status of a Page scrape.
   *
   * @param bool $published
   *   TRUE to set this Page scrape to published, FALSE to set it to unpublished.
   *
   * @return \Drupal\solwise_page_scrapes\PageScrapeInterface
   *   The called Page scrape entity.
   */
  public function setPublished($published);

}
