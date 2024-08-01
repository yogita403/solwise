<?php

namespace Drupal\solwise_page_scrapes\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for Page scrape edit forms.
 *
 * @ingroup solwise_page_scrapes
 */
class PageScrapeForm extends ContentEntityForm {
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\solwise_page_scrapes\Entity\PageScrape */
    $form = parent::buildForm($form, $form_state);
    $entity = $this->entity;

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $entity = $this->entity;
    $status = parent::save($form, $form_state);

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label Page scrape.', [
          '%label' => $entity->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Page scrape.', [
          '%label' => $entity->label(),
        ]));
    }
    $form_state->setRedirect('entity.page_scrape.canonical', ['page_scrape' => $entity->id()]);
  }

}
