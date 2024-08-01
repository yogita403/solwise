<?php

namespace Drupal\solwise_page_scrapes\Entity;

use Drupal\views\EntityViewsData;
use Drupal\views\EntityViewsDataInterface;

/**
 * Provides Views data for Page scrape entities.
 */
class PageScrapeViewsData extends EntityViewsData implements EntityViewsDataInterface {
  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    $data['page_scrape']['table']['base'] = array(
      'field' => 'id',
      'title' => $this->t('Page scrape'),
      'help' => $this->t('The Page scrape ID.'),
    );

    return $data;
  }

}
