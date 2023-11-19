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

// Plugin-Informationen
define('ZEN_CAL_PLUGIN_NAME', 'Zen calendar');
define('ZEN_CAL_PLUGIN_VERSION', '1.0');
// Define the capability name
define('ZEN_CAL_MANAGE_SETTINGS_CAP', 'manage_zen_calendar');
define('ZEN_CAL_SLUG', 'zen-calendar-settings');

// Scripts for Angular script
function load_ng_scripts()
{
    wp_enqueue_style('ng_styles', plugin_dir_url(__FILE__) . 'dist/styles.463c5bcc279f9804.css');
    wp_register_script('ng_main', plugin_dir_url(__FILE__) . 'dist/main.aaa0e61f3f8e40dc.js', true);
    wp_register_script('ng_polyfills', plugin_dir_url(__FILE__) . 'dist/polyfills.7ef82dbfc6acbeb8.js', true);
    wp_register_script('ng_runtime', plugin_dir_url(__FILE__) . 'dist/runtime.d828c3a65864714d.js', true);
}

function zen_cal_install()
{
    global $wpdb;
    $tblBasic = $wpdb->prefix . "zencalendar_basic";
    $tblDetails = $wpdb->prefix . "zencalendar_details";
    $charset_collate = $wpdb->get_charset_collate();

    // create Basic Table
    $sqlBasic = "CREATE TABLE $tblBasic (
  id INT NOT NULL AUTO_INCREMENT,
  event_start DATE NOT NULL,
  event_end DATE NOT NULL,
  frequ_start DATE NOT NULL,
  frequ_end DATE NOT NULL,
  frequ_type INT NOT NULL COMMENT '0:None, 1:weekly, 2:monthly, 3:yearly',
  is_valid BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
  ) COMMENT = 'BasisInfo für den Überblick' $charset_collate;";

    // create Detail Table
    $sqlDetails = "CREATE TABLE $tblDetails (
  id INT NOT NULL AUTO_INCREMENT,
  cal_basic_id INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  startTime INT NOT NULL COMMENT 'minutes since midnight',
  endTime INT NOT NULL COMMENT 'minutes since midnight',
  lang VARCHAR(5) NOT NULL,
  link TEXT NOT NULL,
  linkType TEXT NOT NULL COMMENT 'url, zoom, email, undefined',
  PRIMARY KEY (id),
  FOREIGN KEY (cal_basic_id) REFERENCES $tblBasic(id)
  ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sqlBasic);
    dbDelta($sqlDetails);
    add_option('ZEN_CAL_PLUGIN_VERSION', ZEN_CAL_PLUGIN_VERSION);
}

function attach_zen_cal()
{
    wp_enqueue_script('ng_main');
    wp_enqueue_script('ng_polyfills');
    wp_enqueue_script('ng_runtime');

    return "<app-root useConfigInterface=\"false\"></app-root>";
}

// Einstellungen-Seite
function zen_calendar_add_settings_page()
{
    add_options_page(ZEN_CAL_PLUGIN_NAME, ZEN_CAL_PLUGIN_NAME, ZEN_CAL_MANAGE_SETTINGS_CAP, ZEN_CAL_SLUG, 'zen_calendar_settings_page');
}

// Darstellung der Einstellungs-Seite
function zen_calendar_settings_page()
{
    if (! current_user_can(ZEN_CAL_MANAGE_SETTINGS_CAP)) {
        return;
    }

    wp_enqueue_script('ng_main');
    wp_enqueue_script('ng_polyfills');
    wp_enqueue_script('ng_runtime');

    echo '<div>Welcome to admin page11</div><app-root useConfigInterface=\"true\"></app-root>';
}

// Query the calender for Event of the given month
function get_wp_zen_calendar4month($request)
{
    $useMonth = $request->get_param('useMonth');

    global $wpdb;
    $tblBasic = $wpdb->prefix . "zencalendar_basic";

    $calOverview = $wpdb->get_results("SELECT id, event_start, event_end, frequ_start, frequ_end, frequ_type 
      FROM $tblBasic 
      WHERE is_valid=TRUE 
        AND  DATE_FORMAT('$useMonth', '%Y-%m-01') <= frequ_end
        AND  frequ_start <= DATE_ADD(DATE_FORMAT('$useMonth', '%Y-%m-01'), INTERVAL 1 MONTH)
      ORDER BY event_start;");
    echo json_encode($calOverview);
}

// Query the details for the Event
function get_wp_zen_eventDetails($request)
{
    $useEventId = $request->get_param('eventId');
    $useLang = $request->get_param('lang');
    global $wpdb;
    $tblDetails = $wpdb->prefix . "zencalendar_details";

    $calDetails = $wpdb->get_results("SELECT title, description,startTime, endTime, link, linkType
      FROM $tblDetails
      WHERE cal_basic_id in ($useEventId)
        AND  lang='$useLang'
      ORDER BY startTime;");
    echo json_encode($calDetails);
}

// Register the useMonth parameter
function register_custom_parameter()
{
    register_rest_field('calendar4month', // Replace with your custom endpoint name
    'useMonth', array(
        'get_callback' => 'get_useMonth',
        'update_callback' => null,
        'schema' => null
    ));

    $params = array(
        'eventId' => array(
            'get_callback' => 'get_event_id',
            'update_callback' => null,
            'schema' => null
        ),
        'lang' => array(
            'get_callback' => 'get_lang',
            'update_callback' => null,
            'schema' => null
        )
    );

    register_rest_field('zenEvent', $params);
}

// Define a callback function for the use month parameter
function get_useMonth($object, $field_name, $request)
{
    return $request['useMonth'];
}

function get_event_id($object, $field_name, $request)
{
    return $request['eventId'];
}

function get_lang($object, $field_name, $request)
{
    return $request['lang'];
}

function run_inits()
{
    // make sure the Angular scripts are loaded
    load_ng_scripts();
    // assign the capabilities
    $admin_role = get_role('administrator');
    if (! $admin_role->has_cap(ZEN_CAL_MANAGE_SETTINGS_CAP)) {
        $admin_role->add_cap(ZEN_CAL_MANAGE_SETTINGS_CAP);
    }
}
function zen_calendar_plugin_action_links($links) {
    $settings_link = '<a href="' . admin_url('options-general.php?page='. ZEN_CAL_SLUG ) . '">' . __('Settings') . '</a>';
    array_unshift($links, $settings_link);
    return $links;
}


add_action('wp_enqueue_scripts', 'load_ng_scripts');
register_activation_hook(__FILE__, 'zen_cal_install');

add_action('rest_api_init', function () {
    register_custom_parameter();
    register_rest_route('zen_calendar/v1', '/calendar4month/', array(
        'methods' => 'GET',
        'callback' => 'get_wp_zen_calendar4month',
        'permission_callback' => '__return_true'
    ));
    register_rest_route('zen_calendar/v1', '/zenEvent/', array(
        'methods' => 'GET',
        'callback' => 'get_wp_zen_eventDetails',
        'permission_callback' => '__return_true'
    ));
});

// Plugin-Hooks
add_action('admin_menu', 'zen_calendar_add_settings_page');

add_action('admin_init', 'run_inits');

add_shortcode('zen_cal', 'attach_zen_cal');

// open the options automatically 
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'zen_calendar_plugin_action_links');

// Add the shortcode [zen_cal] to any page or post.
// The shorcode can be whatever. [zen_cal] is just an example.
?>
