<?php

namespace Drupal\solwise_page_scrapes\Form;

use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class PageScrapeTypeForm.
 *
 * @package Drupal\solwise_page_scrapes\Form
 */
class PageScrapeTypeForm extends EntityForm {
  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    $page_scrape_type = $this->entity;
    $form['label'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#maxlength' => 255,
      '#default_value' => $page_scrape_type->label(),
      '#description' => $this->t("Label for the Page scrape type."),
      '#required' => TRUE,
    );

    $form['id'] = array(
      '#type' => 'machine_name',
      '#default_value' => $page_scrape_type->id(),
      '#machine_name' => array(
        'exists' => '\Drupal\solwise_page_scrapes\Entity\PageScrapeType::load',
      ),
      '#disabled' => !$page_scrape_type->isNew(),
    );

    /* You will need additional form elements for your custom properties. */

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $page_scrape_type = $this->entity;
    $status = $page_scrape_type->save();

    switch ($status) {
      case SAVED_NEW:
        drupal_set_message($this->t('Created the %label Page scrape type.', [
          '%label' => $page_scrape_type->label(),
        ]));
        break;

      default:
        drupal_set_message($this->t('Saved the %label Page scrape type.', [
          '%label' => $page_scrape_type->label(),
        ]));
    }
    $form_state->setRedirectUrl($page_scrape_type->urlInfo('collection'));
  }

}
