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

function load_ng_scripts() {
    wp_enqueue_style( 'ng_styles', plugin_dir_url( __FILE__ ) . 'dist/styles.463c5bcc279f9804.css' );
    wp_register_script( 'ng_main', plugin_dir_url( __FILE__ ) . 'dist/main.3b6284dd5f5cc38e.js', true );
    wp_register_script( 'ng_polyfills', plugin_dir_url( __FILE__ ) . 'dist/polyfills.7ef82dbfc6acbeb8.js', true );
    wp_register_script( 'ng_runtime', plugin_dir_url( __FILE__ ) . 'dist/runtime.d828c3a65864714d.js', true );
}

add_action( 'wp_enqueue_scripts', 'load_ng_scripts' );

function attach_zen_cal() {
    wp_enqueue_script( 'ng_main' );
    wp_enqueue_script( 'ng_polyfills' );
    wp_enqueue_script( 'ng_runtime' );

    return "<app-root useConfigInterface=\"true\"></app-root>";
}

add_shortcode( 'zen_cal', 'attach_zen_cal' );

// Add the shortcode [zen_cal] to any page or post.
// The shorcode can be whatever. [zen_cal] is just an example.
?>
