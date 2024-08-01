<?php

namespace Drupal\solwise_page\Controller;
use Drupal\Core\Database\Database;
use Drupal\Core\Controller\ControllerBase;

/**
 * Class SettingsForm.
 */
class SolwisePage extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  /*public function indexPage() {
    
    $page_type = \Drupal::request()->get('page_type');
    $page_id = \Drupal::request()->get('page_id');
    $stock_id = \Drupal::request()->get('stock_id');
    $pages = [];

    if ($page_type != 'product' && isset($page_type)) {
      $page_id = $this->getPageId($page_type);
      $pageFilters = $this->getFilters($page_id);

      foreach ($pageFilters as $pageFilterVal) { 
        
      }

      $stockIds = $this->getStockId($page_id);
      foreach ($stockIds as $key => $stockId) {
        $pages['filterVal'][] = $this->getFiltersByStockId($stockId->stockID);
        $pages['productDetails'][] = $this->getPorductDetails($stockId->stockID);
        $pages['bulletPoints'][] = $this->getBulletPoints($stockId->stockID);
        $pages['imageURL'][] = $this->getPorductImages($stockId->stockID, 1);
      }
      $pages['filters'] = $pageFilters;

      switch ($page_type) {
        case "index1":
            $theme = 'solwise_index_page';
            break;
        case "index2":
            $theme = 'solwise_index_page';
            break;
        case "index3":
            $theme = 'solwise_index_page_3';
            break;
        default:
          $theme = 'solwise_index_page';
      }

      return [
        'content' => [
          '#theme' => $theme,
          '#pages' => $pages,
        ]
      ];
    }
    elseif ($page_type == 'product' && isset($stock_id)) {
      
      $pages['productDetails'] = $this->getPorductDetails($stock_id);
      $pages['bulletPoints'] = $this->getBulletPoints($stock_id);
      $pages['imageURL'] = $this->getPorductImages($stock_id);
      if($this->hasKits($stock_id)) {
        $kits = $this->getProductKits($stock_id);
        $kitsDetails = [];
        $KitsComponent = [];
        foreach ($kits as $key => $kit) {
          $kitsDetails[] = $this->getKitsDetails($kit->kitID);
          $KitsComponent[] = $this->getKitsComponent($kit->kitID);
        }
        
        $pages['kitsDetails'] = $kitsDetails;
          foreach ($KitsComponent as $key => $KitsComponents) {
            $url = '';
            $stockCode = '[';
            foreach ($KitsComponents as $key => $KitsComponent) {
              $index = $key + 1;
              $url .= 'NewStockCode['. $index .']='.$KitsComponent->stockCode;
              $stockCode .= '&quot;'. $KitsComponent->stockCode .'&quot;';
              if (count($KitsComponents) != $index) {
                $url .= '&';
                $stockCode .= ', ';
              }
            }
            $stockCode .= ']';
            $kitPath[] = $url;
            $kitstockCode[] = $stockCode;

          }
        $pages['kitPath'] = $kitPath;
        $pages['kitstockCode'] = $kitstockCode;
      }
      
      
      return [
        'content' => [
          '#theme' => 'solwise_product_page',
          '#pages' => $pages,
        ]
      ];
    }
  
    return [
      'content' => []
    ];
  }*/


