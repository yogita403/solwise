<?php

namespace Drupal\solwise_deploy\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Solwise deployment scripts controller
 */
class DeployController extends ControllerBase {

  public function deploy() {
    $out = shell_exec('git pull && composer install');
    drupal_set_message('Codebase update deployed.');
    return $this->redirect('<front>');
  }
}