<?php

namespace Drupal\solwise_page_scrapes;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Page scrape entity.
 *
 * @see \Drupal\solwise_page_scrapes\Entity\PageScrape.
 */
class PageScrapeAccessControlHandler extends EntityAccessControlHandler {
  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\solwise_page_scrapes\PageScrapeInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished page scrape entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published page scrape entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit page scrape entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete page scrape entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add page scrape entities');
  }

}
