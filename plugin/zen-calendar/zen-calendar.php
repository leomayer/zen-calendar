<?php
/**
 * Plugin Name:         Zen calendar
 * Plugin URI:          https://github.com/leomayer/zen-calendar
 * Description:         A calendar app to the void - written in Angular
 * Version:             1.0.0
 * Author:              Leo Mayer
 * Author URI:          https://nowhere.gv
 * 
 */

global $zencal_db_version;
$zencal_db_version = '1.0';

function zen_cal_install(){
  global $wpdb;
  global $zencal_db_version;
  $tblBasic=$wpdb->prefix . "zencalendar_basic"; 
  $tblDetails=$wpdb->prefix . "zencalendar_details";
  $charset_collate = $wpdb->get_charset_collate();

  // create Basic Table
  $sqlBasic="CREATE TABLE $tblBasic (
  id INT NOT NULL , 
  event_start DATE NOT NULL, 
  event_end DATE NOT NULL, 
  frequ_start DATE NOT NULL, 
  frequ_end DATE NOT NULL, 
  frequ_type INT NOT NULL COMMENT '0:None, 1:weekly, 2:monthly, 3:yearly', 
  PRIMARY KEY (`id`)
  ) COMMENT = 'BasisInfo für den Überblick' $charset_collate;";    
  
  // create Detail Table
  $sqlDetails="CREATE TABLE $tblDetails (
  id INT NOT NULL , 
  cal_basic_id INT NOT NULL, 
  title TEXT NOT NULL, 
  description TEXT NOT NULL, 
  startTime INT NOT NULL COMMENT 'minutes since midnight', 
  endTime INT NOT NULL COMMENT 'minutes since midnight', 
  lang VARCHAR(5) NOT NULL, 
  link TEXT NOT NULL, 
  linkType TEXT NOT NULL COMMENT 'zoom, email, undefined', 
  PRIMARY KEY (id),
  FOREIGN KEY (cal_basic_id) REFERENCES $tblBasic(id)
  ) $charset_collate;";    
  
  require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sqlBasic );
	dbDelta( $sqlDetails );
	add_option( 'zencal_db_version', $zencal_db_version );
  
}

function load_ng_scripts() {
    wp_enqueue_style( 'ng_styles', plugin_dir_url( __FILE__ ) . 'dist/styles.463c5bcc279f9804.css' );
    wp_register_script( 'ng_main', plugin_dir_url( __FILE__ ) . 'dist/main.18a4850219d35269.js', true );
    wp_register_script( 'ng_polyfills', plugin_dir_url( __FILE__ ) . 'dist/polyfills.7ef82dbfc6acbeb8.js', true );
    wp_register_script( 'ng_runtime', plugin_dir_url( __FILE__ ) . 'dist/runtime.d828c3a65864714d.js', true );
}

function attach_zen_cal() {
    wp_enqueue_script( 'ng_main' );
    wp_enqueue_script( 'ng_polyfills' );
    wp_enqueue_script( 'ng_runtime' );

    return "<app-root useConfigInterface=\"false\"></app-root>";
}

add_action( 'wp_enqueue_scripts', 'load_ng_scripts' );
register_activation_hook( __FILE__, 'zen_cal_install' );

add_shortcode( 'zen_cal', 'attach_zen_cal' );

// Add the shortcode [zen_cal] to any page or post.
// The shorcode can be whatever. [zen_cal] is just an example.
?>