/**
Implements Index pages
*/
  public function indexPage(){
    $page_type = \Drupal::request()->get('page_type');
    $indexFilterPageId = \Drupal::request()->get('filter_type');
    $page_id = \Drupal::request()->get('page_id');
    $stock_id = \Drupal::request()->get('stock_id');
    $pages = [];

    if($page_type != 'product' && isset($page_type)) {
      $page_id = $this->getPageId($page_type);
      if($page_type == 'index6'){
        if(isset($indexFilterPageId)){
          $indexInfo = $this->getIndexDetails($indexFilterPageId);
          foreach ($indexInfo as $index) {
            $pages['page_heading'] = $index->page_heading;
            $pages['filter_action'] = $index->filter_action;
          }
          $pageFilters = $this->getFilters($indexFilterPageId);
          $stock_id = $this->getProductIndexStockId($indexFilterPageId);
          $pages['productDetails'] = $this->getPorductDetails($stock_id);
          $pages['bulletPoints'] = $this->getBulletPoints($stock_id);
          $tabDetails = $this->getProductTabsDetails($stock_id);
          foreach ($tabDetails as $key => $tabDetail) {
            $pages['overview'] = $tabDetail->overview;
            $pages['specification'] = $tabDetail->specification;
            $pages['downloads'] = $tabDetail->downloads;
            $pages['reviews'] = $tabDetail->reviews;
            $pages['brochuresComparisons'] = $tabDetail->brochuresComparisons;
            $pages['videoArticles'] = $tabDetail->videoArticles;
            $pages['accessories'] = $tabDetail->accessories;
          }
          $pages['imageURL'] = $this->getPorductImages($stock_id);
          $kits=$this->getStockKitsIds($stock_id);
          if($kits){
            foreach ($kits as $key => $kit) {
              $kitsDetails[] = $this->getKitsDetails($kit->ID);
              $KitsComponent[] = $this->getKitsComponent($kit->ID);
            }
            $pages['kitsDetails'] = $kitsDetails;
            foreach ($KitsComponent as $key => $KitsComponents) {
              $url = '';
              $stockCode = '[';
              foreach ($KitsComponents as $key => $KitsComponent) {
                $index = $key + 1;
                $url .= 'NewStockCode['. $index .']='.$KitsComponent->stockCode;
                $stockCode .= '&quot;'. $KitsComponent->stockCode .'&quot;';
                if (count($KitsComponents) != $index) {
                  $url .= '&';
                  $stockCode .= ', ';
                }
              }
              $stockCode .= ']';
              $kitPath[] = $url;
              $kitstockCode[] = $stockCode;
            }
            $pages['kitPath'] = $kitPath;
            $pages['kitstockCode'] = $kitstockCode;
          }
          $stockIds = $this->getStockId($indexFilterPageId);
          foreach ($stockIds as $key => $stockId) {
            $productIndexDetails[] = $this->getPorductDetails($stockId->stockID);
          }
          $pages['productIndexDetails'] = $productIndexDetails;
        }
      }
      else{
        if(isset($indexFilterPageId)){
          $indexInfo = $this->getIndexDetails($indexFilterPageId);
          foreach ($indexInfo as $index) {
            $pages['page_heading'] = $index->page_heading;
            $pages['filter_action'] = $index->filter_action;
          }
          $pageFilters = $this->getFilters($indexFilterPageId);
          $stockIds = $this->getStockId($indexFilterPageId);
        }
        else{
          $pageFilters = $this->getFilters($page_id);
          $stockIds = $this->getStockId($page_id);
        }
      
        foreach ($stockIds as $key => $stockId) {
          $pages['filterVal'][] = $this->getFiltersByStockId($stockId->stockID);
          $pages['indexFilterId'][] = $this->getIndexFilterID($stockId->stockID);
          $pages['productDetails'][] = $this->getPorductDetails($stockId->stockID);
          $pages['bulletPoints'][] = $this->getBulletPoints($stockId->stockID);
          $pages['imageURL'][] = $this->getPorductImages($stockId->stockID, 1);
        }
        $pages['filters'] = $pageFilters;
      }
      switch ($page_type) {
        case "index1":
            $theme = 'solwise_index_page';
            break;
        case "index2":
            $theme = 'solwise_index_page_2';
            break;
        case "index3":
            $theme = 'solwise_index_page';
            break;
        case "index4":
            $theme = 'solwise_index_page_4';
            break;
        case "index6":
            $theme = 'solwise_index_page_6';
            break;
        default:
          $theme = 'solwise_index_page';
      }

      return [
        'content' => [
          '#theme' => $theme,
          '#pages' => $pages,
        ]
      ];
    }
    elseif ($page_type == 'product' && isset($stock_id)){
      $pages['productDetails'] = $this->getPorductDetails($stock_id);
      $pages['bulletPoints'] = $this->getBulletPoints($stock_id);
      $tabDetails = $this->getProductTabsDetails($stock_id);
      foreach ($tabDetails as $key => $tabDetail) {
        $pages['overview'] = $tabDetail->overview;
        $pages['specification'] = $tabDetail->specification;
        $pages['downloads'] = $tabDetail->downloads;
        $pages['reviews'] = $tabDetail->reviews;
        $pages['brochuresComparisons'] = $tabDetail->brochuresComparisons;
        $pages['videoArticles'] = $tabDetail->videoArticles;
        $pages['accessories'] = $tabDetail->accessories;
      }
      $pages['imageURL'] = $this->getPorductImages($stock_id);
      if($stock_id >= 20000){
      	$kits=$this->getStockKitsIds($stock_id);
      	if($kits){
      		foreach ($kits as $key => $kit) {
	          $kitsDetails[] = $this->getKitsDetails($kit->ID);
	          $KitsComponent[] = $this->getKitsComponent($kit->ID);
	        }
					$pages['kitsDetails'] = $kitsDetails;
	        foreach ($KitsComponent as $key => $KitsComponents) {
	          $url = '';
	          $stockCode = '[';
	          foreach ($KitsComponents as $key => $KitsComponent) {
	            $index = $key + 1;
	            $url .= 'NewStockCode['. $index .']='.$KitsComponent->stockCode;
	            $stockCode .= '&quot;'. $KitsComponent->stockCode .'&quot;';
	            if (count($KitsComponents) != $index) {
	              $url .= '&';
	              $stockCode .= ', ';
	            }
	          }
	          $stockCode .= ']';
	          $kitPath[] = $url;
	          $kitstockCode[] = $stockCode;
					}
	        $pages['kitPath'] = $kitPath;
	        $pages['kitstockCode'] = $kitstockCode;
      	}	
				/*if($this->hasKits($stock_id)) {
	        $kits = $this->getProductKits($stock_id);
	        $kitsDetails = [];
	        $KitsComponent = [];
	        foreach ($kits as $key => $kit) {
	          $kitsDetails[] = $this->getKitsDetails($kit->kitID);
	          $KitsComponent[] = $this->getKitsComponent($kit->kitID);
	        }
	        
	        $pages['kitsDetails'] = $kitsDetails;

	        foreach ($KitsComponent as $key => $KitsComponents) {
	          $url = '';
	          $stockCode = '[';
	          foreach ($KitsComponents as $key => $KitsComponent) {
	            $index = $key + 1;
	            $url .= 'NewStockCode['. $index .']='.$KitsComponent->stockCode;
	            $stockCode .= '&quot;'. $KitsComponent->stockCode .'&quot;';
	            if (count($KitsComponents) != $index) {
	              $url .= '&';
	              $stockCode .= ', ';
	            }
	          }
	          $stockCode .= ']';
	          $kitPath[] = $url;
	          $kitstockCode[] = $stockCode;

	        }
	        $pages['kitPath'] = $kitPath;
	        $pages['kitstockCode'] = $kitstockCode;
	    	}*/
      }
      return [
        'content' => [
          '#theme' => 'solwise_product_page',
          '#pages' => $pages,
        ]
      ];
    }
  
    return [
      'content' => []
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIndexDetails(int $indexPageId){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_indexpages', 'wif');
    $query->fields('wif', array('page_heading','filter_action'));
    $query->condition('ID', $indexPageId, "=");
    $entries = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $entries;
  }
  
  /**
   * {@inheritdoc}
   */
  public function getFilters(int $indexPageId){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_indexfilters', 'wif');
    $query->fields('wif', array('property_name', 'order_filter','ID','keyFilter'));
    $query->condition('indexPageId', $indexPageId, "=");
    $query->orderBy('order_filter', 'ACE');
    $entries = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $entries;
  }

  /**
   * {@inheritdoc}
   */

  public function getIndexFilterID(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_product_filtervals', 'wpf');
    $query->fields('wpf', array('indexFilterID'));
    $query->condition('stockID', $stockID, "=");
    $entries = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $entries;
  }

  /**
   * {@inheritdoc}
   */
  public function getFiltersByStockId(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_product_filtervals', 'wpf');
    $query->leftJoin('wb_indexfilters', 'wif', 'wpf.indexFilterID = wif.ID');
    $query->fields('wif', array('property_name'));
    $query->fields('wpf', array('stockID','indexFilterID'));
    $query->condition('wpf.stockID', $stockID, "=");
    $query->orderBy('order_filter', 'ACE');
    $entries = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $entries;
  }

  /**
   * {@inheritdoc}
   */
  public function getPageId($pageType){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_indextemplate_types', 'wils');
    $query->fields('wils', array('ID'));
    $query->condition('name', $pageType, "=");
    $pageIDs = $query->execute()->fetchField();
    Database::setActiveConnection();
    return $pageIDs;
  }

  /**
   * {@inheritdoc}
   */
  public function getStockId(int $indexPageId){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_index_link_stock', 'wils');
    $query->fields('wils', array('stockID'));
    $query->condition('indexPageId', $indexPageId, "=");
    $stockIDs = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $stockIDs;
  }

  /**
   * {@inheritdoc}
   */
  public function getProductIndexStockId(int $indexPageId){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_index_link_stock', 'wils');
    $query->fields('wils', array('stockID'));
    $query->condition('indexPageId', $indexPageId, "=");
    $query->orderBy('order_metric', 'ACE');
    $stockIDs = $query->execute()->fetchField();
    Database::setActiveConnection();
    return $stockIDs;
  }

  /**
   * {@inheritdoc}
   */
  public function getBulletPoints(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_bullets', 'wbb');
    $query->fields('wbb', array('bulletHTML'));
    $query->condition('stockID', $stockID, "=");
    $bulletHTML = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $bulletHTML;
  }

  /**
   * {@inheritdoc}
   */
  public function getProductTabsDetails(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_stock', 'wbs');
    $query->fields('wbs', array('overview', 'specification', 'downloads' , 'reviews', 'brochuresComparisons', 'videoArticles', 'accessories'));
    $query->condition('stockID', $stockID, "=");
    $tabdetail = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $tabdetail;
  }

  /**
   * {@inheritdoc}
   */
    
  public function getPorductDetails(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('rem_stock', 'rs');
    $query->fields('rs', array('Code', 'Name', 'URL'));
    $query->condition('StockID', $stockID, "=");
    $productDetails = $query->execute()->fetchObject();
    Database::setActiveConnection();
    return $productDetails;
  }

  /**
   * {@inheritdoc}
   */
  public function getPorductImages(int $stockID, $imageCount = 0){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_images', 'wbi');
    $query->fields('wbi', array('image_path', 'altText'));
    $query->condition('StockID', $stockID, "=");
    /*if ($imageCount) {
      $query->range(0, $imageCount);
    }*/
    $image_path = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $image_path;
  }

  /**
   * {@inheritdoc}
   */
  public function getProductKits(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_kits_components', 'wkp');
    $query->fields('wkp', array('kitID'));
    $query->condition('stockID', $stockID, "=");
    $kitsDetails = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $kitsDetails;
  }

  /**
   * {@inheritdoc}
   */
  public function getKitsDetails(int $kitID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_kits', 'wkp');
    $query->fields('wkp', array('kitName', 'description'));
    $query->condition('ID', $kitID, "=");
    $kitsDetails = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $kitsDetails;
  }
  /**
   * {@inheritdoc}
   */
  public function getKitsComponent(int $kitID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_kits_components', 'wkx');
    $query->fields('wkx', array('stockCode'));
    $query->condition('kitID', $kitID, "=");
    $KitsComponent = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $KitsComponent;
  }

  /**
   * {@inheritdoc}
   */
  public function getStockKitsIds(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_index_link_stock', 'wils');
    $query->innerJoin('wb_kits', 'wks', '(wks.ID + 20000) = wils.stockID');
    $query->fields('wks', array('ID'));
    $query->condition('wils.stockID', $stockID, "=");
    $kits = $query->execute()->fetchAll();
    Database::setActiveConnection();
    return $kits;
  }

  /**
   * {@inheritdoc}
   */
  public function hasKits(int $stockID){

    Database::setActiveConnection('external');
    $db = Database::getConnection();
    $query = $db->select('wb_kits_components', 'wkp');
    $query->fields('wkp', array('kitID'));
    $query->condition('stockID', $stockID, "=");
    $kits = $query->execute()->fetchObject();
    Database::setActiveConnection();
    if ($kits) {
      $resposne = true;
    }else{
      $resposne = false;
    }
    return $resposne;
  }

}
