<?php

namespace Drupal\solwise_page_scrapes;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * Defines a class to build a listing of Page scrape entities.
 *
 * @ingroup solwise_page_scrapes
 */
class PageScrapeListBuilder extends EntityListBuilder {
  // use LinkGeneratorTrait;
  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Page scrape ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var $entity \Drupal\solwise_page_scrapes\Entity\PageScrape */
    $row['id'] = $entity->id();
    $row['name'] = Link::fromTextAndUrl(
      $entity->label(),
      new Url(
        'entity.page_scrape.edit_form', array(
          'page_scrape' => $entity->id(),
        )
      )
    );
    return $row + parent::buildRow($entity);
  }

}
